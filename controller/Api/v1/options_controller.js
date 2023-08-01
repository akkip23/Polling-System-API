//require schema to save question data
const Questions = require("../../../model/Questions");
const Options = require("../../../model/Options");

module.exports.deleteOption = async function (req, res) {
  let optionIsExist = await Options.exists({ _id: req.params.id });
  if (optionIsExist == null) {
    return res.status(404).json({
      message: "option does not exists",
    });
  }
  
  let option = await Options.findById(req.params.id)
  if (option.votes > 0) {
    return res.status(403).json({
      option: option,
      message: "The options has votes it cannot be deleted",
    });
  }

  try {
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

module.exports.addVotes = async function (req, res) {
  let optionIsExist = await Options.exists({ _id: req.params.id });
  if (optionIsExist == null) {
    return res.status(404).json({
      message: "option does not exists",
    });
  }
  try {
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
