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

  const bootcamp = await Bootcamp.findOne({
    _id: bootcampId,
    user: req.user._id,
  });

  //check if owner of bootcamp can add course to if or admin
  if (!bootcamp && req.user.role !== "Admin")
    throw createError(400, "Not authorize to add course to this bootcamp");

  const newCourse = await Course.create({
    ...req.body,
    bootcamp: bootcampId,
    user: req.user._id,
  });

  res.status(201).send({ status: "success", data: newCourse });
});

const updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course)
    throw createError(404, `Course is not found with id of ${req.params.id}`);

  //Check if user is owner of the course
  const findCourse = await Course.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!findCourse && req.user.role !== "Admin")
    throw createError(400, "Not authorize to update this course");

  const editCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  const updatedCourse = await Course.findById(req.params.id);

  res.status(200).send({ status: "success", data: updatedCourse });
});

const updateTutuionCost = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course)
    throw createError(404, `Course is not found with id of ${req.params.id}`);

  //Check if user is owner of the course
  const findCourse = await Course.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!findCourse && req.user.role !== "Admin")
    throw createError(400, "Not authorize to update this course");

  course.tuition = req.body.newTutionCost;

  await course.save();

  const updatedCourse = await Course.findById(req.params.id);

  res.status(200).send({ status: "success", data: updatedCourse });
});

const deleteCourse = asyncHandler(async (req, res, next) => {
  const deleteCourse = await Course.findById(req.params.id);

  if (!deleteCourse)
    throw createError(404, `Course is not found with id of ${req.params.id}`);

  //Check if user is owner of the course
  const findCourse = await Course.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!findCourse && req.user.role !== "Admin")
    throw createError(400, "Not authorize to update this course");

  await deleteCourse.remove();
  res.status(204).send({ status: "success", data: {} });
});

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  updateTutuionCost,
};
