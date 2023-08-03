//require schema to save question data
const Questions = require("../../../model/Questions");
//require schema to save Options data
const Options = require("../../../model/Options");
const mongoose = require('mongoose');

//delete option of a question if the option contains have votes to it the option cannot be deleted
module.exports.deleteOption = async function (req, res) {

  //check if the id is a valid id or not
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {    
    return res.status(400).json({ error: 'Invalid Question ID format.' });
  } 
  
  //check if the Option exist in the database
  try {
    const userId = req.params.id;
    const users = await Options.find({ _id: userId });

    if (users.length === 0) {
      // No Question found      
      return res.status(404).json({ error: 'Question does not exist.' });
    }
  } catch (error) {
    console.error('Error querying the database:', error); 
  }
  
  //find option and check if the options has votes to it
  let option = await Options.findById(req.params.id)
  if (option.votes > 0) {
    return res.status(403).json({
      option: option,
      message: "The options has votes it cannot be deleted",
    });
  }

  try {
    //find option and delete it and also find the id of the option in question schema and update it
    await Options.findByIdAndDelete(req.params.id).then(async (option) => {
      await Questions.findByIdAndUpdate(option.question_id, {
        $pull: { options: req.params.id },
      }).then(() => {
        return res.status(200).json({
          message: "Option data deleted Successfully",
        });
      });
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error deleting Option",
    });
  }
};

//add votes to a particular options of a question
module.exports.addVotes = async function (req, res) {

  //check if the id is a valid id or not
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {    
    return res.status(400).json({ error: 'Invalid Question ID format.' });
  } 
  
  //check if the Option exist in the database
  try {
    const userId = req.params.id;
    const users = await Options.find({ _id: userId });

    if (users.length === 0) {
      // No Question found      
      return res.status(404).json({ error: 'Question does not exist.' });
    }
  } catch (error) {
    console.error('Error querying the database:', error); 
  }

  try {
    //find option and update it's votes
    const option = await Options.findById(req.params.id);
    await Options.findByIdAndUpdate(
      req.params.id,
      { votes: option.votes + 1 },
      { new: true }
    ).then((option) => {
      return res.status(200).json({
        option: option,
        message: "votes updated successfully",
      });
    });
  } catch (error) {
    return res.status(400).json({
      message: `Error updating votes ${error}`,
    });
  }
};
