# Ford Transit Custom 250 L1H1

Configuración comunicada por el propietario el 23 de noviembre de 2026: primera
generación, batalla corta y techo normal. No se deduce la altura de techo sólo
del número de homologación, que contempla distintas variantes.

## Medidas nominales

| Dato | Valor |
| --- | --- |
| Longitud útil hasta la mampara | 255,5 cm |
| Ancho interior máximo | 177,5 cm |
| Ancho entre pasos de rueda | 139 cm |
| Altura interior | 140,6 cm |
| Puerta trasera: ancho × alto | Aprox. 140 × 134 cm |
| Volumen de carga | Aprox. 6 m³ |

Fuentes: [documentación oficial Ford de 2012, página 46](https://www.fordpresse.be/content/old/2012_pdf_2012_ford_transit_custom_nl.pdf#page=46)
y [folleto original Ford MY2013.5, páginas impresas 38–39, PDF 21](https://www.smov.co.uk/pdf/Ford%20Transit%20Custom.pdf#page=21),
redactado por Ford y alojado en un tercero. El segundo da 5,95 m³ SAE / 5,36 m³
VDA; por eso la web indica aproximadamente 6 m³. No se utiliza la extensión
bajo el asiento delantero, que no ha sido confirmada.

La carga útil en kg sigue sin especificarse. La serie «250» y los 150 kg de
carga de techo no son un valor de carga útil del compartimento. No se publican
promesas de peso, viajes o capacidad para una vivienda completa.

## Visualización y comprobador

`src/vehicle.ts` es la única fuente de las dimensiones para la interfaz, la
geometría y el conocimiento aprobado de Kai. La vista anterior de una furgoneta
grande se sustituye por un esquema de la Custom corta y un espacio de carga
construido con SVG. Los originales de imagen permanecen intactos.

El ejemplo acumulativo contiene ocho cajas de 60 × 40 × 40 cm, dos sillas de
45 × 45 × 90 cm y un panel de 200 × 60 × 8 cm. Las posiciones no se intersectan
y respetan la envolvente central de 139 cm. Es un ejemplo geométrico, no una
instrucción de apilado ni la capacidad máxima: peso, resistencia y sujeción
requieren confirmación personal. La barra indica pasos del ejemplo, no volumen
ocupado.

El comprobador local revisa seis orientaciones rectas de una pieza rígida y
reserva 2 cm por cada lado. Usa la anchura central y la puerta trasera, de modo
que sus límites conservadores son 251,5 × 135 × 130 cm. Un resultado positivo
sólo identifica una orientación geométrica; no confirma transporte. Si ninguna
posición recta pasa, solicita revisión o desmontaje, sin afirmar que la carga
sea imposible en diagonal. No calcula precios ni registra o envía datos.

Las vistas de la furgoneta cambian manualmente por defecto, para permitir leer
las medidas y rellenar el comprobador. La reproducción se puede activar con su
botón; el foco y la interacción la pausan. Este ajuste no afecta al movimiento
automático de Kai en la casa. Las medidas y el comprobador permanecen visibles
debajo de las dos vistas y se traducen a los seis idiomas.

Las preguntas sobre medidas de la furgoneta usan una respuesta aprobada del
servidor, incluso si hay un proveedor de IA. Las consultas de precio conservan
su derivación al calculador. Kai no infiere carga útil ni garantiza que una
pieza o una vivienda completa se transporte en un solo viaje.
