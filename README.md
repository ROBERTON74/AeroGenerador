# AeroGenerador

Aplicacion web interactiva desarrollada para representar un aerogenerador 3D en funcionamiento con Three.js, React y datos reales agregados de generacion eolica procedentes de ESIOS / Red Electrica.

El proyecto esta destinado al Departamento de Robotica de la Universidad Complutense de Madrid. La aplicacion combina una escena 3D tecnica con un dashboard inferior tipo SCADA que muestra generacion eolica real, factor de carga, rpm estimadas, viento equivalente, yaw, pitch, temperaturas, vibracion, disponibilidad y estado operativo.

La version actual tambien deja refinada la union visual entre palas y buje: las palas quedan integradas en el rotor sin pieza frontal sobresaliente en el eje, para que la animacion se vea mas limpia.

## Como abrirlo en localhost

1. Instalar dependencias:

```bash
npm install
```

2. Crear un archivo `.env` a partir de `.env.example`:

```bash
VITE_ESIOS_API_KEY=tu_token_personal_de_esios
```

3. Ejecutar la aplicacion:

```bash
npm run dev
```

4. Abrir en el navegador:

```text
http://localhost:5177/
```

## API key de ESIOS

La API key se guarda solo en `.env` y no debe subirse a GitHub. El archivo `.env.example` incluye un valor de ejemplo para que otra persona pueda configurar su propio token.

La aplicacion usa el indicador ESIOS `551`, correspondiente a generacion eolica en tiempo real. ESIOS aporta generacion eolica agregada del sistema electrico, normalmente con ambito `Peninsula`. No aporta telemetria real de un aerogenerador individual.

Las variables mecanicas del dashboard, como rpm, yaw, pitch, temperaturas, vibracion y carga mecanica, se calculan como equivalentes didacticos mediante modelos matematicos a partir de la generacion eolica real.

## Documentacion

La documentacion de entrega esta en:

```text
documentacion/
```

Archivo recomendado para empezar:

```text
documentacion/indice_documentacion_entrega.md
```

Tambien se incluye una figura anotada del dashboard en:

```text
documentacion/assets/dashboard_anotado_flechas.png
```

## Scripts principales

```bash
npm run dev
npm run build
npm run preview
```

## Autor

Robert Jesus Melendez Nunez


