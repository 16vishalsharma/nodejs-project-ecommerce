const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
const routes = require('./routes');
const viewRoutes = require('./routes/viewRoutes');
const authRoutes = require('./routes/authRoutes');

// Import URL controller for redirect route
const { redirectUrl } = require('./controllers/urlController');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { getCurrentUser } = require('./middleware/auth');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', './views');

// Static Files
app.use(express.static('public'));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Middleware to make session available in all views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Apply getCurrentUser middleware globally
app.use(getCurrentUser);

// URL Shortener redirect route (for /s/:shortCode) - Public
app.get('/s/:shortCode', redirectUrl);

// Auth Routes (Login, Signup, Logout) - Must be before API routes
app.use('/', authRoutes);

// View Routes (Server-Side Rendering)
app.use('/', viewRoutes);

// API Routes
app.use('/api', routes);

// Error Handler Middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
