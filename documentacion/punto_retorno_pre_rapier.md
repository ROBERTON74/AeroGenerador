# Punto de retorno antes de Rapier Physics

Fecha: 28 de mayo de 2026.

## Autoria y apoyo de IA

Este proyecto lo he planteado, organizado y dirigido yo. Yo he definido la arquitectura general, la estructura de la aplicacion, la integracion de datos, el enfoque visual, la documentacion y las decisiones principales de desarrollo. He utilizado herramientas de IA como apoyo tecnico para acelerar tareas de redaccion, revision, depuracion y generacion de alternativas, pero la orquestacion del proyecto, la seleccion de tecnologias, la integracion final y los criterios de entrega son mios. Este trabajo esta destinado al **Departamento de Robotica de la Universidad Complutense de Madrid**.

En este documento registro el estado inmediatamente anterior a la integracion de `@react-three/rapier`, para poder volver a la animacion previa si el resultado fisico no convence.

## Estado anterior

Antes de Rapier, la animacion principal del aerogenerador se hacia completamente con Three.js y `useFrame`:

- Giro del rotor calculado desde las rpm.
- Suavizado de velocidad mediante interpolacion.
- Oscilacion de torre con seno temporal.
- Torsion visual con seno temporal.
- Flexion de pala calculada desde las metricas mecanicas derivadas.
- Sombras reforzadas, incluyendo sombra visual de palas sobre el suelo.

La escena ya funcionaba correctamente y la build compilaba.

## Cambios introducidos con Rapier

Archivos modificados:

- `package.json`: se anade la dependencia `@react-three/rapier`.
- `package-lock.json`: se registra la dependencia instalada.
- `src/components/WindTurbineScene.jsx`: se envuelve la escena con `<Physics gravity={[0, 0, 0]} colliders={false} timeStep="vary">`.
- `src/components/WindTurbine.jsx`: el aerogenerador principal se envuelve en un `RigidBody` dinamico con un `CuboidCollider` invisible para generar masa fisica.
- `src/components/WindTurbine.jsx`: la oscilacion de torre y torsion pasan a usar un controlador fisico de torque, rigidez y amortiguacion.
- `src/components/WindTurbineScene.jsx`: las turbinas lejanas usan `physicsEnabled={false}` para no cargar fisica innecesaria.

## Objetivo del cambio

Mi objetivo con el cambio fue mejorar la sensacion mecanica de la animacion:

- Movimiento con mas inercia.
- Oscilacion menos artificial.
- Respuesta mas natural a carga mecanica.
- Base para futuras fuerzas, vibraciones y simulaciones mas realistas.

## Que hace Rapier en este proyecto

Rapier no calcula aerodinamica real ni telemetria industrial. En esta fase lo uso como motor fisico para transformar datos derivados de ESIOS en una respuesta visual mas natural.

El dato real sigue siendo ESIOS. Rapier solo mejora la dinamica visual.

## Como volver atras

Para volver al estado previo a Rapier:

1. En `src/components/WindTurbineScene.jsx`, quitar:

```jsx
import { Physics } from '@react-three/rapier';
```

Y sustituir:

```jsx
<Physics gravity={[0, 0, 0]} colliders={false} timeStep="vary">
  <SceneContent windData={windData} showStressMap={showStressMap} />
</Physics>
```

por:

```jsx
<SceneContent windData={windData} showStressMap={showStressMap} />
```

2. En `src/components/WindTurbine.jsx`, quitar:

```jsx
import { CuboidCollider, RigidBody } from '@react-three/rapier';
```

3. En `WindTurbine.jsx`, retirar `physicsBodyRef`, `physicsEnabled`, el bloque `RigidBody`, el `CuboidCollider` y volver al control anterior:

```jsx
if (turbineRef.current) {
  const windPulse = Math.sin(state.clock.elapsedTime * 0.72);
  turbineRef.current.rotation.z = windPulse * towerSway;
  turbineRef.current.rotation.y = windPulse * towerTorsion;
}
```

4. En `package.json`, quitar la dependencia:

```json
"@react-three/rapier": "..."
```

5. Ejecutar:

```bash
npm install
npm run build
```

## Verificacion tras integrar Rapier

Comando ejecutado:

```bash
npm.cmd run build
```

Resultado:

- Build correcta.
- Aviso de bundle grande esperado.
- El bundle aumenta porque Rapier incorpora motor fisico y WASM.

---

**Autor:** Robert Jesus Melendez Nuñez

