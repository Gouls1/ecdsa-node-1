import { useState } from "react";
import server from "./server";

import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";


function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);


  const privateKey = "ef623f95022d3556a9995c4e4b5ce2c2f654a97e5614f06ce3c5ce7416e49371";

  function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
  }
  
  async function signMessage(msg) {
    let hashMsge = hashMessage(msg);
    return secp.sign(hashMsge, privateKey, {recovered: true});
  }

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const message = `${address} sends ${sendAmount} to ${recipient}`;
      
      const [sign, recovery] = await signMessage(message);

      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        message: hashMessage(message),
        sign: sign,
        recovery,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
