var Web3 = require('@theqrl/web3')
var web3 = new Web3(new Web3.providers.HttpProvider('http://45.76.43.83:4545'))
const contractCompiler = require("./contract-compiler")
/* Load Wallet */
require("./qrllib/qrllib-js.js")

let output = contractCompiler.GetCompilerOutput()

const inputABI = output.contracts['MyToken.sol']['MyToken'].abi

/* Load Wallet */
var hexSeed = "0x7801414d061d92874f97d2b5614a5c97452b5376c6c1d5729a6b58b8612677a5c683034aa7b175450218b842f4d8de44" //this one is of public node
let d = dilithium.NewFromSeed(hexSeed)

const contract_call = async () => {
    let address = await d.GetAddress()
    let contract = new web3.zond.Contract(inputABI, "0xf3a0d03Ea099d97168091EA119161a4AA60E1148")
    let nonce = await web3.zond.getTransactionCount(address)
    web3.zond.getCode("0xf3a0d03Ea099d97168091EA119161a4AA60E1148", function(error, result) {
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
            to: '0xf3a0d03Ea099d97168091EA119161a4AA60E1148',
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