# Renovar ventas, portal y reservas de Kraken PFM con permisos y pagos verificados

El cliente podía aportar importes/estados financieros, el dominio de email otorgaba
privilegios y varios formularios aparentaban éxito tras fallar. La entrega separa
estimación, persistencia y pago, y facilita pedir presupuesto con una portada
comercial compacta, header/footer móviles y Kai de ventas en seis idiomas.

Registro y login conservan la identidad anónima mediante enlace o transferencia
servidor de borradores con dos tokens verificados. Sólo se transfieren Draft sin
pago/checkout/cotización/transacción ni adjuntos; los casos protegidos necesitan
asistencia. Un fallo de transferencia conserva el login y ofrece retry con la prueba
sólo en memoria. El panel pagina por propietario; staff exige claim y correo
verificado. Notas internas privadas, documentos escapados y calendario ICS como
borrador sustituyen privilegios implícitos y afirmaciones de factura/sincronización.

Los borradores preservan createdAt y deben guardarse antes de avanzar o abrir
checkout. Express calcula la cotización desde servicios guardados, asocia el
Gateway a la reserva propia y confirma pagos mediante webhook HMAC verificado e
idempotente. Sin configuración Payrexx devuelve 503 antes de bloquear el pedido.
El retorno del navegador no confirma captura. Contacto, candidaturas y B2B esperan
su recibo Firestore primario y los adjuntos seleccionados deben subirse; los
reintentos reutilizan ID. Reglas e índices están versionados, sin deploy productivo.

Se añaden 20 escenas Kai (15 calendario Europe/Zurich y cinco servicios/Thurgau) y
151 derivados. El inventario tiene 285 imágenes públicas válidas, cero dañadas y
cero rutas faltantes. Los 41 archivos dañados se archivan preservando bytes/hashes;
los 22 originales históricos siguen identificados, sin presentar ilustraciones
nuevas como recuperación de originales. Las cargas diferidas y WebP reducen el JS
inicial de entrada/modulepreloads de 2.570.402 a 722.451 B (730.521 a 201.858 B gzip),
71,9% menos sin comprimir. Queda el aviso de Firebase diferido de unos 570 kB;
estas medidas no son una puntuación Lighthouse.

La arquitectura React/Vite/Express conserva rutas, API y SEO por idioma. Vercel usa
Express y assets CDN. Preview fuerza Firebase demo y bloquea proveedores reales
aunque herede claves; no aloja emuladores remotos. La Preview 10fbb52 es anterior
a estos cambios. La [nueva Preview](https://kpfm-c9yyqi0ak-antonionadre2-5701s-projects.vercel.app) está **READY** sobre `9a8c783`;
el acceso está protegido por Vercel. Registro en `docs/VERCEL_SETUP.md`.
La producción se conserva.

Validación local del 21 de noviembre de 2026:

- `npm ci`: 436 paquetes, salida 0; typecheck, build:vercel y npm test: salida 0.
- 43 unidades (portal 18, backend 7 y PDF 6 incluidas), 16 formularios, 12 subidas,
  servidor 2/2, Vercel 4/4 y reglas/Auth/Firestore/Storage reales en emuladores 7/7.
- `npm audit`: cero hallazgos de todas las severidades tras corregir los dos
  críticos iniciales, retirar Jimp sin uso y fijar dependencias transitivas.
- Navegador: portada sin overflow en nueve anchos de 320 a 1920 px, seis idiomas,
  chat fallback, registro/perfil reales demo, datos propios/tercero oculto,
  staff con claim real, paginación 25→46 y mensajes.

[CI Node 24/Java 21/emuladores](https://github.com/antonionadre2-dev/kph-/actions/runs/44908677518): **success** sobre `9a8c783`.
Quedan acceso Firebase del propietario, configuración Auth/Admin/claims,
migración de notas, reglas/índices en la **base nombrada** y Storage, además de
sandbox Payrexx y cuentas/destinos Gemini/EmailJS/Make. `firebase.production.example.json`
explicita la base original, que debe verificarse contra cliente/Admin y proyecto
antes de desplegar. No se crearon datos, mensajes, usuarios o pagos productivos,
no se desplegaron reglas reales, no se fusionó el PR y no se sustituyó producción.

Guías: `docs/CODEX_SETUP.md`, `docs/INTEGRATIONS.md`, `docs/BACKEND_SECURITY.md`,
`docs/VERCEL_SETUP.md`, `docs/ASSET_AUDIT.md` y `docs/KAI_MEDIA.md`.
