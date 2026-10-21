# Lámina suave de mar en los tres visores · 20 de octubre de 2026

El usuario pide una lámina de color muy suave para mostrar dónde estaría el mar en las tres animaciones de plataformas. Se añade a semisumergible, TLP y jacket, manteniendo visibles los elementos sumergidos.

## Resultado y alcance

- Plano horizontal azul claro con opacidad máxima del 13 % y bordes difuminados.
- Leyenda breve: «Azul tenue: nivel del mar orientativo».
- Niveles visuales en el sistema de coordenadas del modelo: semisumergible Z=0 m, TLP Z=3 m y jacket Z=45 m. En glTF corresponden al eje vertical Y. Son elecciones de presentación para las geometrías reconstruidas; no son cotas medidas, mareas ni cálculos de flotabilidad o calado.
- La malla está fuera de la jerarquía de la turbina y del cálculo del encuadre. No cambia cámaras, escalas, materiales del modelo, rigs ni movimiento.
- Transparencia por ambas caras y sin escritura de profundidad: se puede explorar por encima y por debajo. No se añade oleaje ni simulación hidrodinámica.

Solo se modifican `index.html` y `visor.js` de cada uno de los tres visores y se añade `mar.js` en cada carpeta. Fuentes en `exportaciones/plataformas_offshore_web/`, `exportaciones/plataforma_tensores_web/` y `exportaciones/jacket_web/`. Copias del portal en `public/assets/plataformas-offshore/`, `public/assets/plataforma-tensores/` y `public/assets/jacket/`.

No cambian los GLB, archivos Blender, aplicación React, visor original `#modelo3d`, laboratorio ni contenido académico. Los generadores de TLP y jacket conservan el módulo nuevo y sus niveles al regenerar las fuentes.

## Verificación y copia

Compilación Angular correcta; se mantiene el aviso anterior de 52 bytes sobre el presupuesto de estilos, sin cambios en esos estilos. Verificación de los tres visores en navegador aislado: nivel y transparencia, controles, giro y pausa, leyenda y anchura móvil. Capturas de conjunto, detalle y móvil en `respaldos/mar_suave_2026-10-20/`; informe `verificacion.json`. La revisión gráfica usa Chrome con SwiftShader y permite tiempo para compilar los materiales antes de medir movimiento.

62 archivos protegidos conservan su SHA-256, incluidos modelos, estilos, materiales servidos, fuente Angular/React y visor original. Copias previas de los seis archivos modificados y manifiesto en esa misma carpeta.

Scripts: `scripts/agregar_mar_suave.py` (prepara fuentes; `--instalar` sincroniza los tres visores), `scripts/verify_mar_suave.mjs` y `scripts/finalizar_mar_suave.py`. Copia posterior `respaldos/portal_mar_suave_2026-10-20.zip` y SHA-256; contiene código, configuración y los cuatro visores, sin medios históricos, dependencias, perfiles del navegador ni credenciales. Para restaurar todo el portal deben conservarse también los vídeos y papers existentes.

Acceso: http://localhost:4200/#plataformas-offshore, http://localhost:4200/#plataforma-tensores y http://localhost:4200/#cimentacion-jacket. Sin publicación ni subida a GitHub.

## Corrección de la lámina de mar · 20 de octubre de 2026

El usuario rechazó el difuminado porque parecía una mancha. Se sustituye por una lámina horizontal uniforme, azul suave al 13 % de opacidad, con contorno fino al 24 % y bordes definidos en semisumergible, TLP y jacket. Se mantiene la visibilidad de los componentes sumergidos. Esta revisión sustituye el acabado difuminado descrito anteriormente.

Solo cambia `mar.js` en los tres visores y el generador que lo conserva. Los niveles orientativos siguen en 0, 3 y 45 m respectivamente; no representan cotas medidas ni simulación hidrodinámica. Sin cambios en modelos, Blender, React, laboratorio o controles.

Verificación: tres visores cargados sin excepciones JavaScript; giro, pausa, controles y anchura móvil correctos. Capturas de conjunto, detalle y móvil e informe en `respaldos/mar_lamina_definida_2026-10-20/`. 62 archivos protegidos mantienen su SHA-256. Se conserva el guardado completo anterior y se añade una copia incremental `respaldos/correccion_mar_lamina_2026-10-20.zip`, con los módulos corregidos, sus versiones anteriores, documentación y scripts. Restaurar primero el guardado completo y después superponer los tres `mar.js` de `portal/` sobre las rutas equivalentes del portal; `fuentes/` contiene las copias de exportación. Sin publicación ni GitHub.

## Mar natural con ondulaciones · 20 de octubre de 2026

El usuario pidió que el mar fuera más estético y rechazó la lámina porque parecía cristal. Esta revisión reemplaza ambos acabados anteriores (mancha difuminada y lámina con contorno) por una superficie amplia de agua azul marina, con ondulaciones animadas, variación de color y brillos suaves según la cámara. Se retira el contorno. La superficie se amplía doce veces respecto al plano original para extenderse fuera del encuadre habitual, sin modificar la cámara del modelo.

Se aplica a semisumergible, TLP y jacket. La transparencia base es del 30 %, con incremento moderado en ángulos rasantes y brillos; permite seguir viendo las partes sumergidas. Se utilizan dos ondas largas y dos ondulaciones finas para sombreado; el movimiento se actualiza durante el render del visor, sin bucles adicionales. Con movimiento reducido las ondas permanecen estáticas. La geometría se mantiene en 160 × 160 segmentos. Los niveles visuales siguen en 0, 3 y 45 m: son orientativos, no cotas medidas. El agua es decorativa, sin simulación hidrodinámica, cálculo de flotabilidad ni reflejo real del aerogenerador.

Implementación común en `scripts/mar_natural.js`, instalada mediante `scripts/agregar_mar_suave.py --instalar` en los tres `mar.js` de exportación y del portal. Se conservan modelos GLB, escenas Blender, encuadres, giro, controles, React, laboratorio y visor original. 62 archivos protegidos conservan su SHA-256.

Verificados los tres visores en navegador aislado: carga sin excepciones, giro, pausa, controles y anchura móvil. Revisión visual de las capturas; compilación Angular correcta, con el aviso previo de 52 bytes sobre el presupuesto CSS. Capturas generales, de detalle y móvil e informe en `respaldos/mar_natural_2026-10-20/`. Copia incremental y SHA-256 en `respaldos/correccion_mar_natural_2026-10-20.zip`. Se conservan todos los guardados anteriores. Para restaurar: recuperar primero el guardado completo y superponer los tres módulos de `portal/` sobre las rutas equivalentes del portal; `fuentes/` contiene las copias para exportación. No hay publicación ni subida a GitHub.
