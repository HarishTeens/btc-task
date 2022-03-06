const data = require("./data");

const getBalance = async (req, res) => {
    const address = req.query.address;
    const response = await data.getUTXOs(address);
    const totalBalance = response.result.reduce((total, utxo) => {
        return total + (utxo.spendable ? utxo.amount : 0);
    }, 0);
    res.json({ balance: totalBalance });
}

const send = async (req, res) => {
    const address = req.body.address;
    const amount = req.body.amount;

    // 1. check sufficient balance in default account 
    const { result: rootBalance } = await data.getRootBalance();
    if (rootBalance < amount) {
        res.json({ error: "Insufficient balance" });
        return;
    }

    // 2. find all UTXOs required to send amount
    const { result: utxos } = await data.getUTXOs();
    let requiredUTXOs = [];
    let collectedAmount = 0;
    const requiredAmount = amount + 0.001; // Add Gas Fees

    for (let utxo of utxos) {
        if (utxo.spendable) {
            requiredUTXOs.push(utxo);
            collectedAmount += utxo.amount;
        }
        if (collectedAmount >= requiredAmount) {
            break;
        }
    };

    // 3. create the transaction
    const { result: receiveAddress } = await data.getReceiveAddress();
    const txParams = [
        requiredUTXOs.map(utxo => ({ txid: utxo.txid, vout: utxo.vout })),
        { [address]: amount, [receiveAddress]: collectedAmount - requiredAmount }
    ]
    const { result: unsignedTx } = await data.createTransaction(txParams);
    res.json({ unsignedTx });

    //     4. get prev tx info
    //     5. dump and get private keys
    // 6. sign
    // 7. send it
}

const controller = {
    getBalance,
    send
}

module.exports = controller;