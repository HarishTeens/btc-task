const express = require("express");
const router = express.Router();
const { getBalance, send } = require("./controller");

router.get("/getBalance", getBalance);
router.post("/send", send);

module.exports = router;