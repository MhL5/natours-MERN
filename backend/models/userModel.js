const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "please provide an email"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  photo: {
    default: "default.jpg",
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    // so password does not show up when we do a get request
    select: false,
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    // so password does not show up when we do a get request
    select: false,
    minLength: 8,
    validate: {
      // !This only works on create and save! example: user.create | user.save
      // !  so we have to use save not update and ...
      validator: function (curEl) {
        return this.password === curEl;
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  // guard clause - only run if password is modified
  if (!this.isModified("password")) return next();

  // Hashing and salting 😀
  this.password = await bcrypt.hash(this.password, 12);
  // delete the passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// since password field has select:false we can not use this.password here
userSchema.methods.correctPassword = catchAsync(
  async (candidatePassword, userPassword) =>
    bcrypt.compare(candidatePassword, userPassword),
);

userSchema.pre("save", function updateChangedPasswordAt(next) {
  // if password has not modified or the document is newly created return
  if (!this.isModified("password") || this.isNew) return next();

  // to ensure that the token is always created after the passwordChange we use - 1000ms
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.changedPasswordAfter = function (JwtTimestamp) {
  // false means not changed
  // if changedTimestamp is less than changedTimestamp this means password haven't changed
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JwtTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
