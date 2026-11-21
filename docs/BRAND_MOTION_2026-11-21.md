# Kraken PFM · identidad y movimiento

La cabecera y el pie muestran «Properties and Facilities Management» junto al
logo oficial. La paleta usa azul marino `#032b59`, azul `#1464ad`, blanco y fondos
azul claro en portada, catálogo, formularios y portal.

`components/ui/prisma-hero.tsx` adapta la referencia adjunta a React, TypeScript,
Tailwind y la dependencia existente `motion/react`. La portada conserva sus
textos, seis idiomas, presupuesto, teléfono y acceso al simulador Ford Transit.
Incluye entrada de palabras, profundidad con puntero y movimiento suave de la
escena de Kai limpiando. Las tarjetas responden al puntero y aparecen al entrar
en pantalla. El tacto mantiene el desplazamiento normal.

La animación es provisional: imagen 3D con parallax y desplazamiento suave.
El usuario eligió esta versión provisional. El hero utiliza los WebP aprobados
y el movimiento se aplica en el navegador. El componente admite un vídeo local
posterior, con carga condicionada, pausa y cartel de respaldo.

La portada empieza con Kai limpiando. Alterna con la escena seleccionada por el
calendario Europe/Zurich y permite elegir manualmente «Kai en acción» o
«Temporada». La selección manual detiene la alternancia. Pausa, pestaña oculta,
portada fuera de pantalla y la preferencia de movimiento reducido detienen el
movimiento automático. `?kai=christmas` y los otros identificadores del calendario
permiten revisar una escena concreta. En móvil, los controles quedan bajo la
imagen para mantener despejados el logo de la gorra y el del polo.

Imagegen integrado produjo el nuevo master, las 15 escenas del calendario, cinco
servicios, las 28 escenas y recortes anteriores y una nueva mascota transparente.
Los prompts y resultados se registran en `KAI_BRAND_*GENERATION.json`,
`KAI_BRAND_MASTER.json` y `KAI_BRAND_POSE.json`. Todos los Kai visibles llevan gorra
y polo marino con el logo blanco. Las escenas históricas se conservan como
fuentes y respaldo; la web utiliza los nuevos derivados.

`KAI_BRAND_V3_ASSETS.json` es el inventario vigente: fuente, dimensiones, peso,
formato y SHA256 de cada variante. Los catálogos `KAI_MEDIA_*` anteriores se
conservan como procedencia histórica. Para reconstruir los derivados:

```sh
python3 scripts/media/build-kai-brand-v3.py
```

Requiere Pillow. El script conserva los originales públicos anteriores en
`assets-source/kai-brand-v3/previous-public`, mantiene transparencia real y nunca
amplía píxeles del original. Los PNG de generación quedan fuera del despliegue;
la web recibe WebP adaptados y el JPEG social. No se añadió ninguna dependencia.

Las pruebas del diseño incluyen nueve anchos (320–1440 px), seis idiomas,
controles de pausa/escena, movimiento reducido, CTA y revisión visual de los
logos. Los registros de la entrega están en `outputs/brand-motion-2026-11-21`
del chat, junto a las capturas y las pruebas existentes de negocio y permisos.

Medición de compilación: entrada/modulepreloads JS 886.117 B, gzip calculado
253.788 B. La animación añade aproximadamente 134 kB respecto al rediseño previo;
la referencia original era 2,57 MB/731 kB gzip. Cartel principal WebP: 184.890 B en
1672 px y 79.244 B en 960 px. No se ejecutó Lighthouse.
