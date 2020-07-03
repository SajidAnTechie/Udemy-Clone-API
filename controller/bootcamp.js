const createError = require("../utilis/createError");
const asyncHandler = require("../middleware/async");
const path = require("path");
const geocoder = require("../utilis/geocoder");
const Bootcamp = require("../models/Bootcamp");

const getAllbootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).send(res.advanceResults);
});

const getBootcamps = asyncHandler(async (req, res, next) => {
  const getBootcampsByid = await Bootcamp.findById(req.params.id);

  if (!getBootcampsByid)
    throw createError(404, `Bootcamp is not found of id ${req.params.id}`);

  res.status(200).send({ status: "success", data: getBootcampsByid });
});

const createBootcamps = asyncHandler(async (req, res, next) => {
  //check if user has one bootcamp

  const bootcamp = await Bootcamp.findOne({ user: req.user._id });

  //If user is not admin,then he can add one bootcamp
  if (bootcamp && req.user.role !== "Admin")
    throw createError(
      400,
      `The User with id ${req.user._id} has already published a bootcamp`
    );

  const newBootcamp = await Bootcamp.create({
    ...req.body,
    user: req.user._id,
  });

  res.status(201).send({ status: "success", data: newBootcamp });
});

const updateBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp)
    throw createError(404, `Bootcamp is not found of id ${req.params.id}`);

  const findbootcamp = await Bootcamp.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  //check if user is owner of the bootcamp or user is admin
  if (!findbootcamp && req.user.role !== "Admin")
    throw createError(400, "Not authorize to update this bootcamp");

  const editBootcamp = await Bootcamp.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

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

  const bootcamp = await Bootcamp.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  //check if user is owner of the bootcamp or user is admin
  if (!bootcamp && req.user.role !== "Admin")
    throw createError(400, "Not authorize to delete this bootcamp");

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

const bootcampUploadPhoto = asyncHandler(async (req, res, next) => {
  const findbootcamp = await Bootcamp.findById(req.params.id);

  if (!findbootcamp)
    throw createError(404, `Bootcamp is not found with id of ${req.params.id}`);

  const bootcamp = await Bootcamp.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  //check if user is owner of the bootcamp or is admin
  if (!bootcamp && req.user.role !== "Admin")
    throw createError(400, "Not authorize to this bootcamp");

  if (!req.files) throw createError(400, "Please add a photo");

  const file = req.files.file;

  //Check file type
  if (!file.mimetype.startsWith("image"))
    throw createError(400, "This file is not supported");

  //Check file size
  if (file.size > process.env.FILE_UPLOAD_SIZE)
    throw createError(
      400,
      `Please upload a image of size less than ${process.env.FILE_UPLOAD_SIZE}`
    );

  const fileName = `photo${req.params.id}${path.parse(file.name).ext}`;

  //Upload file to path public/upload
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${fileName}`, async (err) => {
    if (err) throw err;

    await Bootcamp.findByIdAndUpdate(req.params.id, {
      photo: fileName,
    });

    res.status(200).send({ status: "success", photo: fileName });

    console.log(req.files);
  });
});

module.exports = {
  getAllbootcamps,
  getBootcamps,
  createBootcamps,
  updateBootcamps,
  deleteBootcamps,
  getBootcampsInRadius,
  bootcampUploadPhoto,
};
