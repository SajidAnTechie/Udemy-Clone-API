const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  updateRating,
} = require("../controller/review");

const router = require("express").Router({ mergeParams: true });

//Invoked middleware
const advanceResults = require("../middleware/advanceResults");
const { protect, permission } = require("../middleware/auth");

//Review model
const Review = require("../models/Review");

router
  .route("/")
  .get(
    advanceResults(Review, { path: "bootcamp", select: "name description" }),
    getReviews
  )
  .post(protect, permission("user", "admin"), createReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, permission("user", "admin"), updateReview)
  .delete(protect, permission("user", "admin"), deleteReview);
router
  .route("/updateRating/:id")
  .put(protect, permission("user", "admin"), updateRating);

module.exports = router;
