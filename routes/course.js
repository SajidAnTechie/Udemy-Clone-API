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
const { Protect, Permission } = require("../middleware/auth");

//Course model
const Course = require("../models/Course");

router
  .route("/")
  .get(
    advanceResults(Course, { path: "bootcamp", select: "name description" }),
    getCourses
  )
  .post(Protect, Permission("Admin", "Publisher"), createCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(Protect, Permission("Admin", "Publisher"), updateCourse)
  .delete(Protect, Permission("Admin", "Publisher"), deleteCourse);

module.exports = router;
