# Integraciones: estado real al 20 de noviembre de 2026

Las pruebas realizadas no han creado cuentas, pagos, solicitudes ni mensajes en
producción. «Configurada» significa que existe una configuración local o pública
en el código; no significa que el proveedor haya autorizado la cuenta o que las
reglas desplegadas coincidan con los archivos del repositorio.

| Servicio | Presente en código | Configuración disponible | Verificado en esta entrega |
| --- | --- | --- | --- |
| Firebase Authentication | Email/contraseña, Google y anónimo | Configuración web pública original; proyecto `vivid-kite-477020-h6`. No hay credenciales administrativas | Inicialización y conexión de los tres emuladores con SDKs simulados; aislamiento local. No acceso real ni altas de usuarios |
| Firestore | Solicitudes, candidaturas, contacto, B2B y reseñas | ID de base importado y `firestore.rules` en el repositorio | Selección de proyecto demo local y base `(default)` mediante simulación. No lectura/escritura remota; reglas desplegadas desconocidas |
| Firebase Storage | Carga de fotos, CV y adjuntos | Bucket público original | Selección del emulador simulada. No carga real. Las reglas de Storage de producción no se incluyen |
| Payrexx | Express crea Gateway firmado; React solicita enlace | `PAYREXX_INSTANCE`, `PAYREXX_API_SECRET`, `APP_URL` pendientes de introducir en entorno seguro | Revisiones y pruebas de guardas locales del servidor; sin crear gateways. Firma/callbacks/conciliación real pendientes |
| Gemini | `/api/chat` usa SDK de servidor; respuesta local alternativa | `GEMINI_API_KEY` pendiente | Respuesta local y validación local del servidor; ninguna llamada real ni consumo de cuota |
| EmailJS | Contacto, Kai, registro, candidaturas, pie y reservas | Tres variables públicas sin valores reales; envíos requieren opt-in | Guardas y envío simulado con SDK inerte; sin email real ni acceso al panel |
| Make | Leads y confirmaciones de costes desde panel | Dos variables de webhook sin valores reales; envíos requieren opt-in | Payload, bloqueo sin configuración y rechazo HTTP fallido con fetch simulado; sin activar escenarios |

## Variables y configuración segura

Copia `.env.example` a `.env.local`, que está ignorado por Git. Express carga las
variables privadas de servidor y Vite incorpora las variables `VITE_*` al navegador
al compilar. Reinicia desarrollo o recompila tras cambiar variables.

- Sólo servidor: `GEMINI_API_KEY`, `PAYREXX_API_SECRET`, `PAYREXX_INSTANCE`, `APP_URL`.
  `ALLOW_EXTERNAL_INTEGRATIONS=true` habilita llamadas reales desde desarrollo:
  emplear exclusivamente credenciales de prueba para comprobar integraciones.
- Cliente público: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`,
  `VITE_EMAILJS_PUBLIC_KEY`, `VITE_MAKE_LEAD_WEBHOOK_URL`,
  `VITE_MAKE_EMAIL_WEBHOOK_URL`. Un webhook de Make en el navegador es visible
  para visitantes; usar un escenario de prueba y controlar permisos/límites en Make.
  No introducir claves privadas en ninguna variable `VITE_*`.
- `VITE_ENABLE_EXTERNAL_SUBMISSIONS=true` habilita EmailJS/Make sólo cuando sus
  variables están configuradas. El valor predeterminado desactiva envíos en todos
  los modos, incluida una compilación de producción. Debe configurarse de forma
  explícita en el destino real para restaurar envíos comerciales.
- `VITE_API_URL` puede apuntar a un backend de prueba; vacío utiliza Express del
  mismo origen. Se ha eliminado el reintento automático contra Cloud Run real.
- Firebase usa emuladores al ejecutar desarrollo o al abrir una build desde
  localhost/LAN local. `VITE_FIREBASE_MODE=emulator` fuerza el proyecto ficticio
  `demo-kraken-pfm`. `production` permite explícitamente el proyecto real,
  también desde local. Las variables `VITE_FIREBASE_*` opcionales sustituyen la
  configuración web importada: API key, project ID, app ID, auth domain, bucket e
  ID de base. La configuración web de Firebase es pública y no concede rol admin.

## Pruebas aisladas reproducibles

Desde la raíz:

```sh
node scripts/test-integrations.mjs
node scripts/test-form-delivery.mjs
```

Esta comprobación usa esbuild con SDKs y fetch inertes. Verifica que desarrollo y
localhost compilado conectan Auth/Firestore/Storage al proyecto demo; producción
remota y opt-in explícito seleccionan producción; EmailJS bloquea envíos sin flag o
configuración; Make genera payload y trata respuestas HTTP fallidas como errores.
La prueba de formularios ejecuta los manejadores reales con entregas simuladas:
el contacto del pie requiere aceptación del webhook; candidaturas exige al menos
un canal confirmado y muestra error cuando fallan los tres. No confirma las
credenciales, los permisos ni los proveedores reales.

Se incluye configuración para ampliar la verificación con Firebase Emulator Suite:

```sh
npx --package firebase-tools firebase emulators:start --config firebase.emulators.json --project demo-kraken-pfm
```

Requiere instalar la CLI y su versión compatible de Java. No se ha ejecutado la
suite real en esta entrega. Auth 9099, Firestore 8080, Storage 9199 e interfaz 4000
escuchan sólo en loopback. El navegador usa `VITE_FIREBASE_EMULATOR_HOST=127.0.0.1`
por defecto; para móvil con emuladores en otro equipo hay que configurar red/host
conscientemente. Las reglas de `rules/emulator.storage.rules` son exclusivamente
de pruebas locales: nunca desplegarlas. `VITE_ENABLE_DEMO_DATA=false` es el valor
predeterminado; sólo `true` con emuladores permite la siembra demo del panel.

## Correcciones del flujo

- Gemini permanece sólo en Express; Vite ya no define ni publica su clave.
- Login fallido nunca crea automáticamente una cuenta del equipo Kai.
- Los identificadores de EmailJS y webhooks se configuran mediante variables.
  Make comprueba estado HTTP y cancela tras cinco segundos; su canal secundario
  de leads mantiene aviso no bloqueante. El envío de correo del panel sí informa
  fallo si el webhook falla.
- Los comandos de reserva devueltos por Kai requieren confirmación explícita del
  visitante antes de enviar datos o conversación.
- `?payment=success` es un retorno no verificado: muestra «pago en revisión» en los
  seis idiomas, sin marcar captura, escribir en Firestore ni enviar notificaciones.
  Se eliminó el botón que simulaba una captura real. La transferencia manual
  conserva estado pendiente y requiere la acción explícita del visitante.
- El panel ya no siembra datos ficticios en Firebase real.
- El contacto del pie espera la aceptación del webhook antes de afirmar éxito.
  Candidaturas muestra error si ningún canal confirma entrega.
- Reseñas muestra error y permite reintentar si falla la persistencia; ya no afirma
  éxito ni dispara confeti por un error de Firestore.

## Accesos y trabajo pendiente

No se ha comprobado autorización administrativa de Firebase/Google Cloud, Payrexx,
Gemini, EmailJS ni Make. Los valores privados deben introducirse directamente en
`.env.local` o en los secretos del entorno de despliegue, nunca en el chat ni Git.
Se necesitan acceso a consolas/proyectos y cuentas de prueba de esos servicios.

Antes de habilitar producción, implementar y probar confirmación de pago en
servidor mediante notificación Payrexx validada y conciliación del Gateway con la
reserva. Actualmente no existe esa ruta ni se ha confirmado el formato de la
notificación. El retorno del navegador no certifica un pago. El importe recibido
por Express aún procede del cliente; una operación comercial definitiva requiere
validar/calcular el precio en servidor y asociarlo a una reserva autenticada.

Las reglas Firestore del repositorio reconocen staff por dominio/email sin exigir
`email_verified`; esto necesita revisión de autorización (claims administrados o
correos verificados) con el propietario. No se han desplegado cambios de reglas.
No existe permiso para la colección `reviews` en estas reglas, por lo que el
formulario fallará si producción usa este archivo. Contacto/B2B permiten creación
pública sin validación de campos. Revisar protección de abuso y reglas reales,
además de comprobar proveedor anónimo, dominios OAuth e índices de la base.

Varios formularios conservan canales secundarios no bloqueantes (por ejemplo
Make o carga de adjuntos); probar fallos parciales con emuladores y cuentas de
sandbox antes de certificar el recorrido comercial completo. El panel contiene
mensajes de sincronización Outlook sin integración Outlook real confirmada.

## Referencias técnicas

La conexión a los tres emuladores sigue las APIs de la documentación oficial:
[Authentication](https://firebase.google.com/docs/emulator-suite/connect_auth),
[Firestore](https://firebase.google.com/docs/emulator-suite/connect_firestore) y
[Storage](https://firebase.google.com/docs/emulator-suite/connect_storage).
Para requisitos y arranque, consultar la
[configuración de Emulator Suite](https://firebase.google.com/docs/emulator-suite/install_and_configure).
