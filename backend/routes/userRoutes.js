const express = require("express");

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} = require(`../controllers/userController`);
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
  logout,
} = require("../controllers/authController");

const router = express.Router();

// special case: it does not follow rest theory - also there is no get and ... here too
// we only want to post users

// * public routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.patch("/resetpassword/:token", resetPassword);

// * Protected routes
router.use(protect);

router.get("/me", getMe, getUser);
router.patch("/updatemypassword", updatePassword);
// since its one image we use upload.single("fieldName")
router.patch("/updateme", uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete("/deleteme", deleteMe);

// * protected routes - only accessible to admins
router.use(restrictTo("admin"));

router.route("/").get(getAllUsers).post(createUser);
// * the order of routes matter don't put anything after /:id
// * because it will assume everything after / is a valid id
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
