const { curly } = require('node-libcurl');
const BASE_URL = `http://${process.env.BTC_CREDS}@127.0.0.1:19001/`;

const getBalance = async () => {
    const { data } = await rpcHelper('getbalance', []);
    return data;
}

const getAddress = async () => {
    const { data } = await rpcHelper('getnewaddress', []);
    return data;
}

const getUTXOs = async (address) => {
    const { data } = await rpcHelper('listunspent', [0, 9999999, [address], true]);
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
    getBalance,
    getAddress,
    getUTXOs
}

module.exports = data;