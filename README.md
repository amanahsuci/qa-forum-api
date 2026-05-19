# Simple Q&A Forum API

A RESTful API for a Simple Q&A Forum application built with NestJS, Prisma ORM, and PostgreSQL. This API allows users to register, login, and manage discussion threads with proper authentication and authorization.

---

## Tech Stack

- **Framework:** NestJS (Node.js)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Token)
- **Password Hashing:** bcrypt
- **API Documentation:** Swagger (OpenAPI)

---

## Prerequisites

Make sure you have the following installed:

- [NestJS CLI](https://nestjs.com/) v10+
- [PostgreSQL](https://www.postgresql.org/)
- [npm](https://www.npmjs.com/)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/qa-forum-api.git
cd qa-forum-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/qa_forum_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="604800"
```

> `JWT_EXPIRES_IN` is in seconds. `604800` = 7 days.

### 4. Create the Database

Create a database named `qa_forum_db` in PostgreSQL (via pgAdmin or psql):

```sql
CREATE DATABASE qa_forum_db;
```

### 5. Run Database Migration

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 6. Seed Dummy Data (Optional)

```bash
npm run prisma:seed
```

### 7. Start the Server

```bash
npm run start:dev
```

Server will run at: `http://localhost:3000/api`

---
![alt text](image-1.png)

![alt text](image.png)

![alt text](image-2.png)

![alt text](image-3.png)

![alt text](image-4.png)

---

## API Documentation

Swagger UI is available at:

```
http://localhost:3000/api/docs
```

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | /api/auth/register | Register a new user | ❌ |
| POST | /api/auth/login | Login and get JWT token | ❌ |

### Users

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | /api/users/:id | Get a user's public profile | ❌ |

### Threads

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | /api/threads | Create a new thread | ✅ |
| GET | /api/threads | Get all threads | ❌ |
| GET | /api/threads/my-threads | Get current user's threads | ✅ |
| GET | /api/threads/:id | Get a specific thread | ❌ |
| PUT | /api/threads/:id | Update a thread (owner only) | ✅ |
| DELETE | /api/threads/:id | Delete a thread (owner only) | ✅ |

---

## Authentication

This API uses **JWT Bearer Token** authentication.

1. Register or login to get an `accessToken`
2. Include the token in the `Authorization` header for protected endpoints:

```
Authorization: Bearer <your_token_here>
```

In Swagger UI, click the **Authorize** button and paste your token (without the word "Bearer").

---

## Database Schema

```
users
─────────────────────────
id           String (UUID, PK)
username     String (unique)
email        String (unique)
passwordHash String
createdAt    DateTime

threads
─────────────────────────
id        String (UUID, PK)
title     String
content   String
userId    String (FK → users.id)
createdAt DateTime
updatedAt DateTime
```

**Relation:** One user can have many threads (one-to-many)

---

## Error Handling

All errors return a consistent JSON format:

```json
{
  "statusCode": 403,
  "timestamp": "2026-04-28T06:00:00.000Z",
  "path": "/api/threads/some-id",
  "message": "You are not allowed to delete this thread"
}
```

| Status Code | Meaning |
|---|---|
| 400 | Bad Request — validation error or invalid input |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — not the owner of the resource |
| 404 | Not Found — resource does not exist |
| 409 | Conflict — email or username already exists |
| 500 | Internal Server Error |

---

## Project Structure

```
src/
├── auth/
│   ├── dto/
│   │   └── auth.dto.ts          # RegisterDto, LoginDto
│   ├── auth.controller.ts       # Auth endpoints
│   ├── auth.module.ts
│   ├── auth.service.ts          # Register & login logic
│   └── jwt.strategy.ts          # JWT validation strategy
├── users/
│   ├── users.controller.ts      # User endpoints
│   ├── users.module.ts
│   └── users.service.ts         # User profile logic
├── threads/
│   ├── dto/
│   │   └── thread.dto.ts        # CreateThreadDto, UpdateThreadDto
│   ├── threads.controller.ts    # Thread endpoints
│   ├── threads.module.ts
│   └── threads.service.ts       # Thread CRUD logic + ownership check
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts        # Database connection
├── common/
│   ├── decorators/
│   │   └── current-user.decorator.ts  # @CurrentUser() decorator
│   ├── filters/
│   │   └── all-exceptions.filter.ts   # Global error handler
│   └── guards/
│       └── jwt-auth.guard.ts          # JWT auth guard
├── app.module.ts                # Root module
└── main.ts                      # Entry point + Swagger setup
prisma/
├── schema.prisma                # Database schema
└── seed.ts                      # Dummy data seeder
```