const config = require("./config.json");

// Check for config requirements
if(config.contract == "contract_here") {
    console.log("You need a to enter your contract from the previous step for this to work.");
    process.exit(1);
}

/* Load Wallet */
require("./qrllib/qrllib-js.js")
var Web3 = require('@theqrl/web3')
var web3 = new Web3(new Web3.providers.HttpProvider(config.provider))
const contractCompiler = require("./contract-compiler")

let output = contractCompiler.GetCompilerOutput()

const inputABI = output.contracts['MyToken.sol']['MyToken'].abi

/* Load Wallet */

const contract_call = async () => {
    let contract = new web3.zond.Contract(inputABI, config.contract)
    web3.zond.getCode(config.contract, function(error, result) {
        if(!error) {
            console.log(result);
        } else {
            console.log(error)
        }
    });
    contract.methods.mint(2).call().then((error, result)=>{
        if(!error) {
            console.log(result);
        } else {
            console.log(error)
        }
    })

}

contract_call()

