const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");


//routes
const databaseConnection = require("./utils/db");
const healthCareRoute = require("./routes/healthCareRoute");
const sendEmailRoute = require("./routes/sendEmailRoutes");
const professionalRoute = require("./routes/professionalRoute");

const errorMiddleware = require("./middleware/error");



dotenv.config();

app.use(cors());

//this is only for passport initialization

app.use(express.json()); // Parse incoming JSON data

// Connect to the MongoDB database
databaseConnection.connect();

app.use("/api/healthCareRoute", healthCareRoute);
app.use("/api/sendEmail", sendEmailRoute);

//===============Professional Route====================
app.use("/api/professionalRoute", professionalRoute);
//=====================================================



app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Professional Scrapped");
});


// Start the server and listen for incoming requests
app.listen(3000, () => {
  console.log(`Backend server is running on ${3000}!`,);
});
