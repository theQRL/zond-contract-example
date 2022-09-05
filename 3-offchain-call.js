/* Load Wallet */
require("./qrllib/qrllib-js.js")

const request = require('request');
const Web3EthAbi = require("web3-eth-abi");
const txHelper = require("./helper/tx");
const contractCompiler = require("./contract-compiler")

let output = contractCompiler.GetCompilerOutput()

const inputABI = output.contracts['MyToken.sol']['MyToken'].abi

/* Prepare Contract Call Input */
let callData = Web3EthAbi.encodeFunctionCall(inputABI[5], ["0x2073a9893a8a2c065bf8d0269c577390639ecefa"])

/* Prepare Contract Deployment Transaction */
let tx = txHelper.CreateCall(1, 397700, 10000, 10000, 10000, "0x2073a9893a8a2c065bf8d0269c577390639ecefa", "0xbc96cf604092dc53c5021fb122ddb2dffad75821", 0, callData)

/* Prepare RPC call request */
let options = {
    url: "http://127.0.0.1:8545",
    method: "post",
    headers:
        {
            "content-type": "application/json"
        },
    body: JSON.stringify( {"jsonrpc": "2.0", "id": 1, "method": "zond_call", "params": [tx, {"blockNumber": "latest"}] })
};

/* Make RPC call */
request(options, (error, response, body) => {
    if (error) {
        console.error('An error has occurred: ', error);
    } else {
        console.log('Post successful: response: ', body);
    }
});

