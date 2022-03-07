const express = require("express");
const router = express.Router();
const { getBalance, faucet, getTransaction, generateWallet, send} = require("./controller");


router.get("/generateWallet", generateWallet);
router.get("/getBalance", getBalance);
router.get("/getTransaction", getTransaction);
router.post("/faucet", faucet);
router.post("/send", send);

module.exports = router;