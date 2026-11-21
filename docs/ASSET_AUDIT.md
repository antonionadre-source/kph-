# Estado de los recursos visuales — 21 de noviembre de 2026

La carpeta pública actual contiene **285 imágenes decodificables, cero imágenes dañadas y cero referencias locales faltantes**. Se retiraron las dos referencias inactivas al logo histórico y al banner de proveedor que no estaban disponibles. No se incorporaron sustitutos falsos de esas marcas o del banner.

Se comprobó el grafo de imports desde `index.tsx` (73 módulos en esa comprobación): **cero referencias activas a los 41 archivos dañados** que quedaban antes de esta continuación. Los 143 derivados nuevos, los originales públicos válidos, los cuatro derivados recuperados de About y las cuatro variantes de encuadre de marca se verificaron con decodificación completa. Esto es una comprobación estática y de archivos; la revisión final de páginas y errores JavaScript en navegador se informa separadamente.

## Qué cambió en la aplicación

- Los seis héroes comerciales utilizan derivados ligeros y las seis tarjetas sus variantes 768. Los originales válidos conservan bytes y nombres.
- Los siete enlaces Dropbox duplicados de ServicesPage se cambiaron por sus originales locales verificados. Las tarjetas incluyen dimensiones y decodificación asíncrona.
- Los cuatro servicios adicionales usan ilustraciones nuevas de Kai, documentadas como generación nueva, no como recuperación histórica. Thurgau usa una ilustración nueva de manzanos y Lago de Constanza.
- Las páginas de servicio/ciudad utilizan la imagen genérica verificada del servicio; si no existe en el catálogo, utilizan una imagen regional válida. Se retiraron las 13 referencias a imágenes específicas de Schaffhausen que no se podían decodificar. No se afirma haber recuperado esas 13 imágenes originales.
- El carrusel omite los dos registros cuyos logos correctos no estaban disponibles (Government of Senegal y One One Six). No se muestran los logos incorrectos de las URLs antiguas.
- El comparador ANTES conserva `oven-before.webp`, válido y del mismo horno; su reintento utiliza esa misma imagen. La celebración de pago utiliza un derivado válido del Kai existente; su autorización de cobro corresponde a la lógica del servidor.
- Dos fotos/ilustraciones actuales de About se recuperaron de sus URLs Dropbox y se sirven localmente. Se comprobó que los PNG históricos del mismo nombre tenían otro contenido y no se utilizaron como sustitución.

## Archivo seguro de los 41 recursos dañados

Se movieron **41 archivos, 48.457.727 bytes**, desde `public/` a `assets-source/legacy-corrupt/public/`, preservando exactamente sus bytes y SHA256. No se borraron, re-encodificaron ni convirtieron en píxeles transparentes. La relación completa, razones de fallo y referencias anteriores está en `ASSET_LEGACY_ARCHIVE.json`. Las rutas antiguas ya no se sirven como imágenes, y ningún consumidor activo apunta a ellas.

Los 22 originales históricos previamente señalados continúan documentados como pendientes en `ASSET_PENDING_ORIGINALS.json`, junto a la estrategia actual de cada pantalla: original válido, ilustración nueva, imagen genérica/regional o registro de logo omitido. Una interfaz sin imágenes rotas no equivale a haber recuperado esos 22 originales. Si se desea restituir el contenido histórico exacto, hacen falta los archivos de esa lista.

## Procedencia y medios nuevos

La preparación anterior recuperó 74 recursos del historial Git, originales locales y fuentes externas, conservando las 60 imágenes que ya eran válidas. Esa recuperación sigue documentada en `asset-recovery.json`. Esta continuación añade 20 escenas nuevas autorizadas (15 calendario y 5 servicios/Thurgau), además de optimizar 31 originales válidos y recuperar dos originales externos actuales de About.

La generación utiliza la herramienta integrada `image_gen` con referencias del Kai existente. Prompts, fuentes, variantes, dimensiones, hashes y restricciones están en `KAI_MEDIA.md` y sus catálogos JSON. Las escenas no acreditan trabajos o propiedades reales ni incorporan logos comerciales nuevos.

## Repetir la auditoría

`scripts/audit-assets.py` es de sólo lectura, salvo que se especifique un informe con `--output`. Requiere Python 3 y Pillow. Omite builds, cachés, pruebas, fuentes archivadas y rutas plantilla sin resolver; incluye los iconos de `site.webmanifest`. Carga todos los píxeles y verifica integridad, en lugar de confiar en firmas mágicas o HTTP 200.

```sh
python scripts/audit-assets.py --output docs/asset-inventory.json
```

La sección `sourceAssets` diferencia las imágenes antiguas bajo `src/assets/images`; las seis dañadas allí no tienen importadores activos y permanecen conservadas. No ejecutar `scripts/fix-corrupt-images.ts` ni usar `audit:images -- --prune` como procedimiento de recuperación.
