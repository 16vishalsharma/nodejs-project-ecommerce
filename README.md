# E-commerce Node.js API Project

A scalable Node.js project with Express and MongoDB, featuring a clean MVC architecture with full CRUD operations. Built for e-commerce applications with support for Users, Products, Categories, and Orders.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

3. Update the `.env` file with your MongoDB connection string and JWT secret:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
SESSION_SECRET=your-session-secret-key-change-in-production
```

For MongoDB Atlas, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

**Important:** Change `JWT_SECRET` and `SESSION_SECRET` to strong, random strings in production!

## Running the Server

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Authentication

This application supports **dual authentication**:
- **Session-based** (for web views) - Automatic redirects to login
- **JWT-based** (for API) - Token-based stateless authentication

### Quick Start with JWT

1. **Login/Signup via API** to get a token:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

2. **Use the token** in subsequent requests:
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

See [README_JWT.md](./README_JWT.md) for detailed JWT documentation and examples.

## Project Structure

This project follows MVC (Model-View-Controller) architecture:

```
├── config/          # Configuration files (database connection)
├── controllers/     # Business logic controllers
├── middleware/     # Custom middleware (error handling, async wrapper)
├── models/         # Mongoose schemas (User, Product, Category, Order)
├── routes/         # API route definitions
├── utils/          # Utility functions
├── views/          # View templates (emails, PDFs, etc.)
└── server.js       # Main application entry point
```

For detailed structure information, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## Available Models

The project includes the following Mongoose models:

1. **User** - User management with authentication-ready fields
2. **Product** - E-commerce product catalog with variants, inventory, and SEO
3. **Category** - Product categories with hierarchical support
4. **Order** - Order management with payment and shipping tracking

## User Schema Structure

The User model includes the following fields:

- `firstName` (String, required) - User's first name
- `lastName` (String, required) - User's last name
- `email` (String, required, unique) - User's email address
- `age` (Number, optional) - User's age
- `phone` (String, optional) - User's phone number
- `address` (Object, optional) - User's address with:
  - `street` (String)
  - `city` (String)
  - `state` (String)
  - `zipCode` (String)
  - `country` (String)
- `isActive` (Boolean, default: true) - User active status
- `createdAt` (Date, auto-generated) - Creation timestamp
- `updatedAt` (Date, auto-updated) - Last update timestamp

## API Endpoints - User CRUD Operations

### POST /api/users
Create a new user

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "age": 30,
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "age": 30,
    "phone": "+1234567890",
    "address": { ... },
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /api/users
Get all users

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      ...
    }
  ]
}
```

### GET /api/users/:id
Get a single user by ID

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    ...
  }
}
```

### PUT /api/users/:id
Update a user by ID (full update - replaces entire document)

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "age": 25,
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "...",
    "firstName": "Jane",
    "lastName": "Smith",
    ...
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PATCH /api/users/:id
Update a user by ID (partial update - updates only provided fields)

**Request Body:**
```json
{
  "age": 31,
  "isActive": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "age": 31,
    "isActive": false,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### DELETE /api/users/:id
Delete a user by ID

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    ...
  }
}
```

## Example Usage

### Create a user:
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "age": 30,
    "phone": "+1234567890"
  }'
```

### Get all users:
```bash
curl http://localhost:5000/api/users
```

### Get single user:
```bash
curl http://localhost:5000/api/users/USER_ID
```

### Update user (PUT - full update):
```bash
curl -X PUT http://localhost:5000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "age": 25
  }'
```

### Update user (PATCH - partial update):
```bash
curl -X PATCH http://localhost:5000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{"age": 31}'
```

### Delete user:
```bash
curl -X DELETE http://localhost:5000/api/users/USER_ID
```

