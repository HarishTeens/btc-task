const express = require('express');
const { curly } = require('node-libcurl')
require('dotenv').config();
const app = express();

const BASE_URL = `http://${process.env.BTC_CREDS}@127.0.0.1:19001/`;

app.get("/", async (req, res) => {
    const { data } = await curly.post(BASE_URL, {
        postFields: JSON.stringify({
            "jsonrpc": "1.0", "id": "curltest", "method":
                "getmemoryinfo", "params": []
        }),
        httpHeader: [
            'Content-Type: text/plain'
        ],
    })
    res.json(data);
});

app.listen(3000, () => {
    console.log("Server started in port 3000");
})