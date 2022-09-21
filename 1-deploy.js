const config = require("./config.json");

// Check for config requirements
if(config.hexseed == "hexseed_here") {
    console.log("You need a to enter a dilithium hexseed for this to work.");
    process.exit(1);
}

const BN = require('bn.js');
const ethUtil = require('ethereumjs-util')
const Web3 = require('@theqrl/web3')
const web3 = new Web3(new Web3.providers.HttpProvider(config.provider))
const contractCompiler = require("./contract-compiler");
require("./qrllib/qrllib-js.js")

/* Load Dilithium Wallet */
// Replace this hexseed with your own Dilithium wallet
const hexSeed = config.hexseed
let d = dilithium.NewFromSeed(hexSeed)

// Deploy contract
const deploy = async () => {
    let address = d.GetAddress()

    // Get solidity compiled contract output
    let output = contractCompiler.GetCompilerOutput()

    const inputABI = output.contracts['MyToken.sol']['MyToken'].abi
    let contractByteCode = output.contracts['MyToken.sol']['MyToken'].evm.bytecode.object

    let contract = new web3.zond.Contract(inputABI)

    let contractSend = contract.deploy({data: contractByteCode, arguments: ["TOKEN123", "TOK"]})

    // This gives you the latest available nonce for the account
    let nonce = await web3.zond.getTransactionCount(address)
    const estimatedGas = await contractSend.estimateGas({"from": d.GetAddress()})

    const createTransaction = await web3.zond.accounts.signTransaction(
        {
            from: address,
            data: contractSend.encodeABI(),
            nonce: nonce,
            chainId: '0x1',
            gas: estimatedGas,
            gasPrice: 1000,
            value: 0,
            to: '',
        },
        hexSeed
        );

    createTransaction.rawTransaction.type = '0x2' // Don't change

    console.log('Attempting to deploy from account:', address);
    await web3.zond.sendSignedTransaction(
        createTransaction.rawTransaction
        ).on('receipt', console.log)
        .on('confirmation', function(confirmationNumber, receipt){
            console.log("confirmation no: ", confirmationNumber)
        });

    const deployedContractAddress = Web3.utils.bytesToHex(ethUtil.generateAddress(Buffer.from(d.GetAddress().slice(2), 'hex'), new BN(nonce).toBuffer()))
    console.log("Expected contract address ", Web3.utils.toChecksumAddress(deployedContractAddress))
};
deploy();
