# Kraken PFM — estado verificado para Codex

Pruebas realizadas el **20 de noviembre de 2026**, con Node.js **v24.12.0** y npm
**11.6.2**. Estado de GitHub y Vercel actualizado el **21 de noviembre de 2026**.
El día 21 se repitieron TypeScript, `build:vercel`, las pruebas de
integraciones/formularios/servidor y cuatro regresiones específicas de Vercel.

## Procedencia y carpeta de trabajo

La carpeta aportada `/Users/Projects/Downloads/another-star---kraken-properties`
se comparó archivo por archivo con un clon independiente de
<https://github.com/antonionadre-source/kph->. `main` estaba en
`fd8cc1ee9c9947cb7e2c718bc433a896c3da244a`, el commit indicado por el usuario.
La única diferencia del código recibido era que `vite.config.ts` ya había retirado
las definiciones que podían exponer Gemini al navegador. Se conservó esa mejora.

La carpeta real no incluía `.git`, `AGENTS.md`, `LEEME-DESCARGA.txt` ni este documento,
y su lock era el remoto incompleto. El CODEX_SETUP.md adjunto se utilizó como
contexto; su descripción del paquete preparado se contrastó con estos archivos.
Se reconstruyó el historial desde un clon separado, sin sobrescribir un historial
local ni cambios posteriores del remoto. La rama de continuación es
`codex/local-migration-2026-11-20`.

Los cambios se prepararon y verificaron en una copia con historial bajo
`outputs/Kraken-PFM-Codex`, y se aplicaron también a la carpeta aportada de Descargas.
La carpeta de Descargas es la copia principal que debes abrir en Codex para
continuar. El clon temporal de comparación se retiró después de recuperar el
historial para liberar espacio; el historial completo permanece en `.git` del proyecto.
El directorio `work/` del chat sólo contiene temporales de esta sesión.

## Abrir y ejecutar

Abre `/Users/Projects/Downloads/another-star---kraken-properties` en Codex.
La raíz contiene `package.json`, `server.ts` y `AGENTS.md`. Con Node.js 24:

```sh
cd /Users/Projects/Downloads/another-star---kraken-properties
npm ci
npm run dev
```

Tras arrancar, la URL prevista es <http://localhost:3000>; comprueba el puerto que
indica la terminal. El comando conserva el host original `0.0.0.0`; puedes
restringirlo a loopback con `HOST=127.0.0.1` en `.env.local`.
Para cambiar de puerto en macOS/Linux: `PORT=3001 npm run dev`. Ctrl+C lo detiene.

`npm run dev` establece desarrollo explícitamente, aunque el entorno heredado
indique producción y aunque exista `dist/index.html`. Vite usa el mismo servidor
HTTP para HMR; los recursos compilados anteriores no se sirven en desarrollo.
Si Vite no puede inicializarse, el arranque falla con el error real.

Para producción local:

```sh
npm run build
npm start
```

La compilación produce `dist/index.html`, los recursos web y `dist/server.cjs`.
En la comprobación final se encontró un error de espacio (`ENOSPC`); se liberaron
sólo temporales y dependencias duplicadas de esta tarea y la repetición pasó.
El bundle del servidor selecciona producción incluso sin `NODE_ENV`. Express
sigue proporcionando API, redirecciones, SEO y 404; subir sólo `dist` a un hosting
estático no reproduce toda la aplicación. El HTML de inicio ya pasa por la
inyección SEO por idioma en producción; los recursos con hash conservan caché.

## Configuración de servicios

Puedes navegar localmente sin claves. Para configurar servicios de prueba:

```sh
cp .env.example .env.local
```

Edita `.env.local` directamente en tu equipo; está ignorado por Git. Las variables
de proceso prevalecen sobre `.env.local`, y ésta sobre `.env`. Nunca publiques
claves en el chat o en Git. Reinicia o recompila después de cambiar variables.

| Variables | Dónde y para qué |
| --- | --- |
| `PAYREXX_INSTANCE`, `PAYREXX_API_SECRET`, `APP_URL` | Sólo Express; instancia de prueba, secreto y URL de retorno |
| `GEMINI_API_KEY` | Sólo Express; nunca se define en el bundle de Vite |
| `ALLOW_EXTERNAL_INTEGRATIONS` | `false` por defecto; habilita Payrexx/Gemini reales en desarrollo sólo tras preparar cuentas de prueba |
| `VITE_FIREBASE_MODE` | `emulator` para pruebas; `production` permite explícitamente el proyecto real |
| `VITE_FIREBASE_*` | Configuración web pública y host de emuladores; ver `.env.example` |
| `VITE_ENABLE_EXTERNAL_SUBMISSIONS` | `false` por defecto; habilita EmailJS/Make tras configurar un destino de prueba |
| `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` | Configuración pública de EmailJS |
| `VITE_MAKE_LEAD_WEBHOOK_URL`, `VITE_MAKE_EMAIL_WEBHOOK_URL` | Destinos de Make; visibles en navegador, nunca incluir secretos privados |
| `VITE_API_URL` | Vacío usa Express del mismo origen; permite backend de prueba explícito |
| `VITE_ENABLE_DEMO_DATA` | `false`; la siembra de datos del panel sólo existe con emuladores y opt-in |

Las variables `VITE_*` son públicas y se incorporan al compilar. En una publicación
real es necesario configurar explícitamente EmailJS/Make para restaurar envíos.
El Firebase cliente original conserva su configuración pública; no otorga acceso
administrativo. En local/SSR se utiliza el proyecto ficticio `demo-kraken-pfm`.

La configuración de Firebase Emulator Suite está en `firebase.emulators.json`.
La suite real no se ejecutó: este equipo no tiene un runtime Java instalado.
Las comprobaciones de Firebase utilizaron SDKs simulados, sin datos productivos.
Consulta [INTEGRATIONS.md](INTEGRATIONS.md) para comandos, estados y limitaciones
por proveedor, reglas, confirmación de pagos y accesos requeridos.

## Correcciones y pruebas

Problemas preexistentes reproducidos antes de modificar:

- `npm ci` fallaba porque faltaban dependencias y paquetes opcionales en el lock.
  Se reparó sin cambiar los rangos de las dependencias.
- Desarrollo asumía producción o desactivaba Vite al existir una build.
- TypeScript detectaba tres errores: `webhookPromise` sin declarar en Careers y
  `confetti`/`setConfetti` ausentes en PaymentCelebration. Se corrigieron.
- El cambio de idioma conservaba un parámetro `lang` antiguo; ahora URL, estado y
  recarga coinciden, preservando el resto de parámetros y el fragmento.
- Se retiraron el registro automático staff tras login fallido y las credenciales
  de acceso prellenadas en la pantalla de login.
- Se eliminó el fallback de pagos al servidor real. Un retorno de navegador no
  marca cobro: muestra pago en revisión en el idioma activo y conserva la URL.
- Formularios del pie, candidaturas y reseñas ya no confirman éxito ante fallo total.

Comprobaciones reproducibles:

```sh
npm ci
npm run typecheck
npm run build
npm test
```

`npm test` ejecuta pruebas de límites de integraciones, entrega de formularios,
regresiones HTTP y cuatro comprobaciones de compatibilidad y aislamiento de
Vercel Preview. Las pruebas de servidor requieren la build previa. Cubren una
copia temporal limpia, presencia de una build antigua, entorno de producción
heredado, rutas/404/redirecciones/SEO, recursos de producción, fallback de Kai y
Payrexx firmado contra un adaptador axios inerte. Ningún gateway real se crea.

Las comprobaciones de formularios ejecutan los handlers con canales inertes y
verifican éxito/fallo; no certifican entrega a proveedores. Firebase/EmailJS/Make
se prueban con SDKs/fetch simulados, incluyendo imports Node/SSR sin navegador.
También se comprobaron 983 condiciones de rutas y metadatos en los seis idiomas.

La revisión de navegador con Chrome incluyó servicios en seis idiomas, páginas
principales, login/registro, retorno de pago pendiente y diseños de 1440×1000 y
390×844. No se enviaron formularios reales. Los recursos externos no visuales se
bloquearon en la prueba. Capturas y resultados están en `outputs/verification` del
chat. Las imágenes aún pendientes limitan la revisión visual de algunas páginas.

Vite mantiene dos avisos de chunks JavaScript superiores a 500 kB; no impiden
compilar. No se ha realizado una auditoría completa de dependencias, rendimiento,
accesibilidad ni seguridad. No hay nuevos errores de TypeScript pendientes.

## Recursos visuales

Se recuperaron **74 archivos**, conservando las 60 imágenes originalmente válidas.
Incluye originales históricos, iconos y logos comprobados, imágenes Dropbox
originales y conversiones del mismo contenido. Los cinco paneles de OurStory se
recuperaron desde sus JPEG históricos, comprobados visualmente.

El inventario público final es **134 válidos, 41 dañados y 5 ausentes**. Quedan
**22 rutas pendientes en componentes activos**; cada ruta, uso y original necesario
está en [ASSET_AUDIT.md](ASSET_AUDIT.md). El manifiesto añade procedencia y SHA256.
No se borraron, inventaron ni ocultaron faltantes, ni se ejecutó el script de píxeles
transparentes. El script nuevo `scripts/audit-assets.py` sólo lee imágenes y
requiere Pillow; el informe distingue también los archivos antiguos de `src/assets`.

## GitHub y próximos pasos

El **21 de noviembre de 2026** se creó el fork
[antonionadre2-dev/kph-](https://github.com/antonionadre2-dev/kph-) y se publicó allí
la rama `codex/local-migration-2026-11-20`. La cuenta Git local
`antonionadre2-dev` tiene escritura y administración en su fork. El acceso al
repositorio original sigue siendo de lectura; el flujo de fork permite proponer
los cambios sin escribir directamente en su rama `main`.

El [pull request #1](https://github.com/antonionadre-source/kph-/pull/1) está abierto
como **borrador**, desde esa rama del fork hacia `antonionadre-source/kph-:main`.
No se ha fusionado el PR, publicado a producción ni usado force push.

El PR disparó inicialmente una comprobación automática de Vercel que solicitaba
autorización de un miembro del equipo. Después se comprobó acceso CLI de
propietario al proyecto existente `kpfm` y el **21 de noviembre** se creó por CLI
una [vista previa protegida](https://kpfm-m1oddj90p-antonionadre2-5701s-projects.vercel.app),
`dpl_6yv836BqyBvcB5P9563Lo6ZWhgbS`, desde el commit `10fbb52`. Vercel informa
**READY** tras instalación, build y empaquetado Express. Esto no implica que la
comprobación automática inicial del PR haya quedado autorizada.

La protección SSO sigue activa y la sesión de propietario quedó pendiente de
completar MFA. No se han confirmado todavía por HTTP o navegador `/api/health`,
las páginas ni las rutas remotas. El siguiente paso es completar esa verificación
en Vercel y comprobar la vista previa sin enviar datos a producción. El entorno
Preview bloquea Payrexx/Gemini incluso con claves heredadas, usa Firebase emulador
y desactiva EmailJS/Make y los datos demo.

Permanecen intactos el despliegue productivo `dpl_Ac9XCUhdt8EQnxtvgmMf6c5BQYMc`,
el dominio `krakenpfm.ch` y el preset global Vite. La vista previa usa Express por
la configuración del repositorio. Consulta [VERCEL_SETUP.md](VERCEL_SETUP.md)
para configuración, pruebas y comprobaciones remotas pendientes.

Los remotos de la carpeta principal son:

| Remoto | Repositorio | Uso |
| --- | --- | --- |
| `origin` | <https://github.com/antonionadre2-dev/kph-> | Publicar la rama en el fork autorizado |
| `upstream` | <https://github.com/antonionadre-source/kph-> | Seguir el original y revisar cambios de `main` |

Para continuar en la rama y actualizar el mismo PR:

```sh
git fetch upstream
git fetch origin
git status
git log --oneline HEAD..upstream/main
git log --oneline upstream/main..HEAD
git push origin codex/local-migration-2026-11-20
```

Si `upstream/main` ha avanzado, revisar e incorporar sus cambios en esta rama,
conservar el trabajo ajeno y repetir las comprobaciones afectadas antes de subir.
Los nuevos commits en la rama del fork actualizan el PR existente. La descripción
preparada está en `docs/PULL_REQUEST.md`; el estado de borrador mantiene visibles
las integraciones y los recursos pendientes de revisión.

No se han comprobado permisos administrativos en Firebase/Google Cloud, Payrexx,
Gemini, EmailJS o Make. Publicar la rama en GitHub no configura ni valida esos
servicios.

Después: aportar los 22 originales activos pendientes y configurar cuentas de
prueba. La conciliación Payrexx por notificación validada en servidor y las reglas
Firebase deben verificarse antes de certificar el funcionamiento comercial completo.
