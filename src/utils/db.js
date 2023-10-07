const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;

const connect = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('DB Connection Successful!'))
    .catch((err) => {
      console.error('DB Connection Failed:', err);
    });
};

module.exports = {
  connect,
};
