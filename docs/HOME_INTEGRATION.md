# Homepage aprobada — 22 de noviembre de 2026

Integración del paquete `kraken-home-codex.zip` en el repositorio React/Vite/Express
existente. La portada es una ruta React, sin iframe, sin segunda calculadora y sin
copiar la identidad de alojamiento ni las páginas privadas de entrega del paquete.

## Implementación

- `components/home/ApprovedHome.tsx`: estructura aprobada, alemán de Suiza,
  cinco servicios particulares, navegación, footer y selección con Kai.
- `components/home/{app,scene,van,lifecycle}.js`: controles y escenas con recursos
  propios de cada montaje. Se cancelan listeners, observadores, peticiones y
  temporizadores al salir, también con React StrictMode.
- `approved-home.css`: estilos aislados bajo `.kraken-home`, animaciones con
  prefijo. `responsive-fixes.css` mantiene toda la casa dentro del encuadre y
  reserva ambas vistas de la Transit frente al reset `hidden` de Tailwind.
- `public/home-approved/assets`: los 14 recursos originales del paquete,
  idénticos en bytes. Inventario y SHA-256 en `HOME_ASSETS.json`.
- `src/home/calculator.ts` y `components/ConsultationPage.tsx`: puente a `/quote`,
  hidratación del borrador y tratamiento explícito de ventanas sin tarifa.
- `server/homeWeather.ts` y `server.ts`: API meteorológica del mismo origen.
- `index.html`, `seoConfig.ts`, `i18n.ts` y `components/App.tsx`: ruta de inicio,
  metadatos de Zürich/Schaffhausen/Winterthur y separación de la navegación
  anterior. Las otras páginas conservan sus componentes y sus idiomas.

## Calculadora y datos

Todas las acciones comerciales de la home, sus tarjetas, la Transit y la
continuación desde Kai entran en la calculadora existente en `/quote`.

| Elección | Identificador existente |
| --- | --- |
| `end` | `end-of-tenancy` |
| `regular` | `daily-cleaning` |
| `deep` | `deep-cleaning` |
| `moving` | `moving` |
| `windows` | Intención separada sin estimación ni checkout |

Se conserva el contrato `kraken_preselected_service`. No se añaden parámetros
`service` o `postcode`. El puente no escribe `kraken_consultation_data_v2`,
carritos ni solicitudes. La calculadora hidrata los datos antes de guardar y
conserva campos anteriores desconocidos cuando el usuario edita sus datos;
un JSON dañado no se sobrescribe automáticamente.

El motor sólo tenía ventanas como complemento de otras limpiezas. No existe una
tarifa independiente aprobada. Por indicación de Antonio, el acceso de ventanas
queda disponible sin mostrar importes, sin sustituirlo por otro servicio y sin
crear una modalidad de pago ficticia. Los otros cuatro servicios reutilizan sus
configuraciones y tarifas existentes. No se modifican pagos, facturación ni APIs
de solicitudes. El texto de la home sobre ausencia de IVA se conserva tal como
fue aprobado; debe revisarse su coherencia con la configuración de facturación
existente antes de publicar cambios comerciales en producción.

## Escena y tiempo

Hora `Europe/Zurich`, estaciones, Navidad/Año Nuevo, iluminación, ropa y tareas
de Kai mantienen las reglas editoriales del paquete. Los cambios manuales se
identifican como vista previa. La Transit conserva dos vistas, etapas, controles
de teclado, pausa/reanudación y respeto al movimiento reducido. No se incorporan
capacidades ni dimensiones numéricas del vehículo.

`GET /api/weather/zurich` usa observaciones LSZH de NOAA AWC. Conserva caché de
20 minutos por proceso, coalescencia de peticiones concurrentes, timeout de ocho
segundos, reintento tras cinco minutos y antigüedad máxima de 90 minutos. Sólo
una observación aún válida puede conservarse como dato retrasado. Si falta, se
devuelve un estado no disponible y la escena queda neutral, sin temperatura
inventada ni inferencia de frío.

## SEO y contactos

Canonical `https://krakenpfm.ch/`, metadatos locales en alemán de Suiza y datos
estructurados sin precios, rangos ni reseñas. Los hosts de preview reciben
`X-Robots-Tag: noindex, nofollow`; la portada pública conserva indexación.
Instagram sigue desactivado, configurable en `components/home/site-config.js`
hasta disponer de la URL oficial. Se incluye el enlace `Website made by seociety.ch`.

## Validación

`npm run build` y `npm run test:home` pasan: 29 pruebas de puente/borradores,
clima, estado de Kai, limpieza del montaje y metadatos. `npm run lint` reproduce
únicamente los tres errores que ya tenía la versión recibida: `webhookPromise`
en `CareersPage.tsx` y `setConfetti`/`confetti` en `PaymentCelebrationPage.tsx`.

Se revisan en navegador 320, 390, 768, 1024, 1440 y 1920 px, sin desbordamiento
horizontal; casa completa, día/noche, celebraciones, clima no disponible, menú
móvil, teclado, movimiento reducido, pausa y estabilidad de altura de la Transit.
Los accesos a la calculadora se prueban con las conexiones de Firebase, EmailJS
y Payrexx bloqueadas temporalmente: no se crean usuarios, pagos ni solicitudes
para validar esta portada. Esto no certifica el envío ni un pago de producción.

La preview local está en `http://localhost:3001/`. Esta entrega modifica el código
de la rama de trabajo; no sustituye por sí misma el despliegue de `krakenpfm.ch`.
