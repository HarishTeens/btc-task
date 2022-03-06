const data = require("./data");

const getBalance = async (req, res) => {
    const response = await data.getBalance();;
    res.json({ balance: response.result });
}

const getAddress = async (req, res) => {
    const response = await data.getAddress();
    res.json({ address: response.result });
}

const controller = {
    getBalance,
    getAddress
}

module.exports = controller;