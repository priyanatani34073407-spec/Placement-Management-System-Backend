# Placement Management System - Backend

Backend API for the Placement Management System built using Node.js, Express.js, and MongoDB.

## Project Overview

The Placement Management System is a web-based application designed to manage students, companies, placements, and user authentication.

This repository contains the backend REST API responsible for handling authentication, database operations, placement management, and communication with the frontend application.

## Features

- User Registration and Login
- JWT-based Authentication
- Student Management
- Company Management
- Placement Management
- MongoDB Database Integration
- Protected API Routes
- CORS Configuration
- RESTful API Architecture
- API Health Check
- Production Deployment Support

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- CORS
- dotenv
- Nodemon

## Project Structure

```text
Placement-Management-System-Backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── studentController.js
│   ├── companyController.js
│   └── placementController.js
│
├── middleware/
│   └── auth.js
│
├── models/
│   ├── User.js
│   ├── Student.js
│   ├── Company.js
│   └── Placement.js
│
├── routes/
│   ├── authRoutes.js
│   ├── studentRoutes.js
│   ├── companyRoutes.js
│   └── placementRoutes.js
│
├── scripts/
│   └── seedAdmin.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
