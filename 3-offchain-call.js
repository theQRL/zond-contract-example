/* Load Wallet */
require("./qrllib/qrllib-js.js")
var Web3 = require('@theqrl/web3')
var web3 = new Web3(new Web3.providers.HttpProvider('http://45.76.43.83:4545'))
const contractCompiler = require("./contract-compiler")

let output = contractCompiler.GetCompilerOutput()

const inputABI = output.contracts['MyToken.sol']['MyToken'].abi

const contract_call = async () => {
    // Deployed contract address
    const deployedContractAddress = "0xfddea5fdd39fc4d1fafdf5ab3d8220bd7bde6a86"

    let contract = new web3.zond.Contract(inputABI, deployedContractAddress)

    contract.methods.balanceOf("0x2073a9893a8a2c065bf8d0269c577390639ecefa").call().then((error, result)=>{
        if(!error) {
            console.log(result);
        } else {
            console.log(error)
        }
    })
}

contract_call()
