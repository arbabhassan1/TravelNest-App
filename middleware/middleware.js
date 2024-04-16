const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../Schema");

// Check the User is Login or Not

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Access Denied: You must be logged in to proceed.");
    return res.redirect("/login");
  }
  next();
};

// Check the Listing Owner

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let dbListing = await Listing.findById(id);

  if (res.locals.currUser && !dbListing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You Don't Owned this Listing!");

    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Validate Listing

module.exports.validateListing = (req, res, next) => {
  let valResult = listingSchema.validate(req.file);

  if (valResult.error) {
    throw new ExpressError(400, valResult.error);
  } else {
    next();
  }
};

// validate Reviews

module.exports.validateReview = (req, res, next) => {
  let valResult = reviewSchema.validate(req.body);

  if (valResult.error) {
    throw new ExpressError(400, valResult.error);
  } else {
    next();
  }
};
