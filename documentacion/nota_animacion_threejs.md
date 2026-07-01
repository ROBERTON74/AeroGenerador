# Nota tecnica sobre la animacion Three.js

Fecha de revision: 30 de junio de 2026.

## Autoria y destino academico

Este proyecto lo he planteado, organizado y desarrollado como autor. He definido la arquitectura general, la integracion de datos, la escena 3D, el dashboard, la documentacion y los criterios tecnicos de entrega. Este trabajo esta destinado al **Departamento de Robotica de la Universidad Complutense de Madrid**.

## Estado actual

La animacion principal del aerogenerador se realiza actualmente con Three.js, React Three Fiber y el hook `useFrame`. No uso un motor de fisica externo en la version entregada.

La escena aplica una respuesta visual mecanica mediante calculos propios:

- Giro del rotor calculado desde las rpm estimadas.
- Suavizado progresivo de velocidad mediante interpolacion.
- Oscilacion de torre con seno temporal y carga mecanica derivada.
- Torsion visual de la estructura.
- Flexion de pala calculada desde las metricas mecanicas estimadas.
- Union visual refinada entre palas y buje, sin pieza frontal sobresaliente en el eje.
- Sombras reforzadas, incluyendo sombra visual de palas sobre el suelo.
- Vista interna de gondola y zonas de esfuerzo cuando activo el analisis mecanico.

## Archivos implicados

- `src/components/WindTurbineScene.jsx`: construye la escena, luces, camara, entorno, aerogeneradores de fondo y particulas de viento.
- `src/components/WindTurbine.jsx`: modela el aerogenerador principal y anima rotor, torre, torsion, flexion y elementos internos.
- `src/services/windDataService.js`: calcula rpm, potencia normalizada, carga mecanica y variables SCADA estimadas.
- `src/hooks/useWindData.js`: actualiza los datos y mantiene el historico local de carga.

## Motivo de esta decision

He mantenido la animacion en Three.js porque es suficiente para la entrega actual, reduce dependencias externas y permite controlar directamente la relacion entre los datos derivados de ESIOS y la respuesta visual del modelo.

La aplicacion no afirma simular aerodinamica industrial completa. El objetivo es mostrar una visualizacion tecnica coherente: ESIOS aporta generacion eolica real agregada y el proyecto la transforma en rpm, carga, oscilacion, torsion, flexion y estado visual estimado de una turbina tipo.

El ajuste de palas y buje es solo de visualizacion. Lo he dejado asi para que el rotor se lea como una pieza continua y para evitar que las palas parezcan atravesar el buje o quedar separadas de el.

## Como simplificar la animacion

Si en el futuro quiero reducir todavia mas la parte visual, los cambios principales estan en `src/components/WindTurbine.jsx`:

1. Mantener solo el giro del rotor.
2. Retirar la oscilacion de torre y torsion dentro de `useFrame`.
3. Desactivar las capas de `StressMap`, `GeneratorCutaway` y flechas mecanicas.
4. Ejecutar `npm run build` para verificar que la aplicacion compila.

## Verificacion

La verificacion tecnica de referencia para esta version es:

```bash
npm run build
```

La build debe compilar correctamente. El aviso de bundle grande es esperable por el uso de Three.js y librerias 3D.

---

**Autor:** Robert Jesus Melendez Nunez


