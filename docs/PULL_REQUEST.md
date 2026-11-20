# Preparar desarrollo local y recuperación de Kraken PFM

`npm run dev` podía servir producción o dejar de cargar Vite tras compilar, y el
lock remoto impedía instalar con `npm ci`. Esta continuación hace explícito el
modo, mantiene el servidor de producción y el SEO, repara el lock y corrige los
errores TypeScript y la persistencia del idioma en URL.

Recupera 74 recursos con procedencia/SHA256, conserva los válidos y documenta los
22 originales todavía pendientes en componentes activos. Aísla Firebase local,
configura EmailJS/Make por variables, mantiene Gemini en servidor y elimina
fallos de login, envío y retorno de pagos que podían afirmar resultados inexistentes.
No se han ejecutado operaciones comerciales reales ni desplegado reglas.

Validación: npm ci, npm run typecheck, npm run build, npm test; revisión Chrome en
escritorio/móvil y seis idiomas; inventario de imágenes mediante decodificación.
Persisten dos avisos de tamaño de chunks, integraciones reales sin certificar y
conciliación Payrexx en servidor pendiente. Ver docs/CODEX_SETUP.md,
docs/INTEGRATIONS.md y docs/ASSET_AUDIT.md.
