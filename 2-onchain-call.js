const config = require("./config.json")
const contractCompiler = require("./contract-compiler")
const { Web3 } = require('@theqrl/web3')
const web3 = new Web3(new Web3.providers.HttpProvider(config.provider))

if(config.hexseed == "hexseed_here") {
    console.log("You need a to enter a dilithium hexseed for this to work.")
    process.exit(1)
}

if(config.contract_address == "contract_address_here") {
    console.log("You need a to enter your contract address for this to work.")
    process.exit(1)
}

const acc = web3.zond.accounts.seedToAccount(config.hexseed)
web3.zond.wallet?.add(config.hexseed)
web3.zond.transactionConfirmationBlocks = config.tx_required_confirmations

const receiverAccAddress = "0x2073a9893a8a2c065bf8d0269c577390639ecefa"

const transferMyToken = async () => {
    console.log('Attempting to call the contract transfer method from account:', acc.address)

    let output = contractCompiler.GetCompilerOutput()

    const contractABI = output.contracts['MyToken.sol']['MyToken'].abi
    const contractAddress = config.contract_address
    const contract = new web3.zond.Contract(contractABI, contractAddress)
    
    const contractTransfer = contract.methods.transfer(receiverAccAddress, 10000)
    const estimatedGas = await contractTransfer.estimateGas({"from": acc.address})
    const txObj = {type: '0x2', gas: estimatedGas, from: acc.address, data: contractTransfer.encodeABI(), to: config.contract_address}
    
    await web3.zond.sendTransaction(txObj, undefined, { checkRevertBeforeSending: true })
    .on('confirmation', console.log)
    .on('receipt', console.log)
    .on('error', console.error)
}

transferMyToken()