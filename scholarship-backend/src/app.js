const express = require('express');
const cors = require('cors');
const routesV1 = require('./routes/v1');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health check
app.get('/', (req, res) => {
  res.json({
    name: 'EduCamino API',
    status: 'running',
    docs: '/api/v1/status',
  });
});

// API Routes
app.use('/api/v1', routesV1);

// Central error handler
app.use(errorHandler);

module.exports = app;
