const express = require("express");
const router = express.Router();

router.use("/questions", require("./questions"));

module.exports = router;
