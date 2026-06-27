# AeroGenerador - documentacion del proyecto

He desarrollado **AeroGenerador** como una aplicacion web interactiva con un aerogenerador 3D animado en Three.js y un dashboard inferior con datos agregados de generacion eolica en Espana.

## Autoria y apoyo de IA

Este proyecto lo he planteado, organizado y dirigido yo. Yo he definido la arquitectura general, la estructura de la aplicacion, la integracion de datos, el enfoque visual, la documentacion y las decisiones principales de desarrollo. He utilizado herramientas de IA como apoyo tecnico para acelerar tareas de redaccion, revision, depuracion y generacion de alternativas, pero la orquestacion del proyecto, la seleccion de tecnologias, la integracion final y los criterios de entrega son mios. Este trabajo esta destinado al **Departamento de Robotica de la Universidad Complutense de Madrid**.

## Que incluye

- Aerogenerador 3D en movimiento con aspas animadas.
- Escena ambiental con terreno, cielo, arboles, turbinas de fondo, particulas de viento y efectos de iluminacion.
- Dashboard inferior con datos de produccion eolica, factor de carga o porcentaje del mix cuando REData lo aporta, rpm estimadas, velocidad de punta de pala y ultimo dato recibido.
- Boton para minimizar el dashboard hacia abajo y dejar visible el aerogenerador completo, con tirador para recuperarlo.
- Conexion a datos reales mediante ESIOS, con respaldo publico de REData si ESIOS no responde.
- Modo de simulacion local si las APIs no responden.
- Modo "Analisis mecanico" activable desde un checkbox.
- Zonas de esfuerzo mecanico resaltadas en rojo/naranja.
- Flechas animadas para representar oscilacion, flexion y torsion.
- Fisica visual con Rapier Physics para dar mas inercia y amortiguacion a la oscilacion principal del aerogenerador.
- Panel SCADA con modo operativo, curva de potencia, rosa de viento, yaw, pitch, disponibilidad, alarmas, temperaturas, vibracion, estado de componentes e historico de carga.
- Detalle desplegable de potencia nominal/modo operativo, con medidor de carga, estados de operacion y flujo viento-rotor-red.
- Detalle desplegable de curva de potencia, con grafica dinamica, punto operativo, zonas cut-in/nominal/cut-out y flujo de potencia.
- Detalle desplegable de rosa de viento/yaw, con brujula tecnica, vector de viento, orientacion de gondola y arco de desalineacion.
- Detalle termico desplegable del gearbox al pulsar la tarjeta de temperaturas, con engranajes animados, zonas de friccion en rojo y tuberias transparentes de aceite.
- Detalle desplegable de pitch y condicion al pulsar su tarjeta, con rotor animado, raiz de pala resaltada y barras de estado por componente.
- Vista interna de la gondola con carcasa translucida, eje, rodamientos, engranajes, generador y bobinas.
- Etiquetas tecnicas en espanol: Buje motor, Torsion de pala, Oscilacion de la torre, Flexion lateral y Base y cimentacion.

## Desarrollo

```bash
npm install
npm run dev
```

## Abrir en localhost

Desde PowerShell o la terminal de VS Code, entra en la carpeta del proyecto y ejecuta:

```powershell
cd "C:\Users\rober\Desktop\Pracicas WEBS\AeroGenerador"
npm install
npm run dev
```

Cuando Vite termine de arrancar, abre esta direccion en el navegador:

```text
http://localhost:5177/
```

El puerto local esta fijado en `5177` por `package.json` y `vite.config.js`. Si el servidor ya esta abierto, basta con entrar directamente en `http://localhost:5177/`. Si aparece que el puerto esta ocupado, cierra la terminal anterior de Vite o deteniendo el proceso `node.exe` que dejo abierta esa sesion.

El token de ESIOS es opcional para abrir la app. Para datos ESIOS en tiempo real, crea o revisa el archivo `.env`:

```bash
VITE_ESIOS_API_KEY=tu_token_personal
```

La API key utilizada en el proyecto se consiguio solicitandola por correo electronico a ESIOS / Red Electrica, explicando que el uso era academico y que el trabajo estaba destinado al Departamento de Robotica de la Universidad Complutense de Madrid. El token real se mantiene privado y no se escribe en la documentacion.

Sin token, la app debe seguir abriendo en localhost y usara REData o simulacion local como respaldo.

La app usa proxies locales de Vite:

- `/ree-api` hacia `https://apidatos.ree.es`
- `/esios-api` hacia `https://api.esios.ree.es`
- `/open-meteo-api` hacia `https://api.open-meteo.com` queda disponible como recurso opcional, pero no alimenta el dashboard actual.

El dashboard actual toma como fuente maestra ESIOS. REData solo se usa como respaldo publico si ESIOS falla.

## Datos en tiempo real

Para conectar con el indicador ESIOS `551` de generacion eolica en tiempo real, crea un archivo `.env` con:

```bash
VITE_ESIOS_API_KEY=tu_token_personal
```

Sin token, la app cae automaticamente a REData publico diario y mantiene la animacion con datos reales agregados, pero con menor frecuencia temporal.

Con el token configurado, la app consulta ESIOS cada cinco minutos mediante el indicador `551`. En el dashboard, el ambito visible de generacion se muestra como `PenÃ­nsula`, que es el `geo_name` devuelto por ESIOS. ESIOS no entrega ubicacion de parques ni datos SCADA de un aerogenerador individual; por eso rpm, viento equivalente, yaw, pitch, temperaturas, vibracion y cargas mecanicas se calculan como estimaciones derivadas de la generacion real.

La calibracion actual normaliza la generacion eolica real contra una referencia de potencia eolica instalada en Espana de `31.679 MW`. Asi se calcula un factor de carga agregado:

```text
factor de carga = generacion eolica actual MW / 31.679 MW
```

Ese factor alimenta la animacion del rotor y las metricas equivalentes. La referencia visual de turbina tipo se calibra alrededor de `5 MW`, coherente con la escala Siemens Gamesa SG 5.0-145 usada en el proyecto. Cuando ESIOS es la fuente activa y no se dispone del total del sistema, el dashboard muestra `Factor carga`; cuando REData aporta total y porcentaje, puede mostrarse `Mix`.

## Panel ingenieril SCADA

El dashboard incluye una capa de indicadores derivados para dar una lectura mas profesional:

- Curva de potencia de una turbina tipo de 5 MW, calculada desde potencia ESIOS y viento equivalente.
- Rosa de viento con direccion equivalente y orientacion estimada de gondola.
- Desalineacion yaw y pitch estimado.
- Modo operativo: bajo cut-in, produccion parcial, potencia nominal, limitacion por equivalente alto o parada por seguridad.
- Disponibilidad estimada, alarmas tecnicas y estado por componentes.
- Temperaturas y vibracion estimadas.
- Historico local de carga mecanica durante la sesion.
- Vista interactiva de potencia nominal: se abre y se cierra pulsando la tarjeta `Modo operativo`.
- Vista interactiva de curva de potencia: se abre y se cierra pulsando la tarjeta `Curva de potencia`.
- Vista interactiva de rosa de viento/yaw: se abre y se cierra pulsando la tarjeta `Rosa de viento / yaw`.
- Vista interactiva de pitch y condicion: se abre y se cierra pulsando la tarjeta `Pitch y condicion`.
- Vista termica interactiva del gearbox: se abre y se cierra pulsando la tarjeta `Temperaturas`.

Estos indicadores son estimaciones visuales y didacticas derivadas de ESIOS. No sustituyen datos SCADA reales de un aerogenerador fisico. Las temperaturas y vibraciones se mantienen acotadas en rangos prudentes: gearbox 35-82 C, generador 38-92 C, aceite 32-72 C y vibracion 0,35-3,2 mm/s.

## Registro de avance

### 17 de junio de 2026

- Se refina la precision de las metricas derivadas para la entrega final.
- La generacion eolica real de ESIOS se normaliza contra `31.679 MW` de potencia eolica instalada de referencia.
- La tarjeta energetica distingue entre `Factor carga` cuando solo hay dato ESIOS de generacion eolica y `Mix` cuando REData aporta total del sistema.
- La turbina tipo de las estimaciones SCADA se calibra a `5 MW`, coherente con la referencia Siemens Gamesa SG 5.0-145.
- Las rpm estimadas se limitan a un rango mas realista para una turbina grande.
- Temperaturas y vibracion pasan a rangos acotados y mas defendibles para una visualizacion tecnica: gearbox 35-82 C, generador 38-92 C, aceite 32-72 C y vibracion 0,35-3,2 mm/s.
- Se crea y actualiza `resumeen para tutor.md` con la explicacion de ESIOS, API key, refresco cada cinco minutos y estimaciones matematicas.

### 31 de mayo de 2026

Queda documentado que el proyecto **AeroGenerador** tiene dos lineas de trabajo que deben conservarse juntas:

- **Aplicacion web interactiva**: proyecto Vite/React/Three.js con dashboard SCADA inferior, datos reales agregados de ESIOS/REData, animacion vinculada a la generacion eolica, paneles desplegables y fisica visual con `@react-three/rapier`.
- **Modelo Blender de referencia**: archivo principal `aerogenerador_modelado_escala_real_base_rectangular_nubes_azules.blend`, guardado en la raiz del proyecto, con el aerogenerador a escala real aproximada y paisaje base.

Estado consolidado de la aplicacion web:

- Servidor local habitual: `http://localhost:5177/`.
- Entrada principal: `src/main.jsx`.
- Escena principal: `src/components/WindTurbineScene.jsx`.
- Modelo 3D web generado por codigo: `src/components/WindTurbine.jsx`.
- Dashboard y paneles SCADA: `src/components/Dashboard.jsx`.
- Datos reales y derivados: `src/services/windDataService.js` y `src/hooks/useWindData.js`.
- Estilos visuales: `src/styles/index.css`.
- Fuente maestra de datos: ESIOS indicador `551` con ambito `Peninsula` cuando existe `VITE_ESIOS_API_KEY`.
- Respaldo sin token: REData / Red Electrica de Espana.
- Las variables que ESIOS no entrega directamente, como viento equivalente, yaw, pitch, temperaturas, vibracion y cargas, se calculan como equivalentes didacticos desde la generacion real agregada y se calibran con factor de carga sobre potencia eolica instalada.

Estado consolidado del modelo Blender:

- Archivo principal actual: `aerogenerador_modelado_escala_real_base_rectangular_nubes_azules.blend`.
- Si Blender abre el cubo por defecto o una escena antigua, cargar explicitamente ese archivo desde la raiz.
- Escala aproximada: 1 unidad Blender = 1 metro.
- Referencia dimensional: Siemens Gamesa SG 5.0-145.
- Medidas registradas: buje a 102,5 m, rotor aproximado de 144,76 m, gondola de 13,1 m x 5,12 m x 4,6 m, torre visible de 98,5 m y puerta de 1,05 m x 2,20 m.
- Estado visual: torre monolitica metalica satinada, base rectangular de cesped de 170 m x 125 m, nubes cercanas en tonos azules, sin camino marron, sin bandas rojas en puntas de palas y sin maqueta tecnica lateral.

Este registro sirve como punto de memoria del proyecto: el modelo web y el modelo `.blend` forman parte del mismo AeroGenerador, aunque uno se ejecuta en navegador y el otro se conserva como modelado Blender.

### 28 de mayo de 2026

- Token de ESIOS configurado y probado mediante el proxy local `/esios-api`.
- El dashboard queda definido como ESIOS-first: ESIOS indicador `551` es la fuente maestra para generacion eolica, fecha del dato, ambito `PenÃ­nsula` y estado de conexion.
- Se retira Tarifa/Open-Meteo como base visible del dashboard. Las variables que ESIOS no entrega directamente se muestran como equivalentes derivados de la generacion real.
- `useWindData` mantiene el polling cada cinco minutos para refrescar los datos.
- Las alarmas y paneles SCADA usan lenguaje de carga/equivalente derivado, no telemetria real de viento local.
- Se integra `@react-three/rapier` para mejorar la fisica visual de la animacion principal: masa, torque, rigidez y amortiguacion en la oscilacion del aerogenerador.
- Se crea [punto_retorno_pre_rapier.md](<./punto_retorno_pre_rapier.md>) para documentar como volver a la animacion anterior si el resultado no convence.

### 27 de mayo de 2026

Estado actual del proyecto:

- Aplicacion funcionando en Vite/React/Three.js con servidor local configurado en `http://localhost:5177/`.
- Escena 3D completa con aerogenerador principal, terreno, cielo, nubes, arboles, turbinas de fondo, particulas de viento y animacion de aspas.
- Sombras reforzadas en la escena principal, incluyendo sombra visible de las palas sobre el suelo.
- Dashboard inferior con datos agregados de generacion eolica de `PenÃ­nsula`, equivalentes derivados, rpm, punta de pala, ultimo dato y fuente de datos.
- Fuentes de datos configuradas:
  - ESIOS como fuente preferente para generacion eolica en tiempo real si se configura `VITE_ESIOS_API_KEY`.
  - REData como respaldo publico sin token.
  - Open-Meteo queda como recurso opcional disponible por proxy, pero no como fuente maestra del dashboard actual.
- Confirmado con el token de ESIOS: el indicador `551` devuelve `geo_name: PenÃ­nsula`; no devuelve parques eolicos ni aerogeneradores concretos.
- Proxies locales configurados en Vite para `/ree-api`, `/esios-api` y `/open-meteo-api`.
- Modo de simulacion local si las APIs fallan, para que la experiencia visual no quede bloqueada.
- Capa de analisis mecanico activable desde el dashboard, con zonas de esfuerzo, flechas, oscilacion, torsion, flexion y vista interna de gondola.
- Panel SCADA con tarjetas para modo operativo, curva de potencia, rosa de viento/yaw, pitch/condicion y temperaturas.
- Cada tarjeta SCADA principal abre una ventana desplegable del mismo tamano y proporcion:
  - `Modo operativo`: medidor de carga, estados de operacion y flujo viento-rotor-red.
  - `Curva de potencia`: grafica dinamica con punto operativo, zonas cut-in/parcial/nominal/cut-out y flujo de potencia.
  - `Rosa de viento / yaw`: brujula dinamica, vector de viento, orientacion de gondola, arco de error y movimiento de correccion.
  - `Pitch y condicion`: rotor animado, pitch de palas, raiz de pala resaltada y barras de condicion por componente.
  - `Temperaturas`: gearbox animado, engranajes, puntos de friccion y circuito transparente de aceite.
- Boton de minimizar dashboard: el panel inferior baja para dejar ver el aerogenerador completo y queda un tirador para volver a mostrarlo.
- Documentacion de reversion incluida para retirar por separado cada ventana desplegable, el panel SCADA o el minimizado del dashboard.
- Verificacion realizada con `npm run build`; la build compila correctamente. El aviso de bundle grande es esperado por el uso de Three.js.

Decisiones pendientes:

- Mantener el token personal de ESIOS en `.env` y no subirlo a repositorios.
- Evaluar fuentes electricas alternativas solo si se necesita un dato que ESIOS no entregue.
- Revisar visualmente si las ventanas SCADA actuales quedan demasiado cargadas o si conviene simplificar alguna animacion.

## Como volver atras

Si el panel SCADA nuevo no convence, los cambios estan concentrados en estos archivos:

- `src/services/windDataService.js`: funcion `deriveScadaMetrics` y calculos auxiliares.
- `src/hooks/useWindData.js`: historico local y union de datos SCADA al objeto `windData`.
- `src/components/Dashboard.jsx`: componentes visuales `AlarmList`, `PowerCurve`, `WindRose`, `HistoryLine`, `ComponentMatrix` y bloque `<section className="scada-panel">`.
- `src/components/Dashboard.jsx`: componentes `GearboxThermalPanel`, `PitchConditionPanel`, `WindYawPanel`, `PowerCurvePanel` y `OperationModePanel` si se quieren retirar solo los detalles desplegables.
- `src/components/WindTurbineScene.jsx`: envoltorio `<Physics>` de Rapier alrededor de la escena.
- `src/components/WindTurbine.jsx`: `RigidBody`, `CuboidCollider` y controlador de torque para la oscilacion fisica.
- `src/styles/index.css`: estilos de `.dashboard-collapse-toggle`, `.dashboard.collapsed`, `.scada-panel`, `.scada-card`, `.thermal-panel`, `.operation-*`, `.gauge-*`, `.power-*`, `.yaw-*`, `.pitch-*`, `.gearbox-*`, alarmas, curva, rosa de viento, componentes e historico.

Para volver a una version mas simple, elimina el bloque `scada-panel` del dashboard, quita la llamada a `deriveScadaMetrics` en `useWindData.js` y elimina los estilos SCADA. ESIOS y REData seguiran funcionando como fuentes electricas.

Para volver solo a la animacion anterior sin Rapier, seguir el documento [punto_retorno_pre_rapier.md](<./punto_retorno_pre_rapier.md>).

Para retirar solo la ventana termica, elimina `GearboxThermalPanel`, vuelve a cambiar el boton `thermal-trigger` por una tarjeta `div.scada-card` normal y borra los estilos `.thermal-*`, `.gearbox-*`, `.gear`, `.shaft`, `.bearing`, `.oil-*` y `.friction-*`.

Para retirar solo la ventana de pitch y condicion, elimina `PitchConditionPanel`, vuelve a cambiar el boton `pitch-trigger` por una tarjeta `div.scada-card` normal y borra los estilos `.pitch-*` y `.condition-*`.

Para retirar solo la ventana de rosa de viento/yaw, elimina `WindYawPanel`, vuelve a cambiar el boton `yaw-trigger` por una tarjeta `div.scada-card` normal y borra los estilos `.yaw-*`, `.compass-*`, `.wind-vector`, `.nacelle-vector`, `.legend-*`, `.ring-*` y `.axis-*`.

Para retirar solo la ventana de curva de potencia, elimina `PowerCurvePanel`, vuelve a cambiar el boton `power-trigger` por una tarjeta `div.scada-card` normal y borra los estilos `.power-*`, `.zone-*` y `.chart-card.power-trigger`.

Para retirar solo la ventana de potencia nominal, elimina `OperationModePanel`, vuelve a cambiar el boton `operation-trigger` por una tarjeta `div.scada-card` normal y borra los estilos `.operation-*`, `.gauge-*`, `.arc-*` y `.flow-*`.

Para retirar solo el minimizado del dashboard, elimina el estado `isDashboardCollapsed`, el boton `dashboard-collapse-toggle` y los estilos `.dashboard.collapsed` y `.dashboard-collapse-toggle`.

## Tareas pendientes

- Mantener la consulta ESIOS cada cinco minutos y verificar visualmente que el dashboard cambia cuando llega un nuevo dato.
- Evaluar si conviene anadir otras fuentes electricas, como ENTSO-E o Electricity Maps, sabiendo que normalmente requieren registro o token.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Documentacion

Consulta primero [indice_documentacion_entrega.md](<./indice_documentacion_entrega.md>) para ver el orden recomendado de lectura y que papel cumple cada documento de la entrega.

Para la justificacion academica principal del proyecto, consulta [motivacion_y_justificacion_del_proyecto.md](<./motivacion_y_justificacion_del_proyecto.md>).

Consulta tambien el documento [tecnologias usadas.md](<./tecnologias usadas.md>) para ver las tecnologias utilizadas en el proyecto y el papel de cada una.

Para explicar en detalle como uso la API key de ESIOS y como calculo rpm, viento equivalente, pitch, yaw, temperaturas, aceite, gearbox, vibracion y cada tarjeta del dashboard, consulta [explicacion_dashboard_esios_modelos_matematicos.md](<./explicacion_dashboard_esios_modelos_matematicos.md>).

Para usar una captura anotada del dashboard con flechas y explicacion de cada zona, consulta [figura_dashboard_anotado.md](<./figura_dashboard_anotado.md>).

Para mantenimiento, escalabilidad y explicacion del codigo creado, consulta [manual_tecnico_codigo_mantenimiento.md](<./manual_tecnico_codigo_mantenimiento.md>).

---

**Autor:** Robert Jesus Melendez Nuñez

