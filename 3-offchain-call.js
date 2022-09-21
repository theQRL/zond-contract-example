const config = require("./config.json");

// Check for config requirements
if(config.contract == "contract_here") {
    console.log("You need a to enter your contract address for this to work.");
    process.exit(1);
}

const Web3 = require('@theqrl/web3')
const web3 = new Web3(new Web3.providers.HttpProvider(config.provider))
const contractCompiler = require("./contract-compiler")

const contract_call = async () => {
    // Deployed contract address
    const deployedContractAddress = config.contract

    let output = contractCompiler.GetCompilerOutput()
    const inputABI = output.contracts['MyToken.sol']['MyToken'].abi

    let contract = new web3.zond.Contract(inputABI, deployedContractAddress)

    contract.methods.balanceOf("0x2073a9893a8a2c065bf8d0269c577390639ecefa").call().then((result, error)=>{
        if(error) {
            console.log(error)
        } else {
            console.log("Balance : " + result)
        }
    })
}

contract_call()