require("./qrllib/qrllib-js.js")

const request = require('request');
const Web3EthAbi = require("web3-eth-abi");
const txHelper = require("./helper/tx");
const contractCompiler = require("./contract-compiler")

/* Compile contract using solidity compiler and get output */
let output = contractCompiler.GetCompilerOutput()
const inputABI = output.contracts['MyToken.sol']['MyToken'].abi

/* Load Wallet */
let hexSeed = "062482cca43bfe13e45f925a4226f1c9f4cd143474490552bcb5f1a869693d950133daea7b7fe7526f7abe9b7e873014"
let d = dilithium.NewFromSeed(hexSeed)

/* Prepare contract call input for the contract function transfer */
let callData = Web3EthAbi.encodeFunctionCall(inputABI[12], ["0x2073a9893a8a2c065bf8d0269c577390639ecefa", "10000"])

/* Prepare Contract Deployment Transaction */
let deployedContractAddress = "0xbc96cf604092dc53c5021fb122ddb2dffad75821"
let tx = txHelper.CreateTx(1, 397700, 10000, deployedContractAddress, 0, callData)
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

