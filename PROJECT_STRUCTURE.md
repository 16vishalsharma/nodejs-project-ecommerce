# Project Structure

This document describes the file structure of the e-commerce Node.js application.

## Directory Structure

```
nodejs-project/
├── config/                 # Configuration files
│   └── database.js        # MongoDB connection configuration
├── controllers/            # Business logic controllers
│   └── userController.js  # User CRUD operations
├── middleware/             # Custom middleware
│   ├── errorHandler.js    # Global error handler
│   └── asyncHandler.js    # Async error wrapper
├── models/                 # Mongoose schemas and models
│   ├── User.js            # User model
│   ├── Product.js         # Product model (E-commerce)
│   ├── Category.js        # Category model (E-commerce)
│   └── Order.js           # Order model (E-commerce)
├── routes/                 # API route definitions
│   ├── index.js           # Main router (combines all routes)
│   └── userRoutes.js      # User routes
├── utils/                  # Utility functions and helpers
│   └── README.md          # Utils documentation
├── views/                  # View templates (emails, PDFs, etc.)
│   └── README.md          # Views documentation
├── .env                    # Environment variables (not in git)
├── .gitignore             # Git ignore file
├── package.json           # Node.js dependencies
├── server.js              # Main application entry point
└── README.md              # Project documentation
```

## File Descriptions

### Core Files

- **server.js** - Main application file. Sets up Express server, connects to database, and mounts routes.
- **package.json** - Node.js project configuration and dependencies.

### Configuration (`config/`)

- **database.js** - MongoDB connection setup using Mongoose. Handles connection and error handling.

### Models (`models/`)

Models define the database schema structure:

- **User.js** - User schema with fields: firstName, lastName, email, age, phone, address, etc.
- **Product.js** - Product schema for e-commerce: name, price, SKU, category, stock, variants, etc.
- **Category.js** - Category schema: name, slug, parentCategory, status, etc.
- **Order.js** - Order schema: orderNumber, user, items, totals, shipping, payment status, etc.

### Controllers (`controllers/`)

Controllers contain the business logic for handling requests:

- **userController.js** - Handles all user-related operations (create, read, update, delete).

### Routes (`routes/`)

Routes define the API endpoints:

- **index.js** - Main router that combines all route modules.
- **userRoutes.js** - Defines all user-related routes (POST, GET, PUT, PATCH, DELETE).

### Middleware (`middleware/`)

Custom middleware functions:

- **errorHandler.js** - Global error handling middleware. Catches and formats errors.
- **asyncHandler.js** - Wrapper for async functions to automatically catch errors.

### Utilities (`utils/`)

Place for utility functions like:
- Validation helpers
- Formatting functions
- File upload handlers
- Email utilities
- Payment helpers

### Views (`views/`)

Place for view templates:
- Email templates
- PDF templates (invoices, receipts)
- API documentation views

## Adding New Features

### To add a new model (e.g., Review):

1. Create `models/Review.js` with schema
2. Create `controllers/reviewController.js` with business logic
3. Create `routes/reviewRoutes.js` with route definitions
4. Add route to `routes/index.js`: `router.use('/reviews', reviewRoutes);`

### Example Flow

```
Request → Route → Controller → Model → Database
                ↓
            Response
```

## Best Practices

1. **Separation of Concerns**: Keep business logic in controllers, not routes.
2. **Error Handling**: Use asyncHandler wrapper and errorHandler middleware.
3. **Validation**: Use Mongoose schema validation and custom validators.
4. **Code Organization**: Follow the MVC pattern (Models, Views, Controllers).
5. **Scalability**: Structure allows easy addition of new features without modifying existing code.

## Database Collections

Mongoose automatically creates collections (tables) from model names:
- `users` - From User model
- `products` - From Product model
- `categories` - From Category model
- `orders` - From Order model

