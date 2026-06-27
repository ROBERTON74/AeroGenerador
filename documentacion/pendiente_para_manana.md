# Pendiente para manana

Proyecto: **AeroGenerador**  
Autor: **Robert Jesus Melendez Nunez**  
Destino academico: **Departamento de Robotica de la Universidad Complutense de Madrid**

## Estado en el que se deja el proyecto

La aplicacion ya esta preparada para continuar con la entrega y la subida a GitHub. El proyecto tiene:

- Aplicacion web Vite / React / Three.js.
- Dashboard SCADA con datos ESIOS y metricas derivadas.
- Documentacion principal agrupada en `documentacion/`.
- Imagen anotada del dashboard en `documentacion/assets/dashboard_anotado_flechas.png`.
- README principal en la raiz del proyecto.
- Git inicializado localmente.
- `.gitignore` creado para evitar subir archivos sensibles o innecesarios.
- Build comprobada correctamente con `npm run build`.

## Cosas importantes que ya quedan protegidas

No se debe subir a GitHub:

- `.env`
- `.env - copia.robert`
- `node_modules/`
- `dist/`
- archivos `.blend1`
- logs temporales
- versiones antiguas pesadas de Blender

La API key real de ESIOS debe mantenerse solamente en `.env`.

El archivo que si se puede subir es:

```text
.env.example
```

Ese archivo solo contiene un ejemplo para que otra persona pueda configurar su propio token.

## Pendiente principal para manana

### 1. Crear repositorio en GitHub

Entrar en GitHub y crear un repositorio nuevo, preferiblemente privado, por ejemplo:

```text
AeroGenerador
```

No hace falta crear README desde GitHub, porque ya existe un `README.md` en la raiz del proyecto.

Despues copiar el enlace del repositorio, por ejemplo:

```text
https://github.com/usuario/AeroGenerador.git
```

### 2. Conectar el repositorio local con GitHub

Cuando ya exista el repositorio remoto, habra que ejecutar:

```bash
git remote add origin https://github.com/usuario/AeroGenerador.git
git branch -M main
```

### 3. Revisar que archivos se van a subir

Antes del primer commit:

```bash
git status
```

Hay que comprobar especialmente que no aparezcan:

- `.env`
- `.env - copia.robert`
- `node_modules/`
- `dist/`

### 4. Hacer el primer commit

Cuando este todo revisado:

```bash
git add .
git commit -m "Entrega inicial AeroGenerador"
```

### 5. Subir a GitHub

```bash
git push -u origin main
```

Si GitHub pide iniciar sesion, hacerlo desde el navegador o con GitHub CLI. No se deben escribir contrasenas ni tokens personales dentro de la documentacion ni en el chat.

## Pendiente de revision antes de enviar al tutor

### Revisar la aplicacion en localhost

Ejecutar:

```bash
npm run dev
```

Abrir:

```text
http://localhost:5177/
```

Comprobar:

- El aerogenerador carga correctamente.
- Las aspas giran.
- El dashboard aparece abajo.
- El dashboard se puede minimizar.
- Las tarjetas desplegables funcionan.
- La conexion con ESIOS aparece correctamente si la API key esta configurada.
- La actualizacion esta planteada cada cinco minutos.

### Revisar documentacion

Documentos principales a revisar:

```text
documentacion/indice_documentacion_entrega.md
documentacion/resumen_para_tutor.md
documentacion/explicacion_dashboard_esios_modelos_matematicos.md
documentacion/manual_tecnico_codigo_mantenimiento.md
documentacion/motivacion_y_justificacion_del_proyecto.md
documentacion/figura_dashboard_anotado.md
```

Tambien revisar:

```text
README.md
```

## Que enviar al tutor

Lo recomendable es enviar:

- Enlace al repositorio de GitHub.
- Explicacion breve de como abrirlo:

```bash
npm install
npm run dev
```

- URL local:

```text
http://localhost:5177/
```

- Aviso de que para usar ESIOS con datos reales hace falta crear `.env` con:

```bash
VITE_ESIOS_API_KEY=token_personal
```

- Indicar que la documentacion esta dentro de:

```text
documentacion/
```

## Nota para retomar manana

Manana lo primero sera:

1. Crear el repositorio privado en GitHub.
2. Pasar el enlace del repositorio remoto.
3. Revisar `git status`.
4. Hacer el primer commit.
5. Subir el proyecto.
6. Abrir GitHub y comprobar que se ve bien el README y la carpeta `documentacion/`.

**Autor:** Robert Jesus Melendez Nunez


