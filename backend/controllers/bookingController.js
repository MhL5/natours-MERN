const stripe = require("stripe")(process.env.STRIPE_TEST_SECRET_KEY);
const Booking = require("../models/bookingModel");
const Tour = require("../models/tourModel");
// const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

// ! im gonna continue with jonas but this does not work and need to be replace ASAP
// TODO: FIX THIS
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2. create the checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    // temp solution not secure at all
    success_url: `${req.protocol}://${req.get("host")}/?tour=${req.params.tourId}&user${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour._id}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
  });

  // 3. create session as response
  res.status(200).json({ status: "success", session });
});

// !temp solution on secure everyone can make booking without paying
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split(`?`)[0]);
  // we will hit the "/" after this redirect again 🤔
  // but second time after if we go to the next middleware
  // a temp solution for making it a little secure without the data in url 017
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
