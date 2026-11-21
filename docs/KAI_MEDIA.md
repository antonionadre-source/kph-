# Medios de Kai — producción del 21 de noviembre de 2026

Se utilizó la habilidad `imagegen` y la herramienta integrada `image_gen`, sin Fal, CLI de generación, claves API ni modelos alternativos. El usuario autorizó crear muchas imágenes y usar las existentes del sitio como referencia de Kai.

## Identidad y procedencia

Referencias inspeccionadas antes de generar: `public/mascota-kraken-homepage.webp`, `public/imagen-google-ai-compatible-desktop.webp` y `public/kai services.webp`. Las nuevas escenas mantienen la cara azul, ojos grandes, tentáculos con ventosas, gorra y uniforme azul marino. Los uniformes nuevos no incorporan textos ni logos inventados. La bandera suiza de la escena nacional es un símbolo del contexto, no una certificación o marca comercial.

Hay **20 escenas nuevas distintas**: 15 de calendario y cinco de servicios/Thurgau. Cada escena se generó con una llamada independiente; una revisión específica eliminó espuma sobre madera de la escena spring-cleaning y la cambió por suelo de piedra seco. Sólo la variante final seleccionada está en el proyecto. Los escenarios son ilustraciones de marca, no fotografías documentales ni pruebas de trabajos, inmuebles o clientes reales.

Los prompts completos y rutas de salida de la herramienta están en `KAI_MEDIA_GENERATION.json` y `KAI_MEDIA_SERVICES_GENERATION.json`. Las fuentes PNG seleccionadas se conservan en `assets-source/kai-calendar/` y `assets-source/kai-services/`. Suman **54.817.519 bytes** y se mantienen fuera de `public`, por lo que el navegador utiliza únicamente los derivados.

## Catálogo y contrato de archivos

| ID | Escena | Carpeta pública |
| --- | --- | --- |
| `spring` | Primavera: limpieza de cristales y flores | `public/kai-calendar/spring/` |
| `summer` | Verano: terraza y jardineras junto al Rin | `public/kai-calendar/summer/` |
| `autumn` | Otoño: cuidado de hojas y accesos | `public/kai-calendar/autumn/` |
| `winter` | Invierno: retirada de nieve del acceso | `public/kai-calendar/winter/` |
| `new-year` | Año Nuevo: bienvenida y comienzo renovado | `public/kai-calendar/new-year/` |
| `carnival` | Fasnacht: cuidado del espacio público | `public/kai-calendar/carnival/` |
| `easter` | Pascua: flores y detalles estacionales | `public/kai-calendar/easter/` |
| `sechselaeuten` | Sechseläuten: escena ilustrada de primavera en Zürich | `public/kai-calendar/sechselaeuten/` |
| `swiss-national-day` | Fiesta nacional suiza: terraza con banderas | `public/kai-calendar/swiss-national-day/` |
| `back-to-school` | Vuelta al colegio: entrada preparada | `public/kai-calendar/back-to-school/` |
| `harvest` | Vendimia: viñedo y cuidado exterior | `public/kai-calendar/harvest/` |
| `samichlaus` | Samichlaus: mandarinas, nueces y pan tradicional | `public/kai-calendar/samichlaus/` |
| `christmas` | Navidad: vestíbulo con árbol y regalos | `public/kai-calendar/christmas/` |
| `new-years-eve` | Fin de año: terraza de Zürich de noche | `public/kai-calendar/new-years-eve/` |
| `spring-cleaning` | Limpieza de primavera en interior | `public/kai-calendar/spring-cleaning/` |

Cada carpeta del calendario contiene `hero-1440.webp` (1440×960), `hero-768.webp` (768×512), `mobile-768.webp` (768×576) y `avatar-320.webp` (320×320). Los recortes se revisaron visualmente: rostro, gorra y acción de Kai permanecen dentro de la composición. Los 60 archivos suman **6.265.466 bytes**; máximos: hero 280.786 B, hero pequeño 110.904 B, móvil 118.718 B y avatar 29.368 B. Dimensiones, bytes, foco y SHA256 están en `KAI_MEDIA_CATALOG.json`.

Las cinco ilustraciones adicionales están en `public/kai-services/{windows,upholstery,moving,floor-care,thurgau}.webp` (768×512), con variantes `-1440.webp` y `-480.webp`. Son 15 archivos, **1.469.642 bytes**, documentados en `KAI_MEDIA_SERVICES.json`. Los cuatro servicios sustituyen visualmente recursos que no se pudieron recuperar, dejando los originales históricos pendientes y sus bytes archivados. Thurgau es una escena ilustrada nueva, identificada como tal.

## Derivados de originales válidos

`KAI_MEDIA_OPTIMIZED.json` documenta **31 originales válidos**: seis comerciales y 25 imágenes existentes de Kai. Sus 68 derivados suman **2.011.012 bytes**. Los originales no se sobrescribieron ni renombraron, y sus hashes se comprobaron después de optimizar.

Los seis originales comerciales suman 12.711.479 B. Sus variantes principales suman 756.834 B y las tarjetas de 768 suman 348.446 B (reducciones de aproximadamente 94% y 97% respecto a ese conjunto de originales). Las variantes conservan el contenido y proporción del original; `1440` es un ancho máximo y los originales más pequeños no se amplían. Los tamaños reales están en el catálogo y en los atributos HTML de los consumidores.

Rutas: `public/kai-calendar/optimized/commercial/{id}/{1440,768,480}.webp` y `public/kai-calendar/optimized/kai/{slug}-{160,320}.webp`. Los PNG de héroes comerciales y las tarjetas comerciales utilizan estos archivos ligeros. Los siete servicios privados de ServicesPage utilizan ya las copias locales originales verificadas de Dropbox.

## Recuperación externa de About

Se guardaron también los **dos originales que AboutPage utilizaba actualmente desde Dropbox** y se produjeron cuatro derivados locales. Se comprobó que NO coincidían con los PNG históricos del mismo nombre: no se sustituyó el contenido por esos PNG diferentes. Los recursos actuales muestran el equipo/Kai correctos; se conservan exactamente las fuentes obtenidas y su procedencia en `KAI_MEDIA_RECOVERED_EXTERNAL.json` y `assets-source/recovered-dropbox/about/`.

## Reconstrucción y verificación

El script `scripts/media/build-kai-assets.py` requiere Python 3 y Pillow. Utiliza las fuentes ya guardadas en el proyecto; no vuelve a llamar al proveedor ni a descargar imágenes. No repara imágenes corruptas ni escribe sobre originales. Si aún existe la salida de la herramienta, comprueba que coincide con la fuente seleccionada.

```sh
python scripts/media/build-kai-assets.py
python scripts/media/build-kai-assets.py --calendar-only
python scripts/media/build-kai-assets.py --services-only
python scripts/media/build-kai-assets.py --existing-only
```

Todas las variantes se decodificaron completas, verificando dimensiones y SHA256. La colección nueva y los derivados de 31 originales suman143 WebP y 9.746.120 B antes de los cuatro archivos recuperados de About. No se ha certificado rendimiento de red real con estas cifras: son pesos de archivos. El selector de fechas, la lógica de publicación y las pruebas del navegador se mantienen en el código de la aplicación, separados de la generación de medios.

## Ajuste de encuadre de los logos existentes

No se generó ni redibujó ningún logo. `scripts/media/trim-existing-brand.py` recorta exclusivamente el margen con alfa completamente transparente de los originales de 1024×1024: azul con caja [4,283,1020,719] y blanco [10,285,1017,718]. Los archivos trim conservan exactamente todos los píxeles RGBA del recorte; los originales permanecen intactos.

Para renderizar header/footer se añadieron variantes 480×206 con alfa, WebP quality 90: `public/kai-calendar/optimized/brand/logo-blue-480.webp` (18.916 B) y `logo-white-480.webp` (24.062 B). El recorte fuente lossless queda guardado por separado. Las dimensiones, hashes, cajas de recorte y la comprobación de igualdad de píxeles están en `KAI_MEDIA_BRAND.json`.

```sh
python scripts/media/trim-existing-brand.py
```
