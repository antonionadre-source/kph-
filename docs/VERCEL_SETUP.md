# Kraken PFM en Vercel

Estado actualizado el **21 de noviembre de 2026**. Se creó por CLI una
[vista previa de Kraken](https://kpfm-m1oddj90p-antonionadre2-5701s-projects.vercel.app) en el proyecto Vercel `kpfm`. Vercel informa estado
**READY** para `dpl_6yv836BqyBvcB5P9563Lo6ZWhgbS`, construido desde el commit
`10fbb52`. Completó instalación, `build:vercel` y el adaptador Express remotos.

La vista previa conserva la protección de acceso SSO del proyecto
(`all_except_custom_domains`). La sesión de propietario necesaria para abrirla
quedó pendiente de completar la verificación de dos pasos (MFA). No se ha
modificado esa protección ni se ha eludido la autenticación. **Todavía no se han
verificado por HTTP o navegador las páginas ni `/api/health` de la vista previa**;
READY confirma la creación del despliegue, no el recorrido funcional completo.

La producción existente `dpl_Ac9XCUhdt8EQnxtvgmMf6c5BQYMc`, el dominio
`krakenpfm.ch` y el preset global **Vite** permanecen intactos. El preset Express
se aplica mediante `vercel.json` a la vista previa. No se fusionó el PR, no se
publicó a producción y no se habilitaron integraciones comerciales.

## Arquitectura y configuración

El proyecto usa Vite para el frontend y Express para API, redirecciones, 404 y
metadatos SEO por ruta/idioma. El preset Vite con salida `dist` solamente no
reproduce esas funciones. `vercel.json` selecciona **Express** para este despliegue
sin cambiar el framework configurado globalmente en el panel del proyecto.

Vercel admite Express como una función Node.js, incluyendo exportación de app o
listener. `server.ts` exporta la app y, con `VERCEL=1`, deja el listener y el ciclo
de vida a la plataforma. `npm run dev`, `npm run build` y `npm start` conservan su
uso habitual fuera de Vercel. El rango `engines.node` ya fija Node.js 24; Vercel
soporta esa versión y aplica sus actualizaciones menores y de seguridad.

La configuración deja `outputDirectory: null` para que el adaptador Express use
la entrada de la raíz `server.ts`; no debe configurarse como `dist` ni `public`.
El adaptador busca una entrada Express dentro de un override de salida, y este
proyecto no usa esa estructura como raíz de despliegue.

`npm run build:vercel` ejecuta la compilación existente y prepara las salidas:

- Los archivos originales de `public/` y los bundles generados en `public/assets/`
  se sirven desde la CDN. Vercel no utiliza `express.static()` para los recursos.
- `dist/*.html` se incluye explícitamente dentro de la función, permitiendo que
  Express inyecte SEO y responda a rutas, idiomas y redirecciones.
- No se copia `index.html` a `public`: eso eludiría Express para el inicio.
  El script rechaza un `public/index.html` accidental.
- El tracing de la función excluye los recursos públicos y el resto de `dist`
  con `excludeFiles: "{public/**,dist/**,.env*}"`; el esquema de Vercel exige una
  cadena para ese campo. Los HTML incluidos explícitamente siguen empaquetados. Así no se duplican los
  aproximadamente 133 MB de imágenes dentro de la función Node.js.
- `public/assets/`, `.vercel/`, builds anteriores, entornos privados y dependencias
  locales se excluyen de Git o de la subida de código según corresponda. Los
  bundles CDN se generan durante la compilación remota.

No se añaden rewrites generales a `/index.html`; las rutas las decide Express.
Los recursos con hash conservan cabecera de caché inmutable.

## Vista previa aislada

En una build de Preview (y al ejecutar `build:vercel` sin un destino de producción
explícito), el script fuerza estos valores aunque hubiera valores heredados:

| Variable | Valor de Preview |
| --- | --- |
| `VITE_FIREBASE_MODE` | `emulator` |
| `VITE_ENABLE_EXTERNAL_SUBMISSIONS` | `false` |
| `VITE_ENABLE_DEMO_DATA` | `false` |
| `VITE_API_URL` | vacío, API de la misma vista previa |
| `VITE_EMAILJS_*` | vacíos |
| `VITE_MAKE_*_WEBHOOK_URL` | vacíos |

Además, Express bloquea Payrexx y utiliza el fallback local de Kai cuando
`VERCEL_ENV=preview`, incluso si se heredan claves o
`ALLOW_EXTERNAL_INTEGRATIONS=true`. No hacen falta claves reales para navegar.

El emulador de Firebase apunta a loopback del navegador. Una vista previa remota
permite revisar páginas y diseño como invitado; no acredita login, base de datos o
subidas de archivos. Esas pruebas requieren emuladores disponibles o servicios de
prueba configurados por separado. No debe interpretarse una vista previa visible
como autorización para usar servicios productivos.

Los builds marcados por Vercel como `production` conservan la configuración
explícita de ese entorno. No se ha autorizado aquí cambiar dominio, alias o
servicios de producción. Un proyecto nuevo cuyo primer despliegue sea Production
requiere configurar también las variables de aislamiento para ese destino.

## Comprobaciones locales

Desde la raíz, con Node.js 24:

```sh
npm ci
npm run typecheck
npm run build:vercel
npm test
```

El **21 de noviembre** pasaron `npm run typecheck`, `npm run build:vercel`, las
pruebas de integraciones/formularios/servidor y las **cuatro pruebas Vercel**. Se
corrigió una regresión de caché local: los bundles generados en `public/assets`
conservan ahora la cabecera inmutable al usar `npm start`. `npm test` incluye ya
`test:vercel`; las cuatro pruebas también se pueden ejecutar por separado con
`npm run test:vercel`.

Las regresiones focalizadas comprueban que Preview fuerza el modo emulador y
bloquea envíos; que sólo se copian bundles CDN; que importar la app en Vercel no
abre un puerto; y que las rutas, SEO, 301 y 404 siguen funcionando mediante la app
exportada. Payrexx y fetch están sustituidos por adaptadores inertes: claves
heredadas de prueba no producen ninguna solicitud externa.

La siguiente comprobación pendiente es completar MFA en la sesión autorizada y
abrir la vista previa protegida. Deben pasar `/api/health`, inicio, seis idiomas, rutas de servicios,
301 de `/contacto`, página inexistente 404 y carga de JS/CSS/imágenes. La prueba de
`/api/chat` debe informar `source: fallback`; Payrexx debe devolver 503 en Preview.
No se debe introducir una cuenta, solicitud ni pago de producción para validar la
vista previa. La protección de acceso de Vercel puede exigir iniciar sesión; no se
cambia esa protección como parte de esta preparación.

## Referencias oficiales consultadas

[Express en Vercel](https://vercel.com/docs/frameworks/backend/express) explica la
exportación, ejecución como función y el uso de `public/` para estáticos.
[Vite en Vercel](https://vercel.com/docs/frameworks/frontend/vite) describe el
frontend y las variables de build.
[Versiones Node.js](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
confirma Node.js 24 y el override mediante `engines`.
[Configuración de proyecto](https://vercel.com/docs/project-configuration/vercel-json)
detalla `framework`, build, funciones y salida.
El [adaptador Express oficial](https://github.com/vercel/vercel/blob/main/packages/express/src/build.ts)
permite contrastar la selección de entrada y el empaquetado de archivos.

## Dependencias: comprobación del 21 de noviembre de 2026

`npm audit --json` confirmó los **55 hallazgos** indicados por la instalación de
Vercel: **2 críticos**, 43 altos, 9 moderados y 1 bajo. Se realizó un triaje limitado
de los dos paquetes críticos, sin instalar, actualizar ni aplicar `npm audit fix`.

| Paquete instalado | Advisory y rango afectado | Uso observado |
| --- | --- | --- |
| `proxy-addr@2.0.7` | [GHSA-jqcg-44mw-7w3h](https://github.com/jshttp/proxy-addr/security/advisories/GHSA-jqcg-44mw-7w3h), `>=1.1.0 <2.0.8`; corregido en `2.0.8` | Dependencia de Express en ejecución del servidor. El advisory describe suplantación de IP con determinadas subredes IPv6 mal configuradas en `trust proxy`. No se observó esa configuración ni uso de `req.ip`/`req.ips` en la aplicación. |
| `websocket-driver@0.7.4` | [GHSA-xv26-6w52-cph6](https://github.com/faye/websocket-driver-node/security/advisories/GHSA-xv26-6w52-cph6), `<0.7.5`; corregido en `0.7.5` | Dependencia instalada de Firebase Realtime Database mediante `faye-websocket`. El advisory describe corrupción de mensajes por cabeceras de longitud del protocolo WebSocket antiguo. La aplicación importa Auth, Firestore y Storage; no se observó importación de Realtime Database. |

Ambos paquetes pertenecen al árbol de dependencias de producción, no sólo a
herramientas de compilación. No se ha confirmado explotación; la revisión del uso
observado tampoco acredita ausencia de riesgo en el entorno desplegado. Quedan
pendientes la actualización controlada de dependencias y su validación antes de
certificar producción. Esta comprobación no constituye una auditoría completa de
seguridad.
