import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { build } from 'esbuild';
import ts from 'typescript';
import { translateSperrgutModell, translateBereitstellung, translateConfidence } from '../components/quoteMunicipalText.ts';
import { quotePdfStatusText } from '../components/quotePdfDownload.ts';

const languages = ['de', 'en', 'fr', 'it', 'es', 'pt'];
test('extracted municipal translations retain their six-language values', () => {
  const models = ['Gemeinde-Sperrgutmarken', 'Official Municipal Sticker Tokens', 'Vignettes officielles de la commune', 'Bollini comunali ufficiali', 'Viñetas / Adhesivos Oficiales del Municipio', 'Selos municipais oficiais'];
  const verified = ['VERIFIZIERT (OFFIZIELL)', 'VERIFIED (OFFICIAL)', 'VÉRIFIÉ (OFFICIEL)', 'VERIFICATO (UFFICIALE)', 'VERIFICADO (OFICIAL)', 'VERIFICADO (OFICIAL)'];
  const times = ['07:00 Uhr am Abholtag (frühst. Vorabend)', '07:00 AM on collection day (earliest evening before)', '07:00 le jour de collecte (au plus tôt la veille au soir)', '07:00 il giorno del ritiro (al più presto la sera prima)', '07:00 h el día de recogida (como muy pronto la tarde anterior)', '07:00 no dia da recolha (o mais cedo na véspera à noite)'];
  languages.forEach((language, index) => {
    assert.equal(translateSperrgutModell('marke', language), models[index]);
    assert.equal(translateConfidence('VERIFIED', language), verified[index]);
    assert.equal(translateBereitstellung(times[0], language), times[index]);
    assert.ok(quotePdfStatusText(language, 'loading'));
    assert.ok(quotePdfStatusText(language, 'error'));
  });
});
test('municipal helper defaults, unknown inputs and regional languages remain compatible', () => {
  assert.equal(translateSperrgutModell(), 'Gemeindespezifisch');
  assert.equal(translateSperrgutModell('custom', 'es'), 'custom');
  assert.equal(translateSperrgutModell('kombisystem', 'de-CH'), 'Kombisystem (Marke + Gewicht)');
  assert.equal(translateSperrgutModell('keineAbfuhr', 'en-GB'), 'No Public Pickup (Direct Transport to Recycling Yard)');
  assert.equal(translateSperrgutModell('aufAnfrage', 'xx'), 'Auf Anfrage (Sonderentsorgung / ERZ)');
  assert.equal(translateBereitstellung(null, 'en'), 'k.A.');
  assert.equal(translateBereitstellung('09:30', 'es'), '09:30');
  assert.equal(translateBereitstellung('07:00 (06:00 bei Hitze über 30°C)', 'en'), '07:00 AM (06:00 AM in heatwaves >30°C)');
  assert.equal(translateConfidence('REPORTED', 'fr'), 'SIGNALÉ');
  assert.equal(translateConfidence('unknown', 'es'), 'PROVISIONAL');
  assert.equal(translateConfidence(), 'VORLÄUFIG');
  assert.equal(quotePdfStatusText('de-CH', 'loading'), quotePdfStatusText('de', 'loading'));
});

async function inertPdfDownload() {
  const result = await build({
    entryPoints: ['components/quotePdfDownload.ts'], bundle: true, write: false, format: 'cjs', platform: 'browser',
    plugins: [{ name: 'inert-pdf-engine', setup(builder) {
      builder.onResolve({ filter: /^jspdf$/ }, () => ({ path: 'jspdf', namespace: 'inert' }));
      builder.onLoad({ filter: /.*/, namespace: 'inert' }, () => ({ loader: 'js', contents: 'globalThis.engineLoads++; export const jsPDF = globalThis.InertPdf;' }));
    } }],
  });
  const saves: Array<{ file: string; options: unknown }> = [];
  let release!: () => void;
  let fail = false;
  const module = { exports: {} as { downloadQuotePdf: (options: unknown) => Promise<void> } };
  const scope = {
    module, exports: module.exports, engineLoads: 0,
    InertPdf: class {
      constructor() {
        return new Proxy({}, { get(_target, key) {
          if (key === 'splitTextToSize') return (text: string) => [text];
          if (key === 'save') return (file: string, options: unknown) => { saves.push({ file, options }); return fail ? Promise.reject(new Error('download-denied')) : new Promise<void>(resolve => { release = resolve; }); };
          return () => {};
        } });
      }
    },
    fetch() { throw new Error('External traffic forbidden'); },
  };
  vm.runInNewContext(result.outputFiles[0].text, scope);
  return { api: module.exports, scope, saves, release: () => release(), fail: () => { fail = true; } };
}
const options = { cart: [], grandTotal: 707, travelFee: 0, name: '', email: '', phone: '', address: '', postcode: '', city: '', language: 'en', bookingId: 'inert-pdf' };
test('PDF engine stays unloaded until download and download waits for the real async save boundary', async () => {
  const boundary = await inertPdfDownload();
  assert.equal(boundary.scope.engineLoads, 0);
  let completed = false;
  const pending = boundary.api.downloadQuotePdf(options).then(() => { completed = true; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(boundary.scope.engineLoads, 1);
  assert.equal(completed, false);
  assert.equal(boundary.saves.length, 1);
  assert.match(boundary.saves[0].file, /^Kraken_Estimate_.*\.pdf$/);
  assert.equal((boundary.saves[0].options as { returnPromise: boolean }).returnPromise, true);
  boundary.release(); await pending;
  assert.equal(completed, true);
});
test('PDF save errors reach the caller instead of becoming false successful downloads', async () => {
  const boundary = await inertPdfDownload(); boundary.fail();
  await assert.rejects(boundary.api.downloadQuotePdf(options), /download-denied/);
});

function downloadAction(scope: Record<string, unknown>) {
  const source = ts.createSourceFile('ConsultationPage.tsx', readFileSync('components/ConsultationPage.tsx', 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let expression: ts.Expression | undefined;
  function visit(node: ts.Node) { if (ts.isVariableDeclaration(node) && node.name.getText(source) === 'exportQuotePdf') expression = node.initializer; ts.forEachChild(node, visit); }
  visit(source); assert.ok(expression);
  const javascript = ts.transpileModule(`(${expression.getText(source)})`, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
  return vm.runInNewContext(javascript, scope) as (options: unknown) => Promise<void>;
}
test('real consultation download action guards duplicate clicks, reports errors and permits retry', async () => {
  let busy = false; let error: string | null = 'old-error'; let calls = 0; let reject!: (error: Error) => void;
  const pendingRef = { current: false };
  const scope = {
    pdfExportPending: pendingRef, language: 'es', quotePdfStatusText,
    setPdfExporting(value: boolean) { busy = value; }, setPdfExportError(value: string | null) { error = value; },
    downloadQuotePdf() { calls++; return calls === 1 ? new Promise<void>((_resolve, fail) => { reject = fail; }) : Promise.resolve(); },
  };
  const action = downloadAction(scope);
  const first = action(options);
  assert.equal(busy, true); assert.equal(error, null);
  await action(options); assert.equal(calls, 1);
  reject(new Error('chunk-or-save-failure')); await first;
  assert.equal(busy, false); assert.equal(pendingRef.current, false);
  assert.equal(error, quotePdfStatusText('es', 'error'));
  await action(options);
  assert.equal(calls, 2); assert.equal(busy, false); assert.equal(error, null);
});
test('consultation has no static PDF engine import and keeps both buttons behind the shared action', () => {
  const sourceText = readFileSync('components/ConsultationPage.tsx', 'utf8');
  const source = ts.createSourceFile('ConsultationPage.tsx', sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const engineImports = source.statements.filter(ts.isImportDeclaration).filter(node => (node.moduleSpecifier as ts.StringLiteral).text.endsWith('/QuotePdfGenerator'));
  assert.ok(engineImports.every(node => node.importClause?.isTypeOnly));
  assert.equal((sourceText.match(/await exportQuotePdf\(\{/g) || []).length, 2);
  assert.equal((sourceText.match(/aria-busy=\{pdfExporting\}/g) || []).length, 2);
});
