# Guion base para video de redes sociales

## Autoria y destino academico

Este proyecto lo he planteado, organizado y desarrollado como autor. He definido la arquitectura general, la integracion de datos, la escena 3D, el dashboard, la documentacion y los criterios tecnicos de entrega. Este trabajo esta destinado al **Departamento de Robotica de la Universidad Complutense de Madrid**.

## Proyecto

He desarrollado una aplicacion web interactiva para visualizar un aerogenerador 3D en movimiento y un dashboard tecnico con datos reales de generacion eolica en Espana.

El objetivo del video es explicar de forma clara que no es solo una animacion: la escena 3D se conecta a una fuente real de datos electricos y transforma esos datos en una visualizacion comprensible, tecnica y atractiva.

## Mensaje principal

He desarrollado una aplicacion web que combina visualizacion 3D, datos reales del sistema electrico espanol y conceptos de monitorizacion industrial para representar el comportamiento de un aerogenerador.

La fuente principal de datos es e-sios, la plataforma de informacion del operador del sistema electrico de Red Electrica de Espana. Trabajo con un token real de acceso a la API e-sios, solicitado por correo electronico a ESIOS / Red Electrica y concedido para uso academico desde el entorno de robotica de la Universidad Complutense de Madrid.

Importante: los datos publicos de e-sios son datos agregados del sistema electrico, no telemetria directa de un aerogenerador concreto. Por eso, la produccion eolica, fecha del dato y ambito electrico son reales; mientras que rpm, cargas, yaw, pitch, temperaturas y vibraciones son estimaciones visuales derivadas de esos datos reales.

## Quien nos da los datos

Mi fuente principal es:

- Red Electrica de Espana / Redeia.
- Plataforma e-sios.
- API e-sios mediante token personal solicitado por correo electronico a ESIOS / Red Electrica.
- Indicador usado en la aplicacion: `551`, generacion eolica en tiempo real.
- Ambito devuelto por la API: `Peninsula`.

La API e-sios permite consultar indicadores por rango de fechas y usar truncado temporal, por ejemplo cada cinco minutos. La documentacion oficial muestra que las peticiones se realizan con cabeceras de tipo `Accept` y `x-api-key`.

En la aplicacion, el token se guarda en `.env` como:

```bash
VITE_ESIOS_API_KEY=token_personal
```

El token no debe mostrarse en el video, ni subirse a repositorios.

## Frase corta para el video

"Los datos no los estoy inventando: vienen de e-sios, la plataforma de Red Electrica de Espana. Uso un token real de API concedido para este trabajo academico, y con esos datos alimento una visualizacion 3D del comportamiento de un aerogenerador."

## Que tecnologias uso

### Frontend

- Vite: servidor de desarrollo, build y proxies hacia APIs externas.
- React: estructura de componentes de la aplicacion.
- Three.js: motor 3D para la escena, materiales, luces, sombras y animacion.
- @react-three/fiber: integracion de Three.js con React.
- @react-three/drei: utilidades 3D como cielo, entorno, nubes, textos y controles.
- Animacion visual con Three.js y `useFrame`: animacion visual para aportar inercia, oscilacion y amortiguacion a la oscilacion del aerogenerador.
- CSS propio: dashboard, paneles SCADA, animaciones, responsive y efectos visuales.
- Lucide React: iconos del dashboard.

### Datos

- ESIOS API: fuente principal real.
- REData / Red Electrica: respaldo si e-sios no responde.
- Polling cada cinco minutos desde el hook de datos.
- Variables derivadas para convertir la generacion real en una lectura visual ingenieril.

### Arquitectura de la app

- `src/services/windDataService.js`: consulta, normaliza y transforma los datos.
- `src/hooks/useWindData.js`: refresco automatico, historico local y errores.
- `src/components/WindTurbineScene.jsx`: escena 3D completa.
- `src/components/WindTurbine.jsx`: aerogenerador, rotor, palas, gondola y analisis mecanico.
- `src/components/Dashboard.jsx`: dashboard inferior, tarjetas SCADA y paneles desplegables.

## Parametros principales de la animacion

### Datos reales directos

- Generacion eolica agregada en MW.
- Fecha y hora del ultimo dato recibido.
- Ambito electrico: Peninsula.
- Fuente de conexion: ESIOS o REData si hay fallback.

### Parametros calculados desde ESIOS

- Potencia normalizada.
- Velocidad de giro del rotor en rpm.
- Velocidad de punta de pala.
- Viento equivalente.
- Variacion equivalente de carga.
- Oscilacion de torre.
- Torsion de torre.
- Flexion en la base de pala.
- Carga mecanica.
- Modo operativo.
- Curva de potencia estimada.
- Yaw y orientacion de gondola estimados.
- Pitch estimado.
- Temperatura de gearbox, aceite y generador.
- Vibracion estimada.
- Estado de componentes: palas, buje, gearbox, generador y torre.

## Que se ve en pantalla

- Aerogenerador 3D con aspas en movimiento.
- Escena ambiental con terreno, cielo, nubes, turbinas de fondo y particulas de viento.
- Sombra de torre y palas sobre el suelo.
- Dashboard inferior con datos electricos reales y valores derivados.
- Boton para minimizar el dashboard y ver el molino completo.
- Panel de analisis mecanico con zonas de tension y vista interna.
- Paneles desplegables:
  - Potencia nominal.
  - Curva de potencia.
  - Rosa de viento / yaw.
  - Pitch y condicion.
  - Temperaturas de gearbox, aceite y generador.

## Para que podria servir cientificamente

La aplicacion puede servir como prototipo educativo y experimental de visualizacion para energia eolica. No sustituye un sistema SCADA real, pero si demuestra como transformar datos energeticos reales en una interfaz de interpretacion tecnica.

Usos posibles:

- Docencia en robotica, energia eolica, automatizacion y sistemas ciberfisicos.
- Explicacion visual de como cambia la produccion eolica agregada en tiempo real.
- Entrenamiento conceptual sobre dashboards industriales y sistemas SCADA.
- Prototipo inicial de gemelo digital visual, donde un modelo 3D se actualiza con datos reales.
- Exploracion de relaciones entre potencia, carga mecanica, rpm y estado estimado de componentes.
- Base para futuras investigaciones con datos SCADA reales de turbinas individuales.
- Interfaz para mantenimiento predictivo si en el futuro se conecta a sensores reales de vibracion, temperatura, pitch, yaw y generador.
- Herramienta divulgativa para explicar la transicion energetica y la integracion de renovables en el sistema electrico.

La literatura tecnica sobre aerogeneradores indica que los datos SCADA se usan cada vez mas para monitorizacion de condicion, deteccion temprana de fallos, diagnostico, mantenimiento predictivo y optimizacion operativa. Mi aplicacion va en esa direccion a nivel visual y academico: conecta datos reales, los transforma en indicadores y los representa en un entorno 3D comprensible.

## Limites que conviene decir con honestidad

- No estamos leyendo sensores internos de un molino real.
- ESIOS no nos da temperaturas, vibraciones, yaw o pitch de una turbina concreta.
- Esos valores son estimaciones derivadas para visualizar un comportamiento plausible.
- La parte real es la generacion eolica agregada del sistema electrico.
- Para convertirlo en un gemelo digital industrial real harian falta datos SCADA de turbinas reales o sensores fisicos.

Esta honestidad hace que el proyecto sea mas serio: muestro lo que es real, lo que es derivado y lo que podria crecer en una siguiente fase.

## Estructura sugerida del video

### 1. Inicio visual

"Este aerogenerador no es solo una animacion. Esta conectado a datos reales del sistema electrico espanol."

Mostrar la escena 3D con el molino girando y el dashboard inferior.

### 2. Fuente de datos

"La fuente principal es e-sios, la plataforma de Red Electrica de Espana. Uso un token real de API concedido para este trabajo academico desde el entorno de robotica de la Universidad Complutense de Madrid."

Mostrar el dashboard con `ESIOS`, `Peninsula` y el ultimo dato.

### 3. Tecnologia

"La web esta desarrollada con React, Vite y Three.js. Three.js nos permite construir el molino, las palas, las sombras y la animacion 3D; React gestiona el dashboard y los paneles tecnicos."

Mostrar cambio entre dashboard, molino, paneles y analisis mecanico.

### 4. Parametros tecnicos

"A partir de la generacion eolica real calculamos rpm, velocidad de punta de pala, carga mecanica, curva de potencia, pitch, yaw, temperaturas estimadas y estado de componentes."

Mostrar las tarjetas SCADA y abrir algunos paneles.

### 5. Utilidad cientifica

"Este tipo de visualizacion puede servir para docencia, investigacion, prototipos de gemelo digital y futuras herramientas de mantenimiento predictivo. La idea es convertir datos complejos en una lectura visual que ayude a entender el comportamiento de sistemas eolicos."

Mostrar la vista interna de la gondola y las zonas de esfuerzo.

### 6. Cierre

"Es un primer paso hacia una interfaz donde datos reales, simulacion 3D e ingenieria se encuentran en una misma pantalla."

## Texto corto para publicacion

Proyecto academico de visualizacion eolica en tiempo real.

He desarrollado una aplicacion web con React, Vite y Three.js que representa un aerogenerador 3D conectado a datos reales de generacion eolica procedentes de e-sios, la plataforma de Red Electrica de Espana.

La app usa un token real de API concedido para uso academico dentro del entorno de robotica de la Universidad Complutense de Madrid. Con esos datos reales del sistema electrico calculo parametros visuales derivados como rpm, carga mecanica, curva de potencia, yaw, pitch, temperaturas y vibracion estimada.

No es telemetria de una turbina individual: es un prototipo de visualizacion tecnica y educativa que abre la puerta a futuros gemelos digitales, monitorizacion industrial y mantenimiento predictivo.

## Hashtags sugeridos

#EnergiaEolica #ThreeJS #ReactJS #DigitalTwin #Robotica #UCM #RedElectrica #ESIOS #RenewableEnergy #SCADA #Ingenieria #WebDevelopment

## Fuentes consultadas

- Documentacion oficial de API e-sios: https://api.esios.ree.es/doc/index.html
- Ejemplo oficial de consulta de indicadores e-sios por rango temporal: https://api.esios.ree.es/doc/indicator/getting_a_specific_indicator_filtering_values_by_a_date_range.html
- Red Electrica sobre e-sios como plataforma publica del operador del sistema: https://www.ree.es/es/sala-de-prensa/notas-de-prensa/2015/07/red-electrica-lanza-una-nueva-version-de-la-web-publica-del-esios
- Portal e-sios de generacion y consumo: https://www.esios.ree.es/es/generacion-y-consumo
- Revision sobre monitorizacion de condicion en aerogeneradores usando SCADA: https://repository.lboro.ac.uk/articles/journal_contribution/Using_SCADA_data_for_wind_turbine_condition_monitoring_-_a_review/9561752
- Revision reciente sobre condition monitoring con SCADA en aerogeneradores: https://www.sciencedirect.com/science/article/pii/S0951832025010385
- Articulo sobre monitorizacion y deteccion de fallos con datos SCADA: https://www.sciencedirect.com/science/article/pii/S0960148117305931

---

**Autor:** Robert Jesus Melendez Nunez



