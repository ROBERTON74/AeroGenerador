# Tecnologias usadas

## Autoria y destino academico

Este proyecto lo he planteado, organizado y desarrollado como autor. He definido la arquitectura general, la integracion de datos, la escena 3D, el dashboard, la documentacion y los criterios tecnicos de entrega. Este trabajo esta destinado al **Departamento de Robotica de la Universidad Complutense de Madrid**.

En este documento resumo las tecnologias que he utilizado en el proyecto del aerogenerador 3D y para que uso cada una.

## Frontend

### Vite

Vite es la herramienta de desarrollo y build que he usado en el proyecto. La uso para arrancar el servidor local, servir la aplicacion durante el desarrollo y generar la version final optimizada con `npm run build`.

Tambien la uso para configurar proxies locales hacia las APIs externas:

- `/ree-api` para REData de Red Electrica.
- `/esios-api` para ESIOS.
- `/open-meteo-api` para Open-Meteo.

Open-Meteo queda configurado como recurso opcional, pero el dashboard actual no lo usa como fuente maestra.

### React

React es la base de la interfaz. Lo he usado para organizar la aplicacion en componentes reutilizables:

- `App.jsx`: coordina la escena 3D, el dashboard y el estado del checkbox de analisis mecanico.
- `Dashboard.jsx`: muestra las metricas energeticas y el control de analisis mecanico.
- `WindTurbineScene.jsx`: contiene la escena 3D completa.
- `WindTurbine.jsx`: modela el aerogenerador, las aspas, la gondola, el rotor y las visualizaciones mecanicas.

### Three.js

Three.js es el motor 3D que me permite crear geometria, materiales, luces, sombras, camaras y animaciones. En este proyecto lo uso para construir el aerogenerador y su entorno con piezas 3D generadas por codigo.

Se utiliza para:

- Torre, base, buje, palas y gondola.
- Union visual de palas con el buje central, sin saliente frontal del eje.
- Materiales metalicos, translucidos y emisivos.
- Sombras reales y sombra visual reforzada de las palas sobre el suelo.
- Flechas, anillos y zonas de esfuerzo.
- Vista interna de la gondola con eje, rodamientos, engranajes y generador.
- Movimiento de rotor, aspas, engranajes y bobinas.

### @react-three/fiber

`@react-three/fiber` conecta React con Three.js. Permite declarar objetos 3D como componentes React y usar `useFrame` para animar la escena en cada fotograma.

En el proyecto se usa para:

- Renderizar la escena dentro de un `Canvas`.
- Animar el giro de las aspas segun las rpm.
- Animar las flechas mecanicas y los elementos internos del generador.
- Aplicar oscilacion y torsion visual al aerogenerador.

### @react-three/drei

`@react-three/drei` aporta utilidades listas para escenas 3D con React Three Fiber.

En este proyecto se usa para:

- `OrbitControls`: control de camara.
- `Sky`: cielo procedimental.
- `Environment`: iluminacion ambiental.
- `Clouds` y `Cloud`: nubes.
- `Sparkles`: particulas ambientales.
- `Text`: etiquetas 3D en espanol para las partes mecanicas.

### Animacion visual con Three.js y useFrame

Three.js y `useFrame` integra animacion visual con Three.js dentro de React Three Fiber. Se usa para mejorar la dinamica visual del aerogenerador principal con un cuerpo rigido, inercia, oscilacion y amortiguacion visual.

En esta fase no calcula aerodinamica real ni datos SCADA industriales. Su funcion es convertir la carga derivada de ESIOS en una oscilacion visual con mas inercia y respuesta fisica.

### Tailwind CSS

Tailwind CSS esta instalado como parte del stack de estilos. La aplicacion combina la configuracion de Tailwind con CSS propio en `src/styles/index.css`.

El CSS propio se usa para:

- Layout de pantalla completa.
- Dashboard inferior.
- Minimizado del dashboard para despejar la escena 3D y ver el aerogenerador completo.
- Botones, estados, checkbox y barra de potencia.
- Adaptacion responsive para pantallas pequenas.

### Lucide React

`lucide-react` proporciona iconos SVG para la interfaz. Se usa en el dashboard para iconos como viento, ubicacion, estado de conexion y refresco de datos.

## Datos y servicios

### ESIOS API

Uso ESIOS como fuente preferente para datos de generacion eolica en tiempo real, mediante el indicador `551`.

Si configuro `VITE_ESIOS_API_KEY`, la aplicacion intenta consultar datos recientes de generacion eolica y vincularlos a la animacion del aerogenerador.

La API key no da acceso a sensores de un aerogenerador individual. Permite consultar el dato real agregado del sistema electrico. En este proyecto se usa el indicador `551`, que devuelve generacion eolica en tiempo real en MW y ambito `Peninsula`.

He programado la consulta para que se ejecute al abrir la aplicacion y despues cada cinco minutos desde `src/hooks/useWindData.js`:

```js
const POLL_INTERVAL = 5 * 60 * 1000;
```

### REData / Red Electrica de Espana

REData funciona como respaldo publico sin token. Si ESIOS no responde o no hay clave configurada, la aplicacion consulta la estructura de generacion diaria del sistema peninsular.

Estos datos se usan para mostrar:

- Produccion eolica en MW.
- Peso aproximado dentro del mix energetico cuando REData aporta total del sistema.
- Factor de carga sobre potencia eolica instalada cuando la fuente activa es ESIOS.
- Hora o fecha del ultimo dato.
- Estado aproximado de generacion.

### Open-Meteo

Open-Meteo queda como fuente meteorologica opcional sin API key. En el estado actual del proyecto no alimenta el dashboard principal, porque el objetivo es que todo el sistema trabaje con ESIOS como dato maestro.

Cuando se reactive como apoyo, esos datos no representaran produccion electrica en MW. El dashboard actual calcula estos equivalentes desde ESIOS:

- Velocidad visual del rotor.
- Viento a 80 m y 120 m.
- Variacion equivalente de carga.
- Direccion equivalente.
- Carga mecanica estimada desde la generacion real.

En la interfaz visible, el ambito de generacion se muestra como `Peninsula`, porque el indicador ESIOS `551` devuelve ese `geo_name`.

### Servicio local de datos

El archivo `src/services/windDataService.js` normaliza las respuestas de ESIOS y REData. Tambien lo uso para calcular valores derivados para la visualizacion:

- Factor de carga, calculado como generacion eolica actual dividida entre `31.679 MW` de potencia eolica instalada de referencia.
- Potencia normalizada.
- RPM estimadas.
- Carga mecanica aproximada.
- Oscilacion de torre.
- Torsion.
- Flexion de raiz de pala.
- Curva de potencia estimada para una turbina tipo de `5 MW`.
- Ventana interactiva de potencia nominal/modo operativo con medidor de carga, estados de operacion y flujo viento-rotor-red.
- Desalineacion yaw y pitch estimado.
- Ventana interactiva de curva de potencia con grafica dinamica, punto operativo, zonas de operacion y flujo de potencia.
- Temperaturas, vibracion, disponibilidad, alarmas y estado de componentes.
- Ventana interactiva de rosa de viento/yaw con brujula, vector de viento, orientacion de gondola y arco de error.
- Ventana termica interactiva del gearbox con engranajes animados, puntos de friccion y circuito de aceite.
- Ventana interactiva de pitch y condicion con rotor animado, raiz de pala resaltada y barras de estado por componente.

### Hook de datos

El archivo `src/hooks/useWindData.js` gestiona la carga de datos, errores, refresco manual y polling periodico.

Si las APIs fallan, se usa una simulacion local para mantener la experiencia visual funcionando.

Tambien mantiene un historico corto en memoria durante la sesion para pintar una tendencia de carga mecanica. Este historico no se guarda en disco ni se envia a ningun servicio externo.

## Visualizacion mecanica

El modo "Analisis mecanico" se activa desde el checkbox del dashboard.

Cuando esta activo:

- Se muestran zonas criticas con colores rojo y naranja.
- Aparecen flechas animadas para indicar esfuerzos y movimientos.
- La gondola se vuelve translucida.
- Se ve el interior del rotor/generador.
- Se muestran etiquetas tecnicas en espanol.

Las etiquetas finales son:

- Buje motor.
- Torsion de pala.
- Oscilacion de la torre.
- Flexion lateral.
- Base y cimentacion.

## Panel SCADA

El dashboard incorpora una capa visual inspirada en sistemas SCADA:

- Modo operativo del aerogenerador.
- Detalle desplegable para potencia nominal y modo operativo.
- Curva de potencia.
- Rosa de viento y yaw estimado.
- Pitch estimado.
- Disponibilidad estimada.
- Alarmas por variacion equivalente, carga mecanica o equivalente alto.
- Estado de componentes: palas, buje, gearbox, generador y torre.
- Temperaturas y vibracion estimadas.
- Detalle desplegable para curva de potencia.
- Detalle desplegable para rosa de viento y yaw.
- Detalle termico desplegable para el gearbox y el aceite.
- Detalle desplegable para pitch y condicion de componentes.

Estos valores son calculos didacticos a partir de datos agregados de ESIOS/REData. No representan telemetria real de una maquina concreta.

La calibracion actual intenta que las estimaciones sean mas defendibles para la entrega:

- La generacion real de ESIOS se normaliza contra `31.679 MW` de potencia eolica instalada de referencia.
- Las rpm se acotan a un rango mas realista para una turbina grande.
- La turbina tipo del panel SCADA se calibra a `5 MW`.
- Las temperaturas se limitan a rangos prudentes: gearbox 35-82 C, generador 38-92 C y aceite 32-72 C.
- La vibracion estimada queda acotada entre 0,35 mm/s y 3,2 mm/s.

## Modelo Blender

Ademas de la aplicacion web, conservo una linea de modelado en Blender.

Archivo principal de referencia:

- `aerogenerador_modelado_escala_real_base_rectangular_nubes_azules.blend`

Este `.blend` es la version de referencia documentada para el modelado del aerogenerador. Si Blender abre una escena vacia, el cubo por defecto o una version anterior, se debe cargar explicitamente este archivo desde la raiz del proyecto.

Estado registrado del modelo:

- Aerogenerador a escala real aproximada, usando 1 unidad Blender = 1 metro.
- Referencia de escala: Siemens Gamesa SG 5.0-145.
- Altura de buje: 102,5 m.
- Diametro de rotor estimado: 144,76 m.
- Gondola principal: 13,1 m de largo, 5,12 m de ancho y 4,6 m de alto.
- Torre visible: 98,5 m de cuerpo hasta la zona de gondola/buje.
- Puerta de acceso: 1,05 m de ancho por 2,20 m de alto.
- Base rectangular limpia de cesped: 170 m x 125 m.
- Torre como monolito metalico satinado, sin anillos visibles.
- Nubes cercanas recolocadas y coloreadas en tonos azules.
- Camino marron eliminado.
- Banderitas o bandas rojas de puntas de pala eliminadas.
- La maqueta lateral de interior de gondola fue retirada; el archivo principal debe contener solo el aerogenerador y el paisaje base.

Archivos Blender anteriores utiles como historial:

- `aerogenerador_modelado_escala_real_revisada.blend`
- `aerogenerador_modelado_torre_monolito_puerta.blend`
- `aerogenerador_modelado_solo_aerogenerador.blend`
- `aerogenerador_modelado_sin_camino_nubes_cerca.blend`

## Registro tecnico de avance

### 31 de mayo de 2026

Dejo registrado que AeroGenerador tiene dos entregables vivos:

- La aplicacion web que he desarrollado con Vite/React/Three.js, con dashboard SCADA, datos ESIOS/REData y animacion visual con Three.js.
- El archivo Blender `aerogenerador_modelado_escala_real_base_rectangular_nubes_azules.blend`, como modelo 3D de referencia fuera del navegador.

Ambos pertenecen al mismo proyecto y deben mantenerse documentados juntos para no perder el avance web ni el avance de modelado.

### 17 de junio de 2026

Se actualiza la capa de datos para mejorar la precision de la entrega final:

- Normalizacion de generacion eolica ESIOS contra `31.679 MW` de potencia eolica instalada de referencia.
- Tarjeta energetica `Factor carga` cuando ESIOS aporta solo generacion eolica y `Mix` cuando REData aporta porcentaje del sistema.
- Turbina tipo de `5 MW` para curva de potencia y paneles SCADA.
- Rango de rpm, temperaturas y vibracion ajustado para evitar valores poco defendibles.
- Documento `resumen_para_tutor.md` ampliado con el proceso de API key, refresco cada cinco minutos y estimaciones matematicas.

### 27 de mayo de 2026

Dejo registrado que el proyecto ya incluye:

- Servidor de desarrollo en puerto `5177` para evitar conflictos con otras aplicaciones.
- Integracion de Three.js y `useFrame` para fisica visual del aerogenerador principal.
- Proxies Vite para REData, ESIOS y Open-Meteo opcional.
- Token de ESIOS configurado en `.env` mediante `VITE_ESIOS_API_KEY`; prueba local correcta contra indicador `551`.
- La API ESIOS devuelve `geo_name: Peninsula` para el indicador usado, por lo que el dashboard ya no presenta Tarifa como lugar de generacion.
- Servicio de datos con normalizacion de generacion eolica, equivalentes derivados, carga mecanica y metricas SCADA derivadas.
- Hook `useWindData` con polling, refresco manual, manejo de errores, simulacion local e historico corto de carga.
- Escena Three.js con aerogenerador, entorno, animacion vinculada a datos, vista interna y modo de analisis mecanico.
- Dashboard con minimizado hacia abajo para despejar la vista del molino.
- Paneles desplegables uniformes para:
  - Potencia nominal / modo operativo.
  - Curva de potencia.
  - Rosa de viento / yaw.
  - Pitch y condicion.
  - Temperaturas de gearbox, aceite y generador.
- Cada panel tiene dimensiones comunes, animacion especifica y boton de cierre.
- Documentacion de reversion por modulo para poder volver atras sin rehacer todo el proyecto.
- Documento especifico `nota_animacion_threejs.md` para volver a la animacion anterior si Three.js no convence.

La ultima verificacion tecnica realizada fue `npm run build`, con compilacion correcta y aviso esperado de bundle grande por dependencias 3D.

### 28 de mayo de 2026

- ESIOS queda fijado como fuente maestra del dashboard.
- REData queda como respaldo si ESIOS no responde.
- Open-Meteo queda documentado como recurso opcional, no como fuente activa del dashboard principal.
- Las variables de viento equivalente, variacion, yaw, pitch, temperaturas, vibracion, disponibilidad y alarmas se calculan desde la generacion real devuelta por ESIOS.
- El dashboard ya no presenta Tarifa como lugar de datos; muestra `Peninsula`, que es el ambito devuelto por ESIOS.

## Reversion de la capa SCADA

Para retirar la capa SCADA sin afectar al resto de la aplicacion:

- Quitar `deriveScadaMetrics` y sus helpers de `src/services/windDataService.js`.
- Quitar el historico y la llamada a `deriveScadaMetrics` de `src/hooks/useWindData.js`.
- Quitar el bloque `<section className="scada-panel">` y los componentes auxiliares de `src/components/Dashboard.jsx`.
- Quitar los estilos `.scada-*`, `.alarm-*`, `.wind-rose`, `.power-curve`, `.component-*` y `.history-line` de `src/styles/index.css`.

Para retirar solamente la ventana termica del gearbox, quitar el componente `GearboxThermalPanel`, cambiar el boton `thermal-trigger` por una tarjeta normal y borrar los estilos `.thermal-*`, `.gearbox-*`, `.gear`, `.shaft`, `.bearing`, `.oil-*` y `.friction-*`.

Para retirar solamente la ventana de pitch y condicion, quitar el componente `PitchConditionPanel`, cambiar el boton `pitch-trigger` por una tarjeta normal y borrar los estilos `.pitch-*` y `.condition-*`.

Para retirar solamente la ventana de rosa de viento/yaw, quitar el componente `WindYawPanel`, cambiar el boton `yaw-trigger` por una tarjeta normal y borrar los estilos `.yaw-*`, `.compass-*`, `.wind-vector`, `.nacelle-vector`, `.legend-*`, `.ring-*` y `.axis-*`.

Para retirar solamente la ventana de curva de potencia, quitar el componente `PowerCurvePanel`, cambiar el boton `power-trigger` por una tarjeta normal y borrar los estilos `.power-*` y `.zone-*`.

Para retirar solamente la ventana de potencia nominal, quitar el componente `OperationModePanel`, cambiar el boton `operation-trigger` por una tarjeta normal y borrar los estilos `.operation-*`, `.gauge-*`, `.arc-*` y `.flow-*`.

Para retirar solamente el minimizado del dashboard, quitar el estado `isDashboardCollapsed`, el boton `dashboard-collapse-toggle` y los estilos `.dashboard.collapsed` y `.dashboard-collapse-toggle`.

## Herramientas de calidad

### npm scripts

El proyecto usa scripts de npm:

- `npm run dev`: servidor local de desarrollo.
- `npm run build`: compilacion de produccion.
- `npm run preview`: previsualizacion de la build.

### Build de Vite

La build se ha usado para verificar que los cambios compilan correctamente. El aviso de bundle grande es normal en este proyecto porque Three.js y las utilidades 3D ocupan bastante espacio.

## Manual de mantenimiento

Para que el proyecto pueda escalarse o mantenerse mas adelante, dejo preparado el documento [manual_tecnico_codigo_mantenimiento.md](<./manual_tecnico_codigo_mantenimiento.md>), donde explico la arquitectura, el flujo de datos, los puntos de cambio y las verificaciones necesarias antes de modificar la aplicacion.

---

**Autor:** Robert Jesus Melendez Nunez



