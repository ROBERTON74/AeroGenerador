# Resumen para tutor

## Autoria y apoyo de IA

Este proyecto lo he planteado, organizado y dirigido yo. Yo he definido la arquitectura general, la integracion con ESIOS, el dashboard, la escena 3D, el enfoque de estimaciones y la documentacion final. He usado IA como apoyo tecnico para revisar textos, depurar ideas y acelerar partes del proceso, pero la orquestacion de la arquitectura, las decisiones de desarrollo y la integracion final son mias. Este trabajo esta destinado al **Departamento de Robotica de la Universidad Complutense de Madrid**.

He desarrollado la aplicacion web **AeroGenerador** como un aerogenerador 3D interactivo en movimiento, usando React, Vite y Three.js. La escena representa un molino eolico funcionando, con terreno, cielo, sombras, aspas animadas y un dashboard inferior tipo SCADA con informacion energetica y tecnica.

Los datos principales que muestro en la aplicacion vienen de **ESIOS**, la plataforma de informacion de Red Electrica / Redeia. Uso el indicador `551`, correspondiente a la **generacion eolica en tiempo real**. Este dato representa la produccion eolica agregada del sistema electrico, normalmente con ambito **Peninsula**, y lo muestro en MW junto con la hora del ultimo dato recibido y el estado de generacion.

Para conectar la aplicacion con ESIOS consegui una **API key personal** solicitandola por correo electronico a ESIOS / Red Electrica. En la solicitud explique que el token se necesitaba para un trabajo academico destinado al Departamento de Robotica de la Universidad Complutense de Madrid, con el objetivo de consultar datos reales de generacion eolica y usarlos en una visualizacion tecnica.

Una vez recibida la clave, la configure en el archivo `.env`:

```text
VITE_ESIOS_API_KEY=tu_token_personal
```

Esa clave no debe subirse a repositorios publicos. Vite la utiliza en el proxy local para enviar la peticion a ESIOS con el encabezado `x-api-key`. Asi mi aplicacion puede consultar datos reales desde el navegador sin exponer directamente la estructura de la llamada.

La aplicacion realiza una consulta inicial al abrirse y despues actualiza los datos automaticamente **cada 5 minutos**. Lo programe en el hook `useWindData`, con un intervalo de:

```js
const POLL_INTERVAL = 5 * 60 * 1000;
```

Es decir, cada 300.000 milisegundos. En cada actualizacion vuelvo a consultar ESIOS, obtengo el ultimo valor disponible de generacion eolica y refresco las metricas del dashboard y la animacion del aerogenerador.

Ademas de los datos reales de generacion, calculo indicadores derivados como rpm estimadas, viento equivalente, pitch, yaw, carga mecanica, temperaturas, vibracion, disponibilidad y estado de componentes. Estos valores no son telemetria real de un aerogenerador concreto, sino estimaciones didacticas calculadas a partir de la generacion eolica real agregada.

## Precision de los datos y estimaciones

La API de ESIOS no entrega sensores internos de un aerogenerador individual. No informa de las rpm reales de una maquina concreta, ni de temperatura real de gearbox, aceite, yaw, pitch o vibracion. El dato real que se usa como base es la generacion eolica agregada en MW.

Para mejorar la precision de la representacion, normalizo ese valor de generacion frente a una referencia de potencia instalada eolica en Espana:

```js
const SPANISH_WIND_INSTALLED_CAPACITY_MW = 31679;
```

Con esto obtengo un factor de carga aproximado:

```text
factor de carga = generacion eolica actual MW / potencia instalada eolica MW
```

La referencia de `31.679 MW` se toma como base actualizada de potencia eolica instalada en Espana a cierre de 2024, cifra atribuida al informe de la Asociacion Empresarial Eolica y publicada por Cinco Dias / El Pais:

```text
https://cincodias.elpais.com/companias/2025-12-16/el-sector-eolico-reclama-medidas-para-alcanzar-el-ritmo-previsto-por-el-plan-nacional-de-energia.html
```

Uso ese factor de carga como base para estimar el comportamiento visual y tecnico de una turbina tipo. La aplicacion toma como referencia una turbina moderna de unos 5 MW y rotor grande, coherente con el modelo Siemens Gamesa SG 5.0-145 usado como referencia de escala.

Ejemplos de calculo:

```text
Generacion eolica ESIOS
        -> factor de carga agregado
        -> viento equivalente
        -> rpm estimadas
        -> carga mecanica estimada
        -> temperaturas y vibracion estimadas
```

Las rpm se mantienen en un rango mas realista para una turbina grande, aproximadamente entre parada y unas 13 rpm. Las temperaturas tambien se limitan a rangos prudentes:

- Gearbox: estimacion acotada entre 35 C y 82 C.
- Generador: estimacion acotada entre 38 C y 92 C.
- Aceite: estimacion acotada entre 32 C y 72 C.
- Vibracion: estimacion acotada entre 0,35 mm/s y 3,2 mm/s.

Por tanto, mi proyecto no afirma medir un aerogenerador real concreto. Lo correcto es explicarlo como una **visualizacion tecnica calibrada**: uso un dato energetico real de ESIOS y lo transformo mediante operaciones matematicas estimadas en variables mecanicas y visuales para representar el funcionamiento probable de una turbina eolica.

Para explicar la motivacion academica del proyecto, su relacion con robotica e ingenieria y la razon por la que he desarrollado esta aplicacion, dejo preparado [motivacion_y_justificacion_del_proyecto.md](<./motivacion_y_justificacion_del_proyecto.md>).

Como aportacion a la Universidad Complutense de Madrid, el proyecto deja un prototipo academico reutilizable que conecta datos reales de generacion eolica, visualizacion 3D, dashboard SCADA y modelos matematicos estimados. Puede servir como base docente y experimental para futuras practicas de robotica, gemelo digital, sistemas ciberfisicos, integracion de sensores y mantenimiento predictivo.

Para una explicacion completa de cada tarjeta del dashboard y de los modelos matematicos usados, dejo documentado el detalle en [explicacion_dashboard_esios_modelos_matematicos.md](<./explicacion_dashboard_esios_modelos_matematicos.md>).

Para revisar la arquitectura del codigo, mantenimiento futuro y posibles ampliaciones, dejo preparado [manual_tecnico_codigo_mantenimiento.md](<./manual_tecnico_codigo_mantenimiento.md>).

---

**Autor:** Robert Jesus Melendez Nuñez

