const express = require("express");
const router = express.Router();

//route all request to api version 1 (v1) 
router.use("/api/v1", require("./Api/v1/index"));

module.exports = router;
