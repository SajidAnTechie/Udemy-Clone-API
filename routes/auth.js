const {
  RegisterUser,
  login,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controller/auth");
const { protect } = require("../middleware/auth");

const router = require("express").Router();

router.route("/register").post(RegisterUser);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/update/userDetails").put(protect, updateDetails);
router.route("/update/password").put(protect, updatePassword);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:resetToken").post(resetPassword);

module.exports = router;
