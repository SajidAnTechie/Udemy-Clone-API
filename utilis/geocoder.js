const NodeGeocoder = require("node-geocoder");
const options = {
  provider: "openstreetmap",
  httpAdapter: "https",
  //apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
