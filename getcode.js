const Web3 = require('@theqrl/web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:4545'))

const contractAddress = "0xfddea5fdd39fc4d1fafdf5ab3d8220bd7bde6a86"

const getCode = async () => {
    web3.zond.getCode(contractAddress, function(result, error) {
        if(error) {
            console.log(error)
        } else {
            console.log(result)
        }
    });
}

getCode()
