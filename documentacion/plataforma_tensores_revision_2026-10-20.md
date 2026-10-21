# Segunda plataforma: tensores y anillo inferior · revisión en Blender

**Actualización posterior:** el usuario aprobó el modelo y autorizó su incorporación. Ya disponible como [segunda plataforma del portal, con materiales mejorados y rotor animado](plataforma_tensores_web_2026-10-20.md). La espera de revisión descrita abajo corresponde a la fase anterior y está resuelta. El archivo de revisión se conserva.

El usuario aporta tres fotografías y solicita el mismo proceso que para la primera plataforma: **modelar primero en Blender, esperar a que lo revise y solo después de su aprobación incorporarlo como otro modelo en Tipos de plataformas offshore**. En esta etapa no se cambia ni exporta nada a la web.

## Resultado para revisar

Escena nueva visible: `Plataforma_tensores_anillo_REVISION`.

Archivo independiente: [plataforma_tensores_anillo_REVISION.blend](../exportaciones/plataforma_tensores_referencia_2026-10-20/plataforma_tensores_anillo_REVISION.blend).

Reconstrucción visual aproximada: cuerpo central amarillo, seis flotadores radiales con extremos redondeados, cuello central, pasarela circular de inspección, refuerzos, pasarelas y perímetro hexagonal con barandillas; seis tensores rectos verticales con terminales; anillo inferior gris poligonal abierto, con nervios, huecos, asientos y pernos. Se omiten las etiquetas numeradas y controles de las fotografías porque pertenecen al visor de referencia.

Se duplica la jerarquía del aerogenerador original de la primera plataforma para conservar el modelo del proyecto: torre, góndola, rotor, detalles y animación. Se añade la banda azul visible en las referencias. Las copias tienen objetos y padres propios; la geometría fuente compartida no se modifica. Se mantienen los materiales mejorados de pintura marina y se crean materiales propios para el anillo y los tensores.

Contiene 2197 objetos, de ellos 2182 mallas editables. Es un modelo 3D real, no un plano con una fotografía. Los renders son únicamente imágenes auxiliares de revisión.

## Hipótesis y límites

Las fotos no aportan cotas ni identificación técnica verificable. Se modela su apariencia sin certificar un diseño concreto ni asignarle fabricante. Hipótesis visuales: seis lóbulos y seis tensores, anillo exterior de 37,2 m de diámetro, desnivel aproximado de 108 m, torre original apoyada a Z=21,12 m. Pueden ajustarse tras la revisión del usuario. No hay cálculo de flotabilidad, pretensión, estabilidad, hidrodinámica ni cargas; la geometría no es una validación de ingeniería.

El rotor conserva el movimiento lineal de 12 rpm. Se comprobó un avance de π/2 radianes entre los fotogramas 7 y 37 a 24 fps. No se simula movimiento de la plataforma ni de los tensores.

## Revisión y conservación

Vistas guardadas junto al `.blend`:

- [Conjunto completo](../exportaciones/plataforma_tensores_referencia_2026-10-20/conjunto_revision.png).
- [Estructura amarilla](../exportaciones/plataforma_tensores_referencia_2026-10-20/estructura_amarilla_revision.png).
- [Anillo inferior](../exportaciones/plataforma_tensores_referencia_2026-10-20/anillo_inferior_revision.png).

Comprobados visualmente el conjunto, la estructura y el anillo mediante vista sólida y renders EEVEE. Archivo guardado de 2.705.894 bytes. Script: `scripts/crear_plataforma_tensores_fotos.py`; manifiesto `procedencia_revision.json` en la carpeta de exportación. Si se vuelve a crear el modelo, el script versiona el archivo existente.

Verificadas las listas de objetos de todas las escenas anteriores sin cambios. Se conserva la primera plataforma flotante, el archivo fuente original, React y el portal Angular. El archivo nuevo se guarda mediante `bpy.data.libraries.write`, sin guardar encima del trabajo anterior. La sesión queda en vista de modelado libre con la nueva escena seleccionada.

**Estado: pendiente de revisión del usuario. No integrar ni exportar este segundo modelo a la web hasta recibir su aprobación.** No hay publicación ni subida a GitHub.
