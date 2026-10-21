# Integración del modelo Blender en la web · 20 de octubre de 2026

## Resultado aprobado y alcance

El portal Angular incorpora un apartado **Modelo 3D** con el aerogenerador de Blender, órbita, zoom, pausa, velocidad, vistas General/Rotor/Góndola y reproducción del pitch original. Después de verlo y aprobarlo, el usuario autorizó sustituir también el aerogenerador principal de la aplicación React por ese mismo modelo, conservando las funcionalidades.

La aplicación React ahora carga `public/models/aerogenerador.glb`: geometría y materiales exportados del archivo `../Proyecto_blender/aerogenerador_desplazado_de_base_COPIA_TRABAJO.blend`. El archivo original no se modificó; su SHA-256 coincide con el manifiesto `public/models/procedencia.json`.

## Dos experiencias independientes

| Proyecto | URL local | Arranque |
| --- | --- | --- |
| Portal Angular, presentación y visor Blender | http://localhost:4200/#modelo3d | `npm.cmd start -- --host 127.0.0.1 --port 4200` desde la carpeta Angular |
| Aplicación React, ESIOS y análisis mecánico | http://localhost:5177/ | `npm.cmd run dev` desde AeroGenerador |

El visor del portal usa una copia local de Three.js 0.181.2, sus módulos y licencia MIT en `public/assets/modelo3d/vendor`. Funciona sin CDN. La aplicación usa sus dependencias existentes React Three Fiber / Drei / Three.js; no se han añadido paquetes. Mantener ambos servidores si se usa el enlace «Abrir aplicación» del portal.

## Comportamiento de la aplicación React

- Se conserva el dashboard, datos ESIOS/REData, refresco, cálculos, alarmas y cinco paneles SCADA: potencia nominal, curva de potencia, yaw, pitch/condición y térmico.
- El giro usa las rpm equivalentes actuales y mantiene la suavización y ganancia visual 1,65 anteriores. No se reproduce un bucle de velocidad constante independiente de los datos.
- El pitch usa las pistas de transformación originales de Blender. Se calibra el tiempo de muestreo según el ángulo solicitado para respetar la interpolación de Blender; una petición de 20° produce aproximadamente 20°, en lugar de mapear linealmente el tiempo.
- El yaw gira la góndola, rotor y accesorios superiores alrededor de la torre, siguiendo la desalineación equivalente del SCADA. No representa un rumbo geográfico medido de una turbina individual. La torre permanece fija respecto a ese giro.
- Se conserva la oscilación y torsión visual de torre; la flexión de palas se representa con una deformación de vértices gobernada por la estimación mecánica.
- «Análisis mecánico» mantiene flechas, etiquetas, zonas de esfuerzo y marcadores de raíces. La carcasa de la góndola se vuelve translúcida y el corte de eje/engranajes/generador existente se adapta al volumen del modelo importado. Ese interior es una representación didáctica añadida, no una nueva medición ni un interior detallado extraído de Blender.
- La baliza usa la pieza del propio modelo; se retira de la escena principal la baliza procedural antigua para evitar una luz flotante duplicada.
- Se conservan mar, cimentación, barco, turbinas de fondo, atmósfera, cámara de rotor, recorrido, órbita, zoom y dashboard minimizable. El encuadre general se adapta al tamaño y a la proporción de pantalla para mostrar el conjunto.
- La carga del GLB muestra un estado de progreso. Si falla ese recurso, un límite de errores recupera el modelo procedural anterior y mantiene el resto de la aplicación.

Los datos mecánicos continúan siendo estimaciones didácticas desde generación agregada. No se ha implementado aún un modelo de desgaste acumulado ni una predicción de vida útil. La idea de visualizar deterioro con el tiempo sigue siendo un trabajo posterior.

## Modelo, escala y rendimiento

El GLB pesa 14.220.004 bytes. Conserva 1.435 nodos y 448 pistas de transformación repartidas en clips exportados; el adaptador reúne sus pistas por nombre. Se omiten paisaje, nubes, mar y espuma de Blender para reutilizar el entorno de la web.

La escala interna es `5.2 / 102.5`, con una escala exterior 1,2, de modo que el buje queda a la altura de cámara anterior de 6,24 unidades. Se centra el modelo usando el eje de la torre. Los detalles estáticos se agrupan por padre, material y atributos de geometría, manteniendo los nodos animados y el rig; pasan de 1.437 mallas renderizables a 276. Cada instancia clona materiales y conserva el recurso GLTF en caché sin modificarlo. Los recursos propios se liberan al desmontar.

## Archivos de mantenimiento

- `src/components/BlenderWindTurbine.jsx`: integración React, oscilación y análisis.
- `src/components/blenderTurbineModel.js`: preparación, optimización, muestreo de pitch, rotor, yaw y liberación.
- `src/components/WindTurbineScene.jsx`: modelo principal, carga/respaldo y encuadre. El modelo antiguo sigue disponible para respaldo y turbinas de horizonte.
- `src/components/WindTurbine.jsx`: modelo procedural conservado; expone las capas de esfuerzo y el corte interno con posición/escala adaptables.
- `public/models/`: GLB y procedencia.
- `scripts/export_blender_web.py`: exportación en proceso Blender independiente; nunca guarda el `.blend` original.
- `scripts/install_blender_viewer.py`: instala el visor local del portal. Solo ejecutarlo para cambios del portal, con acceso a su carpeta hermana.
- `scripts/verify_blender_react.mjs` y `scripts/verify_react_browser.mjs`: comprobaciones del adaptador y de la aplicación en navegador. La segunda usa una instancia local Chrome de pruebas con CDP en 9333.
- `exportaciones/modelo_blender_web/`: fuentes del visor independiente y copia de la exportación.

## Verificaciones

- Compilación de producción React correcta; permanece el aviso de tamaño del paquete principal de Three.js. No es un fallo de compilación.
- Compilación Angular correcta tras añadir el apartado del visor; su laboratorio se conserva por SHA-256.
- Prueba del adaptador: giro, parada a cero rpm, ángulo de pitch de 20°, yaw sin girar la torre, independencia de materiales entre instancias y transparencia del análisis.
- Prueba del navegador: modelo Blender montado, ausencia de excepciones JavaScript, siete tarjetas de datos, tres controles de cámara, recorrido y cinco paneles SCADA.
- Análisis mecánico activado, dashboard minimizable y capturas de escritorio y móvil a 390 píxeles. Sin desbordamiento horizontal en la comprobación móvil. No se ha probado un dispositivo físico ni una sesión prolongada de rendimiento.
- El visor Angular se verificó con pausa real de imagen, pitch animado, controles, integración por iframe y diseño móvil a 390 píxeles.
- Capturas e informes JSON en `respaldos/react_blender_2026-10-20/` y `respaldos/modelo3d_2026-10-20/`.

La comprobación de UI usa los datos que recibe la aplicación; no certifica la calidad de las estimaciones ni la disponibilidad futura de APIs externas. Los servicios de datos, el hook de actualización y Dashboard no se modificaron.

## Guardado y reversión

Antes de sustituir el modelo se guardaron los componentes anteriores en `respaldos/react_blender_2026-10-20/`. Restaurar `WindTurbine.jsx` y `WindTurbineScene.jsx` desde esa carpeta devuelve la aplicación al modelo anterior sin tocar dashboard ni fuentes de datos. El visor del portal tiene sus copias independientes en `respaldos/modelo3d_2026-10-20/`.

Se guardan archivos de código `respaldos/react_blender_2026-10-20.zip` y `respaldos/portal_angular_2026-10-20.zip`, cada uno con SHA-256. El ZIP React incluye fuentes, configuración, modelos y documentación, sin dependencias, dist ni secretos. El ZIP Angular incluye fuentes, configuración, notas y los nuevos assets del visor 3D, pero excluye los vídeos, papers y renders previos de `public/assets`; conservar esos medios originales para restaurar el portal completo.

No se ha publicado en Vercel ni subido a GitHub. Las credenciales permanecen en archivos de entorno ignorados. La portada técnica del día 18 y el laboratorio aprobado se conservan.

## Vista DEL · ampliación del 20 de octubre de 2026

Nueva vista ampliada [DEL y zonas de fatiga](vista_del_2026-10-20.md) en http://localhost:5177/?vista=del, accesible también desde «DEL · Fatiga». Colorea el modelo Blender en rojo en raíces de pala, uniones superiores y base de torre; incluye tres acercamientos y restaura los materiales al salir. Es un mapa ilustrativo: **no se calcula DEL numérico ni daño medido** porque no hay historial de cargas individual. Mantener esta distinción en interfaz y documentación. No cambia el visor del portal, el laboratorio ni los servicios de datos. Copias y verificaciones en la nota específica.


## Base offshore · actualización del 20 de octubre de 2026

La aplicación React sustituye la base anterior por un monopilote con transición amarilla, plataforma de rejilla, barandillas, escalera y defensas de desembarco, tomando referencias offshore reales. Detalle normal: http://localhost:5177/?vista=base. Se conserva el modelo Blender, sus funciones y la vista DEL ilustrativa; el original `.blend` y el portal permanecen intactos. [Proporciones, fuentes, verificaciones y reversión](base_offshore_2026-10-20.md). Copia del código en `respaldos/react_base_offshore_2026-10-20.zip`; sin nueva publicación.


## Predictivo y Rainflow / Cp / Ct · 20 de octubre de 2026

Se añaden dos vistas a la aplicación React: [Predictivo](http://localhost:5177/?vista=predictivo) y [Rainflow · Cp/Ct](http://localhost:5177/?vista=rainflow). La primera presenta seguimiento por componentes con estimaciones SCADA y selección ámbar, sin RUL ni fallos predichos. La segunda calcula potencia y empuje de un escenario editable y cuenta ciclos Rainflow de una señal sintética identificada. Se conservan el modelo Blender, la base offshore, DEL, el dashboard y el portal. [Supuestos, verificación y reversión](predictivo_rainflow_2026-10-20.md). Copia en `respaldos/react_analisis_2026-10-20.zip`; sin nueva publicación.
