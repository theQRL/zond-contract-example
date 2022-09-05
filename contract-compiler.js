const fs = require("fs");
const solc = require("solc");

/* The main contract should be mentioned here */
var input = {
    language: 'Solidity',
    sources: {
        'MyToken.sol': {
            content: fs.readFileSync("./contracts/MyToken.sol").toString(),
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

/* All imports of solidity contract should be mentioned here (if any) otherwise should be left blank */
function findImports(path) {
    if (path === 'ERC20.sol')
        return {
            contents:
                fs.readFileSync("./contracts/ERC20.sol").toString()
        };
    else if (path === 'IERC20.sol')
        return {
            contents:
                fs.readFileSync("./contracts/IERC20.sol").toString()
        };
    else return { error: 'File not found' };
}

function GetCompilerOutput() {
    return JSON.parse(solc.compile(JSON.stringify(input), {import: findImports}))
}

module.exports = {
    GetCompilerOutput,
}
