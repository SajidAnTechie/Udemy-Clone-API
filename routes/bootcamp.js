const router = require("express").Router();

const {
  getAllbootcamps,
  getBootcamps,
  createBootcamps,
  updateBootcamps,
  deleteBootcamps,
  getBootcampsInRadius,
} = require("../controller/bootcamp");

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router.route("/").get(getAllbootcamps).post(createBootcamps);
router
  .route("/:id")
  .get(getBootcamps)
  .put(updateBootcamps)
  .delete(deleteBootcamps);

module.exports = router;
