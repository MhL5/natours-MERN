// review / rating / createdAt / ref to tour & user
const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "review can not be empty"],
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "review must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: "tour",
  //   select: "name",
  // });
  this.populate({
    path: "user",
    select: "name photo",
  });

  next();
});

// its a technic which we didn't use so far idk what it's called
// we created this function as statics because we needed to call aggregate on the modal (this method points to the model)
reviewSchema.statics.calcAverageRating = async function (tourId) {
  // this points to schema
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  // stats will be [] if noting match
  if (stats.length > 0)
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  else
    await Tour.findByIdAndUpdate(tourId, {
      // our default values
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
};

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// we should use post so we run our calc after review is added not before
reviewSchema.post("save", function () {
  // this points to current document that is being saved
  // Review is not defined yet so we have to use this.constructor instead
  // moving Review above this function won't fix this issue
  // Review.calcAverageRating(this.tour);
  this.constructor.calcAverageRating(this.tour);
});

// * in case if a review gets deleted or updated these methods do not have document middlewares
// they only have query middlewares
// were gonna use a workaround
// findByIdAndUpdate
// findByIdAndDelete
// * passing the data from pre middle ware to the post middleware
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // this is current query we do this in order to get access to the current document
  // we can await the query to get access to the document
  this.r = await this.clone().findOne();
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  // this.r = await this.findOne(); does not work here query already executed
  await this.r.constructor.calcAverageRating(this.r.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
