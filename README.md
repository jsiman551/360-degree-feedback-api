# Proyecto de Evaluaciones de Desempeño (API)

Este proyecto es una API para la gestión de evaluaciones de desempeño en una organización. Permite a los administradores, managers y empleados interactuar con el sistema para ver, crear y gestionar evaluaciones.

## Características
- Autenticación y autorización con JWT.
- Gestión de usuarios con roles (`Admin`, `Manager`, `Employee`).
- Validación de datos con Zod.
- Manejo centralizado de errores.
- Estructura organizada en capas para controladores, servicios, y modelos.

## Tecnologías
- **Node.js** y **Express** para la API.
- **MongoDB** como base de datos.
- **Mongoose** para la gestión de datos.
- **TypeScript** como lenguaje principal.
- **Zod** para la validación de datos.

## Requisitos

- **Node.js** (v14 o superior)
- **npm** o **yarn**
- **MongoDB** (ya sea local o en MongoDB Atlas)
- **Archivo .env** con las siguientes variables de entorno:
```bash
    PORT=5000
    MONGO_URI=<URL-de-tu-base-de-datos-MongoDB>     
    JWT_SECRET=<clave-secreta-para-JWT>
  ```  


## Instalación

1. Clona el repositorio:
```bash
git clone <URL-del-repositorio>
cd <nombre-del-repositorio>
```
2. Instala las dependencias:
```bash
npm install
```
3. Crea un archivo .env en la raíz del proyecto y agrega las variables de entorno como se indica en los requisitos

4. Compila el proyecto TypeScript a JavaScript:
```bash
npm run build
```

5. Inicia el servidor:
```bash
npm run start
```
Alternativamente, para desarrollo con reinicio automático, usa:
```bash
npm run dev
```
