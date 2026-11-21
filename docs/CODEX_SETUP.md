# Kraken PFM — entrega del 21 de noviembre de 2026

La copia principal de trabajo es `/Users/Projects/Downloads/another-star---kraken-properties`.
Puede seguir desarrollándose con Node.js 24. Incluye una portada orientada a pedir
presupuesto, un portal con identidad y permisos revisados, nuevas imágenes de Kai
y pruebas locales con Firebase Emulator Suite real. La configuración comercial
remota sigue pendiente; una Preview navegable no certifica pagos ni datos remotos.

## Procedencia y estado de publicación

La carpeta aportada se contrastó con `antonionadre-source/kph-`, commit
`fd8cc1ee9c9947cb7e2c718bc433a896c3da244a`. La única diferencia inicial de código
respecto a ese commit era la retirada de definiciones de Gemini en `vite.config.ts`,
que se conservó. La carpeta recibida no incluía historial Git ni los documentos y
lock reparado que describía el adjunto; se recuperó el historial mediante un clon
independiente. El adjunto se usó como contexto y sus afirmaciones se comprobaron.

El trabajo inicial se preparó en `outputs/Kraken-PFM-Codex` y se trasladó a esta
carpeta de Descargas, que es la referencia para continuar. `origin` corresponde al
[fork autorizado](https://github.com/antonionadre2-dev/kph-) y `upstream` al
[repositorio original](https://github.com/antonionadre-source/kph-). La rama es
`codex/local-migration-2026-11-20`; el [PR #1](https://github.com/antonionadre-source/kph-/pull/1)
permanece en borrador. La revisión comenzó en HEAD `7986211`; la entrega ampliada
posterior está compilada y publicada como [Preview protegida](https://kpfm-c9yyqi0ak-antonionadre2-5701s-projects.vercel.app)
READY, código `9a8c783`. Registro en [VERCEL_SETUP.md](VERCEL_SETUP.md). No se ha
fusionado el PR ni sustituido la producción de `krakenpfm.ch`.

La Preview publicada anteriormente corresponde a `10fbb52` y no representa estos
cambios nuevos. Su URL, protección de acceso y estado de verificación se mantienen
en [VERCEL_SETUP.md](VERCEL_SETUP.md).

## Qué incluye la entrega

- Portada comercial compacta, header y footer nuevos, navegación móvil y acceso
  directo al presupuesto por servicio. Se mantienen las rutas y seis idiomas.
- Kai de ventas con instrucciones del servidor, límites de mensajes y una
  respuesta local útil sin claves. El chat no ejecuta reservas ni envía datos
  implícitamente a partir de una respuesta del modelo.
- Registro y login separados de la asignación de privilegios. El registro puede
  enlazar la identidad anónima existente para conservar borradores y archivos.
  Perfil y notificación son operaciones diferenciadas; un fallo secundario no
  aparenta que deba crearse otra cuenta. El login de una cuenta existente puede
  transferir borradores mediante dos identidades verificadas en servidor; sólo
  `Draft` sin pago, checkout ni adjuntos. Un fallo conserva el login y permite
  reintentar con la prueba sólo en memoria durante esa sesión.
- Panel paginado con registros del propietario; acceso del equipo sólo con claim
  `staff: true` y correo verificado. Notas internas en subcolección privada,
  documentos HTML escapados y exportación de calendario como borrador ICS,
  sin afirmar sincronización Outlook ni emisión fiscal.
- Borradores guardados antes de avanzar, `createdAt` preservado, importes finales
  calculados en Express y pagos que requieren evidencia verificada del servidor.
  Contacto, candidaturas y B2B esperan su registro primario; los adjuntos elegidos
  deben subirse correctamente y los errores permiten reintentar.
- HTML inicial con contenido esencial, metadatos y `lang` por ruta/idioma; Express
  no expone su bundle, sourcemap ni estadísticas como archivos estáticos.

Los contratos de identidad, precios, pagos y reglas están detallados en
[BACKEND_SECURITY.md](BACKEND_SECURITY.md). Los estados y accesos por proveedor
están en [INTEGRATIONS.md](INTEGRATIONS.md).

## Ejecutar en local

Requisitos: Node.js 24 y npm. La comprobación de esta entrega utiliza Node
`v24.12.0`. Desde la raíz:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Si `.env.local` ya existe, consérvalo y compara los campos nuevos con el ejemplo.
Las variables de proceso prevalecen sobre `.env.local`, y ésta sobre `.env`.
No introducir secretos en Git, el chat ni variables `VITE_*`: estas últimas son
públicas y se incorporan al bundle durante la compilación.

La URL habitual es `http://localhost:3000`; consulta el puerto de la terminal.
`HOST=127.0.0.1` restringe el listener a loopback y `PORT=3001` cambia el puerto.
`npm run dev` selecciona desarrollo aunque herede `NODE_ENV=production` o exista
una build anterior. Los parámetros `?lang=` se separan del path entregado a Vite
para evitar IDs virtuales CSS inválidos. Un error al inicializar Vite conserva su
causa real en terminal.

Sin emuladores se pueden revisar páginas y el fallback de Kai. Para probar
registro, panel, borradores y adjuntos, sigue la sección siguiente.

## Firebase local: pruebas reales, sin producción

Se ejecutaron Auth, Firestore y Storage Emulator Suite con Java 21, Firebase CLI
`15.37.0` y el proyecto ficticio `demo-kraken-pfm`. No requieren una sesión Firebase
productiva. Instala Java 21 y deja su `bin` en PATH; después, en otra terminal:

```sh
npx --yes firebase-tools@15.37.0 emulators:start --config firebase.emulators.json --project demo-kraken-pfm
```

Los puertos están limitados a `127.0.0.1`: Auth 9099, Firestore 8080, Storage 9199
e interfaz 4000. Para que Express verifique los tokens del mismo entorno, usa en
`.env.local`:

```dotenv
VITE_FIREBASE_MODE=emulator
VITE_FIREBASE_EMULATOR_HOST=127.0.0.1
FIREBASE_ADMIN_PROJECT_ID=demo-kraken-pfm
FIREBASE_ADMIN_DATABASE_ID=(default)
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
ALLOW_EXTERNAL_INTEGRATIONS=false
VITE_ENABLE_EXTERNAL_SUBMISSIONS=false
VITE_ENABLE_DEMO_DATA=false
```

Reinicia `npm run dev` tras cambiar el entorno. Los datos de las pruebas son
locales. No se han desplegado reglas ni creado usuarios, pagos o solicitudes en
Firebase productivo. Con proveedores externos desactivados, checkout no abrirá
un pago real: su creación y confirmación se comprueban con un proveedor inerte.

## Comprobaciones reproducibles

```sh
npm ci
npm run typecheck
npm run build:vercel
npm test
```

`npm test` agrupa límites de integraciones, entrega de formularios, subidas,
servidor, Vercel y unidades. Los tests HTTP de producción requieren una build
fresca. Las reglas reales se ejecutan aparte, con los emuladores encendidos:

```sh
npm run test:rules
```

Para arrancar la suite de emuladores sólo durante esa prueba:

```sh
npx --yes firebase-tools@15.37.0 emulators:exec --config firebase.emulators.json --project demo-kraken-pfm "npm run test:rules"
```

Resultados finales locales del 21 de noviembre de 2026:

| Comprobación | Resultado |
| --- | --- |
| `npm ci` | Salida 0; 436 paquetes instalados |
| `npm run typecheck` | Salida 0 |
| `npm run build:vercel` | Salida 0 |
| `npm test` | Salida 0 en todas las suites |
| Unidades | 43/43, incluidas 18 del portal, 8 de backend y 6 de PDF |
| Formularios y subidas | 16/16 de entrega y 12/12 de subidas, con canales inertes |
| Servidor y Vercel | 2/2 HTTP y 5/5 de compatibilidad/aislamiento Preview |
| Reglas e integración Firebase | 7/7 sobre emuladores reales Auth/Firestore/Storage, transacciones Admin, doble identidad y Payrexx simulado |
| `npm audit` | 0 hallazgos: 0 críticos, altos, moderados y bajos |
| CI | [GitHub Actions](https://github.com/antonionadre2-dev/kph-/actions/runs/44908677518) success sobre `9a8c783`, incluidos emuladores reales |

La CI configura Node 24 y Java 21, instala el lock, comprueba tipos/build/suites y
arranca emuladores del proyecto demo para reglas. La ejecución remota citada
terminó correctamente, además de las comprobaciones locales.

La revisión de navegador comprobó la portada sin desbordamiento horizontal a
320, 360, 390, 414, 768, 1024, 1280, 1440 y 1920 px; los seis idiomas y el fallback
del chat. Con Firebase local real se comprobaron registro y perfil guardados,
registros propios visibles y de otro usuario ocultos, staff con claim real,
paginación de 25 a 46 registros y mensajes. Estas pruebas no acreditan entrega de
correo ni un pago Payrexx real, y no son una comprobación remota de producción.

## Kai, recursos visuales y rendimiento

Se crearon **20 escenas nuevas en total**: 15 de calendario y cinco de servicios/
Thurgau. El selector usa la fecha de `Europe/Zurich`; las ventanas de campaña se
distinguen de festivos oficiales y Sechseläuten usa fechas contrastadas. Las nuevas
escenas son ilustraciones de marca, no fotos de trabajos o clientes reales.

Hay **151 derivados**: 143 WebP de esas escenas y de la optimización de 31
originales válidos, cuatro derivados de dos originales actuales de About
recuperados de Dropbox y cuatro variantes de encuadre de los logos existentes.
El inventario actual contiene **285 imágenes públicas válidas, cero dañadas y
cero rutas faltantes**. Se retiraron referencias inactivas sin inventar logos.
Los originales válidos no se sobrescribieron y los logos no se redibujaron.

Los 41 archivos históricos dañados se archivaron fuera de `public`, preservando
bytes y SHA256. Los 22 originales históricos pendientes siguen identificados:
una ilustración nueva o una imagen regional válida no equivale a recuperarlos.
Consulta [ASSET_AUDIT.md](ASSET_AUDIT.md), [KAI_MEDIA.md](KAI_MEDIA.md) y sus
manifiestos para procedencia, dimensiones y reconstrucción. No utilizar
`scripts/fix-corrupt-images.ts` ni la opción de poda como método de recuperación.

Se separó la inicialización Auth de Firestore/Storage y se difirieron cargas
pesadas. La build final mide el JavaScript de entrada HTML y sus modulepreloads:

| Recurso | Sin comprimir | Gzip calculado |
| --- | ---: | ---: |
| JS inicial anterior | 2.570.402 B | 730.521 B |
| JS inicial actual | 722.451 B | 201.858 B |
| CSS actual | 245.640 B | 30.965 B |

El JS inicial sin comprimir baja **71,9%** sobre esa referencia. El chunk de
presupuesto mide 459,18 kB (126,23 kB gzip); queda un aviso de chunk Firebase
cargado de forma diferida de aproximadamente 570 kB. Son medidas de archivos y
compresión local, no tráfico observado ni puntuación Lighthouse. El aviso restante
no impidió compilar.

Se parchearon los dos paquetes críticos iniciales, se retiró Jimp sin importadores
y se fijaron dependencias transitivas mediante overrides. Tras reinstalar, el
`npm audit` final reportó **0 vulnerabilidades de todas las severidades**. Ese
resultado describe el árbol y advisories consultados en esta fecha; no certifica
por sí solo toda la seguridad del servicio.

## Qué acceso falta para publicar servicios reales

La consulta Firebase CLI de proyectos no tenía una sesión autenticada. Para
habilitar un entorno real hace falta acceso del propietario al proyecto Firebase/
Google Cloud correcto, su ID de base, configuración Admin, proveedores Auth,
dominios OAuth, claims staff, reglas, índices y Storage. Registro/perfil/panel
ordinarios usan el SDK cliente; Admin privado es necesario para checkout y la
transferencia entre UIDs. Los cambios de reglas y la migración de notas antiguas
requieren una operación deliberada con backup.

La base productiva seleccionada es **nombrada**, distinta de `(default)` local.
`firebase.production.example.json` declara el ID original: confirmar que coincide
con `VITE_FIREBASE_DATABASE_ID`, `FIREBASE_ADMIN_DATABASE_ID` y el proyecto
autorizado antes de usarlo. No desplegar a ciegas con `firebase.emulators.json`,
que no declara esa base. No se ha desplegado el ejemplo ni validado permisos
remotos. Mantener el authDomain Firebase actual; un alias personalizado necesita
Hosting/DNS o proxy de los helpers Auth y configuración OAuth, no sólo una variable.

Payrexx necesita credenciales TEST y webhook firmado comprobado en sandbox;
Gemini, EmailJS y Make necesitan sus cuentas y destinos autorizados. Estos valores
se introducen directamente en el entorno seguro. La Preview fuerza emuladores y
bloquea integraciones comerciales; no aporta emuladores remotos ni convierte el
loopback del visitante en una base de datos compartida.
