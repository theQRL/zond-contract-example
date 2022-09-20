const Web3 = require('@theqrl/web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://45.76.43.83:4545'))

const getCode = async () => {
    // Deployed contract address
    const deployedContractAddress = "0xfddea5fdd39fc4d1fafdf5ab3d8220bd7bde6a86"

    web3.zond.getCode(deployedContractAddress, function(result, error) {
        if(error) {
            console.log(error)
        } else {
            console.log(result)
        }
    });
}

getCode()
