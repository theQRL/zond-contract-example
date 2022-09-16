const BN = require('bn.js');
const ethUtil = require('ethereumjs-util')
var Web3 = require('@theqrl/web3')
var web3 = new Web3(new Web3.providers.HttpProvider('http://45.76.43.83:4545'))

require("./qrllib/qrllib-js.js")
const contractCompiler = require("./contract-compiler");

let output = contractCompiler.GetCompilerOutput()

const inputABI = output.contracts['MyToken.sol']['MyToken'].abi

/* Load Wallet */
var hexSeed = "0x7801414d061d92874f97d2b5614a5c97452b5376c6c1d5729a6b58b8612677a5c683034aa7b175450218b842f4d8de44" //this one is of public node
let d = dilithium.NewFromSeed(hexSeed)
/* Prepare Contract Input */
let contractByteCode = output.contracts['MyToken.sol']['MyToken'].evm.bytecode.object

/* Prepare Contract Deployment Transaction */
let nonce = 202

// Deploy contract
const deploy = async () => {
    console.log('Attempting to deploy from account:', d.GetAddress());
    let address = d.GetAddress()
    let contract = new web3.zond.Contract(inputABI)
    let tx = contract.deploy({data: contractByteCode, arguments: ["TOKEN123", "HELLO"]})
    const createTransaction = await web3.zond.accounts.signTransaction(
        {
            from: address,
            data: tx.encodeABI(),
            nonce: nonce,
            chainId: "0x1",
            gas: "0x1e8480",
            gasPrice:"0x2710",
            value:"0x0",
            to: '',
        },
        hexSeed
        );

    createTransaction.rawTransaction.type = '0x2'
    web3.zond.sendSignedTransaction(
        createTransaction.rawTransaction
        ).on('receipt', console.log)
        .on('confirmation', function(confirmationNumber, receipt){ 
            console.log("confirmation no: ", confirmationNumber)
        });
        
    console.log("Expected contract address ", ethUtil.generateAddress(Buffer.from(d.GetAddress().slice(2), 'hex'), new BN(nonce).toBuffer()).toString('hex'))
};
deploy();
