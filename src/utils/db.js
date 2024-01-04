const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;

const connect = () => {
  mongoose
    .connect("mongodb+srv://matzsolutions:2VVG2QxBAMub9Oaz@cluster0.gyal2.mongodb.net/healthcare", {
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
