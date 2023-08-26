const cookieSession = require("cookie-session");
const passportSetup = require("./passport");
const passport = require("passport");

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");


//routes
const databaseConnection = require("./utils/db");
const healthCareRoute = require("./routes/healthCareRoute");

const errorMiddleware = require("./middleware/error");



dotenv.config();

app.use(cors());
// Enable Cross-Origin Resource Sharing (CORS) for the app
// app.use(
//   cors({
//     origin: "http://localhost:5000",
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true,
//   })
// );

//this is only for passport initialization

app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

//this is only for passport initialization

app.use(express.json()); // Parse incoming JSON data

// Connect to the MongoDB database
databaseConnection.connect();

app.use("/api/healthCareRoute", healthCareRoute);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Hello World");
});
// Start the server and listen for incoming requests
app.listen(5000, () => {
  console.log(`Backend server is running on ${3000}!`,);
});
