const express = require("express");
const reviewRouter = require("./reviewRoutes");
const {
  getAllTours,
  createTour,
  updateTour,
  getTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
  getMyTours,
} = require("../controllers/tourController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

// POST /tour/:tourId/reviews
// GET  /tour/:tourId/reviews
// GET  /tour/:tourId/reviews/:reviewId
// !bad pattern this does not belong here and there is duplication same code in review route
// router
//   .route("/:tourId/reviews")
//   .post(protect, restrictTo("user"), createReview);
// we use this instead:☺
router.use("/:tourId/reviews", reviewRouter);

// * ME
router.route("/").get(getAllTours);
router.route("/getmytours").get(protect, getMyTours);
// *

// * router.param("id", checkID);
router.route("/top-5-tours").get(aliasTopTours, getAllTours);
router.route("/tour-stats").get(getTourStats);
router
  .route("/monthly-plan/:year")
  .get(protect, restrictTo("admin", "lead-guide", "guide"), getMonthlyPlan);
// we can specify this in two ways:
// 1. "/tours-within/:distance/center/:latlng/unit/:unit"
// 2. "/tours-within?distance=233&center=-40,45&unit=mi"
router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(getToursWithin);

router.route("/distances/:latlng/unit/:unit").get(getDistances);

// * CHANGED
router
  .route("/")
  .get(protect, restrictTo("admin", "lead-guide"), getAllTours)
  .post(createTour); // post(checkPostBody, createTour);
// * CHANGED

router
  .route("/:id")
  .get(getTour)
  .patch(
    protect,
    restrictTo("admin", "lead-guide"),
    uploadTourImages,
    resizeTourImages,
    updateTour,
  )
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

module.exports = router;
