const express = require("express");
const router = express.Router();
const { getBalance } = require("./controller");

router.get("/getBalance", getBalance);
router.get("/getAddress",);
router.post("/send",);

module.exports = router;