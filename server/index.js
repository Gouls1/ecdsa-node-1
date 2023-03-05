const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak")
const { utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());



const balances = 
{
  "31dc8cfb9d2e9b872687c060de71a490bdb90523": 100,
  "0x2": 50,
  "0x3": 75,
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, message, sign, recovery } = req.body;

    function recoverKey(message, signature, recoveryBit) {
      return secp.recoverPublicKey(message, signature, recoveryBit)
  }


  const recoveredKey = recoverKey(Uint8Array.from(Object.values(message)), Uint8Array.from(Object.values(sign)), recovery);


  if (toHex(keccak256((recoveredKey).slice(1)).slice(-20)) !== sender) {
    console.log(sender);
    res.status(400).send({message: "Transaction could not be signed"});

  } else {

    setInitialBalance(sender);
    setInitialBalance(recipient);
    


      if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
      } else {
        balances[sender] -= amount;
        balances[recipient] += amount;
        res.send({ balance: balances[sender] });
      }
  };
});


app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
