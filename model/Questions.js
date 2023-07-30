const mongoose = require("mongoose");

//question schema schema is also know for the blueprint of the database or of questions model
questionSchema = new mongoose.Schema(
  {
    question: {
      type: "string",
      reequried: true,
    },
    options: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Options",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Questions = mongoose.model("Questions", questionSchema);

//exports questions model to be access for other page
module.exports = Questions;
