const express = require("express");
const {
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
} = require("../controllers/reviewController");
const { protect, restrictTo } = require("../controllers/authController");
// now it will merge the params coming from tourRoutes
const router = express.Router({ mergeParams: true });

// POST /tour/2131312/reviews
// GET  /tour/2131312/reviews
// POST /reviews

// * protecting reviews
router.use(protect);

router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user"), setTourUserIds, createReview);

router
  .route("/:id")
  .get(getReview)
  .delete(restrictTo("user", "admin"), deleteReview)
  .patch(restrictTo("user", "admin"), updateReview);

module.exports = router;
