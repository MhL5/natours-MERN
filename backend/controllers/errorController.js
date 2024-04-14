const AppError = require("../utils/appError");

function handleJwtExpiredError() {
  return new AppError(
    "your login session has expired, please login again.",
    401,
  );
}

function handleJwtTokenError() {
  return new AppError("Invalid token! please login again.", 401);
}

function handleCastErrorDB(err) {
  const message = `invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
}

function handleValidationErrorDB(err) {
  const errors = Object.values(err.errors).map((obj) => obj.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
}

function handleDuplicateFieldDB(err) {
  const message = `Duplicate field value: ${JSON.stringify(err.keyValue)}. please try another value!`;

  return new AppError(message, 400);
}

function sendErrorForDev(err, req, res) {
  const { statusCode, status, message, stack } = err;

  if (req.originalUrl.startsWith("/api"))
    return res.status(statusCode).json({
      status: status,
      error: err,
      message: message,
      stack: stack,
    });

  console.log(err);
  return res.status(statusCode).render("error", {
    title: "something went wrong",
  });
}

function sendErrorProduction(err, req, res) {
  //! api
  if (req.originalUrl.startsWith("/api")) {
    const { statusCode, status, message, isOperational } = err;

    //* Operational trusted error: send message to the client
    if (isOperational) {
      return res.status(statusCode).json({ status: status, message: message });
    }

    //* Programming or other unknown error: don't leak error details
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong! internal Error",
    });
  }
  //! RENDERED WEBSITE
  const { statusCode, isOperational } = err;

  //* Operational trusted error: send message to the client
  if (isOperational) {
    res.status(statusCode).render("error", {
      title: "something went wrong",
    });
    return;
  }

  //* Programming or other unknown error: don't leak error details
  return res.status(500).json({
    status: "error",
    message: "Please try again later",
  });
}

module.exports = (err, req, res, next) => {
  // default error status code
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  // development environment errors
  if (process.env.NODE_ENV.toLowerCase() === "development") {
    sendErrorForDev(err, req, res);
  }
  // production environment errors
  if (process.env.NODE_ENV.toLowerCase() === "production") {
    // err has Non-enumerable properties
    // we can not copy all of its properties easily so we have to use err itself for our if statements
    let errCopy = { ...err };

    // handling invalidId errors DB:
    if (err.name === "CastError") errCopy = handleCastErrorDB(errCopy);
    // handling duplicate fields error DB:
    if (err.code === 11000) errCopy = handleDuplicateFieldDB(errCopy);
    // handling Validation error DB:
    if (err.name === "ValidationError")
      errCopy = handleValidationErrorDB(errCopy);
    // handling Auth jwt token error:
    if (err.name === "JsonWebTokenError") errCopy = handleJwtTokenError();
    // handling Auth jwt token expired:
    if (err.name === "TokenExpiredError") errCopy = handleJwtExpiredError();

    sendErrorProduction(errCopy, req, res);
  }
};
