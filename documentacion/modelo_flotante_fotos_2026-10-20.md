# Modelo flotante a partir de fotografías · 20 de octubre de 2026

Actualización posterior autorizada: el conjunto ya tiene un [apartado adicional de plataformas offshore en el portal](plataformas_offshore_web_2026-10-20.md), con rotor animado. No sustituye nada existente. Las restricciones de las entradas anteriores corresponden a esas etapas; la nueva petición autoriza únicamente esta incorporación independiente.

## Combinación confirmada: original sobre base flotante

El usuario respondió «1»: confirma colocar en Blender el mástil y aerogenerador original sobre la base flotante. Sustitución realizada **solo en una nueva escena**, `Flotante_con_aerogenerador_original`. Las escenas y archivos de las versiones anteriores permanecen disponibles.

Archivo: [flotante_con_aerogenerador_original.blend](../exportaciones/plataforma_flotante_referencia_2026-10-20/flotante_con_aerogenerador_original.blend). Vista: [conjunto con original](../exportaciones/plataforma_flotante_referencia_2026-10-20/conjunto_con_original.png). Script: `scripts/combinar_original_base_flotante.py`; manifiesto: `combinacion_original.json` en la carpeta de exportación.

Se importaron las 1435 piezas visibles y grupos seleccionados del Blender original con el mismo filtro usado por la exportación web; se conserva la jerarquía y el pitch, y se añade un padre de giro lineal de 12 rpm. Se excluyen paisaje, nubes y cimentación original. Se conservan los 563 objetos y grupos de base/amarres y sus transformaciones, además de los materiales mejorados. El apoyo de la torre se verifica a Z=14,17 m sobre la primera columna (X=-24; Y=-13,8564). El render del conjunto confirma visualmente el montaje. Los colores de identificación originales de las palas se conservan.

El archivo fuente `../Proyecto_blender/aerogenerador_desplazado_de_base_COPIA_TRABAJO.blend` no se guarda ni modifica: SHA-256 `8d712a014aeacf747b6b36d22c3234d6047a52ca50485eeba63d668494920479`, coincidente con la procedencia previa. React y Angular siguen intactos. Esta confirmación resuelve la duda registrada a continuación; no autoriza una integración web.

## Materiales mejorados y nueva petición de sustitución

Se mejoran los siete materiales con pintura marina satinada amarilla, composite blanco, placas azules, acero galvanizado y amarres metálicos oscuros. Se añade variación de rugosidad y microrrelieve sutil, sin inventar corrosión o desgaste medido. La iluminación neutra se separa del fondo azul para eliminar la dominante verde. Geometría intacta, revisión mediante render EEVEE.

Nueva versión independiente: `exportaciones/plataforma_flotante_referencia_2026-10-20/aerogenerador_flotante_materiales_mejorados.blend`; vista `detalle_materiales_mejorados.png`. Se conserva el primer `.blend`. Script: `scripts/mejorar_materiales_flotante.py`.

El usuario pide además una sustitución conservando la base flotante. Se solicita aclaración entre colocar el mástil y aerogenerador original sobre esta base en Blender o reemplazar el conjunto en la web. **Esa sustitución todavía no se ha ejecutado, pendiente de aclaración del destino.** El archivo fuente original se ha localizado y consultado sin modificarlo; ni React ni Angular han cambiado en esta petición.

El usuario autorizó únicamente crear el modelo en el Blender abierto, conectado por MCP al puerto 9876. Reiteró expresamente que no se sustituyera nada. No se integra este modelo en React ni en Angular y no se modifican sus recursos.

## Archivo y escena

- Archivo independiente: [aerogenerador_flotante_reconstruido.blend](../exportaciones/plataforma_flotante_referencia_2026-10-20/aerogenerador_flotante_reconstruido.blend).
- Escena nueva: `Plataforma_flotante_referencia_fotos`, con 592 objetos, incluidas cámaras, luces y grupos.
- Script reproducible: [crear_flotante_desde_fotos.py](../scripts/crear_flotante_desde_fotos.py). Si vuelve a ejecutarse, crea otra escena y versiona el archivo existente.
- Vistas guardadas: [conjunto](../exportaciones/plataforma_flotante_referencia_2026-10-20/vista_completa.png) y [detalle de plataforma](../exportaciones/plataforma_flotante_referencia_2026-10-20/detalle_plataforma.png).

Reconstrucción visual aproximada de las tres fotos aportadas: plataforma triangular con tres columnas amarillas, tubos superiores e inferiores, diagonales cruzadas, pasarelas, barandillas, escaleras, placas azules inferiores, tres líneas de amarre curvas y anclas. Torre sobre una esquina, banda azul, góndola y tres palas de perfil propio. No es el modelo original descargado ni una reconstrucción dimensional certificada. Las etiquetas numeradas de las fotografías no se modelan como piezas físicas.

Las dimensiones son hipótesis visuales: triángulo de 48 m de lado, columnas de 20 m y rotor de 145 m. El rotor tiene animación lineal de dos vueltas en 240 intervalos a 24 fps (12 rpm), fotogramas 1–241. No hay simulación hidrodinámica, cálculo de estabilidad, tensión de amarres ni fatiga. El aerogenerador se construye aparte y no modifica el Blender usado por las aplicaciones.

## Verificación y conservación

Tras la aclaración del usuario se deja la sesión en perspectiva libre, vista sólida de modelado, con una pala seleccionada. Comprobadas 561 mallas editables y 19 curvas 3D; la pala seleccionada contiene 432 vértices y 386 caras. Los PNG son únicamente vistas auxiliares: el modelo está construido con geometría tridimensional, no con un plano de imagen. Se ocultan las guías de cámaras, luces y relaciones para facilitar la inspección.

Se comprobó visualmente el conjunto y un acercamiento de la plataforma en Blender, además de dos renders EEVEE. La escena anterior `Scene` conserva exactamente sus tres objetos (`Cube`, `Light`, `Camera`); el script verifica las listas de objetos de todas las escenas anteriores. La nueva escena queda seleccionada en la sesión actual. Se guarda únicamente la escena nueva mediante `bpy.data.libraries.write`, sin guardar encima del archivo de trabajo previo. Archivo final de 127706 bytes. No hay importación web, sustitución, publicación ni subida a GitHub.
