# AGENTS.md

## Autoria y destino academico

Este proyecto lo he planteado, organizado y desarrollado como autor. He definido la arquitectura general, la integracion de datos, la escena 3D, el dashboard, la documentacion y los criterios tecnicos de entrega. Este trabajo esta destinado al **Departamento de Robotica de la Universidad Complutense de Madrid**.

## Objetivo del proyecto

Crear una aplicacion web interactiva que muestre un aerogenerador 3D realista en movimiento usando Three.js, junto con un pequeno dashboard inferior que muestre metricas reales de produccion eolica en Espana.

La aplicacion debe representar visualmente un molino eolico funcionando. La velocidad de giro de las aspas debe cambiar segun datos reales obtenidos desde una API publica, preferiblemente Red Electrica de Espana / ESIOS.

Con el token personal de ESIOS configurado, la aplicacion consulta el indicador `551` de generacion eolica en tiempo real. La API devuelve el ambito `Peninsula`, no parques eolicos ni molinos concretos. El dashboard debe tomar ESIOS como fuente maestra; las variables que ESIOS no entrega directamente se calculan como equivalentes derivados de la generacion real.

## Idea principal

La persona que abra la aplicacion vera en pantalla:

- Un aerogenerador 3D realista.
- Aspas girando de forma suave.
- Terreno, cielo y ambiente visual.
- Un dashboard pequeno en la parte inferior.
- Un control para minimizar el dashboard hacia abajo y recuperar la vista completa del aerogenerador.
- Datos reales actualizados sobre produccion eolica.
- Animacion vinculada a esos datos.
- Un panel ingenieril tipo SCADA con indicadores derivados: modo operativo, curva de potencia, yaw, pitch, alarmas, temperaturas, vibracion, disponibilidad y estado de componentes.
- Una vista desplegable de potencia nominal/modo operativo al pulsar su tarjeta, con medidor de carga, estados de operacion y flujo viento-rotor-red.
- Una vista desplegable de curva de potencia al pulsar su tarjeta, con grafica dinamica, punto operativo, zonas de operacion y flujo de potencia.
- Una vista desplegable de rosa de viento/yaw al pulsar su tarjeta, con brujula tecnica, vector de viento, orientacion de gondola y arco de desalineacion.
- Una vista termica desplegable del gearbox y aceite al pulsar la tarjeta de temperaturas, con animacion tecnica y zonas de friccion resaltadas.
- Una vista desplegable de pitch y condicion al pulsar su tarjeta, con rotor animado, raiz de pala resaltada y barras de estado por componente.
- Animacion visual con Three.js para que la oscilacion principal del aerogenerador tenga inercia, oscilacion y amortiguacion visual.

## Importante sobre los datos

No se pretende representar un aerogenerador individual real, porque los datos publicos normalmente son agregados.

La aplicacion debe usar datos reales agregados, por ejemplo:

- Produccion eolica actual en Espana.
- Produccion eolica del sistema peninsular.
- Porcentaje de la eolica dentro del mix energetico.
- Hora del ultimo dato recibido.
- Estado aproximado de generacion.
- Generacion ESIOS con ambito `Peninsula`; viento equivalente, yaw, pitch, temperaturas y cargas calculadas desde esa generacion.

La animacion del aerogenerador sera una representacion visual basada en esos datos reales.

Los indicadores SCADA derivados son didacticos y estimados a partir de datos agregados de ESIOS/REData. No deben presentarse como telemetria real de un aerogenerador individual.

## Registro de avance actual

Fecha de registro: 17 de junio de 2026.

Estado de precision de datos para entrega:

- Se refina la capa de datos derivados para que sea mas defendible tecnicamente.
- La generacion eolica real de ESIOS indicador `551` se normaliza contra una referencia de potencia eolica instalada en Espana de `31.679 MW`.
- El dashboard distingue entre `Factor carga` cuando ESIOS aporta solo generacion eolica agregada y `Mix` cuando REData aporta porcentaje sobre el total del sistema.
- La turbina tipo usada para curva de potencia y equivalentes SCADA queda calibrada a `5 MW`, coherente con la referencia Siemens Gamesa SG 5.0-145 del modelo.
- Las rpm estimadas, temperaturas y vibracion quedan acotadas para evitar valores poco realistas.
- Rangos actuales de estimacion: gearbox 35-82 C, generador 38-92 C, aceite 32-72 C y vibracion 0,35-3,2 mm/s.
- Se creo y actualizo `resumen_para_tutor.md` con explicacion de ESIOS, API key, refresco cada cinco minutos e ingenieria inversa didactica.

Fecha de registro: 31 de mayo de 2026.

Estado consolidado:

- El proyecto se llama **AeroGenerador** y combina dos entregables: la aplicacion web en Vite/React/Three.js y el modelo Blender `.blend`.
- La app web incorpora Three.js, `@react-three/fiber`, `@react-three/drei`, Three.js y `useFrame`, dashboard SCADA, datos ESIOS/REData y animacion vinculada a generacion eolica agregada.
- El archivo Blender principal que debe recordarse es `aerogenerador_modelado_escala_real_base_rectangular_nubes_azules.blend`.
- Ambos avances deben mantenerse juntos en la documentacion: el navegador muestra la experiencia interactiva y Blender conserva el modelado de referencia a escala.

Fecha de registro: 28 de mayo de 2026.

Estado alcanzado:

- Aplicacion en Vite/React/Three.js funcionando en `http://localhost:5177/`.
- Datos conectados con ESIOS mediante token y REData como respaldo sin token.
- ESIOS indicador `551` probado correctamente; devuelve `geo_name: Peninsula`.
- Dashboard SCADA con metricas energeticas reales y metricas mecanicas/equivalentes derivadas de ESIOS.
- Ventanas desplegables uniformes para potencia nominal, curva de potencia, rosa de viento/yaw, pitch/condicion y temperaturas.
- Cada ventana tiene animacion propia y se puede cerrar o abrir desde su tarjeta.
- El dashboard puede minimizarse hacia abajo para ver el aerogenerador completo.
- La escena principal muestra sombras reforzadas, incluida la sombra visible de las palas sobre el suelo.
- La animacion principal integra Three.js y `useFrame` para mejorar la respuesta fisica visual. El punto de retorno anterior queda documentado en `nota_animacion_threejs.md`.
- La documentacion principal incluye instrucciones de reversion por modulo y tareas pendientes.
- Se creo el archivo raiz `tecnologias_resumen.md` como resumen directo de lenguajes, tecnologias, APIs, scripts, componentes y estado del proyecto.

Pendiente principal:

- Mantener el token personal de ESIOS en `.env` y no subirlo a repositorios.
- Revisar fuentes alternativas solo si se necesita una variable que ESIOS no entregue.

## Registro de modelado Blender

Fecha de registro: 30 de mayo de 2026.

Archivo Blender principal actual:

- `aerogenerador_modelado_escala_real_base_rectangular_nubes_azules.blend`

Este archivo queda como la version de referencia mas reciente del modelado. Si Blender se abre con el cubo por defecto o con una escena anterior, cargar explicitamente este `.blend` desde la raiz del proyecto.

Estado del modelado:

- Aerogenerador a escala real aproximada, usando 1 unidad Blender = 1 metro.
- Referencia contrastada: Siemens Gamesa SG 5.0-145, con rotor de 145 m, pala de 71 m y opcion de torre de 102,5 m de altura de buje.
- Medidas verificadas en el modelo:
  - Altura de buje: 102,5 m.
  - Diametro de rotor estimado: 144,76 m.
  - Gondola principal: 13,1 m de largo, 5,12 m de ancho y 4,6 m de alto.
  - Torre monolitica visible: 98,5 m de cuerpo hasta la zona de gondola/buje.
  - Puerta de acceso en base: 1,05 m de ancho por 2,20 m de alto.
- Torre convertida visualmente en un unico monolito metalico satinado, sin anillos ni divisiones visibles en el pilar.
- Base de paisaje cambiada a rectangulo limpio de cesped de 170 m x 125 m.
- Nubes recolocadas cerca del aerogenerador y coloreadas en tonos azules.
- Camino marron eliminado; el terreno debe leerse como cesped continuo.
- Banderitas/bandas rojas de las puntas de las palas eliminadas. La baliza roja de la gondola puede mantenerse como detalle realista si no molesta visualmente.
- Valore una maqueta lateral del interior de la gondola, pero finalmente decidi retirarla para mantener una entrega mas limpia. El archivo principal actual debe contener solo el aerogenerador y el paisaje base, sin maqueta tecnica lateral ni animacion de motor lateral.

Fuentes usadas para la escala:

- Siemens Gamesa SG 5.0-145: rotor 145 m, potencia 5 MW, palas 71 m, alturas de torre 90 / 102,5 / 127,5 m.
- NREL ATB Land-Based Wind: rangos modernos de turbinas terrestres con rotores de 148-196 m y alturas de buje de 100-140 m.

Archivos Blender importantes anteriores:

- `aerogenerador_modelado_escala_real_revisada.blend`: version con escala revisada antes de convertir la base a rectangulo.
- `aerogenerador_modelado_torre_monolito_puerta.blend`: version con torre monolitica y puerta, antes de la base rectangular.
- `aerogenerador_modelado_solo_aerogenerador.blend`: version limpia tras retirar la maqueta lateral de gondola.
- `aerogenerador_modelado_sin_camino_nubes_cerca.blend`: version con camino eliminado y nubes acercadas.

## Stack recomendado

Frontend:

- Vite
- React
- Three.js
- @react-three/fiber
- @react-three/drei
- Animacion visual con Three.js y `useFrame`
- Tailwind CSS

Backend opcional:

- Node.js
- Express
- Axios
- WebSocket o polling

API de datos:

- Red Electrica de Espana
- ESIOS API
- Open-Meteo API queda como recurso opcional, no como fuente activa del dashboard actual
- Otra API publica fiable si ESIOS requiere token

## Estructura deseada del proyecto

```text
wind-turbine-dashboard/
|-- AGENTS.md
|-- README.md
|-- package.json
|-- src/
|   |-- App.jsx
|   |-- main.jsx
|   |-- components/
|   |   |-- WindTurbineScene.jsx
|   |   |-- WindTurbine.jsx
|   |   |-- Dashboard.jsx
|   |   `-- LoadingScreen.jsx
|   |-- services/
|   |   `-- windDataService.js
|   |-- hooks/
|   |   `-- useWindData.js
|   `-- styles/
|       `-- index.css
`-- public/
```

---

**Autor:** Robert Jesus Melendez Nunez



