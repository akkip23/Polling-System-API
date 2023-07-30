//require express to use all functionalities of express
const { error } = require("console");
const express = require("express");
//app var get access to all functions for express
const app = express();
//port to run app on
const port = 8000;
//make connection to DB
const db = require("./config/mongoose");

//parse req.body and send it as object
app.use(express.urlencoded({ extended: true }));
//routes
app.use("/", require("./routes/index"));

//server will listen to all the req and send res and will run on port 8000
app.listen(port, (err) => {
  if (err) {
    console.log("error connecting to server", error);
    return;
  }
  console.log("connection successful on port ", port);
});
