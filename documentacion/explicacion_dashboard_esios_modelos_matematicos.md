# Explicacion del dashboard, ESIOS y modelos matematicos

## Autoria y destino academico

Este proyecto lo he planteado, organizado y desarrollado como autor. He definido la arquitectura general, la integracion de datos, la escena 3D, el dashboard, la documentacion y los criterios tecnicos de entrega. Este trabajo esta destinado al **Departamento de Robotica de la Universidad Complutense de Madrid**.

Este trabajo esta destinado al **Departamento de Robotica de la Universidad Complutense de Madrid**, dentro de un contexto academico y de laboratorio de ingenieria. Por eso documento con claridad que datos son reales, que datos son derivados y que limites tiene la visualizacion.

## Idea general

Como apoyo visual, dejo preparada una figura anotada del dashboard en [figura_dashboard_anotado.md](<./figura_dashboard_anotado.md>). Esa figura senala con flechas cada zona de la interfaz y explica para que sirve cada tarjeta.

La aplicacion no recibe datos internos de un aerogenerador real. ESIOS no proporciona rpm, temperatura de gearbox, temperatura de aceite, pitch, yaw, vibracion ni sensores de una turbina individual. Lo que obtengo con la API key de ESIOS es el dato real de **generacion eolica agregada** del sistema electrico, usando el indicador `551`.

Con ese dato real de produccion eolica en MW construyo una visualizacion tecnica calibrada. Es decir, uso la generacion eolica real como base energetica y, mediante modelos matematicos estimados, calculo variables equivalentes para representar como podria comportarse una turbina tipo.

El flujo de calculo es:

```text
ESIOS indicador 551
        -> generacion eolica real agregada en MW
        -> factor de carga frente a potencia instalada
        -> viento equivalente
        -> rpm estimadas
        -> carga mecanica estimada
        -> yaw, pitch, temperaturas, vibracion y estado de componentes
        -> animacion 3D y dashboard SCADA
```

## API key de ESIOS

Para poder consultar ESIOS con mayor estabilidad y acceder al indicador de generacion eolica en tiempo real, solicite una API key personal a ESIOS. El proceso consistio en contactar por correo electronico con ESIOS / Red Electrica, explicando que la clave se necesitaba para un trabajo academico destinado al Departamento de Robotica de la Universidad Complutense de Madrid.

En esa solicitud indique el objetivo del proyecto: desarrollar una aplicacion web de visualizacion tecnica de energia eolica, conectada a datos reales de generacion electrica y usada dentro de un contexto universitario. Tras recibir la clave, la integre en el entorno local del proyecto.

La API key real no se escribe dentro de la documentacion ni debe publicarse en repositorios, porque es una credencial privada. En su lugar, se documenta la variable que debe configurarse. La API key de ESIOS se guarda en el archivo `.env`:

```text
VITE_ESIOS_API_KEY=token_personal
```

No se debe subir a repositorios publicos. En `vite.config.js` la uso dentro del proxy local `/esios-api`, que anade la cabecera `x-api-key` a las peticiones hacia `https://api.esios.ree.es`.

En resumen, el procedimiento reproducible es:

1. Solicitar a ESIOS / Red Electrica una API key mediante correo electronico, indicando el uso academico del proyecto.
2. Recibir el token personal.
3. Crear el archivo `.env` en la raiz del proyecto.
4. Guardar el token como `VITE_ESIOS_API_KEY`.
5. Reiniciar el servidor de Vite para que el proxy lea la variable.
6. Verificar en la aplicacion que aparece el estado `Conectado a ESIOS`.

La consulta principal se hace al indicador:

```text
ESIOS indicador 551 - Generacion T.Real eolica
```

La llamada pide datos recientes con truncado temporal de cinco minutos:

```text
time_trunc=five_minutes
```

En el hook `src/hooks/useWindData.js` tambien programe la actualizacion automatica cada cinco minutos:

```js
const POLL_INTERVAL = 5 * 60 * 1000;
```

Eso equivale a `300.000` milisegundos. Al abrir la aplicacion hago una consulta inicial y despues repito la consulta cada cinco minutos.

## Dato real que entra desde ESIOS

El dato real que entra desde ESIOS es:

- Generacion eolica agregada en MW.
- Fecha y hora del ultimo valor recibido.
- Ambito electrico, normalmente `Peninsula`.
- Fuente del dato: ESIOS indicador `551`.

Este dato no pertenece a un parque eolico concreto ni a un aerogenerador individual. Representa la produccion eolica agregada del sistema electrico.

## Factor de carga

Para transformar la generacion real en un valor util para la visualizacion, normalizo la potencia eolica actual frente a una referencia de potencia eolica instalada en Espana:

```js
const SPANISH_WIND_INSTALLED_CAPACITY_MW = 31679;
```

La formula base es:

```text
factor de carga = generacion eolica ESIOS MW / 31.679 MW
```

Este factor se limita entre `0` y `1` para evitar valores fuera de rango. Lo uso como variable principal para alimentar las rpm, la carga mecanica y los indicadores SCADA derivados.

## RPM estimadas del rotor

Las rpm no vienen de ESIOS. Las calculo como una estimacion de una turbina grande a partir del factor de carga.

La logica del codigo es:

```text
si el factor de carga es casi cero:
    rpm = 0
si hay produccion:
    rpm = 4,5 + raiz_cuadrada(factor de carga) * 7,8
    rpm limitada entre 4,5 y 12,8
```

Esto evita que el aerogenerador gire de forma exagerada. Una turbina grande no gira a cientos de rpm; gira lentamente, con mucho par. Por eso limite el rango visual aproximadamente entre parada y unas `13 rpm`.

En el dashboard aparece como:

```text
Rotor: 8 rpm
```

Ese valor controla tambien la animacion de las aspas en Three.js.

## Viento equivalente

Como ESIOS entrega energia y no viento local, calculo un viento equivalente desde el factor de carga.

La idea es que, a baja generacion, el viento equivalente sea bajo; a mayor generacion, el viento equivalente aumenta de manera no lineal. Uso una relacion tipo raiz cubica porque la potencia eolica esta relacionada con el cubo de la velocidad del viento.

En la interfaz aparece como:

```text
Viento equiv.
30,0 km/h
Derivado ESIOS
```

No significa que un anemometro real haya medido exactamente `30,0 km/h`. Significa que, para la generacion eolica agregada recibida, ese es el viento equivalente que uso para mover y explicar la turbina tipo.

## Variacion equivalente

La tarjeta `Variacion` muestra el cambio equivalente de carga. Sirve para representar si la produccion esta variando de forma suave o si hay cambios mas bruscos.

La calculo comparando la generacion actual con la generacion anterior y teniendo en cuenta una referencia de variacion. Si hay mas diferencia entre lecturas, sube la variacion equivalente.

En la interfaz aparece como:

```text
Variacion
3,7 km/h
Equivalente carga
```

Sirve para alimentar oscilaciones, cargas visuales y avisos de comportamiento variable.

## Punta de pala

La punta de pala se calcula a partir de las rpm y del radio del rotor usado como referencia visual:

```js
const REPRESENTATIVE_ROTOR_RADIUS_METERS = 72.5;
```

La formula usada en el dashboard es:

```text
velocidad punta pala = 2 * pi * radio * rpm / 60
```

Primero se obtiene en metros por segundo y despues se muestra tambien en km/h. Este valor ayuda a entender que, aunque el rotor parezca girar despacio, la punta de la pala puede moverse muy rapido por el gran radio del rotor.

## Oscilacion de torre

La tarjeta `Oscilacion torre` muestra una oscilacion visual estimada de la torre. No es una medicion real de inclinacion.

La calculo desde:

- Factor de carga.
- Variacion equivalente.
- Estado mecanico derivado.

Sirve para que el aerogenerador no parezca un objeto rigido sin respuesta fisica. Representa de forma didactica la pequena flexion que podria tener una estructura alta sometida a viento y carga.

## Torsion de torre

La tarjeta `Torsion torre` representa un giro o esfuerzo torsional estimado.

Se calcula desde la carga y la variacion equivalente. Sirve para mostrar que un aerogenerador no solo recibe fuerzas frontales, sino tambien esfuerzos laterales y torsionales.

## Base de pala

La tarjeta `Base pala` indica la flexion estimada en la raiz de la pala.

La raiz de pala es una zona critica porque ahi se transmite gran parte del esfuerzo aerodinamico al buje. En la app uso este valor para representar flexion y carga mecanica visual en el rotor.

## Carga mecanica

La tarjeta `Carga mecanica` resume en porcentaje la exigencia estimada de la turbina tipo.

La calculo combinando:

- Factor de carga.
- Variacion entre lecturas.
- Participacion relativa de la eolica.

En la interfaz puede aparecer, por ejemplo:

```text
Carga mecanica
23%
Carga baja
```

Sirve como indicador general para interpretar si el aerogenerador esta funcionando en una situacion suave, media o exigente.

## Modo operativo

La tarjeta `Modo operativo` resume el estado estimado de funcionamiento.

Los estados principales son:

- `Bajo cut-in`: viento equivalente insuficiente para producir.
- `Produccion parcial`: la turbina produce, pero por debajo de potencia nominal.
- `Potencia nominal`: la turbina tipo se acerca a su zona nominal.
- `Limitacion por equivalente alto`: el equivalente de viento/carga es alto y la turbina tenderia a limitar.
- `Parada por seguridad`: viento equivalente muy alto.

En la imagen aparece:

```text
Modo operativo
Produccion parcial
Disponibilidad 98,0%
Sin alarmas activas
```

Esto significa que, segun el dato energetico real y el modelo derivado, la turbina tipo esta en una zona de produccion normal, sin alarmas importantes.

## Curva de potencia

La tarjeta `Curva de potencia` compara el viento equivalente con una turbina tipo de `5 MW`.

La referencia del codigo es:

```js
const REPRESENTATIVE_TURBINE_RATED_MW = 5.0;
```

La curva usa tres zonas:

- Por debajo de `3 m/s`: no produce.
- Entre `3 m/s` y `12 m/s`: la potencia sube de forma cubica.
- A partir de `12 m/s`: se considera zona nominal hasta el limite de seguridad.

La formula simplificada en zona parcial es:

```text
potencia estimada = 5 MW * ((viento - 3) / (12 - 3))^3
```

En la imagen aparece:

```text
Curva de potencia
1,0 MW
20,9% de turbina tipo
```

Esto significa que, con el viento equivalente calculado desde ESIOS, una turbina tipo de `5 MW` estaria alrededor de `1,0 MW`, aproximadamente un `20,9%` de su referencia nominal.

## Rosa de viento / yaw

La tarjeta `Rosa de viento / yaw` muestra la direccion equivalente de viento y la orientacion estimada de la gondola.

`Yaw` es el giro de la gondola para orientarse hacia el viento. Si la gondola y el viento no estan alineados, aparece un error de yaw.

En la imagen aparece:

```text
Rosa de viento / yaw
7,2 deg
Direccion derivada 254 deg - Gondola 247 deg
```

Esto significa que el modelo estima una desalineacion de unos `7,2 grados` entre la direccion equivalente del viento y la orientacion de la gondola. No es una medicion real de un sensor yaw; es un indicador derivado para explicar la orientacion de la turbina.

## Pitch y condicion

La tarjeta `Pitch y condicion` muestra el angulo estimado de las palas y una lectura de condicion de componentes.

`Pitch` es el angulo con el que las palas se orientan para captar mas o menos energia del viento. En una turbina real, el control pitch ayuda a regular la potencia y proteger la maquina.

En la imagen aparece:

```text
Pitch y condicion
2,4 deg
Vibracion 1,1 mm/s
Palas - Buje - Gearbox - Generador - Torre
```

El pitch se calcula desde el viento equivalente y el factor de carga. La vibracion se estima desde carga, rotorPower y variacion equivalente. Las etiquetas de componentes sirven para mostrar el estado estimado de cada parte principal.

## Temperaturas

La tarjeta `Temperaturas` resume la temperatura estimada de los componentes internos.

En la imagen aparece:

```text
Temperaturas
49,9 C
Gearbox 44,4 C - Aceite 41,3 C
```

Estas temperaturas no vienen de sensores reales. Las calculo desde el factor de carga y la carga mecanica:

```text
gearbox = 38 + rotorPower * 22 + cargaMecanica * 0,08
generador = 42 + rotorPower * 27 + cargaMecanica * 0,10
aceite = 36 + rotorPower * 18 + cargaMecanica * 0,065
```

Despues limito los valores a rangos prudentes:

- Gearbox: 35-82 C.
- Generador: 38-92 C.
- Aceite: 32-72 C.

La temperatura principal de la tarjeta sirve como resumen termico. El detalle desplegable muestra el gearbox, el circuito de aceite, zonas de friccion y lectura tecnica.

## Disponibilidad

La disponibilidad es una estimacion del estado general de la turbina tipo.

Parte de un valor alto y baja si aparecen alarmas o si la carga mecanica aumenta. Sirve para representar si el sistema esta en una condicion normal o si necesita vigilancia.

No es disponibilidad real de un parque eolico; es un indicador didactico derivado.

## Alarmas

Las alarmas se activan si el modelo detecta condiciones derivadas exigentes:

- Variacion equivalente alta.
- Desalineacion yaw alta.
- Carga mecanica alta.
- Viento equivalente alto.

Si no se cumple ninguna condicion importante, aparece:

```text
Sin alarmas activas
```

## Estado de conexion

La zona derecha del dashboard muestra si la app esta conectada a ESIOS.

Cuando aparece:

```text
Conectado a ESIOS
```

significa que la aplicacion ha podido obtener datos desde la API usando el proxy y la API key configurada.

## Boton de analisis mecanico

El control `Analisis mecanico` activa una capa visual adicional sobre la escena 3D:

- Zonas de esfuerzo.
- Oscilacion de torre.
- Torsion.
- Flexion.
- Vista interna de partes mecanicas.

Sirve para explicar el proyecto desde un punto de vista de ingenieria y no solo como una animacion estetica.

## Boton minimizar

El boton `Minimizar` oculta el dashboard hacia abajo para dejar mas espacio a la vista 3D del aerogenerador. Esto ayuda a presentar el modelo visual sin perder la posibilidad de recuperar los datos tecnicos.

## Resumen para defensa oral

La frase mas importante para explicar el proyecto es:

```text
La API key de ESIOS me permite acceder a generacion eolica real agregada del sistema electrico. A partir de ese dato energetico real calculo, mediante modelos matematicos estimados, las rpm, el viento equivalente, la carga mecanica, el pitch, el yaw, temperaturas, vibracion y estado de componentes de una turbina tipo. No afirmo que sean sensores reales de una turbina concreta; son equivalentes didacticos para una visualizacion tecnica destinada al Departamento de Robotica de la Universidad Complutense de Madrid.
```

---

**Autor:** Robert Jesus Melendez Nunez



