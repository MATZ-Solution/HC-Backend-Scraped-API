const AWS = require('aws-sdk');

const s3Middleware = (req, res, next) => {
  try {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    // Attach S3 instance to request object
    req.s3 = s3;
    next();
  } catch (err) {
    console.error('Error initializing S3 middleware:', err);
    res.status(500).json({ message: 'Error initializing AWS S3' });
  }
};

module.exports = s3Middleware;