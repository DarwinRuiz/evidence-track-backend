# 🚀 EvidenceTrack API — Backend (Node.js + Express + TypeScript)

EvidenceTrack API es un servicio backend modular diseñado para la gestión profesional de expedientes y evidencias.  
Incluye autenticación segura con JWT, autorización por roles, arquitectura modular por features, validaciones robustas, stored procedures y pruebas automatizadas.

---

## 📌 Tecnologías Principales

-   **Node.js + Express**
-   **TypeScript**
-   **Knex.js** (SQL Server)
-   **JWT Authentication**
-   **Zod** para validación
-   **Winston Logger**
-   **Jest + Supertest** para testing
-   Arquitectura **feature-based**

---

## 📂 Estructura del Proyecto

```
src/
├── app.ts
├── server.ts
├── config/
│ ├── env.ts
│ ├── knexfile.ts
│ └── logger.ts
├── core/
│ ├── http/
│ ├── security/
│ └── utils/
├── database/
├── middlewares/
├── modules/
│ ├── auth/
│ ├── users/
│ ├── roles/
│ ├── case-file/
│ ├── evidence-item/
│ └── reports/
└── tests/
```

---

## 🔧 Instalación

### 1️⃣ Clonar repo

```bash
git clone https://github.com/DarwinRuiz/evidence-track-backend.git
cd evidence-track-backend
```

### 2️⃣ Instalar dependencias

```bash
pnpm install
```

### Crear archivo .env

```
PORT=3000
JWT_SECRET=super_secret
DATABASE_HOST=localhost
DATABASE_PORT=1433
DATABASE_USER=sa
DATABASE_PASSWORD=YourPassword
DATABASE_NAME=evidence_track
```

### Ejecutar en modo desarrollo

```bash
pnpm dev
```

### Ejecutar tests

```bash
pnpm test
```

---

## 🗄 Base de Datos

Utiliza SQL Server con los esquemas:

-   `admin` → roles y usuarios
-   `dicri` → expedientes y evidencias

Script completo en:
`database/scripts/initial_schema.sql`

Incluye datos iniciales (roles, usuarios, expedientes y evidencia).

---

## 🔐 Autenticación & Autorización

-   Autenticación por **JWT Bearer Token**
-   Middleware: `authenticationMiddleware`
-   Roles:
    -   ADMINISTRATOR
    -   COORDINATOR
    -   TECHNICIAN

Autorización granular:

```ts
createRoleAuthorizationMiddleware(['COORDINATOR', 'TECHNICIAN']);
```

---

## 📡 Endpoints Principales

### 🔸 Auth

| Método | Ruta        | Descripción |
| ------ | ----------- | ----------- |
| POST   | /auth/login | Login       |

### Users

| GET | /users |
| POST | /users |
| PUT | /users/:id |
| DELETE | /users/:id |

### Case Files

| GET | /case-files |
| GET | /case-files/:id |
| POST | /case-files |
| PUT | /case-files/:id |
| DELETE | /case-files/:id |

### Evidence Items

| GET | /evidence-items |
| POST | /evidence-items |
| PUT | /evidence-items/:id |
| DELETE | /evidence-items/:id |

### Reports

| GET | /reports/overview |
| GET | /reports/status-by-day |
| GET | /reports/technician-activity |
| GET | /reports/evidence-density |

---

## 🧪 Testing

Incluye pruebas para:

-   auth
-   users
-   roles
-   case-file
-   evidence-item
-   reports

Ejecutar:

```bash
pnpm test
```

---

## 🧱 Arquitectura

### ✔ Feature Modules

Cada módulo contiene:

-   `*.model.ts`
-   `*.validators.ts`
-   `*.repository.ts`
-   `*.service.ts`
-   `*.controller.ts`
-   `*.routes.ts`

### ✔ Respuesta estandarizada

```json
{
"success": true,
"message": "OK",
"data": { ... }
}
```

### ✔ Error handling

Errores controlados con `ApiError`  
Errores inesperados → `UNEXPECTED_ERROR`

---

## 🧑‍💻 Autor

**Darwin Ruiz**  
Arquitecto de Software — Node.js, Express, SQL Server, React.
