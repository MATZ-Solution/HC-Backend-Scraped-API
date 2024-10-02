const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

//routes
const databaseConnection = require('./utils/db');
const healthCareRoute = require('./routes/healthCareRoute');
const sendEmailRoute = require('./routes/sendEmailRoutes');
const professionalRoute = require('./routes/professionalRoute');
const npiRoute = require('./routes/npiRoute');

// const blockedIp = require('./Model/blockedIpModel');

const errorMiddleware = require('./middleware/error');

dotenv.config();

app.use(cors());

//this is only for passport initialization

app.use(express.json()); // Parse incoming JSON data

// Connect to the MongoDB database
databaseConnection.connect();

const BLOCK_DURATION = 3600 * 1000; // 1 hour in milliseconds

// Use a Map to store blocked IPs with their block timestamp
const blockedIPs = new Map();

// Rate limiter configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    // Add the IP to the blocked list with the current timestamp
    blockedIPs.set(req.ip, Date.now());
    return res.status(429).json({
      status: 429,
      error: 'Too many requests',
      message: 'You have exceeded the 100 requests in 15 mins limit and your IP has been temporarily blocked!',
    });
  },
});

app.use((req, res, next) => {
  const clientIP = req.ip;
  const blockedAt = blockedIPs.get(clientIP);

  if (blockedAt) {
    const timeSinceBlocked = Date.now() - blockedAt;
    if (timeSinceBlocked < BLOCK_DURATION) {
      return res.status(403).json({
        status: 403,
        error: 'Forbidden',
        message: 'Your IP has been blocked temporarily. Please try again later.'
      });
    } else {
      // Remove IP from blocked list after block duration has passed
      blockedIPs.delete(clientIP);
    }
  }

  next();
});



//limit
// app.get('/', limiter, async (req, res) => {
//   try {
//     // console.log(req.ip);
//     // let res = await axios.get(`http://ip-api.com/json/192.168.10.11`);
//     // console.log(res.data);
//     res.send('Professional Scrapped 10/18/23 4:25');
//   } catch (err) {
//     console.log(err);
//   }
// });


// limiter middleware to your routes
// app.use('/api', limiter);

// app.use('/api', async (req, res, next) => {
//   // Check if the request exceeded the rate limit
//   const isIpBlocked = await blockedIp.find({
//     ip: req.ip,
//     blockedStatus: true,
//   });

//   if (isIpBlocked.length > 0) {
//     console.log(`IP ${req.ip} is blocked.`);
//     return res.status(403).json({ error: 'Access denied.' });
//   } else if (req.rateLimit.remaining === 0) {
//     await blockedIp.create({
//       ip: req.ip,
//       blockedStatus: true,
//     });

//     console.log(`IP ${req.ip} has exceeded the rate limit.`);

//     return res
//       .status(429)
//       .json({ error: 'Rate limit exceeded. Please try again later.' });
//   }

//   // If not exceeded, continue with the next middleware
//   next();
// });

app.use('/api/healthCareRoute', healthCareRoute);
app.use('/api/sendEmail', sendEmailRoute);

app.use('/api/npi/',npiRoute)
//===============Professional Route====================
app.use('/api/professionalRoute', professionalRoute);
//=====================================================

app.use(errorMiddleware);
// app.enable('trust proxy');


app.get('/', async (req, res) => {
  try {
    // console.log(req.ip);
    // let res = await axios.get(`http://ip-api.com/json/192.168.10.11`);
    // console.log(res.data);
    res.send('Professional Scrapped 10/18/23 4:25');
  } catch (err) {
    console.log(err);
  }
});


//for only counting purpose
// const skilledNursingFacility = require('../src/Model/skilledNursingFacilityModel');
// const adultDayCareModel = require('../src/Model/adultDayCareModel');
// const assistedLiving = require('../src/Model/assistedLiving');
// const careRetirementCommunities = require('../src/Model/careRetirementCommunities');
// const geriatorCareManagerModel = require('../src/Model/geriatorCareManagerModel');
// const hoSpiceModel = require('../src/Model/hoSpice');
// const inHomeCare = require('../src/Model/inHomeCare');
// const independentLiving = require('../src/Model/independentLiving');
// const memoryCareModel = require('../src/Model/memoryCareModel');

// const nursingHome = require('../src/Model/nursingHome');
// const longtermCares = require('../src/Model/longtermCares');
// const inpatientRehabilitiaion = require('../src/Model/inpatientRehabilitiaion');
// const hoSpiceModel = require('../src/Model/hospital');
// const hoSpiceModel = require('../src/Model/homeHealth');
// const dialysisFacility = require('../src/Model/dialysisFacility'); not available
// const groupPracticeModel = require('../src/Model/groupPractice'); not availble

// app.get('/count', async (req, res) => {
//   try {
//     const [
//       skilledNursingFacilityResponse,
//       adultDayCareModelResponse,
//       assistedLivingResponse,
//       careRetirementCommunitiesResponse,
//       geriatorCareManagerModelResponse,
//       hoSpiceModelResponse,
//       inHomeCareResponse,
//       independentLivingResponse,
//       memoryCareModelResponse,
//     ] = await Promise.all([
//       skilledNursingFacility.count({
//         photos: { $exists: true, $ne: [] },
//       }),
//       adultDayCareModel.count({
//         photos: { $exists: true, $ne: [] },
//       }),
//       assistedLiving.count({
//         photos: { $exists: true, $ne: [] },
//       }),
//       careRetirementCommunities.count({
//         photos: { $exists: true, $ne: [] },
//       }),
//       geriatorCareManagerModel.count({
//         photos: { $exists: true, $ne: [] },
//       }),
//       hoSpiceModel.count({
//         photos: { $exists: true, $ne: [] },
//       }),
//       inHomeCare.count({
//         photos: { $exists: true, $ne: [] },
//       }),
//       independentLiving.count({
//         photos: { $exists: true, $ne: [] },
//       }),
//       memoryCareModel.count({
//         photos: { $exists: true, $ne: [] },
//       }),
//     ]);

//     res.status(200).json({
//       skilledNursingFacility: skilledNursingFacilityResponse,
//       adultDayCare: adultDayCareModelResponse,
//       assistedLiving: assistedLivingResponse,
//       careRetirementCommunities: careRetirementCommunitiesResponse,
//       geriatorCareManager: geriatorCareManagerModelResponse,
//       hoSpice: hoSpiceModelResponse,
//       inHomeCare: inHomeCareResponse,
//       independentLiving: independentLivingResponse,
//       memoryCare: memoryCareModelResponse,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// Start the server and listen for incoming requests
app.listen(3000, () => {
  console.log(`Backend server is running on ${3000}!`);
});
