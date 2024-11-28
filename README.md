
# Performance Evaluations API Project

This project is an API for managing performance evaluations within an organization. It enables administrators, managers, and employees to interact with the system to view, create, and manage evaluations.

## Features
- Authentication and authorization using JWT.
- User management with roles (`Admin`, `Manager`, `Employee`).
- Data validation using Zod.
- Centralized error handling.
- Layered architecture for controllers, services, and models.

## Technologies
- **Node.js** and **Express** for the API.
- **MongoDB** as the database.
- **Mongoose** for data management.
- **TypeScript** as the main language.
- **Zod** for data validation.
- **Vitest** for unit testing.

## Requirements
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **.env** file with the following environment variables:
```bash
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret-key>
```

### Folder Structure
- **dist**: Contains compiled JavaScript files from TypeScript.
- **node_modules**: Dependencies installed for the project.
- **src**: Main folder for source code.
  - **config**: Configuration files, including database connection.
  - **controllers**: Manage requests and responses.
  - **middlewares**: Middleware functions executed during request lifecycles.
  - **models**: Represent data structures in the application.
  - **routes**: Define application routes.
  - **schemas**: Define data validation schemas.
  - **services**: Business logic reusable across the application.
  - **types**: TypeScript types and interfaces.
- **app.ts**: Main file configuring the Express app.
- **server.ts**: File starting the server.
- **.env**: Environment variables.
- **.gitignore**: Files and folders ignored by version control.
- **package-lock.json**: Tracks the exact dependency versions installed.
- **package.json**: Contains project metadata and dependencies.
- **README.md**: Project documentation.
- **tsconfig.json**: TypeScript compiler configuration.

## Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file at the root of the project and add environment variables as mentioned in the requirements.

4. Compile the TypeScript project to JavaScript:
```bash
npm run build
```

5. Start the server:
```bash
npm run start
```
Alternatively, for development with auto-restart, use:
```bash
npm run dev
```

## Endpoints

### 1. **User Registration**
- **Method:** `POST`
- **Route:** `/api/auth/register`
- **Description:** Allows administrators to register a new user in the system.
- **Authorization:** Only accessible to users with the **Admin** role.
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "role": "Admin" | "Manager" | "Employee"
  }
  ```
**Successful Response (201):**
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
**Common Errors:**
1. Email already in use: If the email is already registered.
2. Username already in use: If the username is already taken.

### 2. **User Login**
- **Method:** `POST`
- **Route:** `/api/auth/login`
- **Description:** Allows users to log into the system.
- **Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```
**Successful Response (200):**
```json
{
  "success": true,
  "message": "Login Successful",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string",
    "role": "Admin" | "Manager" | "Employee"
  }
}
```
**Common Errors:**
1. Invalid Credentials: If the username or password is incorrect.

### 3. **Create Evaluation**
- **Method:** `POST`
- **Route:** `/api/evaluations`
- **Description:** Allows administrators and managers to create a new evaluation for an employee.
- **Authorization:** Accessible only to users with **Manager** or **Admin** roles.
- **Request Body:**
  ```json
  {
    "employeeId": "string",
    "score": number,
    "comments": "string"
  }
  ```
**Successful Response (201):**
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

### Additional Endpoints
Details are provided for:
- **Update Evaluation** (`PUT /api/evaluations/:id`)
- **Get Evaluations by Employee ID** (`GET /api/evaluations/employee/:id`)
- **Get All Employees** (`GET /api/employees`)
- **Generate Employee Report** (`GET /api/reports/employee/:id`)
- **Add Feedback to an Evaluation** (`POST /api/feedback`)

## Running Tests
```bash
npm run test
```