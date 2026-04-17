const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
const routes = require('./routes');
const viewRoutes = require('./routes/viewRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Import URL controller for redirect route
const { redirectUrl } = require('./controllers/urlController');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { getCurrentUser } = require('./middleware/auth');

// Initialize Express app
const app = express();

// Ensure DB is connected before handling any request (serverless-safe)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', './views');

// CORS - allow frontend to call API
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Static Files
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// Middleware to make session available in all views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Apply getCurrentUser middleware globally
app.use(getCurrentUser);

// URL Shortener redirect route (for /s/:shortCode) - Public
app.get('/s/:shortCode', redirectUrl);

// Auth Routes (Login, Signup, Logout) - Must be before API routes
app.use('/', authRoutes);

// Upload Routes
app.use('/upload', uploadRoutes);

// API Routes (before view routes to avoid /api catch-all in viewRoutes)
app.use('/api', routes);

// View Routes (Server-Side Rendering)
app.use('/', viewRoutes);

// Error Handler Middleware (must be last)
app.use(errorHandler);

// Start server only when not running in a serverless environment (e.g. Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
