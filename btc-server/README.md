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
4. Configure ENV variables  
    a. Set BTC_CREDS. Format: `<username>:<password>`  
    b. Use the list transactions API to get root wallet address and set it to ROOT_WALLET_ADDRESS  
    `curl --user admin1:123 --data-binary '{"jsonrpc": "1.0", "id": "curltest", "method":"listtransactions", "params": ["*",1]}' -H 'content-type: text/plain;' http://127.0.0.1:19001/ | jq -r  '.result[0].address'`    
       **Note:** If you dont have `jq` installed, you can easily install it using `sudo apt-get install jq`  
6. Setup project  
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

### Example Walkthrough
- **Generate Wallet**  
![image](https://user-images.githubusercontent.com/33366456/156957729-3f1e29eb-cdc4-4eb5-827b-bed52c805e5f.png)

- **Check initial balance** 
![image](https://user-images.githubusercontent.com/33366456/156957761-ddcad350-a842-4a7d-80e8-556f26912f27.png)
- **Send BTC to the generated address using the SEND API**  
If the Tx was successfull, you would get the TX ID in the response.  
![image](https://user-images.githubusercontent.com/33366456/156957785-984664fc-1de0-454e-bdb9-1ae6c34a5f70.png)
- **Check the TX details**   
I've hardcoded the GAS fees to be 0.001 at the moment. This could easily be changed, if required :)   
![image](https://user-images.githubusercontent.com/33366456/156957891-aaa93117-67e9-4916-818b-573f91073d40.png)
- **Check Address balance**  
As expected we got 35 BTC in our balance 🚀  
![image](https://user-images.githubusercontent.com/33366456/156957991-707bc24a-b10b-4f48-92e7-2e602ed9e744.png)
