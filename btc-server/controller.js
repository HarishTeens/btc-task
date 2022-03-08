const data = require("./data");
const bitcore = require('bitcore-lib');


const getPubkeyFromTx = async (txid, vo) => {
    const { result } = await data.getRawTransaction(txid);
    const { result: decodedTx } = await data.decodeRawTransaction(result);

    const requiredVout = decodedTx.vout.find(vout => vout.n === vo);
    return requiredVout.scriptPubKey.hex;
}

const getBalance = async (req, res) => {
    const address = req.query.address;
    const { result: utxos } = await data.getUTXOs(address);
    let balance = 0;
    if (utxos.length !== 0) {
        balance = utxos.reduce((total, utxo) => {
            return total + utxo.amount;
        }, 0);        
    }  
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
    let senderBalance;
    if (utxos.length !== 0) {
        senderBalance = utxos.reduce((total, utxo) => {
            return total + utxo.amount;
        }, 0);        
    } 
    
    if (senderBalance < amount) {
        res.json({ error: "Insufficient balance" });
        return;
    }
    
    // 2. prepare inputs    
    const satoshiToSend = amount * 100000000;
    const prevTxs = await Promise.all(utxos.map(async utxo => ({
        txid: utxo.txid,
        outputIndex: utxo.vout,
        script: utxo.scriptPubKey,
        satoshis: Math.floor(Number(utxo.amount) * 100000000),
        address: utxo.address
    })));

    // 3. Create the transaction
    const transaction = new bitcore.Transaction();
    transaction.from(prevTxs);
    transaction.to(receiver, satoshiToSend);
    transaction.fee(0.001 * 100000000);
    transaction.change(sender);

    // 4. Sign the transaction
    transaction.sign(senderKey);
    const signedTx = transaction.serialize();
    // 5. send it
    // await data.importPrivKey(senderKey);
    const { result: txid } = await data.sendTransaction(signedTx);
    // 6. Mine a block to confirm the transaction
    const { result: blockHash } = await data.generateBlock(senderKey);
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
    getTransaction
}

module.exports = controller;