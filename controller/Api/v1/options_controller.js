//require schema to save question data
const Questions = require("../../../model/Questions");
//require schema to save Options data
const Options = require("../../../model/Options");

//delete option of a question if the option contains have votes to it the option cannot be deleted
module.exports.deleteOption = async function (req, res) {

  //check if the option id exist for the selected option
  let optionIsExist = await Options.exists({ _id: req.params.id });
  if (optionIsExist == null) {
    return res.status(404).json({
      message: "option does not exists",
    });
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

  //check if the option id exist for the selected option
  let optionIsExist = await Options.exists({ _id: req.params.id });
  if (optionIsExist == null) {
    return res.status(404).json({
      message: "option does not exists",
    });
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
