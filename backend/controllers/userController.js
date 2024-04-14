const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users");
//   },
//   filename: (req, file, cb) => {
//     const extension = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${extension}`);
//   },
// });
//  we want to keep the image in memory instead of in file and reading it again in resizeUserPhoto
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("Not an image! please upload only images.", 400), false);
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
// upload middleware
exports.uploadUserPhoto = upload.single("photo");
// * image processor
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  // next middleware relies on req.file.filename to update user so we define it here
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

function filterObj(obj, ...allowedFields) {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.send(204).json({ status: "success", data: null });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. create error if user posts password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        "this route is not for password update, please use /updatemypassword route",
        400,
      ),
    );

  // 2. filter out unwanted field name that are not allowed to update
  // since we are not working with sensitive data we use findByIdAndUpdate
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  // 3. update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "account updated successfully",
    data: { user: updateUser },
  });
});

exports.createUser = function (req, res) {
  res.status(500).json({
    status: "error",
    message: "this route is not defined! please use signup instead😉",
  });
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
// ! do not update passwords with this | findByIdAndUpdate does not include validators that we have on save and create
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
