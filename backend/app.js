const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
// MY CODE
const xssSanitizer = require("./utils/xssSanitizer");
// MY CODE

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.enable("trust proxy");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// * Global Middlewares
// ***************************
// Cors
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  }),
);
app.options("*", cors());
// serving static files
app.use(express.static(path.join(__dirname, "public")));
// set security http headers
app.use(helmet());

// development logging
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// limit request from same ip
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "too many requests with this id, please try again in an hour.",
});
app.use("/api", limiter);

// body parser, reading data from the body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
// app.use(express.urlencoded({extended:true,limit:"10kb"}))

// *after parsing we can start sanitizing
// 1. data sanitization against noSQL query injection
app.use(mongoSanitize());

// 2. http parameter pollution protection
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  }),
);

// 3. data sanitization against XSS
app.use(xssSanitizer());

// compression
app.use(compression());

// testing middleware 😂
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// * Mounting routers

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

app.all("*", (req, res, next) => {
  // if (err): it will skip all the existing middlewares and goes straight to the error middleware
  next(new AppError(`Cant Find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
