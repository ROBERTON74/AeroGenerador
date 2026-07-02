# Rollback despliegue Vercel

Fecha: 2026-07-02

Commit base antes de preparar Vercel:

```text
a948b1d - WIP: backup local edits before syncing remote
```

## Objetivo

Dejar registrado como volver atras si el despliegue en Vercel falla o si la app no abre bien en movil/escritorio.

## Cambios hechos para Vercel

- `vercel.json`: configuracion de build, carpeta `dist` y rutas publicas.
- `api/_proxy.js`: helper comun para reenviar peticiones HTTP.
- `api/esios.js`: proxy seguro para ESIOS.
- `api/ree.js`: proxy para REData.
- `api/open-meteo.js`: proxy para Open-Meteo.
- `index.html`: metadatos moviles basicos.
- `src/styles/index.css`: adaptacion responsive para movil, tablet y escritorio.
- `.gitignore`: ignora la carpeta local `.vercel`.

## Despliegue activo

```text
https://aerogenerador-robert.vercel.app
```

Deployment id final verificado:

```text
dpl_C5UmzAnVCj8GoYZV6tMXByDkDTqE
```

## Variables necesarias en Vercel

En Vercel, configurar:

```text
ESIOS_API_KEY=tu_token_personal_de_esios
```

Tambien se acepta `VITE_ESIOS_API_KEY`, pero es mejor usar `ESIOS_API_KEY` porque queda solo en servidor.

## Rollback rapido en Git

1. Ver el historial:

```bash
git log --oneline -5
```

Si se quiere volver exactamente al estado anterior a Vercel, usar como referencia:

```text
a948b1d
```

2. Volver al commit anterior creando un commit inverso:

```bash
git revert <commit_del_despliegue_vercel>
```

3. Subir a GitHub:

```bash
git push origin main
```

Vercel redeployara automaticamente la version anterior.

## Rollback desde Vercel

1. Entrar en el proyecto de Vercel.
2. Ir a `Deployments`.
3. Elegir un despliegue anterior que funcionaba.
4. Pulsar `Promote to Production`.

## Comprobaciones despues del rollback

- Abrir la URL publica de Vercel.
- Probar en movil y ordenador.
- Comprobar que aparece el aerogenerador offshore.
- Abrir paneles `Modelo` y `Mecanica`.
- Revisar que no aparece error permanente de datos.
