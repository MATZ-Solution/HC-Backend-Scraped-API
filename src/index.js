const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

//routes
const databaseConnection = require('./utils/db');
const healthCareRoute = require('./routes/healthCareRoute');
const sendEmailRoute = require('./routes/sendEmailRoutes');
const professionalRoute = require('./routes/professionalRoute');
const blockedIp = require('./Model/blockedIpModel');

const errorMiddleware = require('./middleware/error');

dotenv.config();

app.use(cors());

//this is only for passport initialization

app.use(express.json()); // Parse incoming JSON data

// Connect to the MongoDB database
databaseConnection.connect();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 25,
  message: 'Too many requests from this IP, please try again later.',
});

// limiter middleware to your routes
app.use('/api', limiter);

app.use('/api', async (req, res, next) => {
  // Check if the request exceeded the rate limit
  const isIpBlocked = await blockedIp.find({
    ip: req.ip,
    blockedStatus: true,
  });

  if (isIpBlocked.length > 0) {
    console.log(`IP ${req.ip} is blocked.`);
    return res.status(403).json({ error: 'Access denied.' });
  } else if (req.rateLimit.remaining === 0) {
    await blockedIp.create({
      ip: req.ip,
      blockedStatus: true,
    });

    console.log(`IP ${req.ip} has exceeded the rate limit.`);

    return res
      .status(429)
      .json({ error: 'Rate limit exceeded. Please try again later.' });
  }

  // If not exceeded, continue with the next middleware
  next();
});

app.use('/api/healthCareRoute', healthCareRoute);
app.use('/api/sendEmail', sendEmailRoute);

//===============Professional Route====================
app.use('/api/professionalRoute', professionalRoute);
//=====================================================

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Professional Scrapped');
});

// Start the server and listen for incoming requests
app.listen(3000, () => {
  console.log(`Backend server is running on ${3000}!`);
});
