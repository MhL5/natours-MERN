const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    required: [true, "Booking must belong to a tour!"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a user!"],
  },
  price: {
    type: Number,
    required: [true, "Booking must have a price"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  // in case if someone pays outside of stripe admin can use this
  paid: {
    type: Boolean,
    default: true,
  },
});

// auto populating on find
bookingSchema.pre(/^find/, function (next) {
  // this query does not happen often so its fine to use it like this
  this.populate("user").populate({
    path: "tour",
    select: "name",
  });

  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
