//require schema to save question data
const Questions = require("../../../model/Questions");
const Options = require("../../../model/Options");

//create controller action to handle req for new question and add it to DB
module.exports.create = async function (req, res) {
  if (req.body.question == undefined || req.body.question == null) {
    return res.status(400).json({
      message: "error creating question wrong input key name use 'question' as key",
    });
  }
  // create new question in Question model
  await Questions.create({ question: req.body.question })
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
  await Questions.find({}).then((data) => {
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
module.exports.viewQuestionWithID = async function (req, res) {
  await Questions.findById(req.params.id)
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

//find question and add option to the it
module.exports.findQuestionandCreateOptions = async function (req, res) {
  if (req.body.text == undefined || req.body.text == null) {
    return res.status(400).json({
      message: "error creating option no input provided or wrong input key name use 'text' as key",
    });
  }

  try {
    await Questions.findById(req.params.id).then(async (question)  => {
      
      await Options.create({
        text: req.body.text,
        question_id: question.id,
      }).then(async (option) => {
        
        await Options.findByIdAndUpdate(option.id, {link_to_vote: `http://localhost:8000/api/v1/options/${option.id}/add_vote`}, {new: true})
        .then((updateOption) => {
          
          question.options.push(updateOption)
          question.save()
          return res.status(200).json({
            option: updateOption,
            message: "option created successfully"
          })
        })
      })
    })   
    
  } catch (error) {
    return res.status(404).json({
      data: `Error finding question:  ${error}`
    })
  }

}


//delete the question and it's associated options
module.exports.deleteQuestion = async function (req, res) {
  try {
    await Questions.findById(req.params.id).then((question) => {

      Options.deleteMany({_id: {$in: question.options}})
      Questions.deleteOne({_id: question._id})
      return res.status(200).json({
        message: "question deleted successfully"
      })
    })
  } catch (error) {
    return res.status(200).json({
      message: "question deleted successfully"
    })
  }
}
