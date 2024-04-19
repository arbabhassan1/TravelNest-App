const Listing = require("../models/listing");

//Index

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

// Add New Listing Form

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

// Show a Singal Listing

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner")
    .populate({
      path: "reviews",
      populate: { path: "author" },
    });
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  res.render("./listings/show.ejs", { listing });
};

// Delete Listing

module.exports.destoryListing = async (req, res) => {
  let { id } = req.params;

  deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfuly!");

  res.redirect("/listings");
};

// Add New Listing

module.exports.addNewListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  let { listing } = req.body;
  listing.owner = req.user._id;
  listing.image = { url, filename };
  newListing = new Listing(listing);
  await newListing.save();
  req.flash("success", "New Listing Created Successfuly!");
  res.redirect("/listings");
};

// Edit Listing

module.exports.editExistingListing = async (req, res) => {
  let { id } = req.params;
  let { listing } = req.body;

  let updateListing = await Listing.findByIdAndUpdate(id, listing);

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updateListing.image = { url, filename };
    updateListing.save();
  }

  req.flash("success", "Listing Update Successfuly!");

  res.redirect(`/listings/${id}`);
};

// Seareched Listings

module.exports.searchedListing = async (req, res) => {
  let { q } = req.query;
  const regex = new RegExp(q, "i");
  const searchedListings = await Listing.find({ title: regex });

  res.render("./listings/searched.ejs", { searchedListings, q });
};
