import { readFileSync, readdirSync, statSync, unlinkSync } from 'fs';
import { join, extname } from 'path';

const PUBLIC_DIR = 'public';
const IMG_EXT = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif', '.bmp'];

// Firmas mágicas reales de cada formato
function realType(buf: Buffer): string {
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') return 'webp';
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return 'gif';
  const head = buf.slice(0, 200).toString('utf8').trimStart();
  if (head.startsWith('<svg') || head.startsWith('<?xml')) return 'svg';
  // El marcador de corrupción que detectamos: carácter de reemplazo UTF-8
  if (buf[0] === 0xef && buf[1] === 0xbf && buf[2] === 0xbd) return 'CORRUPTO(utf8)';
  return 'desconocido';
}

// Recolecta todos los archivos de un directorio recursivamente
function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name === 'dist') continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

// 1) Junta todo el texto del código fuente para buscar referencias
const codeText = walk('.')
  .filter(f => /\.(tsx?|jsx?|css|html|json)$/.test(f) && !f.includes('node_modules') && !f.includes('dist'))
  .map(f => { try { return readFileSync(f, 'utf8'); } catch { return ''; } })
  .join('\n');

// 2) Analiza cada imagen de /public
const images = readdirSync(PUBLIC_DIR)
  .filter(n => IMG_EXT.includes(extname(n).toLowerCase()));

const rows = images.map(name => {
  const full = join(PUBLIC_DIR, name);
  const buf = readFileSync(full);
  const ext = extname(name).toLowerCase().slice(1);
  const tipo = realType(buf);
  const size = buf.length;

  let estado: string;
  if (size <= 100 || tipo.startsWith('CORRUPTO')) estado = '❌ CORRUPTO/VACÍO';
  else if (tipo === 'svg' && ext !== 'svg') estado = '⚠️ SVG con extensión .' + ext;
  else if (tipo !== 'desconocido' && tipo !== ext && !(tipo === 'jpg' && ext === 'jpeg')) estado = '⚠️ es .' + tipo + ' nombrado .' + ext;
  else estado = '✅ OK';

  const referenciado = codeText.includes(name) || codeText.includes(name.replace(/ /g, '%20')); // busca el nombre exacto o codificado en el código
  return { name, size, tipo, estado, referenciado };
});

// 3) Imprime el reporte
console.log('\n=== DIAGNÓSTICO DE IMÁGENES EN /public ===\n');
for (const r of rows.sort((a, b) => a.size - b.size)) {
  console.log(
    `${r.estado.padEnd(26)} ${String(r.size).padStart(8)}B  ` +
    `${r.referenciado ? 'USADA   ' : 'sin-uso '} ${r.name}`
  );
}

const corruptos = rows.filter(r => r.estado.startsWith('❌'));
const sinUso = rows.filter(r => !r.referenciado);
console.log(`\nResumen: ${rows.length} imágenes | ${corruptos.length} corruptas | ${sinUso.length} sin referencias en código`);

if (sinUso.length > 0) {
  console.log('\nCANDIDATAS A BORRAR (sin uso en el código):');
  sinUso.forEach(r => console.log('  public/' + r.name + ' (' + r.estado + ')'));
  
  if (process.argv.includes('--prune')) {
    console.log('\n--- ELIMINANDO IMÁGENES SIN REFERENCIA (--prune) ---');
    let freedBytes = 0;
    sinUso.forEach(r => {
      try {
        const fullPath = join(PUBLIC_DIR, r.name);
        const st = statSync(fullPath);
        unlinkSync(fullPath);
        freedBytes += st.size;
        console.log(`  Deleted: public/${r.name}`);
      } catch (e: any) {
        console.error(`  Failed to delete public/${r.name}: ${e.message}`);
      }
    });
    console.log(`¡Listo! Se liberaron ${(freedBytes / 1024).toFixed(1)} KB.`);
  } else {
    console.log('\nPara eliminarlas automáticamente, ejecuta:');
    console.log('  npm run audit:images -- --prune');
  }
} else {
  console.log('\n✅ ¡No hay imágenes huérfanas o sin uso en el código!');
}

if (corruptos.filter(r => r.referenciado).length > 0) {
  console.log('\n⚠️ Corruptas pero AÚN referenciadas (NO borres sin reemplazar):');
  corruptos.filter(r => r.referenciado).forEach(r => console.log('  ' + r.name));
}
