const config = require("./config.json");

// Check for config requirements
if(config.hexseed == "hexseed_here") {
    console.log("You need a to enter a dilithium hexseed for this to work.");
    process.exit(1);
}
// Check for config requirements
if(config.contract == "contract_here") {
    console.log("You need a to enter your contract address for this to work.");
    process.exit(1);
}

const Web3 = require('@theqrl/web3')
const web3 = new Web3(new Web3.providers.HttpProvider(config.provider))
const contractCompiler = require("./contract-compiler")
require("./qrllib/qrllib-js.js")

/* Load Dilithium Wallet */
// Replace this hexseed with your own Dilithium wallet
const hexSeed = config.hexseed
let d = dilithium.NewFromSeed(hexSeed)

// Call Contract
const contract_call = async () => {
    let address = await d.GetAddress()

    // Get solidity compiled contract output
    let output = contractCompiler.GetCompilerOutput()

    const inputABI = output.contracts['MyToken.sol']['MyToken'].abi

    // Deployed contract address
    const deployedContractAddress = config.contract

    let contract = new web3.zond.Contract(inputABI, deployedContractAddress)
    let nonce = await web3.zond.getTransactionCount(address)

    // Transfer 10000 tokens to 0x2073a9893a8a2c065bf8d0269c577390639ecefa
    let contractSend = contract.methods.transfer("0x2073a9893a8a2c065bf8d0269c577390639ecefa", 10000)
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
            to: deployedContractAddress,
        },
        hexSeed
        );

    createTransaction.rawTransaction.type = '0x2' // Don't change

    console.log("sending transaction and waiting for the receipt")
    await web3.zond.sendSignedTransaction(
        createTransaction.rawTransaction
        ).on('receipt', console.log);
}

contract_call()