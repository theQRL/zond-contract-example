const config = require("./config.json")
const contractCompiler = require("./contract-compiler")
const { Web3 } = require('@theqrl/web3')
const web3 = new Web3(new Web3.providers.HttpProvider(config.provider))

if(config.contract_address == "contract_address_here") {
    console.log("You need a to enter your contract address for this to work.")
    process.exit(1)
}

const accAddress = "0x2073a9893a8a2c065bf8d0269c577390639ecefa"

const checkMyTokenBalance = async () => {
    console.log('Attempting to check MyToken balance for account:', accAddress)

    const output = contractCompiler.GetCompilerOutput()
    const contractABI = output.contracts['MyToken.sol']['MyToken'].abi
    const contract = new web3.zond.Contract(contractABI, config.contract_address)
    contract.methods.balanceOf(accAddress).call().then((result, error)=>{
        if(error) {
            console.log(error)
        } else {
            console.log("Balance: " + result)
        }
    })
}

checkMyTokenBalance()