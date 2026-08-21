Placement Management System - Backend
REST API backend for the Placement Management System. The backend provides authentication and APIs for managing students, companies, and placement records.
Built with Node.js, Express, MongoDB, Mongoose, and JWT.
Features
Admin registration and login
JWT-based authentication
Student management
Company management
Placement management
Placement statistics for reports
Search and pagination support
Password change functionality
MongoDB database integration
CORS support for the deployed frontend
Health-check endpoint for deployment monitoring
Tech Stack
Technology
Purpose
Node.js
JavaScript runtime
Express.js
REST API framework
MongoDB
Database
Mongoose
MongoDB ODM
JWT
Authentication
bcryptjs
Password hashing
CORS
Cross-origin request handling
dotenv
Environment variable management
Project Structure
Placement-Management-System-Backend-main/
├── config/
│   └── db.js
├── controllers/
│   ├── authControllers.js
│   ├── companyControllers.js
│   ├── placementControllers.js
│   └── studentControllers.js
├── middleware/
│   └── auth.js
├── models/
│   ├── Company.js
│   ├── Placement.js
│   ├── Student.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── companyRoutes.js
│   ├── placementRoutes.js
│   └── studentRoutes.js
├── scripts/
│   └── seedAdmin.js
├── server.js
├── package.json
└── package-lock.json
Getting Started
1. Clone the repository
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Placement-Management-System-Backend-main
2. Install dependencies
npm install
3. Create the environment file
Create a .env file in the project root:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=8000
CLIENT_ORIGIN=http://localhost:5173
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
Do not commit .env or real credentials to GitHub.
4. Create the admin user
If you want to create the administrator account using the seed script:
npm run seed
The seed script uses ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD from .env.
5. Start the development server
npm run dev
The API will normally be available at:
http://localhost:8000
6. Start the production server
npm start
The server uses the PORT supplied by the hosting platform and falls back to 8000 when no port is provided.
Environment Variables
Variable
Required
Description
MONGO_URI
Yes
MongoDB connection string
JWT_SECRET
Yes
Secret used to sign and verify JWTs
PORT
No
Server port; defaults to 8000 locally
CLIENT_ORIGIN
Recommended
Deployed frontend URL allowed by CORS
ADMIN_NAME
For seed
Name used by the admin seed script
ADMIN_EMAIL
For seed
Email used by the admin seed script
ADMIN_PASSWORD
For seed
Password used by the admin seed script
For production, configure these variables in the hosting provider instead of storing them in the repository.
API Base Routes
Resource
Base Route
Authentication
Health
/api/health
Public
Authentication
/auth
Mixed
Students
/students
Required
Companies
/companies
Required
Placements
/placements
Required
API Endpoints
Authentication
Method
Endpoint
Description
Auth
POST
/auth/register
Register a user
Public
POST
/auth/login
Login and receive a JWT
Public
GET
/auth/me
Get the authenticated user's profile
Required
PUT
/auth/change-password
Change the authenticated user's password
Required
Students
Method
Endpoint
Description
GET
/students
Get students with pagination and sorting
GET
/students/search?q=
Search students
GET
/students/:id
Get a student by ID
POST
/students
Add a student
PUT
/students/:id
Update a student
DELETE
/students/:id
Delete a student
All student routes require authentication.
Companies
Method
Endpoint
Description
GET
/companies
Get companies with pagination and sorting
GET
/companies/search?q=
Search companies
GET
/companies/:id
Get a company by ID
POST
/companies
Add a company
PUT
/companies/:id
Update a company
DELETE
/companies/:id
Delete a company
All company routes require authentication.
Placements
Method
Endpoint
Description
GET
/placements
Get placement records
GET
/placements/stats
Get placement statistics
GET
/placements/:id
Get a placement by ID
POST
/placements
Create a placement record
PUT
/placements/:id
Update a placement
DELETE
/placements/:id
Delete a placement
All placement routes require authentication.
Authentication
After a successful login, the API returns a JWT token.
Send the token with protected requests using the Authorization header:
Authorization: Bearer <JWT_TOKEN>
The following route groups are protected:
/students
/companies
/placements
/auth/me
/auth/change-password
Health Check
The backend provides a public health-check endpoint:
GET /api/health
Successful response:
{
  "success": true,
  "message": "API is healthy"
}
For a Render deployment, use:
https://YOUR-RENDER-SERVICE.onrender.com/api/health
Frontend Integration
The frontend is deployed separately and communicates with this backend through the Render service URL.
Set the frontend environment variable to the backend URL:
VITE_API_BASE_URL=https://YOUR-RENDER-SERVICE.onrender.com
Do not append /api to VITE_API_BASE_URL, because the current API routes use /auth, /students, /companies, and /placements.
For the backend, set:
CLIENT_ORIGIN=https://YOUR-VERCEL-FRONTEND.vercel.app
This allows the deployed Vercel frontend to access the API through CORS.
Deployment on Render
Build Command
npm install
Start Command
npm start
Required Environment Variables
Add the following variables in the Render dashboard:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_ORIGIN=https://YOUR-VERCEL-FRONTEND.vercel.app
If the admin seed script is required:
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
After deployment, verify the service using /api/health.
MongoDB
This project uses MongoDB through Mongoose.
Make sure your MongoDB Atlas configuration allows connections from your hosting environment. The MONGO_URI value should be stored as an environment variable and should never be committed to the repository.
Available Scripts
Command
Description
npm install
Install project dependencies
npm run dev
Start the development server with Nodemon
npm start
Start the production server
npm run seed
Create or update the admin user
Security Notes
Never commit .env files.
Never expose JWT_SECRET publicly.
Use a strong production JWT secret.
Use a strong admin password.
Configure CLIENT_ORIGIN with the actual deployed frontend URL.
Keep MongoDB credentials private.
Project Status
Backend: Ready for local development and Render deployment.
Frontend: Designed to communicate with the backend through the configured API base URL.
Author
Shaik Anas
B.Tech - Data Science
Chalapathi Institute of Technology
