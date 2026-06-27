# Figura tecnica del dashboard anotado

## Autoria y destino academico

Este proyecto lo he planteado, organizado y desarrollado como autor. He definido la arquitectura general, la integracion de datos, la escena 3D, el dashboard, la documentacion y los criterios tecnicos de entrega. Este trabajo esta destinado al **Departamento de Robotica de la Universidad Complutense de Madrid**.

Este trabajo esta destinado al **Departamento de Robotica de la Universidad Complutense de Madrid**, dentro de un contexto academico y de laboratorio de ingenieria.

## Figura general

![Dashboard anotado de AeroGenerador](<./assets/dashboard_anotado_flechas.png>)

**Figura 1.** Dashboard principal de **AeroGenerador** con anotaciones tecnicas. La imagen muestra la relacion entre los datos reales de ESIOS, las metricas derivadas mediante modelos matematicos y los controles visuales de la aplicacion.

## Descripcion de las anotaciones

1. **Fuente ESIOS y ambito Peninsula**  
   Identifica que la aplicacion trabaja con datos electricos de ESIOS y que el ambito recibido corresponde al sistema peninsular. No representa un parque eolico concreto.

2. **Generacion eolica real agregada (MW)**  
   Muestra la produccion eolica real agregada en megavatios. Es el dato principal recibido desde ESIOS mediante el indicador `551`.

3. **Factor de carga sobre potencia instalada**  
   Representa la relacion entre la generacion eolica actual y la potencia eolica instalada tomada como referencia. Este factor alimenta varias estimaciones del dashboard.

4. **Viento equivalente derivado**  
   Es una conversion didactica desde la generacion real hacia un viento equivalente. No procede de un anemometro real, sino del modelo matematico usado para visualizar la turbina tipo.

5. **RPM estimadas del rotor**  
   Indica la velocidad de giro estimada del aerogenerador. Las rpm no vienen directamente de ESIOS; se calculan desde el factor de carga.

6. **Velocidad de punta de pala**  
   Calcula la velocidad de la punta de la pala usando las rpm estimadas y el radio de rotor de referencia. Ayuda a entender la magnitud del movimiento aunque el rotor gire lentamente.

7. **Ultimo dato recibido y fuente**  
   Muestra la fecha, hora y fuente del ultimo dato procesado. Sirve para verificar la actualidad de la informacion.

8. **Carga mecanica y esfuerzos estimados**  
   Resume la exigencia mecanica aproximada de la turbina tipo. Se calcula desde el factor de carga, la variacion entre lecturas y los equivalentes derivados.

9. **Modo operativo y disponibilidad**  
   Resume el estado global de funcionamiento: produccion parcial, potencia nominal, limitacion o parada. Tambien muestra la disponibilidad estimada y alarmas activas.

10. **Curva de potencia de turbina tipo**  
    Representa la potencia esperada para una turbina de referencia de `5 MW`, calculada desde el viento equivalente.

11. **Rosa de viento y yaw estimado**  
    Muestra la direccion equivalente del viento y la orientacion estimada de la gondola. El valor de yaw indica la desalineacion entre ambas direcciones.

12. **Pitch, vibracion y estado de componentes**  
    Resume el angulo estimado de las palas, la vibracion equivalente y el estado de componentes como palas, buje, gearbox, generador y torre.

13. **Temperaturas: gearbox, aceite y generador**  
    Muestra temperaturas estimadas desde la carga y el factor de potencia. No proceden de sensores reales, sino de modelos matematicos acotados en rangos prudentes.

14. **Control de analisis mecanico**  
    Permite activar la capa visual de esfuerzos, torsion, flexion y vista mecanica interna. Es un control para presentar la parte ingenieril de la escena.

15. **Estado de conexion y refresco**  
    Indica si la aplicacion esta conectada a ESIOS o si trabaja en modo respaldo/simulacion. Incluye tambien el control manual de actualizacion.

## Uso de la figura en la memoria

Esta figura se puede usar en la memoria del proyecto para explicar de forma visual que el dashboard no es solo una interfaz estetica, sino una capa tecnica que conecta:

- Datos reales de generacion eolica agregada.
- Estimaciones matematicas derivadas.
- Representacion visual del aerogenerador.
- Indicadores tipo SCADA.
- Controles de analisis mecanico.

La figura tambien ayuda a defender que existe una separacion clara entre dato real y dato derivado. ESIOS aporta la generacion eolica agregada, mientras que rpm, pitch, yaw, temperaturas, vibracion y cargas son equivalentes calculados para una turbina tipo.

---

**Autor:** Robert Jesus Melendez Nunez


