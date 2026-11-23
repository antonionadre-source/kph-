# Über Kraken: fuentes y criterios de contenido

Revisión: **23 de noviembre de 2026**. Ruta de la preview: **`/ueber-kraken`**. Archivo de contenido: `web/ueber-kraken.html`.

Esta página reúne la historia que Kraken ya publica, la explicación de Kai y el enfoque comercial aprobado por el propietario. Las fuentes antiguas contienen una oferta más amplia: sirven para recuperar la historia y los valores, no para modificar el alcance actual de cinco servicios para particulares.

## Fuentes públicas consultadas

Las dos páginas respondieron HTTP 200 durante la consulta:

- [Sobre Kraken](https://krakenpfm.ch/about), título «Über uns | Kraken Properties and Facilities Management».
- [Historia de Kraken](https://krakenpfm.ch/our-story), título «Unsere Geschichte | Kraken Properties and Facilities Management».

El contenido se carga mediante JavaScript. La lectura de HTML sin ejecutar la aplicación solo devuelve parte de la página. Los siguientes módulos se localizaron siguiendo las referencias del bundle público de la propia web, sin acceder a zonas privadas:

- [OurStoryPage-DN1zewe_.js](https://krakenpfm.ch/assets/OurStoryPage-DN1zewe_.js): cronología del fundador, creación de Kraken y versiones por idioma.
- [AboutPage-CoXtSAjp.js](https://krakenpfm.ch/assets/AboutPage-CoXtSAjp.js): estructura de About y recursos de marca.
- [data-app-resources-B2X9X7pt.js](https://krakenpfm.ch/assets/data-app-resources-B2X9X7pt.js): traducciones de About, valores y leyenda de Kai.

Estos nombres de archivo identifican la versión consultada; pueden cambiar en futuros despliegues. La evidencia es información publicada por la propia empresa, no una comprobación independiente de registros o acreditaciones.

## Hechos utilizables y su procedencia

| Contenido | Evidencia | Tratamiento en la nueva página |
| --- | --- | --- |
| Fundador: Antonio Nadre Gomes Mendes | Nombre completo en las versiones alemana, inglesa y española de OurStory. | Se conserva el nombre completo y el cargo de fundador. |
| Inicio como limpiador en Londres en 2015 | `timeline_p1_year` y `timeline_p1_desc` de OurStory. | Primera estación de la historia, sin añadir empleadores ni responsabilidades no descritas. |
| Evolución hacia gestión y trabajo comercial en Reino Unido | Las versiones de OurStory describen esa progresión; la española incluye gestión de edificios. | Se utiliza una formulación general sobre Gebäudemanagement y Vertrieb. |
| Experiencia en Zürich y Schaffhausen | Relato de la etapa suiza en OurStory. | Se mencionan las dos regiones, sin añadir clientes ni avales comerciales. |
| Fundación en enero de 2026 | Estación de creación de Kraken en OurStory. | Se conserva mes y año. |
| Origen en Schaffhausen | `about.hero.subtitle` sitúa allí la fundación. | Se combina con la fecha de OurStory; no se añaden otras oficinas. |
| Integridad, atención al cliente, calidad y responsabilidad ambiental | Claves `aboutPage.valueIntegrity*`, `valueClientCentric*`, `valueExcellence*` y `valueSustainability*`. | Se expresan como principios y prácticas deseadas, sin certificaciones ni resultados ambientales cuantificados. |
| Kai y su relación con el Rin/Rheinfall | `aboutPage.storyP1`–`storyP3` y mensajes `mascot.about.*`. | Se presenta explícitamente como leyenda o historia de marca. |

La idea de que la experiencia profesional influye en el servicio actual es una síntesis editorial. Conviene describir esa relación sin atribuir un lugar o momento exacto al nacimiento de una idea que la fuente no especifica.

## Alcance actual indicado por el propietario

La página debe mantener los cinco servicios: Fensterreinigung, Umzugsreinigung, Regelmässige Reinigung, Grundreinigung y Kleine Umzüge. El público son particulares y pequeños encargos, incluidas viviendas de 1 a 4 habitaciones, en Zürich, Schaffhausen y Winterthur.

El equipo experimentado, el trato personal y la atención a trabajos pequeños forman parte del brief actual. Los CTA comerciales conducen a la calculadora existente; los enlaces informativos pueden abrir Servicios o capítulos de la página. No se muestran precios, tarifas, intervalos ni selectores de presupuesto. El wording de ausencia de IVA procede del propietario y se conserva en el footer aprobado.

## Contradicciones y afirmaciones omitidas

- La versión española de OurStory sitúa Head of Sales en Manchester; otras versiones lo sitúan en el norte de Londres. Se omite la ciudad de ese puesto y se utiliza Reino Unido.
- La versión española habla de un edificio de aproximadamente 200 viviendas en Aldersgate; la home antigua indexada habla del complejo de oficinas 200 Aldersgate. Se omiten dirección, tipología y número de viviendas.
- No se trasladan los servicios extensivos de las páginas antiguas: facility management comercial, industria, jardinería, emergencias y otros servicios ajenos al alcance aprobado.
- No se reutilizan cifras de seguros, garantías, reseñas, plazos de respuesta, promesas 24/7, ni afirmaciones de certificación B-Corp o neutralidad climática. Algunas fuentes contienen diferencias o describen aspiraciones; esta página no las presenta como hechos acreditados.
- No se utiliza una supuesta etimología de «Kai»: no se encontró una explicación documentada del nombre.

## Kai: identidad, ficción y ayuda digital

Kai es el pulpo azul de la marca. La relación con el Rin y el Rheinfall pertenece a su relato ficticio. Expresiones como «Die Legende unserer Marke», «Markengeschichte» y «fantasievolle Figur» distinguen esa historia de la cronología real del fundador.

Los brazos representan ayuda, organización y atención a tareas diversas. Las labores contratadas las realiza el equipo humano. Kai no se presenta como un empleado real, un certificador ni una prueba de trabajos realizados.

En esta preview, el modal de Kai es una **ayuda para elegir entre los cinco servicios y continuar a la calculadora**. No se anuncia como IA conversacional universal, no promete resolver cualquier pregunta, no calcula tarifas propias y no confirma disponibilidad. El texto de la página y del modal debe respetar esas capacidades.

## Imagen original de Kai con el álbum

- Origen exacto: [kai about us.webp](https://krakenpfm.ch/kai%20about%20us.webp).
- Archivo del proyecto: `web/assets/kai-story.webp`.
- Tamaño: **231.798 bytes**.
- Dimensiones: **1254 × 1254 px**.
- Formato observado: WebP RGBA, con transparencia.
- SHA-256: `9c0acbf2e93af7ebd4b5bcc021a0e019944ea216a399315d72c0e4c50d3ddd2b`.

Se comprobó que el archivo del proyecto es idéntico byte por byte a la descarga del recurso público. No se generó un nuevo personaje ni un retrato del fundador. El álbum forma parte de la imagen de marca; sus miniaturas no se presentan como fotografías documentales del personal o de la trayectoria de Antonio.

Existe otra escena pública con Kai y personas frente a un paisaje urbano, pero no acredita identidades reales. No se utiliza como retrato del fundador ni como fotografía verificada del equipo.

## Revisión del alemán

Las fechas 2015 y enero de 2026, el nombre del fundador y la explicación de Kai coinciden con las fuentes seleccionadas. El texto usa tratamiento formal, vocabulario comprensible y ortografía suiza con `ss`.

La redacción de valores evita superlativos sin prueba. La presentación del personaje separa adecuadamente la leyenda de marca, el trabajo del equipo y la función de selección del modal. Las dos etapas británicas y la etapa suiza se resumen sin repetir los detalles contradictorios de las fuentes antiguas.

## Actualización visual del cómic y nueva sección de confianza

Actualización solicitada el 23 de noviembre de 2026. Se sustituye el retrato aislado de Kai en el apartado «Das freundliche Gesicht von Kraken» por la portada del cómic, con imágenes relacionadas en sus pestañas. El álbum del hero permanece como parte de la presentación de la empresa.

| Recurso | Procedencia | Tratamiento |
| --- | --- | --- |
| `web/assets/kai-comic-cover.webp` | `comic-promotion.webp`, adjunto por el propietario, 1055 × 1491 px. | Copia del original, sin redibujar logo ni título. Se muestra completo y puede ampliarse. |
| `web/assets/kai-evolution.webp` | https://krakenpfm.ch/evolucion-mascota-kraken.webp, 1672 × 941 px. | Recurso original de la web, copiado sin cambios de contenido. |
| `web/assets/kai-rheinfall-awakening.webp` | Nueva escena generada para esta actualización, 1672 × 941 px. | Inspirada en la portada y en Kai bebé. No se presenta como una página real recuperada del cómic. Prompt y modo en `KAI_COMIC_IMAGE_PROMPT.txt`. |

Se revisaron las rutas públicas https://krakenpfm.ch/comic y https://krakenpfm.ch/comic-shop, los módulos `ComicPage-N2dSP9Uf.js`, `ComicShopPage-BJ4lHC1b.js` y las claves `comic.backCover.p1`–`p4` de las traducciones. No se localizaron páginas interiores ni un lector o PDF público. El texto de contraportada relata que un deseo por los padres de Thiago hace despertar algo pequeño al pie del Rheinfall. La página resume ese argumento como leyenda de marca, sin añadir hechos a la biografía real del fundador.

El visor de imágenes informa de que la escena del despertar es nueva. Enlaces reales a los archivos funcionan también sin JavaScript. Con JavaScript se abre un diálogo accesible que permite ver cada imagen completa, cerrar con Escape y regresar al control de origen.

### Home: «Warum Kraken?»

La sección `#warum-kraken` reemplaza el resumen anterior de la empresa; conserva `#ueber-uns` como ancla secundaria y presenta el proceso de forma compacta. Se implementa en `web/index.html` y `web/why.css`. La revisión del 23 de noviembre de 2026 utiliza una composición sin fotografía del fundador: tipografía, nombre y función de Antonio, tres razones breves y un CTA temprano hacia la calculadora. No incluye rostro generado, avatar de iniciales ni hueco para una foto. El seguro y el alcance de la garantía se explican en un detalle accesible.

El propietario aporta en esta actualización los mensajes de ausencia de IVA, precios transparentes, trato personal, garantía para la limpieza de entrega y seguro de responsabilidad civil. El texto mantiene esas afirmaciones sin inventar cuantías, cobertura universal, horarios de atención ni condiciones de garantía. La garantía se refiere a los trabajos de limpieza acordados y no garantiza resolver cualquier problema del inmueble.

La ampliación posterior del mismo día da protagonismo al IVA mediante una comparación con un proveedor sujeto al tipo general del 8,1 %, siempre a igualdad de precio anterior al impuesto y de alcance. El ahorro relativo al total con IVA es aproximadamente del 7,5 % bajo esa condición. No se promete un precio inferior al de todas las empresas. Los fundamentos y las fuentes oficiales constan en `docs/VAT_COMPARISON_ES.md`.

El mensaje fiscal elegido es «Keine MwSt. auf Ihrer Rechnung». No promete un ahorro comparativo fijo del 8,1 %: las bases y precios de otras empresas pueden diferir. Se consultaron las fuentes oficiales https://www.estv.admin.ch/de/mwst-steuersaetze-schweiz y https://www.estv.admin.ch/de/mehrwertsteuer; no se ha realizado una auditoría registral de Kraken. La revisión no cambia el enfoque de cinco servicios ni añade precios fuera de la calculadora.

## Kai como guía personal: «Seine Hilfe»

El propietario aprobó la opción de una escena interactiva por servicio con una presentación sobria el 23 de noviembre de 2026. La pestaña sustituye los tres iconos decorativos por cinco escenas nuevas generadas con la herramienta integrada de imágenes. Se usa el Kai adulto original `web/assets/kai.webp` como referencia de identidad y la primera escena como referencia de composición para las cuatro variantes.

Los archivos son `kai-help-windows.webp`, `kai-help-end.webp`, `kai-help-regular.webp`, `kai-help-deep.webp` y `kai-help-moving.webp`, todos de 1672 × 941 px en `web/assets/`. Los cinco prompts finales, modo y referencias se conservan en `KAI_HELP_IMAGE_PROMPTS.txt`. Son imágenes de marca, no fotografías de empleados ni pruebas de trabajos reales. El calendario representa una rutina, no disponibilidad de reservas.

La página aplica por separado el logo original en gorra, polo y caja mediante capas SVG. Mantener sus coordenadas y el encuadre completo al integrar. Solo se muestra una escena; cada elección cambia su imagen, título, explicación y botón comercial. El movimiento se limita a una transición breve que respeta la preferencia de reducir animaciones. Las opciones tienen texto legible, selección mediante color y tick, soporte de teclado y enlace útil sin JavaScript. Los recursos se cargan al entrar en el módulo y las selecciones rápidas no deben mostrar un estado anterior.

Los botones emplean el puente existente `kraken:opencalculator` con la clave de servicio. La preview de otro origen abre la calculadora de producción, pero no puede prefijar su almacenamiento. El mapeo confirmado de ventanas continúa pendiente; no se lo sustituye por limpieza profunda ni se añaden parámetros sin soporte. La integración final en el mismo origen debe conservar idioma y borrador, conforme a la documentación de calculadora existente.
