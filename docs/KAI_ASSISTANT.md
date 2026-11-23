# Kai — guía operativa

Implementación del 23 de noviembre de 2026. Este documento describe el código;
no certifica una publicación ni una llamada real a Gemini.

## Interfaz y uso

`components/KaiAssistant.tsx` es el único asistente global, compartido por la
home y las demás páginas, incluida `/quote` (excepto la invitación de reseñas).
`FloatingMascot.tsx` lo monta desde `App.tsx`. Los botones de la home usan
`src/kai/open.ts`: si el componente todavía está cargando, conserva la última
petición de apertura. El borrador continúa al navegar entre páginas.

El diálogo nativo gestiona la modalidad, el foco y Escape. Al abrir se enfoca el
título; al cerrar o minimizar se devuelve el foco al botón de origen.
Tab y Mayús+Tab enlazan el último y el primer control visible del panel. El hilo y
el resumen tienen desplazamiento propio. `src/viewport.js` sigue el viewport
visual para colocar el panel sobre el teclado móvil; las consultas de contenedor
compactan las barras en paneles bajos. El error queda dentro del hilo desplazable
y se reserva espacio para el campo de mensaje y la continuación.

La interfaz y las etiquetas de los 17 campos están en alemán suizo, inglés,
español, portugués, italiano y francés (`src/kai/copy.ts`). Usa la preferencia
compartida del sitio. Cambiar de idioma cancela e invalida la petición activa,
conserva los datos y permite reintentar. Los campos de resumen no se editan
mientras hay una respuesta pendiente para evitar que ésta pise correcciones.

## Datos y continuación

`sessionStorage.kraken_kai_request_v1` conserva el borrador y hasta 30 mensajes
en la sesión de la pestaña; no es un registro de solicitudes del servidor.
Cerrar o minimizar no lo borra. Restablecer requiere una confirmación y borra
sólo la conversación y el borrador de Kai, sin tocar los datos del calculador.

El resumen permite elegir entre los cinco servicios, revisar los datos conocidos
y completar los pendientes. Sólo **Continuar en la calculadora** prepara el
traspaso a `/quote`. Si hay diferencias con datos guardados, la opción por
defecto es conservarlos; el usuario puede elegir sustituir los campos en
conflicto por los de Kai. Las notas se conservan y amplían, sin descartar las
anteriores. Los detalles sin control equivalente permanecen como notas visibles.
Los editores permanecen en su sección durante la escritura para conservar el
foco. Cambiar de servicio conserva el borrador completo de Kai; la transferencia
incluye únicamente los campos aplicables al servicio elegido y los comunes.

`src/kai/draft.ts` escribe únicamente el sobre temporal
`kraken_kai_calculator_transfer_v1` en la sesión, con respaldo en memoria, consumo
único y caducidad de una hora. `ConsultationPage.tsx` restaura primero el borrador
existente y después aplica el traspaso confirmado. Un JSON previo dañado no se
sobrescribe. Se mantienen `kraken_consultation_data_v2` y el carrito existente.

Kai no calcula precios, descuentos, importes ni duraciones; éstos pertenecen al
motor real del calculador. El chat no envía una solicitud de servicio, correos,
WhatsApp, reservas ni pagos, y no confirma disponibilidad. Ventanas continúa
sin estimación independiente ni checkout. El enlace de contacto abre el correo
del usuario; no envía un mensaje automáticamente.

## Servidor y configuración

`POST /api/kai/assist` recibe el mensaje, el historial limitado, el borrador y el
idioma. Los mensajes del chat sí se transmiten a esta API y, si se configura la
IA, al proveedor; no deben confundirse con una solicitud comercial enviada.

- `GEMINI_API_KEY`: sólo en el servidor. En el entorno Vercel revisado no está
  configurada, por lo que se usa el modo guiado determinista. **La IA real no se
  ha verificado.**
- `GEMINI_MODEL`: opcional; el valor por defecto del código es
  `gemini-3.5-flash-lite`. La disponibilidad real de ese modelo debe comprobarse
  con la cuenta del proveedor antes de dar la conexión por validada.
- El proveedor tiene un timeout máximo de ocho segundos. Ausencia de clave,
  fallo o respuesta inválida mantienen el modo guiado y los datos recuperables.
  La etiqueta de IA sólo aparece tras una respuesta del servidor con `mode: ai`;
  el modo guiado informa expresamente de que no hay IA activa.
- Límite de 25 peticiones por IP y minuto, en memoria **por instancia** del
  servidor. No es un límite global distribuido. El exceso devuelve HTTP 429 y
  `Retry-After`; las respuestas llevan `Cache-Control: no-store`.

`server/kaiAssistant.ts` valida el contrato, filtra contenido monetario y
rechaza afirmaciones no permitidas del proveedor. `server/kaiKnowledge.ts`
contiene el conocimiento y las preguntas guiadas. Ninguna clave debe añadirse
a variables públicas del frontend.

## Verificación

`tests/kai-assistant.test.ts` cubre extracción guiada, idiomas, varios servicios,
datos pendientes, validación, contenido monetario, fallos, timeout y límite de
peticiones. Las respuestas de IA se simulan con proveedores inyectados; estas
pruebas no llaman a Gemini. `tests/kai-draft.test.ts` cubre el traspaso explícito,
conflictos, conservación de datos, almacenamiento bloqueado y sobres inválidos.

Los resultados finales de compilación, pruebas, revisión en navegador y eventual
publicación se registran en la entrega correspondiente; estas pruebas simuladas
no certifican IA real, envíos, reservas ni pagos de producción.

### Continuar cuando el calculador ya está abierto

Si Kai se utiliza dentro de `/quote`, Continuar emite un aviso sin datos personales tras preparar la transferencia. El calculador consume el borrador una sola vez y lo combina con los campos y la configuración que están editándose en ese momento, sin recargar la página. El resumen detecta también estos cambios sin guardar para ofrecer conservarlos o reemplazarlos. Si se cambia de servicio, la edición interrumpida se conserva en memoria y se restaura al reabrir ese servicio durante la misma visita al calculador. No se añade ni modifica ningún elemento del carrito, solicitud o pago automáticamente; un borrador local malformado permanece intacto.
