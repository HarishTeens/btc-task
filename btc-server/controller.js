const data = require("./data");

const getBalance = async (req, res) => {
    const response = await data.getBalance();;
    res.json({ balance: response.result });
}

const controller = {
    getBalance
}

module.exports = controller;