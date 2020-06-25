const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controller/course");

const router = require("express").Router({ mergeParams: true });

//Invoked middleware
const advanceResults = require("../middleware/advanceResults");

//Course model
const Course = require("../models/Course");

router
  .route("/")
  .get(
    advanceResults(Course, { path: "bootcamp", select: "name description" }),
    getCourses
  )
  .post(createCourse);
router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
