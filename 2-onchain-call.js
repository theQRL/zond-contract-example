const Web3 = require('@theqrl/web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://45.76.43.83:4545'))
const contractCompiler = require("./contract-compiler")
require("./qrllib/qrllib-js.js")

/* Load Dilithium Wallet */
// Replace this hexseed with your own Dilithium wallet
const hexSeed = "0x7801414d061d92874f97d2b5614a5c97452b5376c6c1d5729a6b58b8612677a5c683034aa7b175450218b842f4d8de44"
let d = dilithium.NewFromSeed(hexSeed)

// Call Contract
const contract_call = async () => {
    let address = await d.GetAddress()

    // Get solidity compiled contract output
    let output = contractCompiler.GetCompilerOutput()

    const inputABI = output.contracts['MyToken.sol']['MyToken'].abi

    // Deployed contract address
    const deployedContractAddress = "0xf3a0d03Ea099d97168091EA119161a4AA60E1148"

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