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

### Descripción de las Carpetas

- **dist**: Contiene los archivos JavaScript generados al compilar el código TypeScript.
- **node_modules**: Carpeta donde se instalan las dependencias del proyecto.
- **src**: Carpeta principal para el código fuente.
  - **config**: Archivos de configuración, que contiene la conexion a base de datos.
  - **controllers**: Controladores que gestionan las solicitudes y respuestas.
  - **middlewares**: Funciones middleware que se ejecutan durante el ciclo de vida de las solicitudes.
  - **models**: Modelos que representan la estructura de los datos en la aplicación.
  - **routes**: Definición de las rutas de la aplicación.
  - **schemas**: Esquemas para la validación de datos.
  - **services**: Lógica de negocio que puede ser reutilizada en diferentes partes de la aplicación.
  - **types**: Definición de tipos e interfaces para TypeScript.
- **app.ts**: Archivo principal que configura la aplicación Express.
- **server.ts**: Archivo que inicia el servidor.
- **.env**: Archivo para las variables de entorno.
- **.gitignore**: Archivos y carpetas que deben ser ignorados por el control de versiones.
- **package-lock.json**: Mantiene un registro de las versiones exactas de las dependencias instaladas.
- **package.json**: Contiene información sobre el proyecto y sus dependencias.
- **README.md**: Documentación del proyecto.
- **tsconfig.json**: Configuración del compilador TypeScript.

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

## Endpoints

### 1. **Registro de Usuario**
- **Método:** `POST`
- **Ruta:** `/api/auth/register`
- **Descripción:** Permite a los administradores registrar un nuevo usuario en el sistema.
- **Autorización:** Solo accesible para usuarios con rol **Admin**.
- **Cuerpo de la solicitud:**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "role": "Admin" | "Manager" | "Employee"
  }
    ```
**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "User was created successfully",
  "data": {
    "id": "user_id",
    "username": "string",
    "email": "string",
    "role": "Admin" | "Manager" | "Employee"
  }
}
```
**Errores Comunes:**
1. Email already in use: Si el correo electrónico ya está registrado.
2. Username already in use: Si el nombre de usuario ya está en uso.

### 2. **Inicio de Sesión de Usuario**
- **Método:** `POST`
- **Ruta:** `/api/auth/login`
- **Descripción:** Permite a los usuarios iniciar sesión en el sistema.
- **Cuerpo de la solicitud:**
```json
{
  "username": "string",
  "password": "string"
}
```
**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Login Successful",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "username": "string",
    "role": "Admin" | "Manager" | "Employee"
  }
}
```
**Errores Comunes:**
1. Invalid Credentials: Si el nombre de usuario o la contraseña son incorrectos.

### 3. **Crear Evaluación**
- **Método:** `POST`
- **Ruta:** `/api/evaluations`
- **Descripción:** Permite a los administradores y managers crear una nueva evaluación para un empleado.
- **Autorización:** Solo accesible para usuarios con rol **Manager** o **Admin**.
- **Cuerpo de la solicitud:**
  ```json
  {
    "employeeId": "string",
    "score": number,
    "comments": "string"
  }
    ```
**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Evaluation created successfully",
  "data": {
    "employee": "employee_id",
    "evaluator": "evaluator_id",
    "score": number,
    "comments": "string",
    "date": "date",
    "updatedAt": "date"
  }
}
```
**Errores Comunes:**
1. Unauthorized: user information missing: Si no se proporciona información del usuario.

### 4. **Obtener Evaluación por ID**
- **Método:** `GET`
- **Ruta:** `/api/evaluations/:id`
- **Descripción:** Permite a los administradores, managers y empleados obtener una evaluación específica.
- **Autorización:**  Accesible para usuarios con rol **Admin**, **Manager**, o **Employee**.
**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "employee": "employee_id",
    "evaluator": "evaluator_id",
    "feedbacks": [
      {
        "feedbackText": "string",
        "score": number,
        "date": "date",
        "user": "user_id"
      }
    ],
    "score": number,
    "comments": "string",
    "date": "date",
    "updatedAt": "date"
  }
}
```
**Errores Comunes:**
1. Unauthorized: user information missing: Si no se proporciona información del usuario.

### 5. **Actualizar Evaluación**
- **Método:** `PUT`
- **Ruta:** `/api/evaluations/:id`
- **Descripción:** Permite a los administradores y managers actualizar una evaluación existente.
- **Autorización:** Solo accesible para usuarios con rol **Manager** o **Admin**.
- **Cuerpo de la solicitud:**
```json
{
  "score": number,
  "comments": "string"
}
```
**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "employee": "employee_id",
    "evaluator": "evaluator_id",
    "score": number,
    "comments": "string",
    "date": "date",
    "updatedAt": "date"
  }
}
```
**Errores Comunes:**
1. Unauthorized: user information missing: Si no se proporciona información del usuario.

### 5. **Obtener Evaluaciones por ID de Empleado**
- **Método:** `GET`
- **Ruta:** `/api/evaluations/employee/:id`
- **Descripción:** Permite a los administradores, managers y empleados obtener todas las evaluaciones de un empleado específico.
- **Autorización:** Accesible para usuarios con rol **Admin**, **Manager**, o **Employee**.

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "employee": [],
      "evaluator": [],
      "feedbacks": [
        {
          "feedbackText": "string",
          "score": number,
          "date": "date",
          "user": "user_id"
        }
      ],
      "score": number,
      "comments": "string",
      "date": "date",
      "updatedAt": "date"
    }
  ]
}
```
**Errores Comunes:**
1. Unauthorized: user information missing: Si no se proporciona información del usuario.
