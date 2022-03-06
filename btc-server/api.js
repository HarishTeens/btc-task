const express = require("express");
const router = express.Router();
const { getBalance,  getAddress} = require("./controller");

router.get("/getBalance", getBalance);
router.get("/getAddress", getAddress);
router.post("/send",);

module.exports = router;