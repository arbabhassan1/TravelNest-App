const Review = require("../models/reviews");
const Listing = require("../models/listing");

// ADD REVIEW

module.exports.addReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = res.locals.currUser._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Added Successfuly!");

  res.redirect(`/listings/${req.params.id}`);
};

// DELETE REVIEW

module.exports.destoryReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Delete Successfuly!");

  res.redirect(`/listings/${id}`);
};
