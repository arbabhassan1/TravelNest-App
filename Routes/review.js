const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap");
const { validateReview, isLoggedIn } = require("../middleware/middleware");
const reviewsController = require("../controllers/reviews");
// Add Rwview

router.post(
  "/",
  validateReview,
  isLoggedIn,
  asyncWrap(reviewsController.addReview)
);

// Review Delete Route

router.delete("/:reviewId", asyncWrap(reviewsController.destoryReview));

module.exports = router;
