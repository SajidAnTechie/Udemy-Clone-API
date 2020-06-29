const createError = require("../utilis/createError");
const asyncHandler = require("../middleware/async");
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

module.exports = {
  RegisterUser,
  login,
  updateDetails,
  updatePassword,
};
