const data = require("./data");

const getBalance = async (req, res) => {
    const address = req.query.address;
    console.log(address);
    const response = await data.getUTXOs(address);
    const totalBalance = response.result.reduce((total, utxo) => { 
        return total + (utxo.spendable ? utxo.amount : 0);
    }, 0);
    res.json({ balance: totalBalance });
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