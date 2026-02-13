
# Task Management System Backend

## Overview
A robust backend for a Task Management System built with Node.js, Express, and PostgreSQL (via Sequelize).

## Features
- **Authentication**: Email-based OTP registration, JWT Login (Access + Refresh Tokens).
- **Task Management**: CRUD operations for tasks (Title, Description, Status).
- **Security**: Rate limiting, Helmet, Input Validation (Joi), Global Error Handling.
- **Logging**: Activity logging for security events and task operations.
- **Documentation**: Swagger UI at `/api-docs`.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Validation**: Joi
- **Security**: Helmet, bcryptjs, jsonwebtoken, express-rate-limit

## Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env` (see `.env.example`).
   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/taskdb
   ```
4. Run the server:
   ```bash
   npm run dev
   ```

## API Documentation
- **Swagger UI**: Visit `http://localhost:3000/api-docs` after starting the server.

## Design Decisions
- **Sequelize**: Used for strictly typed schema definitions and easy migration handling (though explicit migrations were skipped for this simplified implementation in favor of `sequelize.sync()`).
- **Joi**: Chosen for schema-based data validation over express-validator for cleaner separation of concerns.
- **Project Structure**: Controller-Service-Repository pattern (simplified to Controller-Model for this scope) for separation of concerns.

