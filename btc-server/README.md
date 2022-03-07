# README

## Setup Instructions
1. Start Docker Container  
`docker run -d -p 19000:19000 -p 19001:19001 -p 19011:19011 cryptochain/bitcoin-regtest`
2. Test RPC connectivity  
`curl --user admin1:123 --data-binary '{"jsonrpc": "1.0", "id": "curltest", "method":"getmemoryinfo", "params": []}' -H 'content-type: text/plain;' http://127.0.0.1:19001/`
3. Generate Blocks  
SSH into the container  
`sudo docker exec -it <container-id> /bin/bash`
Generate a minimum of 100 blocks  
`make generate BLOCKS=500`
4. Setup project  
`npm ci`
5. Start Server  
`npm start`

## Usage
1. **GET** `api/generateWallet`       : Generates a new address with private Key
2. **GET** `api/getBalance?address=`  : Gets the balance of the default wallet  
3. **GET** `api/getTransaction?txid=` : Gets Transaction details
4. **POST** `api/send`          : Sends BTC from default wallet to any address  
### POST Payload structure
```
{
    "address":"mzc5gyKed4LoBPkiGXTtfM8r4DpsfHqTA5",
    "amount": 25
}
```