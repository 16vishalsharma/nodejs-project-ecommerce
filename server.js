const cluster = require('cluster');
const os = require('os');

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker exit and restart
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died (${signal || code}). Restarting...`);
    cluster.fork();
  });

  // Log when worker comes online
  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

} else {
  // Workers run the Express app
  const express = require('express');
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

  // Connect to MongoDB
  connectDB();

  // View Engine Setup
  app.set('view engine', 'ejs');
  app.set('views', './views');

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

  // Upload Routes
  app.use('/upload', uploadRoutes);

  // View Routes (Server-Side Rendering)
  app.use('/', viewRoutes);

  // API Routes
  app.use('/api', routes);

  // Error Handler Middleware (must be last)
  app.use(errorHandler);

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} running on port ${PORT}`);
  });
}
