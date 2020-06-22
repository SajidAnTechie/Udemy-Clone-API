const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const { unknownEndpoints, errorHandler } = require("./middleware/error");
const connectDb = require("./config/db");
const app = express();

dotenv.config({ path: "./config/config.env" });

connectDb();

app.use(express.json());

const bootcampRouter = require("./routes/bootcamp");

app.use("/api/v1/bootcamp", bootcampRouter);

app.use(unknownEndpoints);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

//Handle unhandle promise rejection

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  //close the server
  server.close(() => process.exit(1));
});
