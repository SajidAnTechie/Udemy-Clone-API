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
const { protect, permission } = require("../middleware/auth");

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
  .post(protect, permission("admin", "publisher"), createBootcamps);
router.route("/:id/photo").put(Protect, bootcampUploadPhoto);
router
  .route("/:id")
  .get(getBootcamps)
  .put(protect, permission("admin", "publisher"), updateBootcamps)
  .delete(protect, permission("admin", "publisher"), deleteBootcamps);

module.exports = router;
