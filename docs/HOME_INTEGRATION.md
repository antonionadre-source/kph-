# Homepage aprobada — actualizada el 23 de noviembre de 2026

Integración del paquete `kraken-home-codex.zip` en el repositorio React/Vite/Express
existente. La portada es una ruta React, sin iframe, sin segunda calculadora y sin
copiar la identidad de alojamiento ni las páginas privadas de entrega del paquete.

## Implementación

- `components/home/ApprovedHome.tsx`: estructura aprobada en seis idiomas,
  cinco servicios particulares, navegación, footer y botones que abren Kai.
- `components/KaiAssistant.tsx` y `src/kai/*`: asistente global compartido con
  las otras páginas, conversación guiada o IA de servidor y resumen editable
  con traspaso explícito al calculador. Guía en `KAI_ASSISTANT.md`.
- `components/home/{app,scene,van,lifecycle}.js`: controles y escenas con recursos
  propios de cada montaje. Se cancelan listeners, observadores, peticiones y
  temporizadores al salir, también con React StrictMode.
- `approved-home.css`: estilos aislados bajo `.kraken-home`, animaciones con
  prefijo. `responsive-fixes.css` mantiene toda la casa dentro del encuadre y
  reserva ambas vistas de la Transit frente al reset `hidden` de Tailwind.
  `device-fixes.css`, cargado al final, permite crecer al header y las tarjetas
  con textos largos, adapta la Transit y pone los controles de escena en una
  columna hasta 540 px, con campos de 16 px y alturas táctiles de 48 px.
- `public/home-approved/assets`: los 14 recursos originales del paquete,
  idénticos en bytes. Inventario y SHA-256 en `HOME_ASSETS.json`.
- `src/home/calculator.ts` y `components/ConsultationPage.tsx`: puente a `/quote`,
  hidratación del borrador y tratamiento explícito de ventanas sin tarifa.
- `server/homeWeather.ts` y `server.ts`: API meteorológica del mismo origen.
- `index.html`, `seoConfig.ts`, `i18n.ts` y `components/App.tsx`: ruta de inicio,
  metadatos de Zürich/Schaffhausen/Winterthur y separación de la navegación
  anterior. Las otras páginas conservan sus componentes y sus idiomas.

## Tamaño de la casa e idiomas

La casa ocupa aproximadamente un tercio más de ancho visible en móvil y tablet,
compensando el margen transparente del recurso original, sin cortar sus paredes
ni desalinear las capas o los controles. En escritorio se amplía un 10% y se
reserva espacio vertical para el suelo.

`homeTranslations.ts` contiene el texto de la portada, la escena, la Transit y
los metadatos en alemán, inglés, español, portugués, italiano y francés.
El asistente global usa `src/kai/copy.ts` y comparte el idioma del sitio.
`HomeLanguageSelector.tsx` recupera el globo y las banderas; incluye
foco visible, cierre con Escape y panel desplazable para pantallas bajas.
Los estados dinámicos se actualizan sin reiniciar las escenas ni perder el
servicio elegido, la pausa o las preferencias de la ilustración.

El proveedor existente comparte la preferencia con el resto de páginas. La URL
`lang` o `hl` prevalece sobre la preferencia guardada, y los enlaces a `/quote`
transportan el idioma también al abrir otra pestaña. Se conservan los parámetros
de navegación, el historial y el idioma elegido al recargar. Las frecuencias y los
controles de navegación del calculador completan sus textos en los seis idiomas.

## Calculadora y datos

Todas las acciones comerciales de la home, sus tarjetas, la Transit y la
continuación desde Kai entran en la calculadora existente en `/quote`.

| Elección | Identificador existente |
| --- | --- |
| `end` | `end-of-tenancy` |
| `regular` | `daily-cleaning` |
| `deep` | `deep-cleaning` |
| `moving` | `moving` |
| `windows` | Intención separada sin estimación ni checkout |

Se conserva el contrato `kraken_preselected_service`. No se añaden parámetros
`service` o `postcode`. El puente no escribe `kraken_consultation_data_v2`,
carritos ni solicitudes. La calculadora hidrata los datos antes de guardar y
conserva campos anteriores desconocidos cuando el usuario edita sus datos;
un JSON dañado no se sobrescribe automáticamente.

Kai ya no depende del panel ni del formulario del paquete estático. Su diálogo
global conserva el borrador durante la navegación y lo guarda en
`sessionStorage.kraken_kai_request_v1`. El usuario revisa un resumen editable
antes de continuar. El traspaso temporal `kraken_kai_calculator_transfer_v1`
se consume una vez; se restauran primero los datos existentes y se respeta la
elección explícita de conservarlos o sustituir campos en conflicto. El chat no
envía solicitudes comerciales, correos, reservas ni pagos. La configuración de
Gemini y las limitaciones del modo guiado se detallan en `KAI_ASSISTANT.md`;
una respuesta real del proveedor todavía no está verificada.

El motor sólo tenía ventanas como complemento de otras limpiezas. No existe una
tarifa independiente aprobada. Por indicación de Antonio, el acceso de ventanas
queda disponible sin mostrar importes, sin sustituirlo por otro servicio y sin
crear una modalidad de pago ficticia. Los otros cuatro servicios reutilizan sus
configuraciones y tarifas existentes. No se modifican pagos, facturación ni APIs
de solicitudes. El texto de la home sobre ausencia de IVA se conserva tal como
fue aprobado; debe revisarse su coherencia con la configuración de facturación
existente antes de publicar cambios comerciales en producción.

## Escena y tiempo

Hora `Europe/Zurich`, estaciones, Navidad/Año Nuevo, iluminación, ropa y tareas
de Kai mantienen las reglas editoriales del paquete. Los cambios manuales se
identifican como vista previa. La Transit conserva dos vistas, etapas, controles
de teclado, pausa/reanudación y respeto al movimiento reducido. No se incorporan
capacidades ni dimensiones numéricas del vehículo.

`GET /api/weather/zurich` usa observaciones LSZH de NOAA AWC. Conserva caché de
20 minutos por proceso, coalescencia de peticiones concurrentes, timeout de ocho
segundos, reintento tras cinco minutos y antigüedad máxima de 90 minutos. Sólo
una observación aún válida puede conservarse como dato retrasado. Si falta, se
devuelve un estado no disponible y la escena queda neutral, sin temperatura
inventada ni inferencia de frío.

## SEO y contactos

Canonical `https://krakenpfm.ch/`, metadatos en el idioma seleccionado y datos
estructurados sin precios, rangos ni reseñas. Los hosts de preview reciben
`X-Robots-Tag: noindex, nofollow`; la portada pública conserva indexación.
Instagram sigue desactivado, configurable en `components/home/site-config.js`
hasta disponer de la URL oficial. Se incluye el enlace `Website made by seociety.ch`.

## Validación

La validación anterior del 23 de noviembre comprobó `npm run build` y
`npm run test:home`: pruebas de puente/borradores, hosting,
clima, estado de Kai, limpieza del montaje, selección de idioma y metadatos. `npm run lint` reproduce
únicamente los tres errores que ya tenía la versión recibida: `webhookPromise`
en `CareersPage.tsx` y `setConfetti`/`confetti` en `PaymentCelebrationPage.tsx`.

Se revisan en navegador 320, 390, 768, 1024, 1440 y 1920 px, sin desbordamiento
horizontal; casa completa, día/noche, celebraciones, clima no disponible, menú
móvil, teclado, movimiento reducido, pausa y estabilidad de altura de la Transit.
Los accesos a la calculadora se prueban con las conexiones de Firebase, EmailJS
y Payrexx bloqueadas temporalmente: no se crean usuarios, pagos ni solicitudes
para validar esta portada. Esto no certifica el envío ni un pago de producción.

La revisión del 23 de noviembre valida los seis idiomas desde el selector, la
conservación del servicio y de los ajustes de escena, recarga y navegación a la
calculadora. La compilación de producción se comprueba con el acceso a ventanas
en francés, sin importe ni pago. No se envían formularios, cuentas ni pagos.

La ampliación posterior del asistente global incluye pruebas de servidor con
proveedores simulados (`kai-assistant.test.ts`) y del traspaso
(`kai-draft.test.ts`). No son llamadas reales a Gemini. La revisión final de
esta ampliación y de los cambios responsive se registra en la entrega, sin
atribuirles automáticamente los resultados anteriores.

## Alojamiento en krakenpfm.ch

`vercel.json` selecciona Express de forma explícita frente al antiguo preset Vite.
El servidor exporta la aplicación y comparte su inicialización sin abrir un
listener en la función. `npm run build:vercel` conserva el HTML para Express y
copia sólo los recursos del frontend a `public/assets`. Se excluyen fuentes de
mapas, estadísticas, bundles Node, registros y entornos privados. El launcher
local `server.js` se conserva y queda fuera del detector de entrada de Vercel.

El lock se sincronizó con las dependencias ya declaradas; una instalación limpia
con Node 24 y `npm ci --include=dev` pasa. No se cambiaron las tarifas ni se
introdujeron nuevas dependencias declaradas.

La publicación usa el proyecto existente de krakenpfm.ch. Para evitar que el
colector remoto omita archivos generados, se construye y verifica el artefacto
completo antes de enviarlo:

```sh
vercel pull --yes --environment=production
vercel build --prod --yes
node scripts/prepare-vercel-output.mjs
node scripts/prepare-vercel-output.mjs --verify
vercel deploy --prebuilt --prod --skip-domain --yes
vercel promote <deployment-id>
```

El preparador incorpora sólo originales públicos versionados y bundles de la
build actual; verifica hashes, referencias, enrutamiento y HTML de la función.
`rewriteRelativeImportExtensions` asegura imports JavaScript ejecutables en el
artefacto Node. Las pruebas ejecutan además la función compilada sin TSX.
El despliegue anterior se conserva como punto de rollback. La preview local
continúa en `http://localhost:3001/`.
