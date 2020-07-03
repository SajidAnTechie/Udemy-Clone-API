const asyncHandler = require("../middleware/async");
const createError = require("../utilis/createError");
const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");

const getReviews = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  if (req.params.bootcampId) {
    const findBootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!findBootcamp)
      throw createError(
        404,
        `Bootcamp is not found with id of ${req.params.bootcampId}`
      );

    const bootcampReviews = await Review.find({
      bootcamp: req.params.bootcampId,
    }).populate({
      path: "bootcamp",
      select: "name description",
    });

    return res.status(200).send({
      status: "success",
      count: bootcampReviews.length,
      data: bootcampReviews,
    });
  } else {
    res.status(200).send(res.advanceResults);
  }
});

const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!review)
    throw createError(404, `Review is not found with id of ${req.params.id}`);

  res.status(200).send({
    status: "success",
    count: review.length,
    data: review,
  });
});

const createReview = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp)
    throw createError(
      404,
      `Bootcamp is not found with id of ${req.params.bootcampId}`
    );

  const review = await Review.create({
    ...req.body,
    bootcamp: req.params.bootcampId,
    user: req.user._id,
  });

  res.status(201).send({ status: "success", data: review });
});

const updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review)
    throw createError(404, `Review is not found with id of ${req.params.id}`);

  //check if review belongs to user created or user is admin

  const findReview = await Review.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!findReview && req.user.role !== "admin")
    throw createError(400, "Not authorized to update this review");

  const editReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  const updatedreview = await Review.findById(req.params.id);

  res.status(200).send({ status: "success", data: updatedreview });
});

const updateRating = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review)
    throw createError(404, `Review is not found with id of ${req.params.id}`);

  //check if review belongs to user created or user is admin

  const findReview = await Review.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!findReview && req.user.role !== "admin")
    throw createError(400, "Not authorized to update this review");

  review.rating = req.body.editRating;

  await review.save();

  const updatedreview = await Review.findById(req.params.id);

  res.status(200).send({ status: "success", data: updatedreview });
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review)
    throw createError(404, `Review is not found with id of ${req.params.id}`);

  //check if review belongs to user created or user is admin
  const findReview = await Review.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!findReview && req.user.role !== "admin")
    throw createError(400, "Not authorized to update this review");

  await review.remove();

  res.status(204).send({ status: "success", data: {} });
});

module.exports = {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  updateRating,
};
