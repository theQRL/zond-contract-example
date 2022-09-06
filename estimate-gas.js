require("./qrllib/qrllib-js.js")

const request = require('request');
const Web3EthAbi = require("web3-eth-abi");
const txHelper = require("./helper/tx");
const contractCompiler = require("./contract-compiler")

/* Compile contract using solidity compiler and get output */
let output = contractCompiler.GetCompilerOutput()
const inputABI = output.contracts['MyToken.sol']['MyToken'].abi

/* Prepare Contract Deployment Transaction */
let contractByteCode = output.contracts['MyToken.sol']['MyToken'].evm.bytecode.object
let callData = Web3EthAbi.encodeFunctionCall(inputABI[0], ["TOKEN123", "HELLO"])
contractByteCode = '0x' + contractByteCode + callData.slice(10) // Ignore 0x and 8 byte of hex string of constructor signature

/* Prepare Contract Deployment Transaction */
let tx = txHelper.CreateCall(1, 0, 100, 10000, 10000, "0x20748ad4e06597dbca756e2731cd26094c05273a", undefined, 0, contractByteCode)

/* Prepare RPC call request */
let options = {
    url: "http://127.0.0.1:4545",  // Zond RPC API address and port
    method: "post",
    headers:
        {
            "content-type": "application/json"
        },
    body: JSON.stringify( {"jsonrpc": "2.0", "id": 1, "method": "zond_estimateGas", "params": [tx, {"blockNumber": "latest"}] })
};

/* Make RPC call */
request(options, (error, response, body) => {
    if (error) {
        console.error('An error has occurred: ', error);
    } else {
        console.log('Post successful: response: ', body);
    }
});