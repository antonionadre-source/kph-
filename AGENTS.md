# Kraken PFM — instrucciones de mantenimiento

- Mantener diseño, mascota Kai, seis idiomas, rutas, SEO y arquitectura React/Vite/Express.
- Leer docs/CODEX_SETUP.md antes de cambiar configuración o integraciones.
- Usar Node.js 24 y npm ci; comprobar npm run typecheck, npm run build y npm run test:server.
- No usar scripts/fix-corrupt-images.ts: no recupera originales y puede crear píxeles transparentes. Documentar faltantes y procedencia de cada recuperación.
- Guardar secretos sólo en .env.local o configuración segura; nunca en Git ni en el bundle cliente.
- Pruebas con mocks o emuladores; no crear pagos, mensajes, usuarios, solicitudes ni datos en producción.
- Trabajar en rama y conservar cambios ajenos; nunca force push.
