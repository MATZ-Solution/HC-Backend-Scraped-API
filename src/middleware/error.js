const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //server error
  err.message = err.message || "Internal Server Error";

  // // Wrong mongoDB id Error check in apis
  if (err.name === "CastError") {
    const message = `Resource not found : ${err.path}`;
    err = new ErrorHandler(message, 404);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
