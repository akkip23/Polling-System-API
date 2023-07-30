//require schema to save question data
const Questions = require("../../../model/Questions");
const Question = require("../../../model/Questions");

//create controller action to handle req for new question and add it to DB
module.exports.create = async function (req, res) {
  if (req.body.text == undefined || req.body.text == null) {
    return res.status(400).json({
      message: "error creating question wrong input key name use 'text' as key",
    });
  }
  // create new question in Question model
  await Question.create({ question: req.body.text })
    .then((question) => {
      return res.status(200).json({
        message: `${question.question} saved successfully`,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: `Error creating New question : ${err}`,
      });
    });
};

//view all question list
module.exports.view = async function (req, res) {
  await Question.find({}).then((data) => {
    if (data.length > 0) {
      return res.status(200).json({
        questions: {
          data,
        },
      });
    } else {
      return res.status(200).json({
        message: "No Questions Available to show, Add New Questions to view",
      });
    }
  });
};

//view question and options with selected question id
module.exports.viewQuestionWithID = function (req, res) {
  Questions.findById(req.params.id)
    .populate("options")
    .then((question) => {
      return res.status(200).json({
        question,
      });
    })
    .catch((err) => {
      res.status(404).json({
        message: `No Data found`,
      });
    });
};
