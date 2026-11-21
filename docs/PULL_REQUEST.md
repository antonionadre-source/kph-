# Renovar Kraken PFM: limpieza, mudanzas, marca Kai y portal seguro

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

La cabecera y el pie incorporan «Properties and Facilities Management» junto al
logo. Azul marino y azul sustituyen al acento verde en la web y el portal. El hero
adapta la referencia Prisma con la dependencia existente motion/react: Kai
limpiando, entrada de palabras, parallax, pausa y cambio de escena por calendario.
La animación provisional fue elegida por el usuario; no se generó vídeo. Se detiene
fuera de pantalla, en pestañas ocultas o con movimiento reducido. En móvil los
controles quedan bajo la foto para despejar los logos.

Se rehacen 50 fuentes de Kai con marca en gorra y polo: calendario, servicios,
regiones, escenas institucionales y mascota transparente. Se generan 150 variantes
con transparencia conservada y sin ampliar píxeles. Las 100 URLs activas están
cubiertas, decodifican y responden HTTP 200; fuentes y hashes quedan documentados.
Las tarjetas incorporan profundidad con puntero y entrada al aparecer en pantalla.
La suma de entrada JS/modulepreloads es 886.117 B (253.788 B gzip calculado), frente
a 2,57 MB (731 kB gzip) de la versión original. El movimiento añade unos 134 kB
respecto a la entrega anterior. Los chunks de Firebase siguen diferidos; estas
medidas no son una puntuación Lighthouse.

La portada añade una variante de revisión `?design=innerwebs`, inspirada en la
referencia visual del usuario: monitor CSS con Kai, tipografía de puntos, crema,
azul marino y tarjetas como ventanas clásicas. La carga es diferida y los estilos
quedan limitados a esa variante; la portada principal sigue disponible. El
presupuesto, el historial y los idiomas conservan sus rutas. Véase
`docs/INNERWEBS_PREVIEW.md`.

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
- Navegador: 54 combinaciones nuevas de portada (nueve anchos 320–1440 px y seis idiomas), pausa, escenas y movimiento reducido; portada previa de 320 a 1920 px; nueve familias de página en 320/768/1440 px;
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

Guías: docs/BRAND_MOTION_2026-11-21.md, docs/KAI_BRAND_V3_ASSETS.json, docs/DESIGN_2026-11-21.md, docs/CODEX_SETUP.md, docs/INTEGRATIONS.md,
docs/BACKEND_SECURITY.md, docs/VERCEL_SETUP.md, docs/CATALOG_MEDIA.json, docs/TRANSIT_REFERENCE.md y docs/KAI_MEDIA.md.

La publicación de medios y hero `33e817b` queda registrada en
`docs/PUBLICATION_BRAND_MOTION_2026-11-21.json`. La variante retro se describe en
`docs/INNERWEBS_PREVIEW.md`; sus enlaces de preview y validación acompañan la
descripción del PR y la entrega del chat.
