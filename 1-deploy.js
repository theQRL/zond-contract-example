const config = require("./config.json")
const contractCompiler = require("./contract-compiler")
const { Web3 } = require('@theqrl/web3')
const web3 = new Web3(new Web3.providers.HttpProvider(config.provider))

if(config.hexseed == "hexseed_here") {
    console.log("You need a to enter a dilithium hexseed for this to work.")
    process.exit(1)
}

const acc = web3.zond.accounts.seedToAccount(config.hexseed)
web3.zond.wallet?.add(config.hexseed)
web3.zond.transactionConfirmationBlocks = config.tx_required_confirmations

const receiptHandler = function(receipt){
    console.log("Contract address ", receipt.contractAddress)
}

const deployMyTokenContract = async () => {
    console.log('Attempting to deploy MyToken contract from account:', acc.address)
    
    const output = contractCompiler.GetCompilerOutput()

    const contractABI = output.contracts['MyToken.sol']['MyToken'].abi
    const contractByteCode = output.contracts['MyToken.sol']['MyToken'].evm.bytecode.object
    const contract = new web3.zond.Contract(contractABI)
    
    const deployOptions = {data: contractByteCode, arguments: ["TOKEN123", "TOK"]}
    const contractDeploy = contract.deploy(deployOptions)
    const estimatedGas = await contractDeploy.estimateGas({from: acc.address})
    const txObj = {type: '0x2', gas: estimatedGas, from: acc.address, data: contractDeploy.encodeABI()}
    
    await web3.zond.sendTransaction(txObj, undefined, { checkRevertBeforeSending: false })
    .on('confirmation', console.log)
    .on('receipt', receiptHandler)
    .on('error', console.error)
}

deployMyTokenContract()
