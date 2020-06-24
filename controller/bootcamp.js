const createError = require("../utilis/createError");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utilis/geocoder");
const Bootcamp = require("../models/Bootcamp");

const getAllbootcamps = asyncHandler(async (req, res, next) => {
  //JSON.Stringify Convert the javascript object into string | when sending data to server, the data has to be string
  //JSON.parse Convert the string into javascript Object | when server send data, data is always a string, so parse the data to convert into js Object

  let query;

  const reqQuery = { ...req.query };

  //Feild to exclude

  const removeFeilds = ["select", "sort", "limit", "page"];

  removeFeilds.forEach((param) => delete reqQuery[param]);

  //Create query string
  let queryStr = JSON.stringify(reqQuery);

  //Create operators ($gt,gte,lt,lte)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)/g, (match) => `$${match}`);

  //Finding resource
  query = Bootcamp.find(JSON.parse(queryStr)).populate({
    path: "Courses",
    select: "title description",
  });

  //Select
  if (req.query.select) {
    const select = req.query.select.split(",").join(" ");
    query = query.select(select);
  }

  //Sort
  if (req.query.sort) {
    const sort = req.query.sort.split(",").join(" ");
    query = query.sort(sort);
  } else {
    query = query.sort("-createdAt");
  }

  //Pagination

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;

  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //Execute Query
  const allBootcamps = await query;

  //Pagination Result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).send({
    status: "success",
    count: allBootcamps.length,
    pagination,
    data: allBootcamps,
  });
});

const getBootcamps = asyncHandler(async (req, res, next) => {
  const getBootcampsByid = await Bootcamp.findById(req.params.id);

  if (!getBootcampsByid)
    throw createError(404, `Bootcamp is not found of id ${req.params.id}`);

  res.status(200).send({ status: "success", data: getBootcampsByid });
});

const createBootcamps = asyncHandler(async (req, res, next) => {
  const newBootcamp = await Bootcamp.create(req.body);

  res.status(201).send({ status: "success", data: newBootcamp });
});

const updateBootcamps = asyncHandler(async (req, res, next) => {
  const editBootcamp = await Bootcamp.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!editBootcamp)
    throw createError(404, `Bootcamp is not found of id ${req.params.id}`);

  const updatedBootcamp = await Bootcamp.findById(req.params.id);

  res.status(200).send({
    status: "success",
    data: updatedBootcamp,
  });
});

const deleteBootcamps = asyncHandler(async (req, res, next) => {
  const deleteBootcamp = await Bootcamp.findById(req.params.id);

  if (!deleteBootcamp)
    throw createError(404, `Bootcamp is not found of id ${req.params.id}`);

  await deleteBootcamp.remove();
  res.status(204).send({
    status: "success",
    data: {},
  });
});

const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const loc = await geocoder.geocode(zipcode);
  console.log(loc);

  const lat = loc[0].latitude;
  const lon = loc[0].longitude;

  const Radius = distance / 3958;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lon, lat], Radius] },
    },
  });

  res
    .status(200)
    .send({ status: "success", count: bootcamps.length, data: bootcamps });
});

module.exports = {
  getAllbootcamps,
  getBootcamps,
  createBootcamps,
  updateBootcamps,
  deleteBootcamps,
  getBootcampsInRadius,
};
