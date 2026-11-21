# Renovar Kraken PFM: limpieza y mudanzas, portal y reservas seguras

La web mezclaba presentaciones extensas, formularios poco legibles y un área de
clientes con errores de identidad, permisos y persistencia. Esta entrega convierte
la portada en una entrada directa a limpieza y mudanzas, unifica el diseño en
seis idiomas y conserva la arquitectura React/Vite/Express y las rutas existentes.

La Ford Transit tiene una recreación SVG con tres inventarios seleccionables:
mueble suelto, habitación y estudio. Cambian los objetos y la lista; el botón de
mudanza abre el configurador correcto y Contacto conserva el inventario elegido.
Se comparan L3H2 y L3H3: el techo y los rangos de dimensiones/volumen máximo
cambian con la variante. La fuente es la ficha Ford de 2017, identificada como
referencia de gama; no se presenta como medición del vehículo concreto ni se
promete transportar un estudio en un solo viaje.

El catálogo reúne 23 servicios con búsqueda, categoría y localidad. Registro,
acceso, dashboard, detalles, presupuestos, contacto, empleo, blog, páginas legales,
reseñas y tienda comparten tipografía, contraste, espaciado y controles. El portal
usa tarjetas en móvil y tabla en escritorio; los errores de acción son visibles.
Los diálogos gestionan altura, scroll, foco, teclado y visores anidados. Se retiran
estrellas, garantías de depósito, disponibilidad en tiempo real y otros reclamos
sin respaldo. Kai mantiene el chat y su calendario Europe/Zurich.

La entrega incluye 20 escenas Kai y sus derivados, archivo íntegro de imágenes
históricas dañadas y diez nuevos WebP del catálogo privado: 61,1 % menos peso que
sus fuentes. El JS inicial de entrada/modulepreloads ronda 752 kB (209 kB gzip),
frente a 2,57 MB (731 kB gzip) de la versión original; quedan chunks diferidos de
Firebase mayores de 500 kB. Estas medidas no son una puntuación Lighthouse.

Registro y login conservan la identidad anónima mediante enlace o transferencia
servidor de borradores con dos tokens verificados. Sólo se transfieren Draft sin
pago, checkout, cotización, transacción ni adjuntos; el fallo conserva el login y
permite reintentar con la prueba en memoria. Las consultas se restringen al
propietario; staff exige claim y correo verificado. Notas internas privadas,
documentos escapados y calendarios ICS como borrador sustituyen privilegios y
confirmaciones implícitas.

Express recalcula presupuestos, asocia checkout a una reserva propia y verifica
webhooks HMAC de forma idempotente. Un retorno del navegador no confirma captura.
Contacto, candidaturas y B2B requieren su recibo Firestore primario; los adjuntos
seleccionados deben subirse y los reintentos conservan ID. Se versionan reglas,
índices y configuración para la base original nombrada; no se despliegan a producción.

Validación del 21 de noviembre de 2026:

- Node 24: typecheck, build:vercel y npm test correctos; 46 unidades, 16 escenarios
  de formularios, 12 de subidas, servidor 2/2 y adaptador Vercel 5/5.
- Navegador: portada de 320 a 1920 px; nueve familias de página en 320/768/1440 px;
  seis idiomas y 144 combinaciones de inventario/idioma/variante/ancho de la Transit.
- Registro y perfil reales en Emulator Suite; nueva solicitud guardada y visible,
  acceso de cliente y staff con claim, detalle y chat fallback. Inventario del
  estudio trasladado al formulario y CTA de mudanza comprobado.
- Las suites de permisos reales Auth/Firestore/Storage se ejecutan en CI con
  Node 24 y Java 21. Dependencias sin cambios respecto a la auditoría de cero
  vulnerabilidades documentada en la entrega anterior.

Vercel mantiene Express, assets CDN y la protección SSO. Preview bloquea los
proveedores reales y por defecto usa emuladores; admite un opt-in de Firebase
staging separado con configuración web completa y Admin privado coincidente.
La conexión remota sigue pendiente del acceso del propietario: Vercel no aloja los
emuladores locales. La producción en krakenpfm.ch no se sustituye, el PR sigue en
borrador y no se crean usuarios, datos, mensajes ni pagos productivos.

Guías: docs/DESIGN_2026-11-21.md, docs/CODEX_SETUP.md, docs/INTEGRATIONS.md,
docs/BACKEND_SECURITY.md, docs/VERCEL_SETUP.md, docs/CATALOG_MEDIA.json, docs/TRANSIT_REFERENCE.md y docs/KAI_MEDIA.md.

[Preview del rediseño](https://kpfm-2iyuijdf0-antonionadre2-5701s-projects.vercel.app):
**READY** sobre `2987d40`, con SSO. [CI de ese código](https://github.com/antonionadre2-dev/kph-/actions/runs/44918828609):
**success**. La producción se mantiene.
