# Kraken PFM en Vercel — 21 de noviembre de 2026

La aplicación se prepara como Express + Vite sobre Node.js 24, con API, SEO por
ruta/idioma, redirecciones y 404. La publicación anterior de Preview está READY,
pero **todavía no representa la ampliación actual** de portada, portal, backend e
imágenes. La nueva build ya pasó las pruebas locales. **Publicación de esta revisión:
consultar registro de despliegue tras la publicación.** La URL y el hash se
incorporarán al registrar esa publicación; no se atribuyen a la Preview anterior.

## Publicación y acceso

| Destino | Estado comprobado |
| --- | --- |
| Preview anterior | [kpfm-m1oddj90p](https://kpfm-m1oddj90p-antonionadre2-5701s-projects.vercel.app), `dpl_6yv836BqyBvcB5P9563Lo6ZWhgbS`, commit `10fbb52`, READY |
| Entrega ampliada | Build local verificada; publicación de esta revisión: consultar registro de despliegue tras la publicación |
| Producción existente | `dpl_Ac9XCUhdt8EQnxtvgmMf6c5BQYMc` y dominio `krakenpfm.ch`, sin sustituir |
| PR | [#1 en borrador](https://github.com/antonionadre-source/kph-/pull/1), sin fusionar |

El proyecto Vercel existente es `kpfm` (`prj_vkZiyfkHn6SLHf1ViysGRbPy0WXz`). La
CLI comprobó acceso de propietario al equipo del proyecto. La protección de Preview
SSO sigue en `all_except_custom_domains`: abrirla exige una sesión autorizada y puede
requerir MFA. No se desactiva ni se elude esa protección. READY acredita que el
adaptador terminó la publicación anterior; las páginas y `/api/health` remotos
siguen sin verificación funcional autenticada documentada.

El preset global del proyecto sigue siendo Vite. `vercel.json` selecciona Express
para cada despliegue que contiene esta configuración, sin cambiar el ajuste global,
el dominio ni la producción existente. Los entornos del proyecto estaban vacíos al
consultarlos; no hay credenciales productivas configuradas por esta entrega.

## Arquitectura conservada

`server.ts` exporta la app Express. Con `VERCEL=1` no abre un puerto: el adaptador
gestiona la función. Fuera de Vercel conserva los tres recorridos:

```sh
npm run dev
npm run build
npm start
```

`dev` usa Vite middleware; `build` genera frontend y `dist/server.cjs`; `start`
ejecuta Express compilado. Node está restringido a `>=24 <25` en `engines`.

La configuración versionada usa `framework: express`, `npm ci`,
`npm run build:vercel` y `outputDirectory: null`. No configurar la salida como
`dist` ni añadir un rewrite general a `/index.html`: eso perdería las decisiones
de rutas, API y SEO de Express.

`build:vercel` limpia bundles CDN anteriores, compila y copia `dist/assets` a
`public/assets`. Los originales públicos y esos bundles se sirven por CDN.
`dist/*.html` se incluye en la función para aplicar metadatos y contenido esencial
por idioma. No se copia el HTML a `public`; el script rechaza un `public/index.html`
accidental para evitar que el inicio eluda Express.

`functions.server.ts.excludeFiles` es una cadena de globs
`{public/**,dist/**,.env*}` y `includeFiles` conserva explícitamente los HTML. Así
los medios públicos y el bundle de backend no se duplican innecesariamente en la
función. `public/assets`, `.vercel`, builds, dependencias y entornos privados se
excluyen de Git o de la subida según corresponda. Los recursos con hash reciben
caché inmutable. El servidor autónomo sólo publica los assets compilados, no
`server.cjs`, su mapa ni `stats.html`.

## Aislamiento de Preview

En toda build sin `VERCEL_ENV=production`, `build:vercel` fuerza:

| Variable | Valor |
| --- | --- |
| `VITE_FIREBASE_MODE` | `emulator` |
| `VITE_ENABLE_EXTERNAL_SUBMISSIONS` | `false` |
| `VITE_ENABLE_DEMO_DATA` | `false` |
| `VITE_API_URL` | Vacío, Express del mismo origen |
| `VITE_EMAILJS_*` y `VITE_MAKE_*_WEBHOOK_URL` | Vacíos |

Express también bloquea Payrexx/Gemini cuando `VERCEL_ENV=preview`, incluso si
hereda claves y `ALLOW_EXTERNAL_INTEGRATIONS=true`. Kai responde con el fallback
local. En otros entornos, las llamadas reales requieren opt-in explícito.

Firebase emulador apunta a loopback del navegador visitante. Vercel no aloja esos
emuladores ni dispone de una base demo remota: la Preview permite revisar páginas,
idiomas, recursos, navegación y API de fallback. **No acredita registro, panel,
reservas o archivos remotos funcionando.** Esos recorridos se prueban localmente
con Auth/Firestore/Storage reales en Emulator Suite. Preparar un destino remoto de
pruebas requiere configuración y acceso independientes.

Una build marcada `production` conserva la configuración explícita de ese entorno.
No usar `--prod`, reasignar alias ni cambiar el dominio para validar esta entrega.
Los datos y proveedores reales no se habilitan como consecuencia de una Preview.

## Verificación reproducible

Con Node 24:

```sh
npm ci
npm run typecheck
npm run build:vercel
npm test
```

`test:server` contiene dos regresiones: desarrollo en copia limpia/con build
antigua/entorno heredado, y producción compilada con rutas/SEO/caché/artefactos
privados. El test de desarrollo incluye CSS inline y `?lang=` en seis idiomas para
impedir que la query contamine IDs virtuales de Vite.

`test:vercel` contiene cuatro regresiones: flags de build Preview, publicación de
assets sin HTML/backend estático, import de Express sin listener y rutas/API con
cero llamadas externas pese a claves heredadas ficticias. Payrexx y fetch son
inertes. Estas cuatro pruebas se incluyen en `npm test`.

Resultados finales locales del 21 de noviembre: `npm ci` terminó con salida 0
(436 paquetes), typecheck 0, `build:vercel` 0 y `npm test` 0. Pasaron 43 unidades
(incluidas 18 del portal, 7 de backend y 6 de PDF), 16 escenarios de formularios,
12 de subidas, **2/2 de servidor y 4/4 de Vercel**. Las reglas e integración sobre
Auth/Firestore/Storage Emulator Suite real pasaron **7/7**, incluyendo Admin,
transferencia con dos identidades y pagos simulados.

La CI está implementada en `.github/workflows/verify.yml`, con Node 24, Java 21,
instalación reproducible, tipos, build, suites y emuladores. Su primera ejecución
en GitHub sigue pendiente; no se presenta como un check remoto ya aprobado.

La QA local de navegador comprobó la portada sin overflow horizontal en nueve
anchos (320, 360, 390, 414, 768, 1024, 1280, 1440 y 1920 px), seis idiomas y chat
fallback. Con demo real se comprobaron registro/perfil guardados, cliente con
registros propios y tercero oculto, staff con claim real, paginación 25→46 y
mensajes. No son pruebas de los servicios comerciales remotos.

Después de publicar la nueva Preview, completar el acceso SSO autorizado y
comprobar `/api/health`, inicio, seis idiomas, servicio/ciudad, 301 de `/contacto`,
404, recursos JS/CSS/imágenes y navegación móvil. `/api/chat` debe devolver
`source: fallback` y Payrexx 503. No convertir un formulario productivo en una
prueba de despliegue. Una ausencia de emuladores remotos debe informarse como tal.

## Dependencias y rendimiento

Se parchearon `proxy-addr` y `websocket-driver`, que concentraban los dos hallazgos
críticos iniciales, se retiró Jimp sin uso y se fijaron dependencias transitivas.
Tras `npm ci`, el `npm audit` final informa **0 hallazgos: 0 críticos, altos,
moderados y bajos**. Describe el árbol consultado en esta fecha, sin sustituir
la revisión de código ni la configuración segura del destino.

| Medida de build | Sin comprimir | Gzip calculado |
| --- | ---: | ---: |
| JS inicial anterior (entrada + modulepreloads) | 2.570.402 B | 730.521 B |
| JS inicial actual (entrada + modulepreloads) | 722.451 B | 201.858 B |
| CSS actual | 245.640 B | 30.965 B |

La reducción de JS inicial sin comprimir es **71,9%**. El chunk de presupuesto
mide 459,18 kB (126,23 kB gzip); sigue el aviso de Firebase diferido de unos 570 kB.
La build terminó correctamente con ese aviso. Son tamaños de archivos y gzip
local, no tráfico real ni puntuación Lighthouse.

El inventario público contiene **285 imágenes válidas, cero dañadas y cero rutas
faltantes**, con 20 escenas nuevas y 151 derivados. Los 41 recursos dañados se
archivaron conservando bytes/hashes; los originales históricos pendientes siguen
identificados. El inventario visual y la procedencia están en
[ASSET_AUDIT.md](ASSET_AUDIT.md) y [KAI_MEDIA.md](KAI_MEDIA.md).

## Requisitos para un entorno comercial

Faltan acceso y configuración del propietario Firebase/Google Cloud, Admin,
proveedores Auth, claims verificadas, reglas/índices/Storage, migración de datos y
sandbox Payrexx. EmailJS/Make/Gemini requieren cuentas, destinos y cuotas
comprobados. Ver [INTEGRATIONS.md](INTEGRATIONS.md) y
[BACKEND_SECURITY.md](BACKEND_SECURITY.md). No introducir secretos en `VITE_*`,
Git ni el chat.

La aplicación usa una base Firestore **nombrada**: antes de cualquier despliegue de
reglas/índices, confirmar el ID de `firebase.production.example.json` contra las
variables cliente/Admin y el proyecto autorizado. No reutilizar ciegamente la
configuración de emuladores, que no declara ese ID. La transferencia segura de
borradores al login necesita Admin privado; el registro/perfil/panel ordinarios
usan SDK cliente. Preview conserva el aislamiento demo, sin emuladores remotos.

Referencias oficiales consultadas: [Express en Vercel](https://vercel.com/docs/frameworks/backend/express),
[Vite en Vercel](https://vercel.com/docs/frameworks/frontend/vite),
[Node.js en Functions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions),
[vercel.json](https://vercel.com/docs/project-configuration/vercel-json),
[adaptador Express](https://github.com/vercel/vercel/blob/main/packages/express/src/build.ts)
y [API de Vite](https://vite.dev/guide/api-javascript.html#vitedevserver).
