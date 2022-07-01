const bitcoin = require('bitcoinjs-lib');
const bip32 = require('bip32');
const bip39 = require('bip39');
const crypto = require('crypto');
const bs58check = require('bs58check');
const { bech32 } = require('bech32');
const b58 = require('b58');
const Mnemonic = require('bitcore-mnemonic');

const fs = require('fs');

require('dotenv').config();

const mnemonic = process.env.MNEMONIC;
const xpub = process.env.XPUB;
const zpub = process.env.ZPUB;
const modifiedZpub = convertZpub(zpub, false);

const network = bitcoin.networks.bitcoin;
const bipMaster = 84; // Purpose Node using Bip84 for Segwit
const isTestNet = false;
const coinNode = +isTestNet;  // Coin Node 0 for Mainnet 1 for Testnet
const accountNode = 0; // Account Node 
const chainIndex = 0; // Chain Index 0 for Receive 1 for Change
const addressIndex = 6; // Address Index [0..n]

function main() {
    const address1 = getSegwitAddressFromMnemonic(mnemonic);
    const address2 = getSegwitAddressFromZpub(modifiedZpub);
    console.log(address1, address2);
}

function getSegwitAddressFromMnemonic(mnemonic) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    const data = bip32.fromSeed(seed, network) // Master Node
        .deriveHardened(bipMaster)
        .deriveHardened(coinNode)
        .deriveHardened(accountNode)
        .derive(chainIndex)
        .derive(addressIndex)
        .publicKey;

    return getAddressFromPubKey(data);
}

function getSegwitAddressFromZpub(zpub) {
    const buffer = bs58check.decode(zpub);
    const version = buffer.readUInt32BE(0);

    const data = bip32
        .fromBase58(zpub, network)
        .derive(chainIndex)
        .derive(addressIndex).publicKey;

    return getAddressFromPubKey(data);
}

function convertZpub(zpub, isTestNet) {
    let data;
    try {
        data = bs58check.decode(zpub);

    } catch (error) {
        console.log(error);
    }
    data = data.slice(4);
    if (isTestNet) {
        // Append `xpub`
        data = Buffer.concat([Buffer.from('043587cf', 'hex'), data]);
    } else {
        // Append `tpub`
        data = Buffer.concat([Buffer.from('0488b21e', 'hex'), data]);
    }
    return bs58check.encode(data);
}

function getAddressFromPubKey(data) {
    const sha256Digest = crypto
        .createHash('sha256')
        .update(data.toString('hex'), 'hex')
        .digest('hex');

    const ripemd160Digest = crypto
        .createHash('ripemd160')
        .update(sha256Digest, 'hex')
        .digest('hex');

    const bech32Words = bech32.toWords(Buffer.from(ripemd160Digest, 'hex'));
    const words = new Uint8Array([0, ...bech32Words]);
    return bech32.encode(isTestNet ? 'tb' : 'bc', Array.from(words));
}

main();