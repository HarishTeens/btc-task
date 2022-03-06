const express = require("express");
const router = express.Router();
const { getBalance, send, getTransaction } = require("./controller");

router.get("/getBalance", getBalance);
router.get("/getTransaction", getTransaction);
router.post("/send", send);

module.exports = router;