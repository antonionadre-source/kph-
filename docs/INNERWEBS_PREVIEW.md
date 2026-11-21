# Kraken PFM · preview retro

Referencia visual solicitada: https://theinnerwebs.com/?ref=minimal.gallery.
La propuesta usa una composición propia: azul de Kraken, crema, titular de puntos,
acento manuscrito, monitor y teclado en CSS con volumen, y las imágenes aprobadas
de Kai dentro de la pantalla. Los servicios se presentan como ventanas clásicas.

Abrir la portada con `?lang=es&design=innerwebs`. El parámetro se conserva en la
navegación interna y en el historial; la variante visual se aplica a la portada.
La URL sin `design=innerwebs` mantiene el diseño principal. Cabecera, marca,
idiomas, presupuesto y rutas usan los componentes existentes.

La pantalla permite elegir Kai limpiando o la escena de temporada, pausar el
movimiento y seguir el calendario Europe/Zurich. Se respeta movimiento reducido,
pestaña oculta y salida de pantalla. El monitor y teclado son elementos CSS,
sin nuevas dependencias, recursos de la referencia ni motor 3D adicional.
La animación de Kai sigue siendo la versión provisional acordada.

El hero se carga de forma diferida. Los estilos están limitados a la clase de
preview y el contenido comercial, Ford Transit y formularios siguen conectados.
Los controles móviles conservan objetivos de al menos 44 px. Los PNG originales
no se descargan en la portada; se usan los WebP adaptados.

Validación: TypeScript sin errores, compilación Vercel correcta y 46 pruebas
unitarias correctas. Revisión visual real en Chrome y Safari, controles de escena,
pausa y acceso al presupuesto. Pruebas de negocio y permisos de la revisión base
`33e817b`: CI 44926041669, correcta. Capturas y registros de esta propuesta en
`outputs/innerwebs-preview-2026-11-21` del chat.
