const createError = require("../utilis/createError");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

const getCourses = asyncHandler(async (req, res, next) => {
  let query;
  const { bootcamp } = req.params;

  if (bootcamp) {
    const findBootcamp = await Bootcamp.findById(bootcamp);
    if (!findBootcamp)
      throw createError(404, `Bootcamp is not found with id of ${bootcamp}`);

    query = Course.find({ bootcamp: bootcamp }).populate({
      path: "bootcamp",
      select: "name description",
    });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }

  const courses = await query;

  res
    .status(200)
    .send({ status: "success", count: courses.length, data: courses });
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
  const { bootcamp } = req.params;

  const findBootcamp = await Bootcamp.findById(bootcamp);

  if (!findBootcamp)
    throw createError(404, `Bootcamp is not found with id of ${bootcamp}`);

  const newCourse = await Course.create({ ...req.body, bootcamp: bootcamp });

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
  const deleteCourse = await Course.findByIdAndDelete(req.params.id);

  if (!deleteCourse)
    throw createError(404, `Course is not found with id of ${req.params.id}`);

  res.status(204).send({ status: "success", data: {} });
});

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
