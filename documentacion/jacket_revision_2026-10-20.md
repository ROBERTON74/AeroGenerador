# Tercera estructura: cimentación jacket · revisión en Blender

Actualización posterior: el usuario aprobó su incorporación. La jacket ya está añadida como [tercer modelo independiente del portal](jacket_web_2026-10-20.md), con palas animadas. La espera de revisión descrita a continuación queda resuelta; se conserva el archivo Blender aprobado.

El usuario aporta tres fotografías y solicita el mismo proceso de los modelos anteriores: **crear primero en Blender** una cimentación jacket. No autoriza todavía su incorporación a la web. Se deja para revisión en una escena y un archivo nuevos.

## Modelo para revisar

- Escena visible: `Jacket_cimentacion_REVISION`.
- Archivo: [jacket_cimentacion_REVISION.blend](../exportaciones/jacket_referencia_2026-10-20/jacket_cimentacion_REVISION.blend).
- Conjunto 3D editable, con 1752 objetos y 1737 mallas. Los renders son únicamente vistas auxiliares.
- Cuatro patas inclinadas abiertas hacia la base, cuatro tramos de arriostramiento en X en las cuatro caras (32 diagonales), cinturones horizontales, collares y manguitos.
- Cuatro pilotes inferiores oscuros, transición amarilla troncopiramidal, cuello circular, brida de torre, pernos y pasarela superior con barandilla.
- Copia independiente de la jerarquía del aerogenerador original, con torre, góndola, palas, buje y detalles. Se conserva el giro de 12 rpm y se añade banda azul como en las fotografías. Materiales propios de pintura amarilla, acero oscuro, acero galvanizado y blanco satinado.

Se interpreta visualmente una estructura de cuatro patas a partir de las tres vistas. Hipótesis aproximadas: lado inferior 24 m, superior 12 m, celosía de 54 m, pilotes visibles de 12 m y apoyo de torre a Z=63,2 m. Son proporciones de reconstrucción, no cotas verificadas ni un dimensionamiento estructural. No se representan suelo, penetración real de pilotes o cálculos geotécnicos, de oleaje o de fatiga. No se le asigna fabricante.

## Vistas y comprobaciones

- [Conjunto completo](../exportaciones/jacket_referencia_2026-10-20/conjunto_revision.png).
- [Detalle de la cimentación](../exportaciones/jacket_referencia_2026-10-20/cimentacion_revision.png).
- [Pilotes inferiores](../exportaciones/jacket_referencia_2026-10-20/pilotes_revision.png).

Revisados el conjunto y los detalles mediante viewport sólido y renders EEVEE. Giro comprobado: avance de π/2 radianes en 30 fotogramas a 24 fps. Se alinea únicamente en esta copia un accesorio de la puerta del modelo original que tenía coordenadas descentradas. Archivo final guardado de 2.531.344 bytes. Informes en `procedencia_revision.json` y `verificacion_revision.json` junto al `.blend`.

Script: `scripts/crear_jacket_referencia_fotos.py`; crea una escena nueva y versiona el archivo si ya existe. Guarda mediante `bpy.data.libraries.write`, sin sobrescribir el Blender de trabajo anterior. Se verifica que las listas de objetos de todas las escenas previas permanezcan iguales. No se modifican sus jerarquías ni sus materiales: la nueva instancia usa objetos copiados y asignaciones de material por objeto.

La sesión queda en vista libre de modelado, con la jacket seleccionada. La semisumergible y la TLP se conservan, así como sus versiones web, el laboratorio y la aplicación React.

**Estado: pendiente de revisión del usuario. No exportar ni añadir la jacket al portal hasta que lo apruebe.** No hay modificación web, publicación ni subida a GitHub.
