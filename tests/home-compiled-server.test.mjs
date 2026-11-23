import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, symlinkSync, rmSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('compiled server graph runs under plain Node without source .ts files and serves health, home and quote', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'kraken-compiled-server-'));
  try {
    const configuration = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile);
    const { options } = ts.parseJsonConfigFileContent(configuration.config, ts.sys, root);
    assert.equal(options.rewriteRelativeImportExtensions, true);
    for (const name of ['server.ts', 'seoConfig.ts', 'i18n.ts', 'src/data/locations.ts', 'server/homeWeather.ts', 'src/locale.ts', 'components/home/homeTranslations.ts', 'server/kaiAssistant.ts', 'server/kaiKnowledge.ts', 'src/kai/types.ts', 'src/vehicle.ts']) {
      const output = ts.transpileModule(readFileSync(path.join(root, name), 'utf8'), { fileName: name, compilerOptions: options }).outputText;
      assert.doesNotMatch(output, /from\s*["']\.\.?\/[^"']+\.ts["']/);
      const destination = path.join(directory, name.replace(/\.ts$/, '.js'));
      mkdirSync(path.dirname(destination), { recursive: true });
      writeFileSync(destination, output);
    }
    writeFileSync(path.join(directory, 'package.json'), '{"type":"module"}');
    symlinkSync(path.join(root, 'node_modules'), path.join(directory, 'node_modules'), 'dir');
    mkdirSync(path.join(directory, 'dist'));
    writeFileSync(path.join(directory, 'dist/index.html'), '<html><head><title>fixture</title></head><body>COMPILED_TEMPLATE</body></html>');
    const driver = `
      import assert from 'node:assert/strict';
      import { createServer, request } from 'node:http';
      globalThis.fetch = () => { throw new Error('No upstream request is allowed'); };
      const { default: app, appReady } = await import(${JSON.stringify(pathToFileURL(path.join(directory, 'server.js')).href)});
      await appReady;
      const server = createServer(app);
      await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
      const get = pathname => new Promise((resolve, reject) => {
        const call = request({ hostname:'127.0.0.1', port:server.address().port, path:pathname, headers:{Host:'krakenpfm.ch'} }, response => {
          let body='';response.setEncoding('utf8');response.on('data', chunk => body+=chunk);
          response.on('end', () => resolve({status:response.statusCode,body}));
        });call.on('error',reject);call.end();
      });
      try {
        assert.deepEqual(JSON.parse((await get('/api/health')).body), {status:'ok'});
        for (const route of ['/', '/quote?lang=es']) {
          const result=await get(route);
          assert.equal(result.status,200,route);
          assert.ok(result.body.includes('COMPILED_TEMPLATE'));
          assert.ok(!result.body.includes('<title>fixture</title>'));
        }
        console.log('COMPILED_SERVER_OK');
      } finally {await new Promise(resolve => server.close(resolve));}
    `;
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', driver], {
      cwd: directory,
      env: { ...process.env, VERCEL: '1', NODE_ENV: 'production' },
      encoding: 'utf8',
      timeout: 15000
    });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /COMPILED_SERVER_OK/);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
