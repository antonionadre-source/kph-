# Corregir desarrollo local y preparar la migración de Kraken PFM

`npm run dev` podía servir producción o dejar de cargar Vite después de compilar,
y el lock impedía instalar con `npm ci`. El cambio selecciona desarrollo
explícitamente, mantiene `npm run build` y `npm start`, repara el lock y corrige
tres errores TypeScript y la persistencia del idioma en la URL.

Conserva el diseño, Kai, contenidos, idiomas, rutas y SEO. Recupera 74 recursos
con procedencia y SHA256, conserva los originales válidos y documenta 22 rutas
de imágenes todavía pendientes en componentes activos. Firebase local y SSR usan
un proyecto demo; EmailJS y Make requieren configuración y habilitación explícitas;
Gemini permanece en el servidor. Corrige el registro automático tras login
fallido y las confirmaciones falsas de formularios y retornos de pago.

Validación realizada: `npm ci`, `npm run typecheck`, `npm run build` y `npm test`;
revisión Chrome en escritorio, móvil y seis idiomas; inventario de imágenes con
decodificación. Las pruebas usan SDKs, fetch y un adaptador Payrexx inertes.
No se han creado pagos, usuarios, solicitudes ni mensajes en producción, ni se han
desplegado reglas. Firebase Emulator Suite real sigue pendiente por falta de Java.

Este PR se prepara como borrador para revisión. Quedan dos avisos de tamaño de
chunks, los 22 originales visuales, validación de proveedores con cuentas de
prueba, reglas Firebase y conciliación Payrexx mediante notificación validada en
servidor. El retorno del navegador sólo muestra pago pendiente. Para un despliegue
comercial también hay que configurar expresamente los destinos EmailJS/Make.
Estado y pasos reproducibles: `docs/CODEX_SETUP.md`, `docs/INTEGRATIONS.md` y
`docs/ASSET_AUDIT.md`.
