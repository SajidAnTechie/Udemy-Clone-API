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
};
