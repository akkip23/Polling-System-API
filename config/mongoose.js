//require mongoose to connect to DB
const mongoose = require("mongoose");

//connect to mongoDB database
mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("connection successful to DB");
  })
  .catch((err) => {
    console.log("error connecting to the server");
  });
