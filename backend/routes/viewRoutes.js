const express = require("express");

const {
  getTour,
  getOverview,
  getLoginForm,
  getMyTours,
} = require("../controllers/viewsController");
const { isLoggedIn, protect } = require("../controllers/authController");
const { createBookingCheckout } = require("../controllers/bookingController");

const router = express.Router();
// !createBookingCheckout is TEMP
router.get("/", createBookingCheckout, isLoggedIn, getOverview);
router.get("/tour/:slug", isLoggedIn, getTour);
router.get("/login", isLoggedIn, getLoginForm);
router.get("/me", protect, getLoginForm);
router.get("/my-tours", protect, getMyTours);

module.exports = router;
