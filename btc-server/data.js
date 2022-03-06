const { curly } = require('node-libcurl');
const BASE_URL = `http://${process.env.BTC_CREDS}@127.0.0.1:19001/`;

// a function to RPC call to the node
const rpcHelper = async (method, params) => {
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

const getBalance = async () => {
    const { data } = await rpcHelper('getbalance', []);
    return data;
}

const data = {
    getBalance
}

module.exports = data;