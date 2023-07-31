const mongoose = require("mongoose");

//option schema schema is also know for the blueprint of the database or of option model
optionSchema = new mongoose.Schema({
  text: {
    type: "string",
    required: true,
  },
  votes: {
    type: "string",
    required: true,
    default: 0,
  },
  question_id: {
    type: "string",
    required: true,
  },
  link_to_vote: {
    type: "string",    
    default: ""
  },
}, {
  timestamps: true
});

const Options = mongoose.model("Options", optionSchema);

//exports questions model to be access for other page
module.exports = Options;
