const {
  RegisterUser,
  login,
  updateDetails,
  updatePassword,
} = require("../controller/auth");
const { Protect } = require("../middleware/auth");

const router = require("express").Router();

router.route("/register").post(RegisterUser);
router.route("/login").post(login);
router.route("/update/userDetails").put(Protect, updateDetails);
router.route("/update/password").put(Protect, updatePassword);

module.exports = router;
