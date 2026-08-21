Placement Management System — Backend
A MERN-stack backend API for managing students, companies, placements, and administrator authentication. Built with Node.js, Express, MongoDB, Mongoose, and JWT.
Project Structure
config/          MongoDB connection configuration
controllers/     Authentication and CRUD business logic
middleware/      JWT authentication middleware
models/          Mongoose schemas
routes/          Express API routes
scripts/         Admin seeding utility
server.js        Express application entry point
Setup
npm install
cp .env.example .env      # set MONGO_URI and JWT_SECRET at minimum
npm run seed                # creates the admin user from ADMIN_EMAIL/ADMIN_PASSWORD
npm run dev                 # nodemon, http://localhost:8000
Environment Variables
Variable
Description
MONGO_URI
MongoDB connection string
PORT
Port to run the server on (default 8000)
JWT_SECRET
Secret used to sign/verify JWTs — use a long random value
ADMIN_NAME
Used only by npm run seed
ADMIN_EMAIL
Used only by npm run seed
ADMIN_PASSWORD
Used only by npm run seed
CLIENT_ORIGIN
Deployed Vercel frontend origin allowed by CORS
Run npm run seed again any time to reset the admin password to ADMIN_PASSWORD.
Production Environment
For Render or another production host, set the same environment variables in the hosting dashboard. Do not commit .env or real credentials to GitHub.
Health Check
The API exposes GET /api/health for deployment checks. A healthy response is:
{
  "success": true,
  "message": "API is healthy"
}
Database
The backend uses MongoDB through Mongoose. MONGO_URI must be supplied through the environment. The application validates that the variable exists before attempting a connection.
Authentication
All /students, /companies, and /placements routes require a valid JWT. Log in via POST /auth/login to get a token, then send it as:
Authorization: Bearer <token>
CORS and Frontend Integration
Set CLIENT_ORIGIN to the deployed Vercel frontend URL. Local development also allows http://localhost:5173 and http://127.0.0.1:5173.
The frontend should use the Render backend URL as its API base URL. Keep the existing route prefixes /auth, /students, /companies, and /placements.
API Endpoints
Auth (/auth) — public except /me and /change-password
Method
Endpoint
Description
POST
/auth/login
Log in, returns { token, user }
GET
/auth/me
Get the logged-in admin's profile
PUT
/auth/change-password
Change the logged-in admin's password
Students (/students) — requires auth
Method
Endpoint
Description
GET
/students/search?q=
Search students by name/email/phone/branch
GET
/students
List students (supports page, limit, sort, order)
GET
/students/:id
Get a single student
POST
/students
Register a student
PUT
/students/:id
Update a student
DELETE
/students/:id
Delete a student
Companies (/companies) — requires auth
Method
Endpoint
Description
GET
/companies/search?q=
Search companies by name/location/HR/email
GET
/companies
List companies (supports page, limit, sort, order)
GET
/companies/:id
Get a single company
POST
/companies
Register a company
PUT
/companies/:id
Update a company
DELETE
/companies/:id
Delete a company
Placements (/placements) — requires auth
Links a student to a company with a status (Applied → Shortlisted → Selected/Rejected).
Method
Endpoint
Description
GET
/placements/stats
Aggregate stats for the Reports page (placement rate, branch/status/top-company breakdowns)
GET
/placements
List placements (supports page, limit), populated with student + company
GET
/placements/:id
Get a single placement
POST
/placements
Record a placement (student, company, package, status)
PUT
/placements/:id
Update a placement (e.g. change status)
DELETE
/placements/:id
Delete a placement
