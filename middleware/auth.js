const createError = require("../utilis/createError");
const verifyToken = require("../utilis/jwt");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

const Protect = asyncHandler(async (req, res, next) => {
  const authorization = req.headers["authorization"];
  if (!(authorization && authorization.toLowerCase().startsWith("bearer")))
    throw createError(401, "Invalid token or token not found");

  const token = authorization.split(" ")[1];

  const decodeToken = verifyToken(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodeToken._id);

  next();
});

const Permission = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    throw createError(
      401,
      `${req.user.role} role user is not allowed to access this route`
    );

  next();
};
module.exports = { Protect, Permission };
