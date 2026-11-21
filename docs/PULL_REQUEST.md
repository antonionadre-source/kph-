# Corregir desarrollo local y desplegar Kraken PFM en Vercel Preview

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

Vercel ejecuta ahora la aplicación Express completa, con SEO, redirecciones y
API, y sirve los bundles por CDN. Preview fuerza Firebase emulador y desactiva
los envíos externos y Payrexx/Gemini aunque herede claves. La producción existente
y el dominio `krakenpfm.ch` permanecen intactos.

[Vista previa protegida](https://kpfm-m1oddj90p-antonionadre2-5701s-projects.vercel.app):
Vercel informa **READY** para el commit `10fbb52` tras instalación y build remotas.
La verificación de páginas y `/api/health` remotos sigue pendiente de completar
MFA en la sesión autorizada. El despliegue por CLI no autoriza por sí mismo la
comprobación automática de Vercel del PR.

Validación realizada: `npm ci`, `npm run typecheck`, `npm run build`,
`npm run build:vercel`, suites de servidor, integraciones y formularios, y las
cuatro regresiones de Vercel incorporadas a `npm test`;
revisión Chrome en escritorio, móvil y seis idiomas; inventario de imágenes con
decodificación. Las pruebas usan SDKs, fetch y un adaptador Payrexx inertes.
No se han creado pagos, usuarios, solicitudes ni mensajes en producción, ni se han
desplegado reglas. Firebase Emulator Suite real sigue pendiente por falta de Java.

Este PR se prepara como borrador para revisión. Quedan dos avisos de tamaño de
chunks, los 22 originales visuales, validación de proveedores con cuentas de
prueba, reglas Firebase y conciliación Payrexx mediante notificación validada en
servidor. El retorno del navegador sólo muestra pago pendiente. Para un despliegue
comercial también hay que configurar expresamente los destinos EmailJS/Make.
La instalación y `npm audit` reportan 55 hallazgos, incluidos dos críticos en
`proxy-addr` y `websocket-driver`; el triaje de uso y las fuentes primarias están
documentados, con actualización y validación pendientes.
Estado y pasos reproducibles: `docs/CODEX_SETUP.md`, `docs/INTEGRATIONS.md` y
`docs/ASSET_AUDIT.md`. Despliegue y dependencias: `docs/VERCEL_SETUP.md`.
