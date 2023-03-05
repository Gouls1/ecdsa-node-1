const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak")

function genPrivateKey() {
    return toHex(secp.utils.randomPrivateKey());
}

function genPublicKey() {
    return toHex(keccak256((secp.getPublicKey(privateKey)).slice(1)).slice(-20));
}

let wallets = [];

for (let i = 0; i < 3; i++) {
    let pair = [];
    privateKey = genPrivateKey();
    pair.push(privateKey);
    pair.push(genPublicKey());
    wallets.push(pair);
}



for (let j = 0; j< wallets.length; j++) {
    console.log(wallets[j]);
}

return wallets