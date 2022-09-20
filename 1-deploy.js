const BN = require('bn.js');
const ethUtil = require('ethereumjs-util')
const Web3 = require('@theqrl/web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://45.76.43.83:4545'))

require("./qrllib/qrllib-js.js")

/* Load Dilithium Wallet */
// Replace this hexseed with your own Dilithium wallet
const hexSeed = "0x7801414d061d92874f97d2b5614a5c97452b5376c6c1d5729a6b58b8612677a5c683034aa7b175450218b842f4d8de44"
let d = dilithium.NewFromSeed(hexSeed)

// Deploy contract
const deploy = async () => {
    let address = d.GetAddress()

    /* Prepare Contract Input */
    const contractCompiler = require("./contract-compiler");
    let output = contractCompiler.GetCompilerOutput()

    const inputABI = output.contracts['MyToken.sol']['MyToken'].abi
    let contractByteCode = output.contracts['MyToken.sol']['MyToken'].evm.bytecode.object

    let contract = new web3.zond.Contract(inputABI)

    let tx = contract.deploy({data: contractByteCode, arguments: ["TOKEN123", "HELLO"]})

    // This gives you the latest available nonce for the account
    let nonce = await web3.zond.getTransactionCount(address)
    const estimatedGas = await tx.estimateGas({"from": d.GetAddress()})

    const createTransaction = await web3.zond.accounts.signTransaction(
        {
            from: address,
            data: tx.encodeABI(),
            nonce: nonce,
            chainId: '0x1',
            gas: estimatedGas,
            gasPrice: 1000,
            value: 0,
            to: '',
        },
        hexSeed
        );

    createTransaction.rawTransaction.type = '0x2'

    console.log('Attempting to deploy from account:', address);
    web3.zond.sendSignedTransaction(
        createTransaction.rawTransaction
        ).on('receipt', console.log)
        .on('confirmation', function(confirmationNumber, receipt){ 
            console.log("confirmation no: ", confirmationNumber)
        });
        
    console.log("Expected contract address ", ethUtil.generateAddress(Buffer.from(d.GetAddress().slice(2), 'hex'), new BN(nonce).toBuffer()).toString('hex'))
};
deploy();
