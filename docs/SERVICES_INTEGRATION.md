# Servicios y Transit — integración del 23 de noviembre de 2026

La entrega `kraken-services-transit`, con formato `kraken-codex-bundle-v1`, se
reconstruyó en una carpeta de referencia separada del repositorio. El importador
se extrajo y revisó antes de utilizarlo. Validó rutas, duplicados, codificaciones,
tamaños y SHA-256 de **58 archivos y 5.174.608 bytes** antes de escribir. No se
ejecutaron scripts ni código de la entrega durante la importación, aparte del
importador revisado. El paquete no se extrajo sobre archivos de producción.

Esta integración adapta los archivos modulares a React/Vite/Express. No sustituye
la aplicación ni la portada completa: incorpora Servicios como página propia y
actualiza la sección `#umzug` y las dependencias que necesita.

## Página independiente y navegación

`components/services/ApprovedServices.tsx` sirve la ruta **`/leistungen`**. La
presentación breve de servicios continúa en la home; el explorador detallado,
Warum Kraken y sus preguntas frecuentes pertenecen a esta página independiente.
La ruta anterior `/services` y las demás páginas existentes conservan sus
componentes y sus rutas.

`components/home/ApprovedHeader.tsx` comparte la cabecera aprobada entre la home
y Servicios. Los menús de escritorio y móvil llevan a `/leistungen` y conservan
el idioma. La selección sigue usando el globo y las banderas existentes.
`components/App.tsx` mantiene una sola instancia del footer aprobado y del
asistente global Kai; la nueva página no monta un segundo chat o footer.

Servicios contiene un único H1 y exactamente cinco detalles nativos `details`:

| Servicio | Fragmento estable |
| --- | --- |
| Fensterreinigung | `#fensterreinigung` |
| Umzugsreinigung | `#umzugsreinigung` |
| Regelmässige Reinigung | `#regelmaessige-reinigung` |
| Grundreinigung | `#grundreinigung` |
| Kleine Umzüge | `#kleine-umzuege` |

Los enlaces y el historial abren el detalle correspondiente, también cuando se
vuelve a activar el mismo fragmento. La escena lateral de escritorio sigue el
servicio abierto; en móvil, la imagen está dentro de cada detalle. Los listeners
y los cuadros de animación pendientes se limpian al desmontar el componente.

La oferta sigue centrada en particulares, trabajos pequeños y viviendas de 1 a
4 habitaciones en Zürich, Schaffhausen y Winterthur. Se conserva el alemán de
Suiza con tratamiento Sie, la atención personal y el equipo experimentado, sin
añadir certificaciones, antigüedad, garantías, reseñas u oficinas sin confirmar.
El texto aprobado permanece: «Es wird keine Mehrwertsteuer verrechnet.»

## Idiomas y HTML inicial

`components/services/servicesTranslations.ts` contiene 120 claves de texto en
alemán, inglés, español, portugués, italiano y francés. Las claves son el texto
alemán aprobado; los valores son texto plano. Los textos compartidos de la
cabecera reutilizan el catálogo de la home. Las medidas usan punto decimal en
inglés y coma en los otros idiomas.

`ServicesContent` es el cuerpo React compartido por la navegación normal y el
HTML inicial. `scripts/render-services.mjs` genera en la compilación una versión
HTML de ese cuerpo para cada uno de los seis idiomas. Express selecciona la
versión correspondiente en el acceso directo y la recarga de `/leistungen`, de
modo que los textos principales y los desplegables están disponibles en HTML
antes de ejecutar JavaScript. Los artefactos de Vercel incluyen ese contenido y
sus hojas de estilo.

`seoConfig.ts` define título, descripción y canonical propios para
`https://krakenpfm.ch/leistungen`. Los hosts de preview mantienen `noindex,
nofollow`; la página del dominio público conserva su indexación normal. No se
publican `/entrega`, exportadores, paquetes fuente ni la identidad del
alojamiento privado como parte de esta integración.

## Recursos y marca

Se incorporan solo estas seis escenas WebP, cada una de 1254 × 1254 píxeles:

- `services-hero-v5.webp`
- `service-windows-v5.webp`
- `service-end-v5.webp`
- `service-regular-v5.webp`
- `service-deep-v5.webp`
- `service-moving-v6.webp`

Su tamaño total es **1.391.418 bytes**. Los hashes y las posiciones del logo se
registran en [SERVICES_ASSETS.json](SERVICES_ASSETS.json). La escena de mudanza
usa v6; no se incorpora v5. Los overlays SVG originales se mantienen en el hero
y en las dos presentaciones de mudanza, con viewBox `0 0 1254 1254`, recorte del
logo `0 280 1024 445` y las transformaciones suministradas. El encuadre permanece
cuadrado para conservar la alineación.

Los 14 recursos originales de la home conservan sus bytes y hashes en
[HOME_ASSETS.json](HOME_ASSETS.json). Esto incluye el logo original, el sprite
de iconos, `service-scenes-branded-v4.webp` para el exterior de Transit y
`transit-loading-v4.webp` para las etapas de carga. No se sustituyen los atlas
compartidos de la home por las nuevas escenas de Servicios.

## Transit y medidas del propietario

`components/home/TransitSection.tsx`, `van.js` y `transit-section.css` conservan
las vistas Unser Transit y Ein Blick hinein. La demostración mantiene las etapas
vacía, cajas, sillas y muebles desmontados protegidos, sin prometer una capacidad
de transporte. La secuencia usa seis segundos de exterior, 1,85 segundos por
etapa y 3,6 segundos en la vista cargada. El botón automático tiene solo un icono,
nombre accesible y un área de 44 × 44 píxeles.

La interacción manual, el foco en los controles y la apertura de medidas pausan
la secuencia hasta una reanudación explícita. Fuera de pantalla o con la pestaña
oculta no avanza; `prefers-reduced-motion` desactiva el inicio desatendido y
mantiene los controles manuales. El código limpia temporizadores, observadores
y listeners al desmontarse.

«Innenmasse ansehen» abre `#cargoMeasurements` en lugar de la ilustración. El
panel queda fuera de `role="img"`, con esquemas SVG y una lista HTML accesible.
«Zur Ladeansicht» vuelve a la carga. Seleccionar una etapa o regresar al exterior
cierra el panel. Servicios repite los mismos cuatro datos:

| Medida interior facilitada por el propietario | Valor |
| --- | --- |
| Fondo a nivel del suelo hasta la mampara | 255,5 cm |
| Ancho interior máximo | 177,5 cm |
| Ancho entre los pasos de rueda | 139 cm |
| Altura del suelo al techo | 140,6 cm |

Son medidas interiores. Esta integración no deduce una variante exacta del
vehículo, dimensiones exteriores, aperturas de puertas, volumen útil, carga
máxima, medidas de los pasos de rueda ni una cantidad garantizada de muebles.
El inventario, los accesos, el trayecto y los viajes se concretan personalmente.

## Calculadora, Kai y datos

Las acciones comerciales reutilizan `src/home/calculator.ts` y la calculadora
existente en `/quote`. No se crea otra calculadora ni se añaden parámetros
`service` o `postcode`. El puente mantiene el contrato ya establecido:

| Elección | Intención de la calculadora |
| --- | --- |
| `end` | `end-of-tenancy` |
| `regular` | `daily-cleaning` |
| `deep` | `deep-cleaning` |
| `moving` | `moving` |
| `windows` | Entrada de ventanas sin estimación ni checkout independiente |

Ventanas no se asigna a limpieza profunda. Sigue pendiente una tarifa
independiente aprobada; la entrada permite expresar la necesidad sin inventar
un importe. Los otros servicios conservan sus configuraciones existentes.

No se modifican el motor de precios, las APIs de solicitudes, la autenticación,
los pagos o la facturación. El puente no escribe el borrador
`kraken_consultation_data_v2` ni borra solicitudes. El idioma y el borrador del
cliente siguen usando los contratos actuales. Kai utiliza su apertura y su
traspaso explícito al calculador existentes, sin nuevos manejadores globales ni
envíos comerciales desde el chat.

Home, Servicios y Kai no añaden precios, tarifas por hora, rangos ni selectores
de presupuesto. Los contactos aprobados y el enlace `Website made by seociety.ch`
se reutilizan desde el footer común. Instagram permanece desactivado hasta
disponer de una URL oficial verificada.

## Verificación y publicación

Este documento describe la implementación y sus límites; no certifica por sí
solo un build, una prueba de navegador ni una publicación. Los resultados de
esas comprobaciones, los tamaños de pantalla revisados y el identificador del
despliegue se registran en la evidencia de entrega final. La configuración real
del proveedor de IA conserva las limitaciones documentadas en
[KAI_ASSISTANT.md](KAI_ASSISTANT.md); esta integración no acredita una llamada
real al proveedor.


## Acabado de la Transit y faros

La sección utiliza cinco imágenes nuevas con transparencia real: una vista exterior y cuatro etapas de carga de 1254 × 1254 px cada una. Los originales se conservan en `public/home-approved/assets`; las nuevas imágenes versionadas están en `public/transit-quality`. La composición normal de alfa sustituye la mezcla `lighten` y las máscaras, conservando la pintura blanca, los neumáticos oscuros y los colores de los muebles sin marcos rectangulares.

Las imágenes fueron generadas con la herramienta integrada `image_gen`, usando las escenas anteriores como referencia. Son representaciones ilustrativas de estilo fotográfico; no son fotografías documentales del vehículo ni una prueba de capacidad. Se conserva el logo Kraken original mediante capas SVG independientes en la carrocería y las cajas, sin texto generado. Los PNG maestros se convierten a WebP de calidad 95 sin redimensionar y conservando exactamente el alfa. Cada imagen se carga mediante `img` con `loading="lazy"`, `decoding="async"` y dimensiones explícitas.

La vista exterior añade dos faros SVG alineados con la nueva fotografía de 1254 × 1254 px y cuatro haces que siguen la posición real de los iconos al cambiar el tamaño o el idioma. Las cuatro fotos interiores y sus logos respetan los mismos `data-frame` y las dos capas del fundido existente. La navegación, las medidas y el controlador de reproducción se conservan.

El encendido y la iluminación de iconos usan animaciones CSS de seis segundos. El controlador existente deja el efecto apagado en la vista interior, fuera de pantalla y con la pestaña oculta. La pausa manual y el movimiento reducido conservan una iluminación tenue estática. No se añaden temporizadores de animación: el observador de tamaño y el RAF de posicionamiento se limpian al desmontar.


## Furgoneta estable durante la carga

La carrocería interior abierta se dibuja una sola vez con la imagen vacía y su logo lateral, fuera de las dos capas del fundido. Las cuatro etapas superponen únicamente el hueco de carga, limitado por un clip SVG normalizado a 1254 × 1254. Cada foto interior y sus logos de cajas comparten la misma transformación afín de registro; puertas, ruedas, luces, parachoques y laterales pertenecen siempre a la base fija. La etapa vacía conserva su recorte interior para poder volver a vacío mediante fundido.

Las imágenes originales no se modifican ni se regeneran. Se conserva la carga diferida con `img`, los identificadores y el controlador de reproducción, las medidas y el movimiento reducido. En tableta se reserva el espacio de las dos filas de controles para que la longitud de la etiqueta de reproducción no desplace verticalmente la imagen.
