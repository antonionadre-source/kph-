# Integraciones — estado comprobado el 21 de noviembre de 2026

Esta entrega distingue implementación, prueba local y configuración remota.
Se probaron Firebase Emulator Suite real y adaptadores externos inertes. No se
crearon pagos, usuarios, solicitudes ni mensajes en servicios productivos, y no
se desplegaron reglas sobre un proyecto real.

| Servicio | Implementación actual | Verificación | Configuración real pendiente |
| --- | --- | --- | --- |
| Firebase Auth | Email/contraseña, Google, sesión anónima, enlace del visitante a su cuenta y recuperación de sesión | Registro/perfil reales en demo, aislamiento propio/tercero, staff por claim y doble ID token verificados en Auth Emulator | Acceso del propietario, proveedores, dominios OAuth y correo de verificación en el proyecto correcto |
| Firestore y Admin | Perfiles, borradores, panel paginado, notas privadas, contacto, candidaturas, B2B y reseñas; precios/pagos bajo autoridad del servidor | Reglas reales, transacciones Admin, panel 25→46 registros y mensajes en Firestore Emulator | Credenciales Admin seguras, ID de base, migración de datos y despliegue deliberado de reglas/índices |
| Storage | Archivos por UID, MIME permitidos y máximo 20 MiB; CV PDF/DOCX; adjuntos elegidos obligatorios antes del recibo | Subida/lectura/borrado reales en Storage Emulator y 12 escenarios de helper con límites inertes | Bucket y reglas reales, permisos y revisión de retención/abuso |
| Payrexx | Gateway vinculado a reserva propia, importe recalculado, firma RFC1738, webhook HMAC y confirmación idempotente | Vectores independientes y gateways/eventos simulados; guardas Preview | Instancia TEST, secreto API, clave individual de webhook, APP_URL y contrato sandbox real |
| Gemini | Chat sólo en Express, instrucciones del servidor, validación, límites y fallback de ventas en seis idiomas | Rechazo de payload inválido, fallback y bloqueo sin opt-in; ninguna llamada real | Clave autorizada, cuota y límites distribuidos |
| EmailJS | Notificación opcional mediante configuración pública explícita | Guardas y canales simulados; no correo real | Servicio, plantilla y clave pública de cuenta autorizada |
| Make | Webhooks explícitos; comprueba estado HTTP y timeout; sin fallback productivo | Payload, fallos HTTP y entrega simulada | Destinos autorizados y control de acceso/abuso del escenario |
| Calendario y documentos | Borrador ICS Europe/Zurich y resumen escapado del pedido | Contratos de calendario, aislamiento y escape en pruebas del portal | No existe sincronización Outlook ni emisión fiscal certificada |

La configuración web Firebase original es pública; no concede permisos Admin ni
acredita el estado de las reglas desplegadas. La sesión Firebase CLI usada para
listar proyectos no estaba autenticada. Aún no se ha comprobado acceso de
propietario a Firebase/Google Cloud ni a los proveedores comerciales.

## Configuración y límites por entorno

Copia `.env.example` a `.env.local` si no existe. Express carga las variables
privadas; Vite incorpora `VITE_*` al navegador al compilar. Reinicia o recompila
tras cambiar valores. Las variables de proceso prevalecen sobre los archivos.

| Variables | Uso |
| --- | --- |
| `VITE_FIREBASE_MODE=emulator` | Proyecto demo y Auth/Firestore/Storage locales; predeterminado para desarrollo/SSR |
| `VITE_FIREBASE_EMULATOR_HOST` | Host visible desde el navegador; normalmente `127.0.0.1` |
| `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_DATABASE_ID` | Proyecto y base explícitos para el backend |
| `FIREBASE_AUTH_EMULATOR_HOST`, `FIRESTORE_EMULATOR_HOST` | Hosts Admin de pruebas, con proyecto `demo-*` |
| `FIREBASE_SERVICE_ACCOUNT_JSON` o `GOOGLE_APPLICATION_CREDENTIALS` | Credencial privada Admin para un destino real; nunca `VITE_*` |
| `PAYREXX_INSTANCE`, `PAYREXX_API_SECRET`, `PAYREXX_WEBHOOK_SIGNING_KEY`, `PAYREXX_MODE`, `APP_URL` | Configuración Payrexx sólo servidor; clave webhook distinta del secreto API |
| `GEMINI_API_KEY` | Sólo Express; no está definida en Vite ni en el bundle cliente |
| `ALLOW_EXTERNAL_INTEGRATIONS` | `false` por defecto en todos los entornos; opt-in obligatorio para Payrexx/Gemini |
| `VITE_ENABLE_EXTERNAL_SUBMISSIONS` | `false` por defecto; opt-in independiente para EmailJS/Make |
| `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` | Configuración pública EmailJS válida y explícita |
| `VITE_MAKE_LEAD_WEBHOOK_URL`, `VITE_MAKE_EMAIL_WEBHOOK_URL` | Webhooks públicos visibles para visitantes; sin secretos privados |
| `VITE_API_URL` | Vacío usa Express del mismo origen; sin reintentos contra Cloud Run productivo |
| `VITE_ENABLE_DEMO_DATA` | `false`; cualquier siembra de demostración requiere emuladores y opt-in |

`VITE_FIREBASE_MODE=production` selecciona explícitamente el proyecto real y exige
recompilar. En una build remota ordinaria sin override también se puede seleccionar
la configuración pública original: no publicar una build sin revisar el destino.
`build:vercel` fuerza emulador y envíos desactivados en Preview; Express bloquea
Payrexx/Gemini en Preview aunque herede claves y opt-in.

La Preview remota apunta al loopback del navegador para Firebase. No incorpora
emuladores alojados ni una base compartida: login, panel, borradores y archivos no
son funcionalidad remota certificada de esa Preview. Se prueban localmente con la
suite real. Para un entorno remoto de pruebas hace falta un backend de pruebas
alcanzable y configurado deliberadamente.

## Identidad, solicitudes y formularios

El equipo requiere claim administrada `staff === true` y `email_verified === true`.
El dominio o texto del correo no concede privilegios. Los clientes leen sus
registros y el panel consulta páginas de 25; `firestore.indexes.json` incluye las
combinaciones de propietario, estado y fecha. Los perfiles no aceptan claims.

Borradores y archivos pertenecen al UID anónimo o registrado. El registro enlaza la
identidad anónima para conservar propiedad; un conflicto de enlace informa error
sin sustituir silenciosamente el UID. Cada guardado conserva `createdAt`, espera
confirmación antes de avanzar y no deja continuar checkout si falla.

Para login en una cuenta existente, `/api/bookings/transfer-drafts` verifica el ID
token anónimo anterior y el Bearer de la cuenta destino mediante Admin. Sólo mueve
borradores `Draft` del origen exacto, sin pago/checkout/cotización/transacción ni
adjuntos. Preserva los datos y trata reintentos de forma idempotente; los casos
protegidos requieren ayuda del equipo, sin reescribir propietarios desde cliente.
Si Admin no está configurado devuelve 503 y el login sigue válido: la prueba queda
sólo en memoria para reintento explícito en esa sesión. No se persiste ni registra
el token. Tras una recarga o prueba caducada se necesita asistencia, sin afirmar
transferencia exitosa. Detalles en [BACKEND_SECURITY.md](BACKEND_SECURITY.md).

Contacto, candidaturas y B2B esperan el recibo Firestore primario. Un fallo de
notificación secundaria no borra ese recibo ni solicita recrear la candidatura.
Candidaturas/B2B reutilizan ID al reintentar; un adjunto seleccionado que no se
sube impide confirmar el envío. El recibo B2B y sus archivos incluyen propietario.
Reseñas valida UID, email, rating y esquema, y muestra fallo si no puede persistir.
El antiguo contacto del pie conserva su comprobación del canal principal.

Storage admite sólo rutas `solicitudes/{uid}/...`, `job_applications/{uid}/...` y
`b2b_quotes/{uid}/...`, con tamaño y MIME limitados. Propietario y equipo verificado
pueden leer. Las notas internas están en `team_notes` privado; los campos
`teamNotes` de registros históricos deben migrarse administrativamente antes de
considerarlos privados: una regla no puede ocultar sólo un campo de un documento.

## Precios y confirmación de pagos

React y Express comparten las fórmulas existentes. El navegador sólo escribe una
estimación; Express recalcula y persiste `serverQuote` en céntimos. Las tarifas
incompletas o casos que requieren revisión no se convierten en un cobro directo.

`POST /api/payrexx/create-gateway` acepta sólo `{ bookingId }`, verifica el ID token
y la propiedad de la reserva guardada y asocia el Gateway. Reintentos reutilizan
el enlace persistido; una creación concurrente o ambigua exige revisión en vez de
abrir otro cobro automáticamente. El cliente no puede marcar captura, alterar el
precio autorizado ni escribir eventos de pago. La configuración de instancia,
secreto API y clave individual de webhook se comprueba antes de persistir checkout:
si falta, devuelve 503 recuperable sin bloquear ni reprecificar el documento.

`POST /api/payrexx/webhook` verifica los bytes originales con HMAC SHA-256 y clave
individual; exige `X-Webhook-Signature` hexadecimal en minúsculas de 64 caracteres.
Sólo un evento confirmado válido, de la instancia y modo esperados y con referencia,
importe y moneda coincidentes puede persistir una captura idempotente. Eventos de
devolución/disputa retiran la verificación y exigen conciliación manual.

El retorno `?payment=success` consulta la reserva; no escribe un pago ni envía
notificaciones. La confirmación requiere `captured`, `verified: true`, transactionId
y gateway Payrexx. No afirma que se haya enviado un correo o garantizado un horario.
La petición de transferencia bancaria conserva estado pendiente. Faltan pruebas
con un webhook real del sandbox y revisión comercial de tarifas/condiciones.

## Pruebas reproducibles

Con Node 24 y dependencias instaladas:

```sh
npm run test:integrations
npm run test:forms
npm run test:uploads
npm run test:unit
```

Las pruebas de límites usan SDKs/fetch inertes. Los 16 escenarios de entrega
comprueban recibo primario, fallos parciales, CV, autenticación y reintento. Los 12
de subidas comprueban rutas/propietario, MIME/tamaño y errores. Pasaron las 43
unidades, incluidas 18 del portal, 7 de backend y 6 de PDF, además de las
regresiones de precios, firma, chat, idioma y calendario.

Con Java 21, iniciar emuladores en otra terminal y ejecutar las siete pruebas reales
(7/7 pasadas en esta entrega):

```sh
npx --yes firebase-tools@15.37.0 emulators:start --config firebase.emulators.json --project demo-kraken-pfm
```

```sh
npm run test:rules
```

Auth 9099, Firestore 8080, Storage 9199 e interfaz 4000 escuchan sólo en loopback.
`firebase.emulators.json` utiliza `firestore.rules`, índices y `storage.rules`
versionados; no utiliza el antiguo archivo Storage permisivo de pruebas. Los
rechazos PERMISSION_DENIED de casos negativos son esperados. Los tests cubren
creación y actualizaciones de borrador, ausencia de privilegios por dominio,
notas privadas, perfiles/reseñas/contacto/B2B, Storage, ID token real y transacciones
Admin con proveedor de pagos simulado, transferencia con dos identidades y
replay. No requieren autenticación CLI productiva.

El arranque manual de la web con Admin de emulador está en
[CODEX_SETUP.md](CODEX_SETUP.md). Las suites HTTP y Vercel requieren la build fresca
y pasaron 2/2 y 4/4 respectivamente. `npm ci` (436 paquetes), typecheck,
`build:vercel` y `npm test` terminaron con salida 0; `npm audit` reportó cero
hallazgos en todas las severidades. CI Node 24/Java 21/emuladores está implementada,
pendiente de su primera ejecución en GitHub. Publicación de esta revisión:
consultar registro en [VERCEL_SETUP.md](VERCEL_SETUP.md).

## Acceso necesario y puesta en servicio pendiente

1. Acceso del propietario al proyecto Firebase/Google Cloud y confirmación de ID de
   proyecto, base y bucket; habilitar Email/Password y Anonymous, y Google para
   su flujo de acceso/reseñas. Autorizar los dominios de la web y configurar correo
   de verificación. El registro/perfil/panel cliente no requieren una clave Admin
   en Vercel; la transferencia entre UIDs y checkout sí requieren Admin privado.
   Mantener el authDomain Firebase actual, salvo que se configure Hosting/DNS o
   proxy de `/__/auth/*` y la URI OAuth correspondiente. Cambiar únicamente la
   variable authDomain a un dominio Vercel no proporciona esos helpers.
   Comprobar también el plan Blaze requerido para Storage y el bucket correcto.
2. Revisión/migración de registros antiguos y notas internas, asignación de claims
   staff, despliegue deliberado de reglas, índices y Storage; protección de abuso
   y App Check según el destino. Ninguno se ha desplegado aquí a producción.
   Confirmar también la **base nombrada** seleccionada por la aplicación:
   `firebase.production.example.json` ejemplifica reglas/índices para su ID original,
   que debe coincidir con las variables cliente/Admin y el proyecto autorizado.
   `firebase.emulators.json` no selecciona esa base productiva y no debe usarse
   ciegamente para desplegar. El ejemplo no se ha desplegado ni valida acceso remoto.
3. Cuenta Payrexx TEST con secreto y clave individual de webhook, APP_URL HTTPS y
   destino JSON de prueba; comprobar Gateway, firma, duplicados y conciliación
   con sandbox antes de habilitar LIVE.
4. Cuentas autorizadas de Gemini, EmailJS y Make; configurar cuotas, plantillas y
   destinos de prueba y comprobar la entrega real antes de activar los flags.

Las credenciales se configuran directamente en secretos del entorno o `.env.local`,
nunca se solicitan en el chat. Detalles de contratos y límites en
[BACKEND_SECURITY.md](BACKEND_SECURITY.md).

Referencias oficiales: [Auth Emulator](https://firebase.google.com/docs/emulator-suite/connect_auth),
[Firestore Emulator](https://firebase.google.com/docs/emulator-suite/connect_firestore),
[Storage Emulator](https://firebase.google.com/docs/emulator-suite/connect_storage),
[custom claims](https://firebase.google.com/docs/auth/admin/custom-claims),
[dominio Auth personalizado](https://firebase.google.com/docs/auth/web/google-signin#customizing-the-redirect-domain-for-google-sign-in),
[requisitos Storage](https://firebase.google.com/docs/storage/web/start),
[webhook Payrexx](https://docs.payrexx.com/developer/guides/webhook),
[transacciones](https://docs.payrexx.com/developer/guides/webhook/transaction) y
[firma REST](https://developers.payrexx.com/reference/rest-api).
