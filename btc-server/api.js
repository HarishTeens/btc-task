const express = require("express");
const router = express.Router();
const { getBalance, send, getTransaction, generateWallet} = require("./controller");

router.get("/generateWallet", generateWallet);
router.get("/getBalance", getBalance);
router.get("/getTransaction", getTransaction);
router.post("/send", send);

module.exports = router;