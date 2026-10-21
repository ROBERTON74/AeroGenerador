## Revisi?n general ? 21 de octubre de 2026

67 comprobaciones funcionales, 45 recursos y tres v?deos correctos. Corregida la agrupaci?n de mallas incompatibles del visor original (fuente e instalaci?n), conservando geometr?a, materiales y destinos de animaci?n. Ajustado el tama?o del t?tulo del portal para evitar recortes en cinco anchuras. Ver `documentacion/revision_general_2026-10-21.md` (portal: `REVISION_GENERAL_2026-10-21.md`). Mar React y adaptadores id?nticos al respaldo aprobado, al 75 %. Compilaciones correctas; avisos de tama?o documentados. Informes y copia incremental en `respaldos/revision_general_2026-10-21/` y `.zip`. Sin publicaci?n ni GitHub.

## Mar de Blender en la animación principal React · 20–21 de octubre de 2026

El usuario aprueba el acabado visual del mar principal y pide conservarlo, manteniendo el movimiento original de Blender al 75 %. No cambiar su aspecto ni el resto de la escena por esta confirmación. Reproducción ya conectada al bucle de render y verificada en navegador.

Por petición del usuario solo se sustituye la superficie del mar en React (5177) por el clip original de Blender al 75 %. Sin animales ni arena añadidos. Escala uniforme equivalente al aerogenerador; altura y opacidad anteriores conservadas. Cámara, modelo, base, cielo, interfaz, datos y controles mantienen su código. Ver `documentacion/react_mar_blender_2026-10-20.md`; fuentes en `src/components/BlenderSea.jsx` y `blenderSea.js`, recursos en `public/models/mar-blender/`. Compilación y pruebas de datos/navegador correctas; respaldo en `respaldos/react_mar_blender_2026-10-21.zip`. Portal Angular intacto. Sin publicación ni GitHub.

## Papers rediseñados y tendencias 2025–2026 · 20 de octubre de 2026

Los tres enlaces existentes de Papers abren notas con diseño editorial propio, índice, fórmulas, ejemplos, impresión y fuentes primarias enlazadas. Incluyen tendencias recientes sobre DEL, RUL y Rainflow/Cp/Ct; se corrigen límites científicos sin añadir modelos de pronóstico. Ver `documentacion/papers_editoriales_2026-10-20.md` (portal: `PAPERS_EDITORIALES_2026-10-20.md`). Seis capturas de escritorio/390 px, compilación correcta con aviso CSS previo y respaldo incremental en `respaldos/papers_editoriales_2026-10-20.zip`. Sin publicación ni GitHub.

## Encuadre inicial frontal con horizonte · 20 de octubre de 2026

Los tres visores de plataformas abren con cámara a siete metros sobre el mar, frontal y con horizonte central, siguiendo la captura del usuario. Conjunto y Restablecer recuperan este encuadre. Distancia adaptada a estructura y pantalla. Animaciones y entorno conservados. Ver `documentacion/encuadre_horizonte_2026-10-20.md` (portal: `ENCUADRE_HORIZONTE_2026-10-20.md`). Copia incremental y capturas en `respaldos/encuadre_horizonte_2026-10-20/`. Sin publicación ni GitHub.

## Animales visibles desde superficie · 20 de octubre de 2026

Ajuste de presentación del entorno compartido: agua al 26 % de opacidad y fauna sin niebla cuando la cámara está sobre el mar; bajo el agua se conserva el acabado anterior. Sin cambiar profundidad, escala, recorridos ni mar al 75 %. Ver `documentacion/visibilidad_animales_superficie_2026-10-20.md` (en el portal, `VISIBILIDAD_ANIMALES_SUPERFICIE_2026-10-20.md`). Copia incremental y capturas en `respaldos/visibilidad_animales_superficie_2026-10-20/`. Sin publicación ni GitHub.

# Continuidad de AeroGenerador

## Revisión estética offshore completada · 20 de octubre de 2026

Los tres visores del portal están revisados en escritorio, a 390 píxeles CSS y con movimiento activo. Mar al 75 %, continuidad de agua hasta 1350 m, fondo sin huecos, pose inicial correcta de los animales y controles móviles completos. Ver `documentacion/revision_estetica_offshore_2026-10-20.md`. Quince capturas e informes en `respaldos/revision_estetica_offshore_2026-10-20/`; se conserva el respaldo anterior. Compilación correcta y 59 archivos protegidos idénticos al respaldo previo. Portal abierto en Edge; servidores 4200 y 5177 iniciados. Sin publicación ni GitHub.

## Entorno Blender adaptado a los tres visores · estado vigente

Por petición del usuario, semisumergible, TLP y jacket del portal Angular comparten ahora el océano original de Blender al **75 % de velocidad (0,75×)**, arena y siete animales: dos jorobadas, dos cachalotes y tres tiburones. Nuevas vistas Entorno marino y Bajo el agua; pausa conjunta. Ver `documentacion/entorno_blender_tres_plataformas_2026-10-20.md`. Recursos compartidos en `exportaciones/entorno_offshore_web/` y `public/assets/entorno-offshore/` del portal. Modelos de plataformas, React, laboratorio y visor original conservados; 59 SHA-256 protegidos intactos. Compilación y pruebas de carga/datos/controles sin GPU correctas; **revisión visual completada posteriormente con quince capturas reales de Edge**, ver `documentacion/revision_estetica_offshore_2026-10-20.md`. Copias previas e informes en `respaldos/entorno_blender_tres_visores_2026-10-20/`. No reinstalar el antiguo script de mar sintético sobre esta versión. Blender vigente: `Oceano_dos_ballenas_dos_cachalotes_REVISION`, copia en `exportaciones/cuatro_cetaceos_REVISION_2026-10-20/`. Sin publicación ni GitHub.

## Fondo de arena Nearshore Sandripples ajustado a escala

Nueva escena vigente `Oceano_fondo_arena_REVISION`, con el fondo proporcionado por el usuario. Detalle calibrado aproximadamente con la separación de crestas de 20–30 cm publicada por el autor; módulos de 16×6 m repetidos sin estirar sus ondulaciones. Geometría derivada en 96×96 m bajo la plataforma y continuidad visual a la misma escala hasta 600×600 m. Referencia del suelo Z=-58 m; placa celeste conservada en copia inferior a -58,6 m, sin mover el original. Mar al 150 %, tres tiburones y cetáceos alejados intactos; doce escenas anteriores conservadas. Leer `documentacion/sandripples_revision_2026-10-20.md` para calibración, adaptación y límites. Copia vigente: `exportaciones/sandripples_REVISION_2026-10-20/oceano_fondo_arena_animales_REVISION.blend`, con fuente, mapas empaquetados, tres renders e informes. Atribución: observaterre, CC BY 4.0. **Pendiente de revisión antes de cambiar la web.** Portal, React y laboratorio intactos; sin publicación ni GitHub.


## Tres tiburones animados y cetáceos más alejados

Escena vigente `Oceano_tres_tiburones_REVISION`: tres copias del GLB de tiburón blanco del usuario, longitudes de referencia 3,8/4,2/4,6 m, clip de nado original, fases y recorridos separados cerca de la plataforma. Jorobada y cachalote desplazados 21,6 y 25,5 m hacia el exterior mediante grupos independientes, sin cambiar escala, profundidad o sus acciones originales. Mar al 150 % y placa celeste conservados; Monterey sigue excluido. Once escenas anteriores conservadas. Leer `documentacion/tres_tiburones_revision_2026-10-20.md`. Copia vigente, renders, fuente e informes en `exportaciones/tres_tiburones_REVISION_2026-10-20/`; archivo `oceano_tres_tiburones_cetaceos_REVISION.blend`. Atribución del tiburón: DigitalLife3D, CC BY-NC 4.0. Recorridos de revisión artística, sin validación de presencia ecológica específica junto a esta plataforma. **Pendiente de revisión antes de cambiar la web; portal y React intactos.**


## Velocidad del mar vigente: 150 % del original

Por petición del usuario el mar pasa de 1,2× a 1,5× (50 % más rápido que el original). Cinco mallas verificadas con escala temporal NLA 0,6666667. Nueva copia `exportaciones/base_celeste_mar_rapido_REVISION_2026-10-20/base_celeste_mar_150_REVISION.blend`; conservar la copia al 120 %. Placa celeste, animales, profundidad, escala y plataforma sin cambios. Ver `documentacion/base_celeste_mar_rapido_2026-10-20.md`. Web sin cambios, pendiente de revisión.


## Placa celeste restaurada y oleaje original al 120 %

El usuario rechazó el fondo Monterey: queda fuera de la nueva escena vigente `Oceano_cetaceos_base_celeste_REVISION`. Se recupera la placa anterior con su material original. Mar descargado al 120 % de velocidad, manteniendo exactamente su clip irregular, sin ondas añadidas; datos de deformación independientes para conservar la velocidad anterior en el historial. Animales, profundidad, escala y plataforma intactos. Leer `documentacion/base_celeste_mar_rapido_2026-10-20.md`. Guardado vigente: `exportaciones/base_celeste_mar_rapido_REVISION_2026-10-20/base_celeste_mar_120_REVISION.blend`, con renders y verificación. **Monterey no está aprobado; no incorporarlo a la web.** No se modifica la web, aún pendiente de revisión.


## Cetáceos descargados animados: revisión Blender más reciente

Nueva escena `Oceano_y_cetaceos_GLB_REVISION`, con los archivos del usuario `humpback_whale_swimming.glb` (ballena jorobada, no azul) y `sperm_whale.glb`. Se conserva el mar descargado, la plataforma y la profundidad intermedia. Longitudes de referencia 16,7 y 18,2 m; escala métrica. Jorobada con clip nativo; cachalote con rig de cuatro huesos y ciclo de cola añadido. Ambos siguen trayectorias suaves orientadas al avance, con variación vertical de ±1,2 m alrededor de Z=-31,02 y -33,42 m. Los animales procedurales se excluyen solo de esta escena; ocho escenas previas conservadas. Leer `documentacion/cetaceos_descargados_revision_2026-10-20.md`. Copia independiente, fuentes, texturas, informes y renders en `exportaciones/cetaceos_descargados_REVISION_2026-10-20/`; archivo vigente `oceano_y_cetaceos_descargados_REVISION.blend`. Atribuciones: Connlan_Immure (CC BY 4.0) y CARI'MAM (CC BY-NC-SA 4.0), según metadatos recibidos; conservar estas condiciones en futuras adaptaciones. **Pendiente de revisión antes de cambiar la web.** Portal y React intactos.


## Superficie GLB descargada: render en Blender pendiente de revisión

El usuario proporcionó `free_ocean_simulation-tiled.glb` y pidió probar su superficie en Blender manteniendo los animales a media profundidad. Nueva escena independiente `Oceano_descargado_REVISION`, con geometría, texturas y animación originales del agua, repetida sin estirarla para cubrir 450 m. Se conservan ballena y cachalote alrededor de Z=-32 m, sus movimientos y la escala en metros. Siete escenas anteriores y archivo recibido intactos. Leer `documentacion/oceano_descargado_revision_2026-10-20.md`. Copia y tres renders en `exportaciones/oceano_descargado_REVISION_2026-10-20/`; archivo vigente de esta prueba: `oceano_descargado_con_cetaceos_REVISION.blend`. Atribución del recurso: the9thearl, CC BY 4.0, según los metadatos GLB. **Esperar revisión del usuario antes de incorporar a la web.** No se cambia el portal ni React.


## Mar: animales a media profundidad y ondas en los cuatro bordes

Copia Blender vigente: `exportaciones/mar_cetaceos_REVISION_2026-10-20/mar_y_cetaceos_REVISION_media_altura_ondas.blend`. Animales alrededor de Z=-32 m, entre fondo y plataforma, con nado horizontal y vertical suave. Cuatro bordes con ondas geométricas animadas, perfil suavizado y nuevas cámaras de revisión. Ver `documentacion/mar_cetaceos_revision_2026-10-20.md` y `media_altura_verificacion.json`. Se conservan escala en metros, seis escenas anteriores y copias previas. Pendiente de revisión del usuario; no exportar ni cambiar la web aún.


## Escala en metros verificada para la futura escena

Nueva copia: `exportaciones/mar_cetaceos_REVISION_2026-10-20/mar_y_cetaceos_REVISION_escala_metros.blend`. 1 unidad = 1 metro; ballena 16,712 m y cachalote 18,218 m, medidos en el modelado. Grupo independiente con origen y escala unitarios, mar en Z=0. Ver `documentacion/mar_cetaceos_revision_2026-10-20.md` y `escala_y_exportacion.json`. Pendiente de revisar antes de exportar; la web se conserva.


## Revisi?n pendiente: mar y cet?ceos en Blender ? 20 de octubre de 2026

El usuario rechaz? el acabado del mar web y pidi? crear primero en Blender agua con oleaje, ballenas y cachalotes para revisarlo. Escena nueva `Mar_y_cetaceos_REVISION`, con Ocean animado, ballena jorobada y cachalote 3D animados, tres c?maras y copia independiente guardada. Leer [mar_cetaceos_revision_2026-10-20.md](documentacion/mar_cetaceos_revision_2026-10-20.md). Las seis escenas anteriores se conservan. **Esperar revisi?n del usuario antes de exportar o cambiar la web.** El portal y React no se modifican en esta etapa.


## Mar natural con ondulaciones · 20 de octubre de 2026

El usuario pidió que el mar fuera más estético y rechazó la lámina porque parecía cristal. Esta revisión reemplaza ambos acabados anteriores (mancha difuminada y lámina con contorno) por una superficie amplia de agua azul marina, con ondulaciones animadas, variación de color y brillos suaves según la cámara. Se retira el contorno. La superficie se amplía doce veces respecto al plano original para extenderse fuera del encuadre habitual, sin modificar la cámara del modelo.

Se aplica a semisumergible, TLP y jacket. La transparencia base es del 30 %, con incremento moderado en ángulos rasantes y brillos; permite seguir viendo las partes sumergidas. Se utilizan dos ondas largas y dos ondulaciones finas para sombreado; el movimiento se actualiza durante el render del visor, sin bucles adicionales. Con movimiento reducido las ondas permanecen estáticas. La geometría se mantiene en 160 × 160 segmentos. Los niveles visuales siguen en 0, 3 y 45 m: son orientativos, no cotas medidas. El agua es decorativa, sin simulación hidrodinámica, cálculo de flotabilidad ni reflejo real del aerogenerador.

Implementación común en `scripts/mar_natural.js`, instalada mediante `scripts/agregar_mar_suave.py --instalar` en los tres `mar.js` de exportación y del portal. Se conservan modelos GLB, escenas Blender, encuadres, giro, controles, React, laboratorio y visor original. 62 archivos protegidos conservan su SHA-256.

Verificados los tres visores en navegador aislado: carga sin excepciones, giro, pausa, controles y anchura móvil. Revisión visual de las capturas; compilación Angular correcta, con el aviso previo de 52 bytes sobre el presupuesto CSS. Capturas generales, de detalle y móvil e informe en `respaldos/mar_natural_2026-10-20/`. Copia incremental y SHA-256 en `respaldos/correccion_mar_natural_2026-10-20.zip`. Se conservan todos los guardados anteriores. Para restaurar: recuperar primero el guardado completo y superponer los tres módulos de `portal/` sobre las rutas equivalentes del portal; `fuentes/` contiene las copias para exportación. No hay publicación ni subida a GitHub.


## Corrección de la lámina de mar · 20 de octubre de 2026

El usuario rechazó el difuminado porque parecía una mancha. Se sustituye por una lámina horizontal uniforme, azul suave al 13 % de opacidad, con contorno fino al 24 % y bordes definidos en semisumergible, TLP y jacket. Se mantiene la visibilidad de los componentes sumergidos. Esta revisión sustituye el acabado difuminado descrito anteriormente.

Solo cambia `mar.js` en los tres visores y el generador que lo conserva. Los niveles orientativos siguen en 0, 3 y 45 m respectivamente; no representan cotas medidas ni simulación hidrodinámica. Sin cambios en modelos, Blender, React, laboratorio o controles.

Verificación: tres visores cargados sin excepciones JavaScript; giro, pausa, controles y anchura móvil correctos. Capturas de conjunto, detalle y móvil e informe en `respaldos/mar_lamina_definida_2026-10-20/`. 62 archivos protegidos mantienen su SHA-256. Se conserva el guardado completo anterior y se añade una copia incremental `respaldos/correccion_mar_lamina_2026-10-20.zip`, con los módulos corregidos, sus versiones anteriores, documentación y scripts. Restaurar primero el guardado completo y después superponer los tres `mar.js` de `portal/` sobre las rutas equivalentes del portal; `fuentes/` contiene las copias de exportación. Sin publicación ni GitHub.


Guardado consolidado por petición del usuario: `respaldos/guardado_completo_2026-10-20/`, con ZIP del trabajo actual, modelos fuente, seis escenas de Blender, guía de restauración e inventario SHA-256. Leer [guardado_completo_2026-10-20.md](documentacion/guardado_completo_2026-10-20.md) y el informe de integridad dentro del respaldo. Conservar las copias anteriores. Sin publicación ni GitHub.

Última mejora: lámina azul muy suave para representar el **nivel del mar orientativo en los tres visores de plataformas**. Ver [mar_suave_visores_2026-10-20.md](documentacion/mar_suave_visores_2026-10-20.md). Semisumergible, TLP y jacket incorporan `mar.js` con transparencia y bordes difuminados; conservar visibilidad de las partes sumergidas. No cambian GLB, Blender, React, visor original ni laboratorio. Los niveles son ilustrativos, no cotas medidas.

Estado más reciente: el usuario **aprobó añadir la jacket**. Ya incorporada como tercer modelo en `#cimentacion-jacket`, con rotor animado, cuatro vistas y los controles habituales. Leer [jacket_web_2026-10-20.md](documentacion/jacket_web_2026-10-20.md). Resuelve la espera de revisión anterior. Se conservan semisumergible, TLP, explicación TLP, visor original, laboratorio y React. Sin publicación ni GitHub.

Última petición: **tercera estructura, cimentación jacket, primero solo en Blender**. Creada `Jacket_cimentacion_REVISION`, archivo independiente y tres vistas. Con cuatro patas, celosía en X, pilotes oscuros y aerogenerador original animado. Leer [jacket_revision_2026-10-20.md](documentacion/jacket_revision_2026-10-20.md). Esperar revisión y aprobación antes de exportar o añadir a la web. Semisumergible, TLP y portal conservados.

Última actualización: la segunda plataforma se identifica como **TLP (Tension Leg Platform)** por petición del usuario. Añadidas definición y fuentes primarias DOE/Sandia en el portal y nombre TLP en su visor. Ver [tlp_explicacion_web_2026-10-20.md](documentacion/tlp_explicacion_web_2026-10-20.md). Conservar el ancla `#plataforma-tensores`, los materiales, el giro y ambas plataformas. El anillo pertenece a la reconstrucción concreta, no a todas las TLP.

Estado más reciente: el usuario **aprobó y autorizó añadir la segunda plataforma**. Ya incorporada en el portal en `#plataforma-tensores`, dentro de Tipos de plataformas offshore, con materiales PBR mejorados y rotor animado. Leer [plataforma_tensores_web_2026-10-20.md](documentacion/plataforma_tensores_web_2026-10-20.md). Resuelve la espera de revisión de las entradas anteriores. Conservar las dos plataformas, el visor original, el laboratorio y React; sin publicación ni GitHub.

Última petición: **segunda plataforma a partir de tres fotos, primero solo en Blender para revisión**. Creada la escena `Plataforma_tensores_anillo_REVISION` con estructura amarilla, tensores verticales y anillo gris inferior; archivo y vistas independientes. Leer [plataforma_tensores_revision_2026-10-20.md](documentacion/plataforma_tensores_revision_2026-10-20.md). Esperar aprobación del usuario antes de exportar o añadir este segundo modelo a la web. La primera plataforma y todo el portal permanecen como estaban.

Última ampliación del 20 de octubre: el usuario autorizó **añadir**, sin sustituir nada, «Tipos de plataformas offshore» al portal Angular. Ya incorpora el conjunto flotante con aerogenerador original y palas animadas en `#plataformas-offshore`. Leer [plataformas_offshore_web_2026-10-20.md](documentacion/plataformas_offshore_web_2026-10-20.md). Esta autorización resuelve la restricción previa solo para el nuevo apartado independiente; conservar el visor anterior, el laboratorio, la portada y React. Sin publicación ni GitHub.

Última instrucción del 20 de octubre: el usuario confirmó la opción 1, **colocar en Blender el mástil y aerogenerador original sobre la nueva base flotante**, conservando esa base y los materiales mejorados. Ya está combinado en una nueva escena y en `flotante_con_aerogenerador_original.blend`; versiones anteriores conservadas. Leer [modelo_flotante_fotos_2026-10-20.md](documentacion/modelo_flotante_fotos_2026-10-20.md). No se ha sustituido ni importado nada a la web; la integración futura requiere una nueva petición.

Leer `documentacion/progreso_2026-10-14.md` para el último estado aprobado y `documentacion/AGENTS.md` para el contexto técnico y académico.

Hay dos proyectos distintos: esta carpeta contiene la aplicación 3D React (puerto 5177); la web con varias secciones que el usuario pidió es el portal Angular de `../AeroGenerador_Entrega_Completa/blender_portal_renderizaciones/portal_aerogenerador_angular` (puerto 4200). Leer también su AGENTS.md antes de modificarlo.

El usuario pidió guardar los avances y conservar el laboratorio animado de su captura. Los cambios globales de interactividad del portal se deshicieron; únicamente se recuperó ese bloque de simulación. No confundir una petición para el portal con otra para la aplicación 3D.

Mantener las credenciales ESIOS en archivos de entorno ignorados. Registrar las decisiones finales y verificaciones de nuevas sesiones en notas de progreso.

## Próxima sesión · 15 de octubre de 2026

El usuario pidió investigar y guardar tendencias de desgaste offshore para mañana. La búsqueda ya está hecha: leer `documentacion/para_manana_2026-10-15.md` y `documentacion/tendencias_offshore_desgaste_2026-10-15.md`. No hay búsqueda automática programada. Esta investigación no autoriza cambiar la interfaz ni reintroducir las modificaciones deshechas. La subida a GitHub continúa pendiente de autorización expresa.

## Actualización vigente · 18 de octubre de 2026

Estado actual y verificaciones en [Portada técnica del portal · 18 de octubre](documentacion/portada_tecnica_2026-10-18.md).

La imagen frontal de la portada Angular recibe un tratamiento de dibujo técnico mediante CSS y SVG; se conserva el render original. El ajuste se limita a esa imagen. El laboratorio animado, la interfaz restante y la aplicación 3D mantienen su implementación. No implica cambios de modelos matemáticos, ESIOS ni telemetría.

Para usar todo el proyecto deben arrancarse dos servidores: portal Angular en 4200 (`npm.cmd start -- --host 127.0.0.1 --port 4200` desde su carpeta) y React 3D en 5177 (`npm.cmd run dev` desde AeroGenerador). Se verificó la compilación del portal y se guardaron copias locales. No hay nueva publicación ni subida a GitHub.

## Estado vigente · 20 de octubre de 2026

Leer primero [progreso_2026-10-20.md](documentacion/progreso_2026-10-20.md) y [la integración Blender/web](documentacion/integracion_modelo_blender_web.md) para el estado más reciente.

El portal Angular (4200) incorpora «Modelo 3D» con el aerogenerador original de Blender. La aplicación React (5177) también usa ese modelo como turbina principal, manteniendo datos, dashboard, paneles SCADA, cámara, entorno marino y análisis mecánico. El giro sigue las rpm equivalentes; pitch y yaw se adaptan a los indicadores existentes. El Blender original, la portada técnica y el laboratorio aprobado se conservan. No hay simulación nueva de desgaste acumulado ni nueva publicación. Copias y verificaciones documentadas en las notas del día 20.

## Vista DEL · ampliación del 20 de octubre de 2026

Nueva vista ampliada [DEL y zonas de fatiga](documentacion/vista_del_2026-10-20.md) en http://localhost:5177/?vista=del, accesible también desde «DEL · Fatiga». Colorea el modelo Blender en rojo en raíces de pala, uniones superiores y base de torre; incluye tres acercamientos y restaura los materiales al salir. Es un mapa ilustrativo: **no se calcula DEL numérico ni daño medido** porque no hay historial de cargas individual. Mantener esta distinción en interfaz y documentación. No cambia el visor del portal, el laboratorio ni los servicios de datos. Copias y verificaciones en la nota específica.


## Base offshore · actualización del 20 de octubre de 2026

La aplicación React sustituye la base anterior por un monopilote con transición amarilla, plataforma de rejilla, barandillas, escalera y defensas de desembarco, tomando referencias offshore reales. Detalle normal: http://localhost:5177/?vista=base. Se conserva el modelo Blender, sus funciones y la vista DEL ilustrativa; el original `.blend` y el portal permanecen intactos. [Proporciones, fuentes, verificaciones y reversión](documentacion/base_offshore_2026-10-20.md). Copia del código en `respaldos/react_base_offshore_2026-10-20.zip`; sin nueva publicación.


## Predictivo y Rainflow / Cp / Ct · 20 de octubre de 2026

Se añaden dos vistas a la aplicación React: [Predictivo](http://localhost:5177/?vista=predictivo) y [Rainflow · Cp/Ct](http://localhost:5177/?vista=rainflow). La primera presenta seguimiento por componentes con estimaciones SCADA y selección ámbar, sin RUL ni fallos predichos. La segunda calcula potencia y empuje de un escenario editable y cuenta ciclos Rainflow de una señal sintética identificada. Se conservan el modelo Blender, la base offshore, DEL, el dashboard y el portal. [Supuestos, verificación y reversión](documentacion/predictivo_rainflow_2026-10-20.md). Copia en `respaldos/react_analisis_2026-10-20.zip`; sin nueva publicación.
## Publicación autorizada · 21 de octubre de 2026

El usuario solicita publicar el trabajo en GitHub y Vercel para ordenador y móvil. Esta autorización sustituye las restricciones anteriores de no publicar para esta entrega. Preparación conjunta: React en `/` y portal Angular en `/portal/`, con fuentes del portal en `portal/`. Ver `documentacion/publicacion_2026-10-21.md`. Conservar la instalación local hermana y los respaldos; credenciales solo en entorno de servidor. Registrar el estado final de la publicación en esa nota.
