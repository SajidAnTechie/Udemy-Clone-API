const {
  getAllbootcamps,
  getBootcamps,
  createBootcamps,
  updateBootcamps,
  deleteBootcamps,
  bootcampUploadPhoto,
  getBootcampsInRadius,
} = require("../controller/bootcamp");

//Invoked middleware.
const advanceResults = require("../middleware/advanceResults");

//Bootcamp model
const Bootcamp = require("../models/Bootcamp");

//Include other resource Router
const courseRouter = require("./course");

const router = require("express").Router();

//Re-route into other resource router
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router
  .route("/")
  .get(
    advanceResults(Bootcamp, { path: "Courses", select: "title description" }),
    getAllbootcamps
  )
  .post(createBootcamps);
router.route("/:id/photo").put(bootcampUploadPhoto);
router
  .route("/:id")
  .get(getBootcamps)
  .put(updateBootcamps)
  .delete(deleteBootcamps);

module.exports = router;
