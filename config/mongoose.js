//require mongoose to connect to DB
const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://akshaypawle23:d1Ek4P7WguzL3LEd@cluster0.tkdtine.mongodb.net/`
  )
  .then(() => {
    console.log("connection successful to DB");
  })
  .catch((err) => {
    console.log("error connecting to the server");
  });
