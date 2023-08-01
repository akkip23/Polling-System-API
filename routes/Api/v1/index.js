const express = require("express");
const router = express.Router();

//routes all request for questions
router.use("/questions", require("./questions"));
//routes all request for options 
router.use("/options", require("./options"));

module.exports = router;
