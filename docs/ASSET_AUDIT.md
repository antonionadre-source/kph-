# Auditoría y recuperación de imágenes — 20/11/2026

Se ha contrastado el commit de origen `fd8cc1ee9c9947cb7e2c718bc433a896c3da244a` con el historial Git completo, el sitio publicado y copias originales locales. No se ha ejecutado `scripts/fix-corrupt-images.ts`, borrado recursos, ocultado faltantes ni creado imágenes nuevas.

## Resultado comprobado

| Inventario (rutas únicas) | Antes | Después |
| --- | ---: | ---: |
| Imágenes válidas (decodificación completa y verificación estructural) | 60 | 134 |
| Archivos dañados o vacíos | 98 | 41 |
| Rutas locales referenciadas sin archivo | 22 | 5 |
| Dañadas con alguna referencia de fuente/manifest | 51 | 19 |

Se han recuperado **74 archivos**: 19 originales del commit histórico `ce926cbe52ab2f3e147b851947c86f8a40d119ce`, 11 logos desde las URLs originales de la copia antigua, 15 iconos desde el pack local original, 7 WebP privados desde sus URLs Dropbox explícitas y 22 conversiones PNG/WebP sin pérdida adicional a partir de los píxeles originales recuperados. Ocho de estas conversiones recuperan los cinco paneles de OurStoryPage y tres variantes WebP de aboutOriginImages, usando los JPEG históricos de `src/assets/images` (bienvenida_familia, viaje_maletas, retrato_uniforme, reunion_consultoria y reunion_kraken). Se comprobaron los nombres semánticos y el contenido visual: bienvenida de familia, equipo en Zürich Airport con maletas, retrato del equipo y reuniones de trabajo. Se conservaron byte por byte las 60 imágenes que ya eran válidas, incluidas las dos imágenes principales del hero.

Las 7 URLs Dropbox se han cambiado por las rutas locales de esos mismos originales en `assets.ts`, para que las tarjetas funcionen sin depender de Dropbox. No se cambió su contenido visual.

La fuente y SHA256 de cada archivo restaurado, sus dimensiones y las conversiones están en [asset-recovery.json](asset-recovery.json). El inventario completo con rutas, usos, tamaños y errores de decodificación está en [asset-inventory.json](asset-inventory.json). Su apartado `sourceAssets` también inspecciona los archivos de `src/assets/images`, separados de los recuentos públicos de la tabla. No se sobrescribieron esos archivos fuente: los originales históricos se utilizaron para generar los recursos públicos que consume la aplicación.

Los iconos proceden del pack `kraken-favicon-pack` de agosto conservado localmente: se verificó la coincidencia de todos los bytes supervivientes al normalizar las secuencias U+FFFD de la corrupción UTF-8. El pack OG local se investigó pero no coincidía; no se utilizó para sustituir imágenes. El sitio publicado devuelve archivos corruptos o 404 para los recursos pendientes; recibir HTTP 200 e `image/webp` no prueba que una imagen se pueda decodificar.

## Pendientes que afectan a componentes alcanzables

Hay **22 rutas pendientes utilizadas por componentes alcanzables**, incluyendo dos usos condicionales (el fallback ANTES y la celebración tras pago). El fondo de Thurgau se selecciona dinámicamente por `cityImages[mun.region]`. Este recuento procede de revisar consumidores y rutas, no de contar toda declaración de `assets.ts` como una pantalla activa. No implica que se hayan abierto todas las combinaciones de servicio/ciudad en navegador.

| Ruta bajo `public/` | Estado | Dónde se utiliza | Original que hace falta |
| --- | --- | --- | --- |
| `Asset-47-jpg.webp` | Ausente | Activa: Clients, carrusel de clientes; `assets.ts:99` | Logo original de One One Six. La URL antigua entrega AMBASSADOR y se ha rechazado. |
| `ChatGPT Image Jul 11, 2026, 03_32_16 AM.png` | Ausente | Activa: fondo de MunicipalityPage para municipios de Thurgau (cityImages.thurgau); `assets.ts:47` | PNG original del fondo de Thurgau, no otra imagen de ciudad. |
| `ChatGPT Image Jul 18, 2026, 07_40_06 PM.png` | Dañada | Activa: PaymentCelebrationPage, pantalla tras pago; `components/PaymentCelebrationPage.tsx:313` | PNG original del 18 de julio a las 19:40:06; no se ha generado un pago para abrirla. |
| `Logo.jpg` | Ausente | Activa: Clients, carrusel de clientes; `assets.ts:95` | Logo original de Government of Senegal. La URL antigua entrega FARFETCH y se ha rechazado. |
| `antes-limpieza-experiencia.webp` | Ausente | Activa condicional: fallback del comparador de SegmentationSection; `components/SegmentationSection.tsx:1998` | Original de la foto ANTES de limpiar el horno; oven-before.webp principal sí es válido. |
| `car-detailing-schaffhausen.webp` | Dañada | Activa: SeoServiceCityPage, servicios × Schaffhausen; `assets.ts:54` | Original WebP/PNG del servicio y ciudad indicados en el nombre; no usar otra ciudad. |
| `common-area-cleaning-schaffhausen.webp` | Dañada | Activa: SeoServiceCityPage, servicios × Schaffhausen; `assets.ts:55` | Original WebP/PNG del servicio y ciudad indicados en el nombre; no usar otra ciudad. |
| `daily-recurring-cleaning-schaffhausen.webp` | Dañada | Activa: SeoServiceCityPage, servicios × Schaffhausen; `assets.ts:56` | Original WebP/PNG del servicio y ciudad indicados en el nombre; no usar otra ciudad. |
| `deep-cleaning-schaffhausen.webp` | Dañada | Activa: SeoServiceCityPage, servicios × Schaffhausen; `assets.ts:57` | Original WebP/PNG del servicio y ciudad indicados en el nombre; no usar otra ciudad. |
| `exterior-cleaning-schaffhausen.webp` | Dañada | Activa: SeoServiceCityPage, servicios × Schaffhausen; `assets.ts:58` | Original WebP/PNG del servicio y ciudad indicados en el nombre; no usar otra ciudad. |
| `furniture-moving-schaffhausen.webp` | Dañada | Activa: SeoServiceCityPage, servicios × Schaffhausen; `assets.ts:59` | Original WebP/PNG del servicio y ciudad indicados en el nombre; no usar otra ciudad. |
| `gardening-schaffhausen.webp` | Dañada | Activa: SeoServiceCityPage, servicios × Schaffhausen; `assets.ts:60` | Original WebP/PNG del servicio y ciudad indicados en el nombre; no usar otra ciudad. |
| `gutter-cleaning-schaffhausen.webp` | Dañada | Activa: SeoServiceCityPage, servicios × Schaffhausen; `assets.ts:61` | Original WebP/PNG del servicio y ciudad indicados en el nombre; no usar otra ciudad. |
| `industrial-maintenance-schaffhausen.webp` | Dañada | Activa: SeoServiceCityPage, servicios × Schaffhausen; `assets.ts:62` | Original WebP/PNG del servicio y ciudad indicados en el nombre; no usar otra ciudad. |
| `office-cleaning-schaffhausen.webp` | Dañada | Activa: SeoServiceCityPage, servicios × Schaffhausen; `assets.ts:63` | Original WebP/PNG del servicio y ciudad indicados en el nombre; no usar otra ciudad. |
| `pest-control-schaffhausen.webp` | Dañada | Activa: SeoServiceCityPage, servicios × Schaffhausen; `assets.ts:64` | Original WebP/PNG del servicio y ciudad indicados en el nombre; no usar otra ciudad. |
| `retail-cleaning-schaffhausen.webp` | Dañada | Activa: SeoServiceCityPage, servicios × Schaffhausen; `assets.ts:65` | Original WebP/PNG del servicio y ciudad indicados en el nombre; no usar otra ciudad. |
| `servicio-privado-limpieza-tapiceria-1.webp` | Dañada | Activa: tarjetas de services en ServicesPage/SeoServiceCityPage; `assets.ts:219` | Original de servicio-privado-limpieza-tapiceria-1.webp, con el servicio correcto. |
| `servicio-privado-limpieza-ventanas-1.webp` | Dañada | Activa: tarjetas de services en ServicesPage/SeoServiceCityPage; `assets.ts:227` | Original de servicio-privado-limpieza-ventanas-1.webp, con el servicio correcto. |
| `servicio-privado-mudanza-cajas-1.webp` | Dañada | Activa: tarjetas de services en ServicesPage/SeoServiceCityPage; `assets.ts:235` | Original de servicio-privado-mudanza-cajas-1.webp, con el servicio correcto. |
| `servicio-privado-pulido-suelos-1.webp` | Dañada | Activa: tarjetas de services en ServicesPage/SeoServiceCityPage; `assets.ts:243` | Original de servicio-privado-pulido-suelos-1.webp, con el servicio correcto. |
| `waste-management-schaffhausen.webp` | Dañada | Activa: SeoServiceCityPage, servicios × Schaffhausen; `assets.ts:66` | Original WebP/PNG del servicio y ciudad indicados en el nombre; no usar otra ciudad. |

## Referencias conservadas sin uso efectivo actual

Estas dos rutas siguen en el código, pero no se han contado como una página activa. `TrustIcons` y `WhyKrakenSection` no tienen importadores. `sustainabilityPartnerLogos` no tiene consumidor actual. Los paneles PNG de la cronología y las tres variantes WebP de `aboutOriginImages` se han recuperado del historial.

| Ruta bajo `public/` | Dónde aparece | Original que hace falta |
| --- | --- | --- |
| `images-3.png` | Catálogo sustainabilityPartnerLogos; sin consumidor actual; `assets.ts:110` | Logo original de Climeworks. La URL antigua entrega Steinfels Swiss y se ha rechazado. |
| `payrexx-checkout-banner.png` | TrustIcons y WhyKrakenSection, componentes sin importador actual; `components/TrustIcons.tsx:8` | Banner original de medios de pago Payrexx. |

Las URLs históricas de `Logo.jpg`, `Asset-47-jpg.webp` e `images-3.png` se rechazaron tras inspección visual porque devolvían otras marcas. Tener el mismo nombre de archivo no bastó para recuperarlas. Las respuestas y hashes rechazados figuran en el manifiesto de recuperación.

## Archivos dañados sin referencia detectada

No se borraron ni sustituyeron estos 22 archivos. No afectan a los consumidores estáticos detectados. Para recuperarlos hacen falta los originales con el mismo nombre; los nombres genéricos requieren confirmar visualmente el contenido. Las búsquedas estáticas no garantizan detectar rutas construidas arbitrariamente en tiempo de ejecución.

| Ruta bajo `public/` | Uso detectado | Original necesario |
| --- | --- | --- |
| `ChatGPT Image Aug 12, 2026, 09_30_31 AM.png` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `ChatGPT Image Aug 12, 2026, 09_33_16 AM copy.png` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `ChatGPT Image Jul 1, 2026, 10_36_53 AM.png` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `ChatGPT%20Image%20Aug%2020,%202026,%2006_37_46%20PM.png` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `chatgpt-image-aug12-093031.png` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `chatgpt-image-aug12-093316.png` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `chatgpt-image-aug12.png` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `chatgpt-image-aug20.png` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `chatgpt-image-jun-13-1.png` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `chatgpt-image-jun-13-2.png` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `favicon.png` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `kai winterthur_opt.webp` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `kai-1.webp` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `kai-2.webp` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `kai-3.webp` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `kraken-og-1200x630.png` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `kraken-original-1731x909.png` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `payrexx-checkout-banner.webp` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `sobre-nosotros-reunion-consultoria-propiedad.webp` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `sobre-nosotros-reunion-equipo-kraken.webp` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `test_fixed.png` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |
| `test_fixed.webp` | Sin referencia de fuente/manifest | Archivo original válido del mismo nombre y contenido. |

## Repetir la auditoría sin modificar recursos

Se añadió un script independiente de sólo lectura; no se cambió el comando antiguo `audit:images` (su `--prune` puede borrar archivos). Se requiere Python 3 y Pillow. No usar el script antiguo como prueba de decodificación: comprobar firmas no basta.

```sh
python3 -m venv .venv-assets
.venv-assets/bin/pip install Pillow
.venv-assets/bin/python scripts/audit-assets.py --output docs/asset-inventory.json
```

El script analiza los recursos locales, incluidos los iconos del `site.webmanifest`, carga todos los píxeles y verifica estructura/CRC cuando corresponde. Sólo escribe el informe si se pasa `--output`; nunca escribe, elimina ni reemplaza imágenes. Su salida es un inventario de incidencias, por lo que su ejecución correcta no significa que todas las imágenes sean válidas.

Para completar la recuperación, aportar primero los 13 originales servicio × Schaffhausen y los 4 originales privados adicionales. Los cinco paneles de la cronología ya se han recuperado. Después incorporar los logos correctos, la imagen de Thurgau y la celebración de pago. Los recursos condicionales y los no utilizados permanecen documentados, sin reemplazos silenciosos.
