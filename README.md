# Placement Management System — Backend

Express + MongoDB (Mongoose) REST API for managing student and company records, tracking placements, and JWT-based admin authentication.

## Setup

```bash
npm install
cp .env.example .env      # set MONGO_URI and JWT_SECRET at minimum
npm run seed                # creates the admin user from ADMIN_EMAIL/ADMIN_PASSWORD
npm run dev                 # nodemon, http://localhost:8000
```

## Environment Variables

| Variable        | Description                                          |
|------------------|-------------------------------------------------------|
| MONGO_URI        | MongoDB connection string                             |
| PORT             | Port to run the server on (default 8000)               |
| JWT_SECRET       | Secret used to sign/verify JWTs — use a long random value |
| ADMIN_NAME       | Used only by `npm run seed`                             |
| ADMIN_EMAIL      | Used only by `npm run seed`                             |
| ADMIN_PASSWORD   | Used only by `npm run seed`                             |

Run `npm run seed` again any time to reset the admin password to `ADMIN_PASSWORD`.

## Authentication

All `/students`, `/companies`, and `/placements` routes require a valid JWT.
Log in via `POST /auth/login` to get a token, then send it as:

```
Authorization: Bearer <token>
```

## API Endpoints

### Auth (`/auth`) — public except `/me` and `/change-password`
| Method | Endpoint                | Description                    |
|--------|---------------------------|----------------------------------|
| POST   | `/auth/login`             | Log in, returns `{ token, user }` |
| GET    | `/auth/me`                 | Get the logged-in admin's profile |
| PUT    | `/auth/change-password`    | Change the logged-in admin's password |

### Students (`/students`) — requires auth
| Method | Endpoint             | Description                                  |
|--------|-----------------------|-----------------------------------------------|
| GET    | `/students/search?q=` | Search students by name/email/phone/branch    |
| GET    | `/students`           | List students (supports `page`, `limit`, `sort`, `order`) |
| GET    | `/students/:id`       | Get a single student                          |
| POST   | `/students`            | Register a student                            |
| PUT    | `/students/:id`        | Update a student                              |
| DELETE | `/students/:id`        | Delete a student                              |

### Companies (`/companies`) — requires auth
| Method | Endpoint              | Description                                   |
|--------|------------------------|------------------------------------------------|
| GET    | `/companies/search?q=` | Search companies by name/location/HR/email    |
| GET    | `/companies`           | List companies (supports `page`, `limit`, `sort`, `order`) |
| GET    | `/companies/:id`       | Get a single company                          |
| POST   | `/companies`            | Register a company                            |
| PUT    | `/companies/:id`        | Update a company                              |
| DELETE | `/companies/:id`        | Delete a company                              |

### Placements (`/placements`) — requires auth
Links a student to a company with a status (`Applied` → `Shortlisted` → `Selected`/`Rejected`).

| Method | Endpoint              | Description                                   |
|--------|------------------------|------------------------------------------------|
| GET    | `/placements/stats`    | Aggregate stats for the Reports page (placement rate, branch/status/top-company breakdowns) |
| GET    | `/placements`           | List placements (supports `page`, `limit`), populated with student + company |
| GET    | `/placements/:id`       | Get a single placement                        |
| POST   | `/placements`            | Record a placement (`student`, `company`, `package`, `status`) |
| PUT    | `/placements/:id`        | Update a placement (e.g. change status)       |
| DELETE | `/placements/:id`        | Delete a placement                            |
