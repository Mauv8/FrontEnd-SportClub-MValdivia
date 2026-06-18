# 🚀 Backend API - Gestión de Usuarios

Este proyecto corresponde a una API desarrollada en **Node.js + Express**, diseñada como apoyo para la asignatura de **Front End**.

Permite a los estudiantes:
- Realizar login con autenticación
- Gestionar usuarios
- Consumir datos desde el frontend usando `fetch`
- Comprender la arquitectura de un backend real

---

# 📌 Tecnologías utilizadas

- Node.js
- Express
- JWT (autenticación)
- SQLite / MySQL (según entorno)
- dotenv
## Objetivo pedagógico

Este proyecto permite que los estudiantes:

- Hagan login real desde el frontend.
- Registren usuarios.
- Consuman rutas protegidas con token.
- Agreguen nuevos campos al modelo `User`.
- Evolucionen el backend sin tener toda la lógica en un solo archivo.

## Estructura

```text
backend_api_v2/
│── .env
│── .env.example
│── package.json
│── README.md
│── storage/
│── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── database.js
│   │   └── env.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── models/
│   │   ├── index.js
│   │   └── User.js
│   ├── repositories/
│   │   └── user.repository.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── index.js
│   │   └── user.routes.js
│   ├── seeders/
│   │   └── user.seeder.js
│   ├── services/
│   │   ├── auth.service.js
│   │   └── user.service.js
│   ├── utils/
│   │   ├── api-response.js
│   │   └── jwt.js
│   └── validators/
│       ├── auth.validator.js
│       └── user.validator.js
```

---

# ⚙️ Instalación del proyecto

## 1. Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/backend-api.git
cd backend-api
```

## 2. Instalar dependencias

```bash
npm install
```

## 3. Configurar variables de entorno

Crear archivo `.env` en la raíz:
  ### Trabajar con SQLite en local

  ```env
  DB_DIALECT=sqlite
  SQLITE_STORAGE=./storage/database.sqlite
  ```

  ### Trabajar con MySQL

  ```env
  DB_DIALECT=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_NAME=frontend_users_db
  DB_USER=root
  DB_PASSWORD=123456
  ```

## 4. Ejecutar el servidor

```bash
npm run dev
```

Servidor disponible en:
http://localhost:3000

---

## Modelo de usuario

```json
{
  "id": 1,
  "full_name": "Usuario Demo 1",
  "email": "usuario1@demo.cl",
  "pass": "hash_guardado_en_bd",
  "role": "user",
  "refresh_pass": false,
  "fecha_nacimiento": "2000-01-10",
  "otros": {
    "practica_deporte": true,
    "deporte": "fútbol"
  }
}
```

### Roles permitidos

- `user`
- `coach`
- `admin`

## Usuarios semilla

Al iniciar por primera vez, si la tabla está vacía, se crean estos usuarios:

- `usuario1@demo.cl` / `12345678`
- `coach1@demo.cl` / `12345678`
- `admin1@demo.cl` / `12345678`

## Endpoints

### Público

#### Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "admin1@demo.cl",
  "password": "12345678"
}
```

Respuesta:

```json
{
  "ok": true,
  "message": "Login exitoso.",
  "data": {
    "token": "jwt_token",
    "user": {
      "id": 1,
      "full_name": "Admin Demo 1",
      "email": "admin1@demo.cl",
      "role": "admin"
    }
  }
}
```

#### Registro de usuario normal

```http
POST /api/auth/register
```

Este endpoint crea siempre usuarios con rol `user`.

Body:

```json
{
  "id": 1,
  "full_name": "Demo User 1",
  "email": "user1@demo.cl",
  "password": "hashed_password",
  "role": "user",
  "must_change_password": false,
  "birth_date": "2000-01-10",
  "metadata": {
    "sports": [
      {
        "name": "football",
        "frequency_per_week": 3
      }
    ]
  }
}
```

### Protegido con Bearer Token

#### Ver mi perfil

```http
GET /api/auth/me
Authorization: Bearer TU_TOKEN
```

#### Listar usuarios

```http
GET /api/users
Authorization: Bearer TU_TOKEN
```

#### Filtrar usuarios por rol

```http
GET /api/users?role=coach
Authorization: Bearer TU_TOKEN
```

#### Obtener usuario por id

```http
GET /api/users/1
Authorization: Bearer TU_TOKEN
```

#### Crear usuario con cualquier rol

```http
POST /api/users
Authorization: Bearer TU_TOKEN
```

#### Actualizar usuario

```http
PUT /api/users/1
Authorization: Bearer TU_TOKEN
```

## Ejemplo desde frontend

### Login

```js
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user1@demo.cl',
    password: '12345678',
  })
});

const result = await response.json();
localStorage.setItem('token', result.data.token);
```

### Consumir ruta protegida

```js
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3000/api/users', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

const result = await response.json();
console.log(result);
```

## Ideas para seguir creciendo

- Agregar refresh tokens.
- Agregar middleware por roles.
- Separar módulo auth y módulo users aún más.
- Migrar de SQLite a MySQL o PostgreSQL sin rehacer controladores.
- Agregar validaciones más estrictas.
- Incorporar recuperación de contraseña.

## Nota docente

Este backend está pensado para que el foco del curso siga siendo Front End. El backend ya resuelve autenticación básica y persistencia para que los estudiantes se concentren en:

- formularios
- DOM
- validaciones
- fetch
- token
- rutas protegidas


#  Uso de Git

```bash
git init
git add .
git commit -m "feat: backend base"
git push
```

---

# ⚠️ Buenas prácticas

- No subir `.env`
- No subir base de datos
- Usar `.gitignore`

---

# 🧠 Frase clave

"El backend no es el objetivo… es la herramienta para aprender frontend real."





npm install sqlite3@5.1.7


Docker .env 

Tu .env del backend debe seguir así:

DB_HOST=mariadb
DB_PORT=3306
DB_NAME=frontend_users_db
DB_USER=club_user
DB_PASSWORD=club_pass



sudo docker compose down -v
sudo docker compose up -d --build

Luego revisar:

sudo docker ps
sudo docker logs club_mariadb
sudo docker logs club_backend