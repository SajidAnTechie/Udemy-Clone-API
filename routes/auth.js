const { RegisterUser, login } = require("../controller/auth");

const router = require("express").Router();

router.route("/register").post(RegisterUser);
router.route("/login").post(login);

module.exports = router;
