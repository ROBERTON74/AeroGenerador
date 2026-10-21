# Revisión estética de los tres visores offshore · 20 de octubre de 2026

Petición del usuario: terminar la adaptación, revisar su estética y abrir la web. Esta revisión continúa la integración descrita en `entorno_blender_tres_plataformas_2026-10-20.md`.

## Correcciones realizadas

- **Carga real desde Angular:** el servidor entrega los archivos `.gz` con `Content-Encoding: gzip` y `fetch` ya los descomprime. El visor comprueba los bytes recibidos y solo descomprime si siguen siendo gzip. Se verifica tanto la entrega descomprimida por HTTP como los archivos comprimidos sin esa cabecera.
- **Océano continuo:** 81 módulos originales de 150 m, unos 1350 m de cobertura, sin estirar las olas. Se conserva el detalle completo alrededor de la plataforma y cerca de la cámara; los módulos lejanos usan una cuadrícula reducida que toma sus posiciones y normales del mismo clip. Instancias agrupadas para reducir llamadas de dibujo. Velocidad **0,75× del original**.
- **Acabado:** tinte azul del agua, iluminación más equilibrada y niebla lejana para fundir el horizonte. Los materiales de las plataformas conservan su definición y no reciben esa niebla. Etiquetas con fondo oscuro y leyenda en una esquina para no tapar el anillo ni los pilotes.
- **Continuidad del fondo:** extensión lejana hasta 1600 m manteniendo el hueco central de 96×96 m. Se conservan las coordenadas UV por metro. Una superficie central con el mismo material cubre esa zona cuando se observa de lejos; el relieve geométrico se muestra al aproximarse. Se retira el mapa de altura usado como color durante la exportación, que creaba un parche oscuro. No se cambian las cotas de fondo adaptadas a las estructuras.
- **Pose inicial correcta:** se evalúa el mezclador en el instante inicial aunque la animación esté pausada o haya movimiento reducido. Así los animales muestran la pose de nado y no la pose de reposo del esqueleto.
- **Móvil:** cámara submarina adaptada a la relación de aspecto para encuadrar los cuatro cetáceos; filas de la interfaz fijadas para eliminar el espacio vacío entre escena y controles. Vistas enlazables mediante `?vista=conjunto`, `mar`, `submarina`, `plataforma` o `rotor`.

Se conserva la pausa conjunta del rotor, el agua y los animales. El selector de velocidad solo cambia las palas. Se amplía el límite de paso temporal de 50 a 250 ms para evitar ralentización artificial al caer temporalmente por debajo de 20 fotogramas por segundo.

## Comprobación y conservación

Se usan capturas reales de Microsoft Edge con WebGL mediante SwiftShader y un perfil de pruebas independiente. El control nativo del escritorio no estaba disponible; la revisión visual se realiza con el navegador instalado ejecutado como herramienta de pruebas. No equivale a una medición de rendimiento en móviles físicos o con todas las GPU.

El navegador de pruebas de Windows impone un tamaño mínimo de ventana mayor que 390 píxeles. Para las capturas móviles se utiliza un marco de exactamente 390 píxeles CSS, evitando confundir el recorte del navegador con un desbordamiento de la web. El servidor de revisión es local y sirve las mismas fuentes de los visores; los originales instalados en Angular se contrastan por SHA-256.

Evidencia de revisión en `respaldos/revision_estetica_offshore_2026-10-20/`: capturas de conjunto y submarinas, escritorio y móvil, además de tomas con animación normal. `revision_visual.json` registra las comprobaciones de navegador cuando finaliza su generación.

Pruebas de datos y controles con Three.js correctas, incluida la descarga real desde Angular, la pausa y el cambio de aspecto móvil. Comparación de los tiburones con Blender en fotogramas 1 y 25: diferencia máxima de cotas menor que 0,000015 m, teniendo en cuenta la base temporal del exportador. La escena Blender se devuelve al fotograma previo y no se sobrescribe.

Los 59 archivos protegidos coinciden con el respaldo de la integración anterior. No cambian los GLB de las tres plataformas, portada, laboratorio, visor original, React ni escenas Blender guardadas. Continúan las atribuciones y licencias del entorno. Sin publicación ni GitHub.

Se abre el portal local en Edge y se dejan los servidores Angular (4200) y React (5177) iniciados. El servidor de revisión de capturas (4280) es temporal y se detiene al terminar.

**Estado de cierre:** terminado. Quince capturas comprobadas: seis vistas de escritorio, seis vistas a 390 píxeles CSS y tres con movimiento activo. Carga completa, agua al 75 %, siete animales y controles dentro de la pantalla en los quince casos. Compilación Angular correcta; se mantiene el aviso previo de 52 bytes del presupuesto CSS. Respaldo incremental: `respaldos/revision_estetica_offshore_2026-10-20.zip`, con fuentes, capturas, informes y SHA-256. Se conservan los respaldos anteriores.
