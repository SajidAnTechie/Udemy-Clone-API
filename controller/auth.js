const crypto = require("crypto");
const createError = require("../utilis/createError");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utilis/sendEmail");
const User = require("../models/User");

const RegisterUser = asyncHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);

  sendTokenResponse(newUser, 200, res);
});

const login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!user) throw createError(401, `Email doesn't match`);

  const isPassword = await user.matchPassword(req.body.password);
  if (!isPassword) throw createError(401, `Password doesn't match`);

  sendTokenResponse(user, 200, res);
});

//Update user details

const updateDetails = asyncHandler(async (req, res, next) => {
  const newDetails = {
    name: req.body.name,
    email: req.body.email,
  };

  console.log(req.user);
  const editDetails = await User.findByIdAndUpdate(req.user._id, newDetails, {
    new: true,
    runValidators: true,
  });

  const updateDetails = await User.findById(req.user._id);
  res.status(200).send({ status: "success", data: updateDetails });
});

//Update Password

const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  //compare currentPassword

  const isMatch = await user.matchPassword(req.body.currentPassword);
  console.log(isMatch);
  if (!isMatch)
    throw createError(
      400,
      `Current password ${req.body.currentPassword} does't match`
    );

  user.password = req.body.newPassword;

  await user.save();

  sendTokenResponse(user, 200, res);
});

//Forgot Password

const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    throw createError(400, `User with email ${req.body.email} is not found`);

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  try {
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetPassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else ) has
    requested the reset of a password. Please make a PUT request to:\n\n ${resetUrl}`;

    const options = {
      email: user.email,
      subject: "Password reset token",
      message,
    };

    await sendEmail(options);

    res
      .status(200)
      .send({ status: "success", data: "ResetPassword Email sent" });
  } catch (error) {
    console.log(error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    throw createError(500, "Email cound't be sent");
  }
});

//ResetPassword

const resetPassword = asyncHandler(async (req, res, next) => {
  //Hash the resetToken

  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) throw createError(400, `Invalid token ${req.params.resetToken}`);

  user.password = req.body.newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.genAuthToken();

  const options = {
    expire: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPRIE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .send({ status: "success", token });
};

const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expire: new Date(Date.now() * 10 * 60 * 1000),
    httpOnly: true,
  });
  res.status(200).send({ status: "success", data: {} });
});

module.exports = {
  RegisterUser,
  login,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  logout,
};
