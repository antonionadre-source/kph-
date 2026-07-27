const { execSync } = require('child_process');

console.log('Starting production build...');

try {
  console.log('1. Running Vite build...');
  execSync('npx vite build', { stdio: 'inherit' });

  console.log('2. Running esbuild for server...');
  execSync('npx esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs', { stdio: 'inherit' });

  console.log('Production build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
