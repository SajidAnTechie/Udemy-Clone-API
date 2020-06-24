const {
  getAllbootcamps,
  getBootcamps,
  createBootcamps,
  updateBootcamps,
  deleteBootcamps,
  getBootcampsInRadius,
} = require("../controller/bootcamp");

//Include other resource Router
const courseRouter = require("./course");

const router = require("express").Router();

//Re-route into other resource router
router.use("/:bootcamp/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router.route("/").get(getAllbootcamps).post(createBootcamps);
router
  .route("/:id")
  .get(getBootcamps)
  .put(updateBootcamps)
  .delete(deleteBootcamps);

module.exports = router;
