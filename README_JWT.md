# JWT Authentication Guide

This application now supports both **Session-based authentication** (for web views) and **JWT authentication** (for API access).

## Authentication Methods

### 1. Session-Based Authentication (Web Views)
- Used for server-side rendered pages
- Sessions stored in Express session
- Automatic redirect to login page if not authenticated
- Used for: `/dashboard`, `/users`, etc.

### 2. JWT Authentication (API)
- Used for REST API endpoints
- Token-based authentication
- Stateless authentication
- Used for: `/api/*` endpoints

## JWT Usage

### Signup (API)
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Login (API)
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Using JWT Token

Include the token in the Authorization header:

```bash
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Or as a query parameter:

```bash
GET /api/users?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user",
    ...
  }
}
```

## Environment Variables

Add to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
```

- `JWT_SECRET`: Secret key for signing tokens (use a strong random string in production)
- `JWT_EXPIRE`: Token expiration time (e.g., `7d`, `24h`, `1h`)

## Protected Routes

### API Routes (JWT Required)
- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `PATCH /api/users/:id` - Partial update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/auth/me` - Get current user

### Web Routes (Session Required)
- `GET /dashboard` - Dashboard
- `GET /users` - Users list
- `GET /users/create` - Create user form
- All user management pages

## Example: Using JWT with cURL

```bash
# 1. Login and get token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | jq -r '.token')

# 2. Use token to access protected route
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN"
```

## Example: Using JWT with JavaScript (Fetch)

```javascript
// Login
const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
  }),
});

const { token } = await loginResponse.json();

// Use token for authenticated requests
const usersResponse = await fetch('http://localhost:5000/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const users = await usersResponse.json();
```

## Token Expiration

By default, tokens expire after 7 days. You can change this in `.env`:

```env
JWT_EXPIRE=24h  # 24 hours
JWT_EXPIRE=1h   # 1 hour
JWT_EXPIRE=30d  # 30 days
```

When a token expires, you'll receive a 401 error and need to login again.

## Security Notes

1. **Never expose JWT_SECRET** - Keep it in `.env` and never commit it to version control
2. **Use HTTPS in production** - JWT tokens should only be sent over secure connections
3. **Store tokens securely** - In browsers, use httpOnly cookies or secure storage
4. **Rotate secrets** - Change JWT_SECRET periodically
5. **Set appropriate expiration** - Don't make tokens valid forever

