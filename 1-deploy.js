require("./qrllib/qrllib-js.js")

const request = require('request');
const ethUtil = require('ethereumjs-util')
const Web3EthAbi = require("web3-eth-abi")
const txHelper = require('./helper/tx.js')
const contractCompiler = require("./contract-compiler");

/* Compile contract using solidity compiler and get output */
let output = contractCompiler.GetCompilerOutput()
const inputABI = output.contracts['MyToken.sol']['MyToken'].abi

/* Load Wallet */
let hexSeed = "0x062482cca43bfe13e45f925a4226f1c9f4cd143474490552bcb5f1a869693d950133daea7b7fe7526f7abe9b7e873014"
let d = dilithium.NewFromSeed(hexSeed)

/* Prepare Contract Input */
let contractByteCode = output.contracts['MyToken.sol']['MyToken'].evm.bytecode.object

/* Prepare Constructor Input (if any) */
let callData = Web3EthAbi.encodeFunctionCall(inputABI[0], ["TOKEN123", "HELLO"])
contractByteCode = '0x' + contractByteCode + callData.slice(10) // Ignore 0x and 8 byte of hex string of constructor signature

/* Prepare Contract Deployment Transaction */
let nonce = 0
let tx = txHelper.CreateTx(nonce, 2000000, 100, "", 0, contractByteCode)
txHelper.SignTx(tx, d)

/* Prepare RPC call request */
let options = {
    url: "http://127.0.0.1:4545",  // Zond RPC API address and port
    method: "post",
    headers:
        {
            "content-type": "application/json"
        },
    body: JSON.stringify( {"jsonrpc": "2.0", "id": 1, "method": "zond_sendRawTransaction", "params": [tx] })
};

/* Make RPC call */
request(options, (error, response, body) => {
    if (error) {
        console.error('An error has occurred: ', error);
    } else {
        console.log('Post successful: response: ', body);
    }
});

let deployedContractAddress = '0x' + ethUtil.generateAddress(Buffer.from(d.GetAddress().slice(2), 'hex'), Buffer.from(txHelper.NumToHex(nonce), 'hex')).toString('hex')
console.log("Expected contract address ", deployedContractAddress)
