const createError = require("../utilis/createError");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

const getCourses = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  if (req.params.bootcampId) {
    const findBootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!findBootcamp)
      throw createError(
        404,
        `Bootcamp is not found with id of ${req.params.bootcampId}`
      );

    const bootcampCourses = await Course.find({
      bootcamp: req.params.bootcampId,
    }).populate({
      path: "bootcamp",
      select: "name description",
    });

    return res.status(200).send({
      status: "success",
      count: bootcampCourses.length,
      data: bootcampCourses,
    });
  } else {
    res.status(200).send(res.advanceResults);
  }
});

const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course)
    throw createError(404, `Course is not found with id of ${req.params.id}`);

  res.status(200).send({ status: "success", data: course });
});

const createCourse = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  const findBootcamp = await Bootcamp.findById(bootcampId);

  if (!findBootcamp)
    throw createError(404, `Bootcamp is not found with id of ${bootcampId}`);

  const newCourse = await Course.create({ ...req.body, bootcamp: bootcampId });

  res.status(201).send({ status: "success", data: newCourse });
});

const updateCourse = asyncHandler(async (req, res, next) => {
  const editCourse = await Course.findByIdAndUpdate(req.params.id, req.body);

  if (!editCourse)
    throw createError(404, `Course is not found with id of ${req.params.id}`);

  const updatedCourse = await Course.findById(req.params.id);

  res.status(201).send({ status: "success", data: updatedCourse });
});

const deleteCourse = asyncHandler(async (req, res, next) => {
  const deleteCourse = await Course.findById(req.params.id);

  if (!deleteCourse)
    throw createError(404, `Course is not found with id of ${req.params.id}`);

  await deleteCourse.remove();
  res.status(204).send({ status: "success", data: {} });
});

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
