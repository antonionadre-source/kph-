# Backend, reservas y permisos — estado de la corrección

Actualizado el 21 de noviembre de 2026. Se han realizado pruebas locales con
adaptadores de pago inertes y con Auth, Firestore y Storage Emulator Suite del
proyecto ficticio `demo-kraken-pfm`. No se han creado pagos, usuarios ni datos en
servicios de producción. No se han desplegado reglas reales.

## Contrato de identidad y datos

- Ser equipo requiere dos propiedades verificadas del token Firebase:
  `staff === true` y `email_verified === true`. El dominio del correo no concede
  permisos. Las claims se asignan mediante una operación administrativa segura;
  ni el registro ni `profiles/{uid}` pueden asignarlas.
- Los clientes y visitantes anónimos pueden persistir sus propios borradores y
  solicitudes, identificados por `userId === auth.uid`. No es obligatorio crear
  una cuenta para pedir presupuesto. El proveedor anónimo debe estar habilitado
  en un entorno real para ese recorrido.
- `profiles/{uid}` tiene un esquema de perfil independiente. `reviews` valida
  propietario, email del token, valoración y campos. Contacto público conserva un
  esquema limitado; B2B exige una identidad propia, incluso anónima.
- Los clientes no pueden escribir un pago, una cotización de servidor ni un
  estado operativo terminado. `amount` inicia en cero; `estimatedAmount` contiene
  exclusivamente la estimación de UI. Una cotización de servidor fija `amount`
  y `serverQuote.totalCents`/`depositCents` en céntimos enteros.
- Los cambios de borrador preservan `createdAt`. El siguiente paso espera la
  persistencia, y checkout no continúa si no se pudo guardar la solicitud.
- Las notas internas están separadas en
  `maintenance_requests/{id}/team_notes/{noteId}` y sólo las lee el equipo.
  **Datos anteriores:** cualquier `teamNotes` antiguo en el documento principal
  necesita migración administrativa a la subcolección y retirada del campo
  original; las reglas no pueden ocultar un campo dentro de un documento legible.
- Storage usa `solicitudes/{uid}/...`, `job_applications/{uid}/...` o
  `b2b_quotes/{uid}/...`, archivos de hasta 20 MiB y MIME permitidos. Sólo el
  propietario sube; propietario y equipo autorizado leen. `storage.rules` es la
  regla versionada; el antiguo archivo permisivo de pruebas no se despliega.

`firestore.indexes.json` incluye los índices compuestos de propietario/estado/
fecha para las listas paginadas del panel.

### Vincular borradores al iniciar sesión en una cuenta existente

El registro nuevo conserva el UID anónimo mediante enlace. Para iniciar sesión
en una cuenta existente, el cliente captura antes su ID token anónimo y llama a
`POST /api/bookings/transfer-drafts` después del login: Bearer del destino y
`sourceIdToken` del origen. El servidor verifica ambas identidades con Admin,
exige proveedor `anonymous` en el origen y una cuenta diferente no anónima en el
destino. El cliente no puede aportar ni reescribir UIDs de propietario.

Una transacción por página mueve sólo documentos del origen exacto en estado
`Draft`, sin pago, checkout, cotización autorizada, transacción ni adjuntos. Los
archivos llevan el UID en su ruta Storage: esos casos requieren asistencia en
vez de una reasignación que rompa su acceso. Se preservan `createdAt`, importe y
demás datos; el servidor registra un evento separado sin tokens. La consulta
pagina por ID de documento, hasta 100 registros, y un replay no vuelve a mover
documentos cuya propiedad ya cambió.

La transferencia necesita Admin, aunque el registro/perfil/panel ordinarios usen
los SDK cliente. Si falta configuración Admin devuelve 503 sin invalidar el login.
La prueba y el cursor quedan sólo en memoria para reintento explícito durante esa
sesión, nunca en localStorage ni logs. Si caduca la prueba o se recarga la página,
la interfaz informa que hace falta asistencia; no afirma que se hayan vinculado
los borradores. Los pagos y solicitudes ya iniciadas no se transfieren.

## Cotización y pago

Las fórmulas existentes se extrajeron a `src/domain/pricing.ts` para que React y
Express compartan los mismos cálculos. No se inventaron tarifas nuevas. El
servidor valida cantidades y recalcula desde los detalles de servicios guardados,
ignorando el precio enviado por el navegador. Tipos sin tarifa completa,
jardinería XL y residuos peligrosos requieren revisión. Una estimación provisional
no abre un cobro de reserva directa; la opción de presupuesto detallado conserva
la tasa de CHF 15 ya existente. Las estimaciones y condiciones del catálogo siguen
necesitando revisión comercial del propietario.

`POST /api/payrexx/create-gateway` acepta únicamente `{ bookingId }` y exige
`Authorization: Bearer <Firebase ID token>`. El servidor verifica la sesión y la
propiedad del documento, persiste una cotización y asocia el Gateway al pedido.
Una solicitud repetida reutiliza un enlace ya guardado. La creación concurrente o
un resultado incierto queda bloqueado para revisión, evitando crear gateways de
forma indiscriminada tras un timeout. No se habilita otro cobro automáticamente
cuando la creación necesita revisión.

La firma REST codifica RFC1738 completo, incluyendo apóstrofos, paréntesis y los
otros caracteres especiales. `APP_URL` debe estar configurada; el servidor no
confía en el header Origin para las redirecciones.

El retorno de navegador `payment=success` no confirma nada. La página consulta
el documento propio y sólo muestra confirmación cuando el pago tiene
`status: captured`, `verified: true`, `transactionId` y `gateway: payrexx`.
Un cobro confirmado tampoco afirma que se haya enviado email o reservado un
horario: el equipo confirma disponibilidad y detalles del servicio.

### Webhook firmado

`POST /api/payrexx/webhook` conserva los bytes originales del cuerpo JSON y
verifica `X-Webhook-Signature` como HMAC SHA-256 con la clave individual del
webhook. Se exige la representación hexadecimal en minúsculas de 64 caracteres
documentada por Payrexx; se compara en tiempo constante. No se aceptan otros
formatos de firma. Sin clave devuelve
503 y una firma incorrecta devuelve 401.

Sólo `transaction.status === confirmed`, instancia, modo TEST/LIVE, referencia,
moneda CHF e importe exacto de la cotización pueden confirmar el pago. La
transacción se guarda mediante Admin SDK con un evento de auditoría y se trata
idempotentemente. Eventos firmados de devolución/disputa se marcan para revisión
y retiran la verificación positiva; no se inventa una conciliación final ni se
ejecutan reembolsos desde este código.

El contrato procede de las guías oficiales de
[webhooks](https://docs.payrexx.com/developer/guides/webhook),
[transacciones](https://docs.payrexx.com/developer/guides/webhook/transaction) y
[firma REST](https://developers.payrexx.com/reference/rest-api).
**Pendiente:** contrastar un webhook JSON real de sandbox, su firma y los estados
de la cuenta autorizada; las pruebas actuales usan fixtures firmadas con claves
ficticias. No se presenta el adaptador como una integración real certificada.

## Chat y entrega de formularios

Express acepta de 1 a 24 mensajes, roles user/model, hasta 3000 caracteres por
mensaje y 18000 totales. Las instrucciones son del servidor y no las puede
sustituir `systemInstruction` del cliente. Gemini limita la respuesta a 500 tokens.
Hay límites por IP e instancia, con memoria acotada. Son límites **por instancia**;
un límite global para un despliegue distribuido y el presupuesto/cuota del
proveedor deben configurarse en la infraestructura correspondiente.

Kai conserva respuestas útiles de ventas en seis idiomas sin clave, sin órdenes
JSON que ejecuten reservas ni afirmaciones de pagos realizados. Contacto espera
el registro primario de Firestore; el fallo de una notificación secundaria no
convierte una solicitud guardada en un error falso.

Los endpoints comerciales requieren `ALLOW_EXTERNAL_INTEGRATIONS=true` en todos
los entornos. Vercel Preview sigue bloqueándolos incluso si hereda esa variable.
Las notificaciones cliente EmailJS/Make mantienen su opt-in independiente.

## HTML y recursos servidos

El HTML inicial recibe título, descripción, h1/contenido esencial, lang, og:url y
og:locale coherentes con la ruta e idioma. Los valores se escapan. La plantilla
productiva se reutiliza por instancia sin releerla sincrónicamente cada vez.
El servidor autónomo sirve sólo los bundles de `dist/assets`, no el bundle de
backend, sourcemap ni stats.html. Vercel mantiene los assets en CDN y la plantilla
HTML en la función Express.

En desarrollo, Vite recibe el path separado de la URL original con query. Los
parámetros de idioma no forman parte de sus IDs virtuales de CSS/módulos. La
regresión HTTP usa una copia temporal con CSS inline y prueba los seis idiomas,
además de comprobar el comportamiento con una build antigua presente.

## Pruebas y próximos pasos operativos

Comprobaciones focalizadas, sin build concurrente:

```sh
node --test tests/backend.test.ts tests/html.test.ts tests/booking-client.test.mjs
node --import tsx --test tests/rules.test.ts
node --import tsx --test --test-name-pattern='development uses Vite' tests/server.test.ts
```

La segunda requiere los emuladores locales Auth 9099, Firestore 8080 y Storage
9199 del proyecto demo. Comprueba reglas reales, el ID token anónimo, borradores
secuenciales, perfiles/reseñas/contacto, recibo B2B privado, aislamiento de Storage y transacciones
Admin con creación de Gateway simulada, reutilización, confirmación y disputa.
Los rechazos PERMISSION_DENIED de casos negativos son resultados esperados.

Para un entorno real quedan pasos que requieren acceso autorizado:

1. Revisar, migrar datos antiguos y desplegar deliberadamente `firestore.rules`,
   `storage.rules` e índices sobre el proyecto/base correctos. Conservar un backup
   y no aplicar reglas nuevas suponiendo que todos los registros históricos ya
   cumplen el esquema. No se ejecutó esa migración ni despliegue.
   La aplicación selecciona una **base nombrada**, no `(default)` en producción.
   `firebase.production.example.json` declara explícitamente el ID original para
   reglas e índices. El propietario debe confirmar o sustituir ese ID para que
   coincida con `VITE_FIREBASE_DATABASE_ID` y `FIREBASE_ADMIN_DATABASE_ID`, así como
   verificar proyecto y bucket. No usar `firebase.emulators.json` como configuración
   de despliegue productivo: no declara la base nombrada. No se ha desplegado el
   ejemplo ni verificado la existencia/permisos remotos de esa base.
2. Habilitar los proveedores Auth necesarios y asignar staff mediante Admin SDK
   sólo a operadores cuya identidad/correo se haya verificado. Revisar dominios
   OAuth y configurar App Check/protección de abuso de formularios públicos.
3. Configurar sólo en secretos de servidor `FIREBASE_ADMIN_PROJECT_ID`,
   `FIREBASE_ADMIN_DATABASE_ID` y `FIREBASE_SERVICE_ACCOUNT_JSON` o
   `GOOGLE_APPLICATION_CREDENTIALS` explícito. La configuración web de Firebase
   no concede acceso administrativo. Nunca poner estas claves en VITE_* ni Git.
4. Preparar sandbox Payrexx: instancia/secreto de prueba, APP_URL HTTPS, modo
   TEST, clave individual del webhook y destino JSON a `/api/payrexx/webhook`.
   Ejecutar el contrato de sandbox y revisión de conciliación antes de plantear
   habilitar LIVE. Nunca introducir claves ni códigos de autenticación en el chat.

Las variables de emulador sólo pueden seleccionar un proyecto `demo-*`; no se
mezclan con un proyecto real. En ese modo se desactiva la detección de metadata
Cloud y no se usan cuentas de servicio heredadas. Las credenciales de producción
no se han configurado ni probado en esta corrección.
