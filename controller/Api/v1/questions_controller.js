//require schema to save question data
const Questions = require("../../../model/Questions");
//require schema to save Options data
const Options = require("../../../model/Options");
const mongoose = require('mongoose');

//create controller action to handle req for new question and add it to DB
module.exports.create = async function (req, res) {
  if (req.body.question == undefined || req.body.question == null) {
    return res.status(400).json({
      message:
        "error creating question wrong input key name use 'question' as key",
    });
  }
  // create new question in Question model
  await Questions.create({ question: req.body.question })
    .then((question) => {
      return res.status(200).json({
        message: `${question.question} Created successfully`,
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
  await Questions.find({})
    .populate("options")
    .then((data) => {
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

  //check if the id is a valid id or not
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {    
    return res.status(400).json({ error: 'Invalid Question ID format.' });
  } 
  
  //check if the question exist in the database
  try {
    const userId = req.params.id;
    const users = await Questions.find({ _id: userId });

    if (users.length === 0) {
      // No Question found      
      return res.status(404).json({ error: 'Question does not exist.' });
    }
  } catch (error) {
    console.error('Error querying the database:', error); 
  } 
  
  await Questions.findById(req.params.id)
  .populate("options") 
  .then((question) => {
    return res.status(200).json({
      question,
    });
  })
  .catch((err) => {
    res.status(404).json({
      message: `Error finding question`,
    });
  });
};

//find question and add option to the it
module.exports.findQuestionandCreateOptions = async function (req, res) {

  //check if req.body key name is valid or not
  if (req.body.text == undefined || req.body.text == null) {
    return res.status(400).json({
      message:
        "error creating option no input provided or wrong input key name use 'text' as key",
    });
  }

  //check if the id is a valid id or not
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {    
    return res.status(400).json({ error: 'Invalid Question ID format.' });
  } 
  
  //check if the question exist in the database
  try {
    const userId = req.params.id;
    const users = await Questions.find({ _id: userId });

    if (users.length === 0) {
      // No Question found      
      return res.status(404).json({ error: 'Question does not exist.' });
    }
  } catch (error) {
    console.error('Error querying the database:', error); 
  } 

  try {
    await Questions.findById(req.params.id).then(async (question) => {
      await Options.create({
        text: req.body.text,
        question_id: question.id,
      }).then(async (option) => {
        await Options.findByIdAndUpdate(
          option.id,
          {
            link_to_vote: `https://polling-system-api-production-add7.up.railway.app/api/v1/options/${option.id}/add_vote`,
          },
          { new: true }
        ).then((updateOption) => {
          question.options.push(updateOption);
          question.save();
          return res.status(200).json({
            option: updateOption,
            message: "option created successfully",
          });
        });
      });
    });
  } catch (error) {
    return res.status(400).json({
      data: `Error finding question`,
    });
  }
};

//delete the question and it's associated options
module.exports.deleteQuestion = async function (req, res) {

  //check if the id is a valid id or not
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {    
    return res.status(400).json({ error: 'Invalid Question ID format.' });
  } 
  
  //check if the question exist in the database
  try {
    const userId = req.params.id;
    const users = await Questions.find({ _id: userId });

    if (users.length === 0) {
      // No Question found      
      return res.status(404).json({ error: 'Question does not exist.' });
    }
  } catch (error) {
    console.error('Error querying the database:', error); 
  }  

  //check if any option exist and if exist check if any option has any votes if yes option cannot be deleted
  const optionsWithVotes = await Options.findOne({
    question_id: req.params.id,
    votes: { $gt: 0 },
  });
  if (optionsWithVotes) {
    return res.status(403).json({
      message: "Cannot delete question with voted options",
    });
  }

  try {
    await Questions.findById(req.params.id).then(async (question) => {
      await Options.deleteMany({ _id: { $in: question.options } });
      await Questions.deleteOne({ _id: question._id });
      return res.status(200).json({
        message: "question deleted successfully",
      });
    });
  } catch (error) {
    return res.status(400).json({
      message: `Error deleting question`,
    });
  }
};
