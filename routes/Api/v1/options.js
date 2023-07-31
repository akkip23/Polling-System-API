const express = require("express");
const router = express.Router();
const optionController = require("../../../controller/Api/v1/options_controller");

//rediret req to option controller to delete option and option id associated with 
router.delete("/:id/delete", optionController.deleteOption)

module.exports = router;
 