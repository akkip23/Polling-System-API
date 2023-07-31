const express = require("express");
const router = express.Router();
const questionController = require("../../../controller/Api/v1/questions_controller");

//pass req to controller and save new question to DB
router.post("/create", questionController.create);
//view all Added questions read-only
router.get("/view", questionController.view);
//view question with a particular ID
router.get("/:id", questionController.viewQuestionWithID);
//create options for a particular questions
router.post("/:id/options/create", questionController.findQuestionandCreateOptions);
//delete the question and it's associated options
router.delete("/:id/delete", questionController.deleteQuestion);

module.exports = router;
