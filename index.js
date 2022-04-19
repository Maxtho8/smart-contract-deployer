import Web3 from "web3";
import dotenv from "dotenv";
import fs from "fs";
import Tx from "ethereumjs-tx";
dotenv.config();

// Create a web3 instance and connect to ganache
const web3 = new Web3(
    new Web3.providers.HttpProvider('http://127.0.0.1:7545')
);
(async () => {
//Read bytecode.txt file
let bytecode = fs.readFileSync("bytecode.txt", "utf8");

// get private key
const privateKey = Buffer.from(process.env.PRIVATE_KEY, "hex");
// get address
const account = web3.eth.accounts.privateKeyToAccount("0x"+privateKey.toString("hex"));

// Create a transaction
const rawTransaction = {
    nonce: await web3.eth.getTransactionCount(account.address),
    from: account.address,
    to:null,
    data: new Buffer.from(bytecode, 'hex')
};

const transaction = new Tx.Transaction(rawTransaction);

transaction.sign(privateKey);

const serializedTransaction = transaction.serialize();

// Send the transaction
web3.eth.sendSignedTransaction("0x" + serializedTransaction.toString("hex"))
    .on("receipt", receipt => {
        console.log(receipt);
    }
)
})();