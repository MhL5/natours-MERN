const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require("./userModel");
// const { isAlpha } = require("validator");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true, // no tour with the same name
      trim: true,
      maxLength: [40, "A tour must have less or equal to 40 characters"],
      minLength: [10, "A tour must have more or equal to 10 characters"],
      // *[boolean,"error message"] is a short hand for this object: { validator: isAlpha, message: "tour name must only contain characters"}
      // isAlpha doesn't return true for spaces and not useful here so we just keep it as a reference
      // validate: [isAlpha, "tour name must only contain characters"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "a tour must have a difficulty"],
      enum: {
        values: ["difficult", "easy", "medium"],
        message: "Difficulty is either: easy, medium, difficult ",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.8,
      min: [1, `rating must be above or equal to 1`],
      max: [5, `rating must be below or equal to 5`],
      // will run each time with new values
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "a tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to the current doc on new document creation
          return this.price > val;
        },
        message: "discount price ({VALUE}) should be below the regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "a tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON for geo spatial data 😀
      type: {
        // type should be string
        type: String,
        // should be point
        default: "Point",
        enum: {
          values: ["Point"],
          message: "start location can only be point",
        },
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: {
            values: ["Point"],
            message: "start location can only be point",
          },
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // * example of embedding guides: Array,
    guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    // ! this a bad idea since it can grow indefinitely 💩parent referencing💩
    // reviews: [{ type: mongoose.Schema.ObjectId, ref: "Review" }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
// * create a price index in order to improve performance
// tourSchema.index({ price: 1 });
// compound index
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

tourSchema.virtual("durationWeek").get(function () {
  return this.duration / 7;
});

// Virtual populate
// reviews will be added dynamically rather than adding it into schema and keeping some useless data in our documents
tourSchema.virtual("reviews", {
  ref: "Review",
  // this part says: "tour" field in the "Review" model should match the _id field in the current model
  foreignField: "tour",
  localField: "_id",
});

// * Document middlewares example
// Runs before .create and .save
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lowerCase: true });

  next();
});
/*
tourSchema.pre("save", function (next) {
  console.log(`will save the document`);
  next();
});

tourSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
});
*/

// * example of embedding: embedding user documents into guides
// it's not a good idea to embed users into tours due to lots of reasons which is obvious
// tourSchema.pre("save", async function (next) {
//   const guidesPromises = this.guides.map(
//     async (userId) => await User.findById(userId),
//   );
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });

// * Query middleware - this keyword points to a query here
tourSchema.pre(/^find/, function (next) {
  // populating guides reference with user data
  this.populate({
    path: "guides",
    select: "-passwordChangedAt -__v",
  });

  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();

  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} ms`);
//   // console.log(docs);
//   next();
// });

// * Aggregation middleware
// tourSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
