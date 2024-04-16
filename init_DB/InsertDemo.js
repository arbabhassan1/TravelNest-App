const mongoose = require("mongoose");
const Listing = require("../models/listing");
const mydata = require("./demoData");

const dbURL = process.env.ATLAS_DB_URL;

main()
  .then(() => console.log("DB Connect"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
}

async function initialData() {
  await Listing.deleteMany({});

  mydata.data = mydata.data.map((obj) => ({
    ...obj,
    owner: "661d3121288139c9994f3726",
  }));

  await Listing.insertMany(mydata.data)
    .then(() => console.log("Done"))
    .catch((err) => console.log(err));
}

initialData();
