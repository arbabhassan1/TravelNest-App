const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const asyncWrap = require("../utils/asyncWrap");
const listingController = require("../controllers/listings");
const multer = require("multer");
const storage = require("../CloudConfig");

const upload = multer(storage);

const {
  isLoggedIn,
  isOwner,
  validateListing,
} = require("../middleware/middleware");

// Index Route

router.get("/", asyncWrap(listingController.index));

// New Route

router.get("/new", isLoggedIn, listingController.renderNewForm);

// Edit Route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  asyncWrap(async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
  })
);

// Update Route

router.put(
  "/:id",
  validateListing,
  upload.single("listing[image]"),
  isLoggedIn,
  isOwner,
  asyncWrap(listingController.editExistingListing)
);

// Add Post Route

router.post(
  "/",
  validateListing,
  isLoggedIn,
  upload.single("listing[image]"),
  asyncWrap(listingController.addNewListing)
);

// DELETE Route

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,

  asyncWrap(listingController.destoryListing)
);

// Show Route

router.get("/:id", asyncWrap(listingController.showListing));

module.exports = router;
