const { curly } = require('node-libcurl');
const BASE_URL = `http://${process.env.BTC_CREDS}@127.0.0.1:19001/`;

const getRootBalance = async () => {
    const { data } = await rpcHelper('getbalance', []);
    return data;
}

const listTransactions = async (params = []) => {
    const { data } = await rpcHelper('listtransactions', params);
    return data;
}
const getRawTransaction = async (txid) => {
    const { data } = await rpcHelper('getrawtransaction', [txid]);
    return data;
}

const decodeRawTransaction = async (rawTx) => {
    const { data } = await rpcHelper('decoderawtransaction', [rawTx]);
    return data;
}

const getNewAddress = async () => {
    const { data } = await rpcHelper('getnewaddress', []);
    return data;
}

const getChangeAddress = async () => {
    const { data } = await rpcHelper('getrawchangeaddress', []);
    return data;
}

const getUTXOs = async (address = "") => {
    const { data } = await rpcHelper('listunspent', [0, 9999999, address != "" ? [address] : [], true]);
    return data;
}

const createTransaction = async (txParams) => {
    const { data } = await rpcHelper('createrawtransaction', txParams);
    return data;
}

const importAddress = async (address) => {
    const { data } = await rpcHelper('importaddress', [address, "outside"]);
    return data;
}

const importPrivKey = async (privKey) => {
    const { data } = await rpcHelper('importprivkey', [privKey, "outside"]);
    return data;
}

const dumpPrivateKey = async (address) => {
    const { data } = await rpcHelper('dumpprivkey', [address]);
    return data;
}

const signTransaction = async (txParams) => {
    const { data } = await rpcHelper('signrawtransaction', txParams);
    return data;
}

const sendTransaction = async (tx) => {
    const { data } = await rpcHelper('sendrawtransaction', [tx]);
    return data;
}

const getTransaction = async (txid) => {
    const { data } = await rpcHelper('gettransaction', [txid]);
    return data;
}

const generateBlock = async (address) => {
    const { data } = await rpcHelper('generatetoaddress', [1, address]);
    return data;
}



const rpcHelper = async (method, params) => {
    // a function to RPC call to the node
    return await curly.post(BASE_URL, {
        postFields: JSON.stringify({
            "jsonrpc": "1.0", "id": "curltest", "method":
                method, "params": params
        }),
        httpHeader: [
            'Content-Type: text/plain'
        ],
    })
}

const data = {
    getRootBalance,
    getChangeAddress,
    getUTXOs,
    createTransaction,
    dumpPrivateKey,
    signTransaction,
    sendTransaction,
    getTransaction,
    generateBlock,
    listTransactions,
    getNewAddress,
    importAddress,
    getRawTransaction,
    decodeRawTransaction,
    importPrivKey
}

module.exports = data;