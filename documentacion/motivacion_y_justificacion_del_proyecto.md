# Motivacion y justificacion del proyecto

## Autoria y destino academico

Este proyecto lo he planteado, organizado y desarrollado como autor. He definido la arquitectura general, la integracion de datos, la escena 3D, el dashboard, la documentacion y los criterios tecnicos de entrega. Este trabajo esta destinado al **Departamento de Robotica de la Universidad Complutense de Madrid**.

Este trabajo esta destinado al **Departamento de Robotica de la Universidad Complutense de Madrid**, dentro de un contexto academico y de laboratorio de ingenieria.

## Motivacion principal

La razon principal por la que he desarrollado esta aplicacion web es mi interes por unir tres areas que considero fundamentales dentro de la ingenieria actual: las energias renovables, la visualizacion 3D interactiva y los sistemas de monitorizacion tecnica. Un aerogenerador no es solamente una maquina que gira; es un sistema electromecanico complejo en el que intervienen aerodinamica, control, generacion electrica, mantenimiento, sensores, cargas mecanicas, vibraciones, orientacion, temperatura y conexion con la red.

Mi objetivo ha sido crear una herramienta que no se limite a mostrar una animacion estetica, sino que permita comprender de forma visual y tecnica como un dato energetico real puede convertirse en una representacion interactiva de funcionamiento. Para ello he usado datos reales de generacion eolica procedentes de ESIOS, la plataforma de informacion de Red Electrica / Redeia, y los he conectado con una escena 3D desarrollada en Three.js y un dashboard inferior de tipo SCADA.

## Problema que quiero abordar

Los datos energeticos publicos existen, pero muchas veces se presentan como tablas, valores numericos o graficas generales que no siempre son intuitivas para interpretar el comportamiento de un sistema fisico. Por ejemplo, conocer que en un momento determinado hay una cierta generacion eolica en MW es un dato importante, pero no explica visualmente que implicaria esa generacion sobre una turbina, su carga, su velocidad de giro estimada o su estado operativo.

El problema que he querido abordar es precisamente esa distancia entre el dato energetico y la comprension tecnica del sistema. Mi aplicacion intenta transformar un dato electrico agregado en una experiencia visual que ayude a interpretar, de forma didactica y tecnica, el comportamiento de una turbina eolica tipo.

## Enfoque propuesto

La aplicacion parte de un dato real: la generacion eolica agregada del sistema electrico obtenida mediante el indicador `551` de ESIOS. A partir de ese dato, calculo un factor de carga frente a una referencia de potencia eolica instalada y lo utilizo para estimar variables equivalentes como:

- Velocidad de giro del rotor en rpm.
- Viento equivalente.
- Velocidad de punta de pala.
- Carga mecanica.
- Oscilacion de torre.
- Torsion.
- Flexion de base de pala.
- Curva de potencia.
- Pitch.
- Yaw.
- Temperaturas de gearbox, aceite y generador.
- Vibracion.
- Disponibilidad.
- Estado de componentes.

Estas variables no se presentan como sensores reales de una turbina concreta, sino como estimaciones didacticas derivadas de un dato energetico real. Esta distincion es esencial para que el proyecto sea tecnicamente honesto y defendible.

## Relacion con robotica e ingenieria

Desde el punto de vista de la robotica y la ingenieria, un aerogenerador puede entenderse como un sistema fisico controlado, con actuadores, sensores, dinamica estructural, conversion energetica y supervision operativa. Aunque el proyecto no implementa un controlador industrial real, si reproduce conceptos propios de sistemas roboticos y ciberfisicos:

- Captura de datos externos.
- Procesamiento y normalizacion de informacion.
- Estimacion de estados internos.
- Visualizacion de variables mecanicas.
- Monitorizacion tipo SCADA.
- Representacion 3D de un sistema tecnico.
- Interaccion entre usuario, modelo visual y datos.
- Posible evolucion hacia gemelo digital.

Por eso considero que el proyecto encaja dentro de un entorno academico de robotica e ingenieria: no se trata solo de una interfaz grafica, sino de una aproximacion a como representar, interpretar y supervisar un sistema fisico complejo mediante software.

## Valor academico del proyecto

El valor academico de esta aplicacion esta en demostrar como se puede conectar una fuente real de datos energeticos con una representacion visual avanzada. La aplicacion combina desarrollo web, programacion 3D, integracion de APIs, calculo de variables derivadas y diseno de una interfaz tecnica.

El proyecto aporta:

- Una visualizacion 3D interactiva de un aerogenerador.
- Un dashboard tecnico vinculado a datos reales.
- Un modelo de estimacion basado en generacion eolica agregada.
- Una separacion clara entre dato real y dato derivado.
- Una estructura de codigo mantenible y ampliable.
- Una base para futuras integraciones con sensores reales.
- Un ejemplo didactico de gemelo digital visual en fase inicial.

## Aportacion a la Universidad Complutense de Madrid

Este trabajo aporta a la Universidad Complutense de Madrid un prototipo academico de visualizacion tecnica y monitorizacion eolica, capaz de transformar datos reales de generacion electrica en una experiencia 3D interactiva. Su valor esta en servir como base docente, experimental y escalable para futuras practicas de robotica, gemelo digital, sistemas ciberfisicos y mantenimiento predictivo.

Desde el punto de vista universitario, la aportacion principal no es solo la aplicacion web en si, sino la integracion de varias areas en un unico prototipo funcional:

- Energia eolica y transicion energetica.
- Visualizacion 3D interactiva.
- Integracion de APIs reales.
- Modelos matematicos estimados.
- Monitorizacion tipo SCADA.
- Interpretacion de datos energeticos.
- Arquitectura web mantenible.
- Documentacion tecnica para futuras ampliaciones.

La aplicacion puede utilizarse como herramienta docente para explicar como se relacionan la produccion eolica, la carga mecanica, la velocidad de giro, el pitch, el yaw, la vibracion, las temperaturas y el estado operativo de una turbina tipo. Tambien puede servir como base de laboratorio para que otros estudiantes trabajen sobre integracion de sensores, dashboards tecnicos, sistemas ciberfisicos o prototipos de gemelo digital.

Ademas, el proyecto deja preparada una arquitectura que podria escalarse en el futuro. Si el Departamento de Robotica dispone mas adelante de sensores reales, datos SCADA industriales o modelos de mantenimiento predictivo, esta aplicacion podria evolucionar desde una visualizacion tecnica calibrada hacia una plataforma experimental mas completa.

Por tanto, mi aportacion a la universidad es una base funcional, documentada y ampliable que conecta software, datos reales, visualizacion 3D e interpretacion tecnica de sistemas eolicos.

## Justificacion del uso de ESIOS

He elegido ESIOS porque es una fuente publica y oficial relacionada con el sistema electrico espanol. El indicador `551` permite consultar generacion eolica en tiempo real, lo que aporta una base real para la aplicacion. Esto evita que el proyecto dependa solo de datos inventados o simulados.

Sin embargo, ESIOS no proporciona datos internos de aerogeneradores individuales. No entrega rpm reales, pitch real, yaw real, temperaturas, vibraciones ni estado de componentes de una maquina concreta. Por eso he usado la generacion eolica real como dato maestro y he desarrollado una capa de modelos matematicos estimados para construir una visualizacion tecnica coherente.

## Justificacion de la visualizacion 3D

La visualizacion 3D permite comprender de forma mas directa conceptos que en una tabla serian menos intuitivos. Ver el rotor girando, el dashboard cambiando, la curva de potencia, la rosa de viento, las temperaturas o el estado de componentes ayuda a relacionar datos numericos con comportamiento fisico.

El uso de Three.js y React Three Fiber me permite construir una experiencia interactiva dentro del navegador, sin depender de software instalado por el usuario final. Esto facilita la demostracion del proyecto en un entorno academico y permite que la aplicacion pueda abrirse en localhost durante una defensa o sesion de laboratorio.

## Limites asumidos

El proyecto tiene limites que he documentado de forma explicita:

- No representa una turbina real individual.
- No recibe telemetria SCADA industrial.
- No mide sensores reales de temperatura, vibracion, yaw o pitch.
- No calcula aerodinamica industrial completa.
- No sustituye un sistema de monitorizacion profesional.

Estos limites no debilitan el proyecto; al contrario, hacen que sea mas riguroso, porque separo claramente lo que es dato real de lo que es estimacion matematica y visual.

## Proyeccion futura

Una de las razones por las que este proyecto me interesa es que puede crecer en varias direcciones. En una fase futura podria conectarse a:

- Sensores reales de laboratorio.
- Datos SCADA de turbinas individuales.
- Sistemas de mantenimiento predictivo.
- Historicos de generacion.
- WebSockets para actualizacion continua.
- Bases de datos para analizar tendencias.
- Modelos de machine learning para deteccion de anomalias.
- Simulaciones fisicas mas avanzadas.

Con estas ampliaciones, la aplicacion podria evolucionar desde una visualizacion tecnica calibrada hacia un prototipo mas cercano a un gemelo digital.

## Conclusion

He desarrollado AeroGenerador porque me permite explorar como transformar datos energeticos reales en una herramienta visual, interactiva y tecnica. El proyecto une programacion web, visualizacion 3D, energia eolica, interpretacion de datos, conceptos SCADA y una aproximacion inicial a gemelo digital.

La aplicacion no pretende afirmar que mide una turbina real concreta, sino demostrar que, a partir de datos reales agregados de ESIOS, es posible construir una representacion tecnica coherente que ayude a comprender mejor el comportamiento de un sistema eolico desde una perspectiva de ingenieria y robotica.

Por este motivo considero que el proyecto tiene sentido dentro del **Departamento de Robotica de la Universidad Complutense de Madrid**, ya que conecta software, datos, sistemas fisicos, visualizacion y monitorizacion tecnica en una misma aplicacion.

---

**Autor:** Robert Jesus Melendez Nunez


