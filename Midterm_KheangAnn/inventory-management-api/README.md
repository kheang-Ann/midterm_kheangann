# Inventory Management API

A warehouse system REST API built with **NestJS** featuring JWT authentication, inventory item CRUD, stock level tracking, supplier management, and real-time availability updates.

## Tech Stack

- **Framework**: NestJS (Node.js / TypeScript)
- **Database**: SQLite via TypeORM (better-sqlite3)
- **Auth**: JWT (JSON Web Tokens) + Passport.js
- **Validation**: class-validator / class-transformer
- **Docs**: Swagger / OpenAPI
- **Testing**: Jest + Supertest
- **CI/CD**: GitHub Actions

---

## Project Structure

```
src/
├── auth/               # JWT authentication (register, login, profile)
├── inventory/          # Inventory items CRUD + stock management
├── suppliers/          # Supplier management CRUD
└── app.module.ts       # Root module

test/                   # E2E integration tests
.github/workflows/      # GitHub Actions CI pipeline
```

---

## API Endpoints

### Authentication
| Method | Endpoint         | Description              | Auth |
|--------|-----------------|--------------------------|------|
| POST   | /auth/register  | Register new user        | No   |
| POST   | /auth/login     | Login, get JWT token     | No   |
| GET    | /auth/profile   | Get current user profile | Yes  |

### Inventory Items (Full CRUD)
| Method | Endpoint                    | Description                  | Auth |
|--------|-----------------------------|------------------------------|------|
| POST   | /inventory                  | Create inventory item        | Yes  |
| GET    | /inventory                  | List all items (filter by category) | Yes |
| GET    | /inventory/low-stock        | Get low stock items          | Yes  |
| GET    | /inventory/sku/:sku         | Get item by SKU              | Yes  |
| GET    | /inventory/:id              | Get item by ID               | Yes  |
| GET    | /inventory/:id/availability | Real-time availability check | Yes  |
| PATCH  | /inventory/:id              | Update item                  | Yes  |
| PATCH  | /inventory/:id/stock        | Adjust stock level           | Yes  |
| DELETE | /inventory/:id              | Delete item                  | Yes  |

### Suppliers
| Method | Endpoint        | Description       | Auth |
|--------|----------------|-------------------|------|
| POST   | /suppliers      | Create supplier   | Yes  |
| GET    | /suppliers      | List all suppliers| Yes  |
| GET    | /suppliers/:id  | Get supplier by ID| Yes  |
| PATCH  | /suppliers/:id  | Update supplier   | Yes  |
| DELETE | /suppliers/:id  | Delete supplier   | Yes  |

---

## Getting Started

### Install dependencies
```bash
npm install
```

### Run in development
```bash
npm run start:dev
```

### Run in production
```bash
npm run build
npm run start:prod
```

The API runs on `http://localhost:3000`  
Swagger docs: `http://localhost:3000/api/docs`

---

## Running Tests

### Unit tests (service layer)
```bash
npm test
```

### E2E integration tests
```bash
npm run test:e2e
```

### Test coverage report
```bash
npm run test:cov
```

---

## GitHub Actions CI/CD

The pipeline (`.github/workflows/ci.yml`) triggers on every push/PR to `main`:

1. Installs dependencies
2. Runs unit tests
3. Runs E2E tests
4. Generates coverage report
5. **Sends email** to the committer AND `srengty@gmail.com` with pass/fail result

### Required GitHub Secrets

Go to your repo → **Settings → Secrets and variables → Actions** and add:

| Secret Name     | Value                                      |
|-----------------|--------------------------------------------|
| `MAIL_USERNAME` | Your Gmail address (e.g. `you@gmail.com`)  |
| `MAIL_PASSWORD` | Gmail App Password (not your login password) |

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App passwords → Generate one for "Mail".

---

## Environment Variables

| Variable     | Default                        | Description        |
|--------------|--------------------------------|--------------------|
| `JWT_SECRET` | `inventory-secret-key-2024`    | JWT signing secret |
| `PORT`       | `3000`                         | Server port        |
| `NODE_ENV`   | (unset)                        | Set to `test` for in-memory DB |
