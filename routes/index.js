const express = require("express");
const router = express.Router();

router.use("/api/v1", require("./Api/v1/index"));

module.exports = router;
