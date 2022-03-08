const data = require("./data");

const generateWallet = async (req, res) => {
    const { result: address } = await data.getNewAddress();
    const { result: privateKey } = await data.dumpPrivateKey(address);
    res.json({
        address,
        privateKey
    })
}

const getBalance = async (req, res) => {
    const address = req.query.address;
    const { result } = await data.listTransactions(["outside", 10, 0, true]);
    const balance = result.filter(tx => tx.category === "receive" && tx.address === address).reduce((total, tx) => {
        return total + tx.amount;
    }, 0);

    res.json({ balance: balance });
}

const faucet = async (req, res) => {
    const address = req.body.address;
    const amount = 100; // Fixed amount for faucets

    // 0. Import Address as watchonly    
    await data.importAddress(req.body.address);

    // 1. check sufficient balance in default account 
    const { result: rootBalance } = await data.getRootBalance();
    if (rootBalance < amount) {
        res.json({ error: "Insufficient balance" });
        return;
    }

    // 2. find all UTXOs from rootAddress
    const { result: utxos } = await data.getUTXOs(process.env.ROOT_WALLET_ADDRESS);

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
    const { result: changeAddress } = await data.getChangeAddress();
    const balance = collectedAmount - requiredAmount;
    let txParams = [
        requiredUTXOs.map(utxo => ({ txid: utxo.txid, vout: utxo.vout })),
        { [address]: amount, [changeAddress]: balance.toPrecision(8) }
    ]
    const { result: unsignedTx } = await data.createTransaction(txParams);

    // 4. dump and get private keys
    const requiredAddresses = new Set();
    for (let utxo of requiredUTXOs) {
        requiredAddresses.add(utxo.address);
    }
    let requiredKeys = await Promise.all([...requiredAddresses].map(async address => {
        const { result } = await data.dumpPrivateKey(address);
        return result;
    }))

    // 5. sign the transaction
    const prevTxs = requiredUTXOs.map(utxo => ({
        txid: utxo.txid,
        vout: utxo.vout,
        scriptPubKey: utxo.scriptPubKey,
        amount: utxo.amount
    }));
    txParams = [
        unsignedTx,
        prevTxs,
        requiredKeys
    ]
    const { result: signedTx } = await data.signTransaction(txParams);
    // 7. send it
    const { result: txid } = await data.sendTransaction(signedTx.hex);
    // 8. Mine a block to confirm the transaction
    const { result: blockHash } = await data.generateBlock(address);

    res.json({ txid: txid });
}

const send = async (req, res) => {
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const amount = req.body.amount;
    const senderKey = req.body.senderKey;

    // 1. check sufficient balance in sender account
    const { result: utxos } = await data.getUTXOs(sender);
    const senderBalance = utxos.reduce((total, utxo) => {
        return total + (utxo.spendable ? utxo.amount : 0);
    }, 0);
    if (senderBalance < amount) {
        res.json({ error: "Insufficient balance" });
        return;
    }

    // 2. gather required UTXOs
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
    const balance = collectedAmount - requiredAmount;
    let txParams = [
        requiredUTXOs.map(utxo => ({ txid: utxo.txid, vout: utxo.vout })),
        { [receiver]: amount, [sender]: balance.toPrecision(8) }
    ]
    const { result: unsignedTx } = await data.createTransaction(txParams);

    // 4. sign the transaction
    const prevTxs = requiredUTXOs.map(utxo => ({
        txid: utxo.txid,
        vout: utxo.vout,
        scriptPubKey: utxo.scriptPubKey,
        amount: utxo.amount
    }));
    txParams = [
        unsignedTx,
        prevTxs,
        [senderKey]
    ]
    const { result: signedTx } = await data.signTransaction(txParams);
    // 7. send it
    const { result: txid } = await data.sendTransaction(signedTx.hex);
    // 8. Mine a block to confirm the transaction
    const { result: blockHash } = await data.generateBlock(receiver);
    res.json({ txid: txid });
}

const getTransaction = async (req, res) => {
    const txid = req.query.txid;
    const { result } = await data.getTransaction(txid);
    res.json(result);
}

const controller = {
    getBalance,
    faucet,
    send,
    getTransaction,
    generateWallet
}

module.exports = controller;