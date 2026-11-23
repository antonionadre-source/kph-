# Integración de los adjuntos About y Warum Kraken

Se integran dos entregas independientes del propietario: la sección Home `#warum-kraken` (con ancla secundaria `#ueber-uns`) y la página About completa. Se conserva la ruta canónica existente `/about`; `/ueber-kraken`, sus variantes con barra final y `/about/` redirigen mediante 301, conservando la consulta de idioma. No se crea otra página duplicada.

## Procedencia y alcance

El paquete `kraken-codex-bundle-v1`, proyecto `kraken-services-transit`, se validó antes de escribir: 27 rutas relativas únicas, codificación, tamaño y SHA-256. La extracción se hizo en una carpeta nueva de trabajo y no ejecutó el JavaScript recuperado. Los 11 recursos necesarios se copian sin regenerar ni recomprimir a `public/about-approved/assets`; el logo original se reutiliza desde Home. El manifiesto `ABOUT_ASSETS.json` y la documentación original `ABOUT_CONTENT_ES.md` registran su procedencia. Los importadores, prompts y el paquete no se publican en el CDN.

About adapta la página a React: hero del álbum, cuatro etapas reales del fundador, cuatro valores, portada original, leyenda de Kai en el Rheinfall, evolución, cinco escenas de ayuda y regiones. La leyenda de marca se distingue de la historia real. La presentación de Antonio es tipográfica. No se añaden retratos, servicios corporativos, precios, acreditaciones o promesas de disponibilidad.

Se reutilizan el header, selector de idiomas, footer, launcher y asistente Kai de la aplicación. El enlace Sobre Kraken abre `/about` en el idioma actual. No se cargan los scripts globales del HTML autónomo ni se duplican sus diálogos o listeners. El visor de imágenes es un diálogo nativo independiente del asistente existente.

## Interacciones y accesibilidad

La misma función `AboutContent` genera React y HTML inicial en seis idiomas. Los siete capítulos son legibles antes de JavaScript. Después del montaje se mejoran las dos barras de pestañas con roles, foco, flechas, Home/End y espacio. Las pestañas cambian el capítulo en el mismo lugar y actualizan su fragmento mediante History API, sin desplazamiento automático ni entradas duplicadas al repetir la pestaña. Los enlaces normales a capítulos, la entrada directa con fragmento y la navegación del historial siguen revelando su destino. El visor conserva la imagen completa, título, leyenda, Escape, cierre desde el fondo y retorno del foco.

Las cinco selecciones de ayuda sincronizan imagen, texto y CTA. La decodificación controla carga, error y selecciones rápidas; una petición antigua no sustituye la actual y el desmontaje invalida trabajo pendiente. Las escenas se cargan de forma diferida y respetan el movimiento reducido. El launcher flotante existente se oculta mientras se usa el selector para no taparlo, y se restaura al salir. Las capas de logo conservan el viewBox 1672 × 941 y el recorte 0 280 1024 450, con las coordenadas proporcionadas para gorra, polo y caja.

Cada controlador elimina listeners, observadores y RAF al desmontarse. La selección del servicio y de los capítulos se conserva al cambiar de idioma. Los textos visibles, alternativos, ARIA y mensajes dinámicos se traducen al alemán, inglés, español, portugués, italiano y francés.

## Calculadora y datos

Los CTA reutilizan `openHomeCalculator` y `/quote`; el selector de escenas no envía solicitudes. Se conserva el contrato existente: end → end-of-tenancy, regular → daily-cleaning, deep → deep-cleaning y moving → moving. Ventanas usa la entrada manual existente, sin precio ni equivalencia con limpieza profunda. Los enlaces sin JavaScript siguen abriendo la calculadora general.

No se cambia el motor de precios, el backend, autenticación, pagos o borradores. El módulo About no escribe localStorage ni sessionStorage. El puente existente conserva la responsabilidad sobre la intención de servicio y la navegación. No se realizan reservas ni envíos de datos reales durante la verificación.

## Comparación de IVA

La ausencia de IVA de Kraken se mantiene como dato comercial indicado por el propietario, sin afirmar una consulta del registro fiscal. El bloque exige el mismo precio neto y alcance de servicio, muestra el proveedor sujeto al tipo general del 8,1 %, explica 8,1 ÷ 108,1 × 100 ≈ 7,49 % y redondea a aproximadamente 7,5 %. La nota obliga a comparar ofertas completas. Los tres desplegables son nativos y el texto sobre garantía/seguro conserva el alcance adjunto.

Tipo general consultado el 23 de noviembre de 2026 en [ESTV](https://www.estv.admin.ch/de/mwst-steuersaetze-schweiz) y explicación en el [portal oficial KMU](https://www.kmu.admin.ch/de/mwst-so-funktioniert-die-mehrwertsteuer). Esta revisión del tipo no certifica la situación fiscal de la empresa.

## Build y publicación

`render-about.mjs` produce seis fragmentos About y seis fragmentos Warum usando los componentes reales; se conservan los seis fragmentos de Servicios. Express incorpora el contenido y su CSS al HTML inicial. El marcador de final del root evita dejar contenido duplicado al sustituir el fallback anidado. El empaquetador verifica los hashes de los 18 fragmentos y de los recursos públicos registrados. Los imports y herramientas de entrega quedan fuera de los recursos comerciales.

Los resultados de pruebas, tamaños, capturas y despliegue se registran en la evidencia de entrega; este documento por sí solo no certifica la publicación ni dispositivos físicos.
