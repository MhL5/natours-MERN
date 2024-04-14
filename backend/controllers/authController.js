const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Email = require("../utils/email");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

function createSendToken(user, statusCode, req, res) {
  // Creating token
  const token = signToken(user._id);

  const maxAge = process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000;
  // cookie
  const cookieOptions = {
    httpOnly: true,
    // secure: true,
    sameSite: "none",
    maxAge,
    // secure: req.secure || req.headers[`x-forwarded-proto`] === "https",
    secure: true,
  };
  // in production with https we can activate secure = true
  // if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  // we removed the password fields in model with select false
  res.status(statusCode).json({ status: "success", token, data: { user } });
}

exports.signup = catchAsync(async (req, res, next) => {
  // ! for security reasons: only extract the fields needed
  // ! we need to add a way to add roles we can not do it here
  const newUserData = req.body;
  // removing the role field so a hacker can not create a user with admin role
  delete newUserData.role;

  const newUser = await User.create(newUserData);
  // removing the unwanted fields from response
  newUser.password = undefined;
  newUser.active = undefined;

  // sending welcome email
  const url = `${req.protocol}://${req.get("host")}/me`;
  // console.log(url);
  await new Email(newUser, url).sendWelcome();

  // Creating token
  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. check if email and password exist
  if (!email || !password)
    return next(new AppError("please provide email and password", 400));

  // 2. check if the user exist and password match
  // for better security we check the password and user at the same time so hackers can not know which one is invalid
  // since we set select:false for password field we have to select it here explicitly
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("incorrect email or password", 401));

  // 3. if everything is ok send the token
  user.password = null;
  user.passwordChangedAt = null;
  createSendToken(user, 200, req, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  // ! THIS DOES NOT WORK
  // TODO: FIX THIS
  // since we used a httpCookie and we can not access it
  // in order to logout we replace the cookie with a new cookie with very short expiration time(10s)
  res.cookie("jwt", "logged out", {
    maxAge: 3 * 3000,
    // no need to make it secure here since it does not contain any sensitive data
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ status: "success" });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1. grabbing the token if it exist
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.replace("Bearer ", "");
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError("You are not logged in! please login to get access", 401),
    );

  // 2. token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // token might be stolen and it should not work after users removes the account or changes his password 3-4
  // 3. check if user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError("This user belonging to this token no longer exist", 401),
    );

  // 4. check if user changes password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat))
    return next(
      new AppError("User recently changed password! please login again", 401),
    );

  // Grant access to protected Route
  req.user = currentUser;
  //  for using it in our templates
  res.locals.user = currentUser;
  next();
});
exports.isLoggedIn = async (req, res, next) => {
  // ! only for rendered pages - no error - we are gonna use this in pug template in order to show user profile or not :|
  // we do not want to catch the errors here and cause an error if user is not logged in
  try {
    // 1. grabbing the token if it exist
    // authorization header only exist for the api not browser so we are gonna use cookie only
    if (!req.cookies.jwt) return next();

    // 2. token verification
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET,
    );

    // token might be stolen and it should not work after users removes the account or changes his password 3-4
    // 3. check if user still exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return next();

    // 4. check if user changes password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) return next();

    // THERE IS A LOGGED IN USER
    //* passing the currentUser to res.locals.user so pug can use this
    res.locals.user = currentUser;
    next();
  } catch (err) {
    return next();
  }
};

exports.restrictTo = function (...roles) {
  return (req, res, next) => {
    // if current user role does not exist in roles array then user does not have access
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("There is no user with that email", 404));
  // 2. generate the random token
  const resetToken = user.createPasswordResetToken();
  // TODO: for some reason i managed to do this without passing required data (name,email) but jonas couldn't
  // ! for user we always use save because we want to run all the validators
  await user.save({ validateBeforeSave: false });

  try {
    // 3. send it back as an email
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetpassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    // 4. done finishing the cycle
    res.status(200).json({ status: "success", message: "token sent to email" });
  } catch (err) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    // ! for user we always use save because we want to run all the validators
    await user.save({ validateBeforeSave: false });

    next(
      new AppError(
        "there was an error sending the email. try again later",
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2. if token has not expired and there is a user, set the new password
  if (!user) return next(new AppError("Token is invalid or has expired.", 400));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  // ! for user we always use save because we want to run all the validators
  await user.save();

  // 3. update changedPasswordAt property for the user
  // happens inside userSchema.pre("save",updateChangedPasswordAt)

  // 4. log the user in, send jwt
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, password, passwordConfirm } = req.body;
  // 1. get user from collection
  // we added the user in protect
  const user = await User.findById(req.user.id).select("+password");

  // 2. check if posted current password is correct
  if (!(await user.correctPassword(passwordCurrent, user.password)))
    return next("user password is not correct", 401);

  // 3. if so, update the password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  // 4. log user in, send jwt token
  createSendToken(user, 200, req, res);
});
