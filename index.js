const express = require("express");
const app = express();
const PORT_NO = 8484;

// Home Route
app.get("/", (req, res) => {
  res.send("/listings");
});

app.listen(PORT_NO, () => {
  console.log("Server is Live on Port NO: " + PORT_NO);
  console.log("Live Preview: " + "http://localhost:" + PORT_NO + "/listings");
});
