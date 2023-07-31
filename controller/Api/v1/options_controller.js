//require schema to save question data
const Questions = require("../../../model/Questions");
const Options = require("../../../model/Options");

module.exports.deleteOption = async function (req, res) {
    console.log(req.params.id);
    try {
        await Options.findByIdAndDelete(req.params.id).then(async (option) => {
            await Questions.findByIdAndUpdate(option.question_id, {$pull: {options: req.params.id}})
            .then(() => {
                return res.status(200).json({
                    message: "Option data deleted Successfully"
                })
            })
        })
    } catch (error) {
        return res.status(404).json({
            message: "Error deleting Option"
        })
    }
}