const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  updateTutuionCost,
} = require("../controller/course");

const router = require("express").Router({ mergeParams: true });

//Invoked middleware
const advanceResults = require("../middleware/advanceResults");
const { protect, permission } = require("../middleware/auth");

//Course model
const Course = require("../models/Course");

router
  .route("/")
  .get(
    advanceResults(Course, { path: "bootcamp", select: "name description" }),
    getCourses
  )
  .post(protect, permission("admin", "publisher"), createCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(protect, permission("admin", "publisher"), updateCourse)
  .delete(protect, permission("admin", "publisher"), deleteCourse);

router
  .route("/updateTutionCost/:id")
  .put(protect, permission("admin", "publisher"), updateTutuionCost);

module.exports = router;
