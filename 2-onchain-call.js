const config = require("./config.json");

// Check for config requirements
if(config.hexseed == "hexseed_here") {
    console.log("You need a to enter a dilithium hexseed for this to work.");
    process.exit(1);
}
if(config.contract == "contract_here") {
    console.log("You need a to enter your contract from the previous step for this to work.");
    process.exit(1);
}

var Web3 = require('@theqrl/web3')
var web3 = new Web3(new Web3.providers.HttpProvider(config.provider))
const contractCompiler = require("./contract-compiler")
/* Load Wallet */
require("./qrllib/qrllib-js.js")

let output = contractCompiler.GetCompilerOutput()

const inputABI = output.contracts['MyToken.sol']['MyToken'].abi

/* Load Wallet */
var hexSeed = config.hexseed
let d = dilithium.NewFromSeed(hexSeed)

const contract_call = async () => {
    let address = await d.GetAddress()
    let contract = new web3.zond.Contract(inputABI, config.contract)
    let nonce = await web3.zond.getTransactionCount(address)
    web3.zond.getCode(config.contract, function(error, result) {
        if(!error) {
            console.log(result);
        } else {
            console.log(error)
        }
    });
    
    let tx = contract.methods.mint(2)
    const createTransaction = await web3.zond.accounts.signTransaction(
        {
            from: address,
            data: tx.encodeABI(),
            nonce: nonce,
            chainId: "0x1",
            gas: "0x1e8480",
            gasPrice:"0x2710",
            value:"0x0",
            to: config.contract,
        },
        hexSeed
        );
    createTransaction.rawTransaction.input = createTransaction.rawTransaction.data
    createTransaction.rawTransaction.type = '0x2'
    web3.zond.sendSignedTransaction(
        createTransaction.rawTransaction
        ).on('receipt', console.log);
    console.log('contract call sent!')

}

contract_call()