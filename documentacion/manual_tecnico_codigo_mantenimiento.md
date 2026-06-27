# Manual tecnico del codigo y mantenimiento

## Autoria y destino academico

Este proyecto lo he planteado, organizado y desarrollado como autor. He definido la arquitectura general, la integracion de datos, la escena 3D, el dashboard, la documentacion y los criterios tecnicos de entrega. Este trabajo esta destinado al **Departamento de Robotica de la Universidad Complutense de Madrid**.

Este trabajo esta destinado al **Departamento de Robotica de la Universidad Complutense de Madrid**, dentro de un contexto academico y de laboratorio de ingenieria. Este manual queda preparado para que el proyecto pueda mantenerse, revisarse o escalarse mas adelante.

## Objetivo de este manual

Este documento explica como esta construido el codigo de **AeroGenerador**, que papel cumple cada archivo importante y que pasos seguir si en el futuro se necesita:

- Mantener la aplicacion.
- Revisar errores.
- Cambiar la API de datos.
- Anadir nuevas metricas.
- Escalar el dashboard.
- Mejorar el modelo 3D.
- Sustituir estimaciones por sensores reales.
- Preparar una version mas avanzada para investigacion o laboratorio.

## Vision general de la arquitectura

La aplicacion sigue una arquitectura frontend basada en Vite, React y Three.js.

```text
index.html
  -> src/main.jsx
      -> src/App.jsx
          -> useWindData()
          -> WindTurbineScene
          -> Dashboard
```

La separacion principal es:

- `App.jsx`: une datos, escena 3D y dashboard.
- `useWindData.js`: gestiona la carga de datos, refresco automatico y fallback.
- `windDataService.js`: consulta APIs y calcula metricas derivadas.
- `WindTurbineScene.jsx`: construye la escena 3D completa.
- `WindTurbine.jsx`: construye y anima el aerogenerador.
- `Dashboard.jsx`: muestra las metricas, tarjetas SCADA y paneles desplegables.
- `index.css`: contiene toda la capa visual de interfaz, dashboard y animaciones CSS.

## Estructura principal de carpetas

```text
AeroGenerador/
|-- package.json
|-- vite.config.js
|-- index.html
|-- src/
|   |-- main.jsx
|   |-- App.jsx
|   |-- components/
|   |   |-- Dashboard.jsx
|   |   |-- LoadingScreen.jsx
|   |   |-- WindTurbine.jsx
|   |   `-- WindTurbineScene.jsx
|   |-- hooks/
|   |   `-- useWindData.js
|   |-- services/
|   |   `-- windDataService.js
|   `-- styles/
|       `-- index.css
|-- documentacion/
`-- .env
```

El archivo `.env` no debe subirse a repositorios publicos porque contiene la API key personal de ESIOS.

## Scripts disponibles

Los comandos principales estan definidos en `package.json`:

```bash
npm run dev
npm run build
npm run preview
```

Uso cada uno para:

- `npm run dev`: abrir la aplicacion en desarrollo en `http://localhost:5177/`.
- `npm run build`: comprobar que el proyecto compila para produccion.
- `npm run preview`: previsualizar la build generada.

El puerto de desarrollo esta fijado en `5177`.

## Variables de entorno

La conexion con ESIOS depende de:

```text
VITE_ESIOS_API_KEY=token_personal
```

La API key se consiguio solicitandola por correo electronico a ESIOS / Red Electrica, explicando que el uso era academico y que el proyecto estaba destinado al Departamento de Robotica de la Universidad Complutense de Madrid. La clave recibida es personal y no debe escribirse en documentacion publica ni subirse a repositorios.

Esta variable se lee desde `vite.config.js`. El proxy `/esios-api` anade la cabecera `x-api-key` a las peticiones hacia ESIOS.

## Proxies de Vite

En `vite.config.js` configure tres proxies:

```text
/ree-api         -> https://apidatos.ree.es
/esios-api       -> https://api.esios.ree.es
/open-meteo-api  -> https://api.open-meteo.com
```

El proxy mas importante es `/esios-api`, porque permite consultar ESIOS desde el navegador sin escribir directamente toda la llamada externa dentro de los componentes React.

## Flujo de datos completo

El flujo real de datos es:

```text
ESIOS indicador 551
  -> fetchEsiosRealtimeWind()
  -> normalizeEsiosResponse()
  -> createWindMetrics()
  -> applyEsiosDerivedOperationalContext()
  -> estimateMechanicalLoads()
  -> deriveScadaMetrics()
  -> Dashboard + WindTurbineScene
```

Si ESIOS falla:

```text
ESIOS falla
  -> REData como respaldo
  -> si tambien falla, simulacion local
```

Esto evita que la aplicacion quede vacia durante una presentacion.

## Hook de datos: useWindData.js

El archivo `src/hooks/useWindData.js` es responsable de:

- Lanzar una consulta inicial al abrir la aplicacion.
- Repetir la consulta cada cinco minutos.
- Guardar el estado `data`, `loading` y `error`.
- Ejecutar `refresh` manual cuando se pulsa el boton de actualizar.
- Mantener un historico corto de carga para la grafica del dashboard.
- Activar datos simulados si las APIs no responden.

El intervalo esta definido como:

```js
const POLL_INTERVAL = 5 * 60 * 1000;
```

Eso equivale a `300.000` milisegundos, es decir, cinco minutos.

## Servicio de datos: windDataService.js

Este es uno de los archivos mas importantes del proyecto.

Funciones principales:

- `fetchWindGeneration()`: funcion general para obtener datos.
- `fetchEsiosRealtimeWind()`: consulta ESIOS.
- `fetchReeDailyWind()`: consulta REData como respaldo.
- `normalizeEsiosResponse()`: transforma la respuesta de ESIOS a un formato usable.
- `normalizeGenerationResponse()`: transforma la respuesta de REData.
- `createWindMetrics()`: crea el objeto base de datos energeticos.
- `applyEsiosDerivedOperationalContext()`: anade contexto operacional derivado.
- `estimateMechanicalLoads()`: calcula cargas mecanicas visuales.
- `deriveScadaMetrics()`: calcula panel SCADA, temperaturas, yaw, pitch, vibracion y alarmas.
- `createFallbackWindData()`: genera datos locales si todo falla.

## Dato real y dato derivado

Es importante mantener esta separacion:

Dato real:

- Generacion eolica agregada en MW.
- Hora del ultimo dato.
- Ambito electrico.
- Fuente ESIOS indicador `551`.

Dato derivado:

- RPM.
- Viento equivalente.
- Carga mecanica.
- Oscilacion de torre.
- Torsion.
- Flexion de base de pala.
- Pitch.
- Yaw.
- Temperaturas.
- Vibracion.
- Alarmas.
- Disponibilidad.
- Estado de componentes.

Esto debe mantenerse claro en futuras ampliaciones para no presentar estimaciones como sensores reales.

## Calculo de factor de carga

La constante principal es:

```js
const SPANISH_WIND_INSTALLED_CAPACITY_MW = 31679;
```

La formula base es:

```text
factor de carga = generacion eolica ESIOS MW / 31.679 MW
```

Este factor se guarda como `normalizedPower` y `rotorPower`. Es la base que alimenta gran parte de la visualizacion.

## Calculo de RPM

Las rpm se estiman en `estimateRepresentativeRotorRpm()`:

```text
si factor de carga <= 0,01:
  rpm = 0
si hay produccion:
  rpm = 4,5 + sqrt(factor de carga) * 7,8
  rpm limitada entre 4,5 y 12,8
```

Esto permite representar una turbina grande de forma realista. No uso rpm industriales reales porque ESIOS no entrega ese dato.

## Calculo de viento equivalente

El viento equivalente se calcula desde `deriveEquivalentWindFromPower()`.

La idea es convertir una produccion energetica agregada en un viento visual coherente. Como la energia eolica se relaciona con el cubo de la velocidad del viento, el modelo usa una respuesta no lineal para que el aumento de potencia no sea simplemente lineal.

## Calculo de cargas mecanicas

La funcion `estimateMechanicalLoads()` calcula:

- `towerSwayDeg`: oscilacion de torre.
- `towerTorsionDeg`: torsion.
- `bladeRootFlexDeg`: flexion de raiz de pala.
- `mechanicalLoadPercent`: carga mecanica general.
- `state`: estado textual de carga.

Usa:

- Factor de carga.
- Generacion actual.
- Generacion anterior.
- Variacion equivalente.
- Rachas equivalentes si existen en el objeto meteorologico derivado.

## Calculo SCADA

La funcion `deriveScadaMetrics()` calcula la capa de dashboard ingenieril:

- Modo operativo.
- Viento equivalente en m/s.
- Direccion equivalente.
- Orientacion de gondola.
- Error yaw.
- Pitch.
- Curva de potencia.
- Potencia esperada en turbina tipo.
- Temperatura de gearbox.
- Temperatura de generador.
- Temperatura de aceite.
- Vibracion.
- Alarmas.
- Disponibilidad.
- Estado por componentes.

Esta funcion es el punto principal que habria que tocar si en el futuro se anaden nuevas variables tecnicas.

## Rangos termicos actuales

Los rangos estan acotados para evitar valores poco defendibles:

```text
Gearbox:   35-82 C
Generador: 38-92 C
Aceite:    32-72 C
Vibracion: 0,35-3,2 mm/s
```

Formulas actuales:

```text
gearbox = 38 + rotorPower * 22 + cargaMecanica * 0,08
generador = 42 + rotorPower * 27 + cargaMecanica * 0,10
aceite = 36 + rotorPower * 18 + cargaMecanica * 0,065
vibracion = 0,45 + rotorPower * 1,25 + variacion equivalente
```

Si se obtienen sensores reales, estas formulas deben sustituirse por lectura directa de datos.

## Componente App.jsx

`App.jsx` es el punto de union de la aplicacion:

```text
useWindData()
  -> data, loading, error, refresh

data
  -> WindTurbineScene
  -> Dashboard
```

Tambien mantiene el estado `showStressMap`, que activa o desactiva el analisis mecanico visual.

## Componente WindTurbineScene.jsx

Este archivo construye la escena 3D:

- Canvas de React Three Fiber.
- Camara.
- Luces.
- Cielo.
- Nubes.
- Terreno.
- Arboles.
- Aerogeneradores lejanos.
- Particulas de viento.
- Hologramas tecnicos sutiles.
- Aerogenerador principal.

El aerogenerador principal se llama asi:

```jsx
<WindTurbine rpm={rpm} power={power} showStressMap={showStressMap} mechanical={windData?.mechanical} />
```

Si en el futuro se quiere cambiar la escena completa, este es el archivo principal.

## Componente WindTurbine.jsx

Este archivo modela y anima el aerogenerador.

Incluye:

- Torre.
- Gondola.
- Buje.
- Palas.
- Sombra proyectada de las palas.
- Movimiento del rotor.
- Movimiento de torre.
- Modo de analisis mecanico.
- Vista interna de generador cuando se activa el analisis.
- Zonas de esfuerzo.

La animacion del rotor depende de:

```text
rpm -> velocidad angular -> rotation.z
```

Actualmente mantengo las rpm reales en el dashboard, pero uso un refuerzo visual suave para que el giro se perciba mejor en pantalla sin cambiar el dato tecnico mostrado.

## Componente Dashboard.jsx

Este archivo controla todo el panel inferior.

Partes principales:

- Tarjetas superiores de datos energeticos.
- Tarjetas de mecanica.
- Panel SCADA.
- Boton de analisis mecanico.
- Boton de minimizar.
- Boton de refresco.
- Panel desplegable de modo operativo.
- Panel desplegable de curva de potencia.
- Panel desplegable de rosa de viento/yaw.
- Panel desplegable de pitch y condicion.
- Panel desplegable de temperaturas.

Si se quiere anadir una nueva tarjeta:

1. Anadir el dato en `windDataService.js`.
2. Pasarlo dentro de `deriveScadaMetrics()`.
3. Leerlo desde `Dashboard.jsx`.
4. Crear la tarjeta visual.
5. Crear estilos en `index.css`.

## Estilos: index.css

El archivo `src/styles/index.css` contiene:

- Estilo global.
- Layout de pantalla completa.
- Dashboard inferior.
- Estados minimizados.
- Tarjetas SCADA.
- Paneles desplegables.
- Animaciones CSS.
- Responsive para pantallas pequenas.

Si se modifica la interfaz, hay que revisar especialmente:

- `.dashboard`
- `.stats-grid`
- `.mechanics-grid`
- `.scada-panel`
- `.scada-card`
- `.thermal-panel`
- `.pitch-panel`
- `.yaw-panel`
- `.power-panel`
- `.operation-panel`

## Como anadir una metrica nueva

Ejemplo: anadir `bearingTempC`.

1. Crear el calculo en `deriveScadaMetrics()`:

```js
const bearingTempC = clamp(...);
```

2. Devolverlo en el objeto SCADA:

```js
return {
  ...,
  bearingTempC,
};
```

3. Mostrarlo en `Dashboard.jsx`:

```jsx
<Stat label="Rodamiento" value={formatDecimal(scada?.bearingTempC, ' C')} detail="Estimado" />
```

4. Documentar si es real o derivado.

5. Ejecutar:

```bash
npm run build
```

## Como cambiar la fuente de datos

Si en el futuro se sustituye ESIOS o se anade otra API:

1. Crear una funcion nueva en `windDataService.js`.
2. Normalizar la respuesta para que devuelva el mismo formato que `createWindMetrics()`.
3. Mantener los campos:

```text
windMw
totalMw
share
rpm
normalizedPower
rotorPower
datetime
source
geoName
status
```

4. Integrarla en `fetchWindGeneration()`.
5. Mantener ESIOS como fuente maestra si sigue siendo el requisito del laboratorio.

## Como conectar sensores reales en el futuro

Si mas adelante el laboratorio conecta sensores reales o datos SCADA industriales, el cambio recomendado es:

- Mantener ESIOS como dato electrico agregado.
- Crear una fuente nueva para telemetria real.
- Separar claramente `realTelemetry` de `derivedScada`.

Ejemplo de estructura futura:

```js
{
  generation: {
    source: 'ESIOS',
    windMw: 6609,
  },
  realTelemetry: {
    rpm: 8.4,
    gearboxTempC: 49.1,
    oilTempC: 42.0,
  },
  derivedScada: {
    yawMisalignmentDeg: 7.2,
    mechanicalLoadPercent: 23,
  }
}
```

Asi se podria saber siempre que datos son reales y cuales siguen siendo estimados.

## Mantenimiento recomendado

Antes de cambiar codigo:

1. Revisar que archivo contiene la responsabilidad.
2. Hacer cambios pequenos.
3. Ejecutar `npm run build`.
4. Abrir `http://localhost:5177/`.
5. Comprobar que:
   - El dashboard carga.
   - El aerogenerador gira.
   - La API no rompe la app si falla.
   - El boton minimizar funciona.
   - Los paneles desplegables abren y cierran.
   - No se presentan estimaciones como datos reales.

## Verificacion minima antes de entregar

Comandos:

```bash
npm install
npm run build
npm run dev
```

Comprobaciones visuales:

- El servidor abre en `http://localhost:5177/`.
- El dashboard muestra `Conectado a ESIOS` si hay token valido.
- El ultimo dato tiene fecha y hora.
- El rotor gira.
- El panel se puede minimizar.
- Las tarjetas SCADA se abren.
- El analisis mecanico se activa.
- No aparecen valores `NaN`, `undefined` o textos cortados de forma grave.

## Errores habituales y solucion

### La app no abre

Revisar:

```bash
npm install
npm run dev
```

Confirmar que el puerto es:

```text
http://localhost:5177/
```

### ESIOS no conecta

Revisar `.env`:

```text
VITE_ESIOS_API_KEY=token_personal
```

Reiniciar Vite despues de cambiar `.env`.

### El dashboard muestra simulacion

Puede ocurrir si:

- La API key no esta.
- ESIOS no responde.
- REData falla.
- No hay red.

La simulacion local es intencionada para que la presentacion no quede vacia.

### El aerogenerador parece parado

Revisar:

- Valor `rpm` en el dashboard.
- Si `rpm = 0`, el modelo esta en parada.
- Si `rpm` es bajo, el giro puede parecer lento porque es una turbina grande.
- Recargar con `Ctrl + F5`.

### Textos con caracteres raros

Algunos textos pueden verse con problemas de codificacion si se mezclan tildes y codificaciones antiguas. Para evitarlo en futuras ediciones, conviene guardar archivos en UTF-8.

## Riesgos tecnicos

Riesgos actuales:

- Three.js aumenta el tamano del bundle.
- Si ESIOS cambia su API, habra que actualizar `fetchEsiosRealtimeWind()`.
- Las metricas SCADA son estimadas, por lo que deben explicarse correctamente.
- El dashboard concentra mucha informacion y puede requerir ajustes responsive si se usa en pantallas pequenas.
- Si se anaden muchas animaciones 3D, puede bajar el rendimiento.

## Escalabilidad

Para escalar el proyecto recomiendo:

1. Separar visualizaciones SCADA en componentes independientes.
2. Crear un archivo de constantes tecnicas para formulas y rangos.
3. Anadir tests unitarios para `windDataService.js`.
4. Crear una capa de datos con adaptadores por API.
5. Separar datos reales, datos derivados y datos simulados.
6. Preparar configuracion para despliegue.
7. Optimizar el bundle con carga diferida si el proyecto crece.

## Posibles mejoras futuras

- Integrar sensores reales del laboratorio.
- Anadir WebSocket para datos en tiempo real.
- Guardar historico en base de datos.
- Comparar ESIOS con otras fuentes energeticas.
- Exportar datos del dashboard a CSV.
- Crear modo presentacion.
- Crear tests automaticos de formulas.
- Mejorar accesibilidad del dashboard.
- Separar el modelo 3D en componentes mas pequenos.
- Documentar una API interna propia si se crea backend.

## Resumen tecnico para mantenimiento

La idea central que debo mantener en cualquier ampliacion es:

```text
ESIOS aporta generacion eolica real agregada.
El codigo transforma ese dato en equivalentes mecanicos y visuales.
La escena 3D y el dashboard muestran una turbina tipo calibrada.
Las variables derivadas deben documentarse siempre como estimaciones.
```

Esta separacion hace que el proyecto sea defendible para un entorno universitario y permite escalarlo en el futuro hacia un gemelo digital mas real si se conectan sensores o datos SCADA reales.

---

**Autor:** Robert Jesus Melendez Nunez



