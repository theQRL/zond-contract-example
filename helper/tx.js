const crypto = require("crypto");

let NumToHex = function(n) {
    return '0x' + Number(n).toString(16)
}

let HexToBigInt = function(hexN) {
    return BigInt(parseInt(hexN.slice(2), 16))
}

let CreateTx = function(nonce, gas, gasPrice, to, value, input) {
    return {
        "type": NumToHex(2),
        "chainId": NumToHex(1),
        "nonce": NumToHex(nonce),
        "gas": NumToHex(gas),
        "gasPrice": NumToHex(gasPrice),
        "to": to,
        "value": NumToHex(value),
        "input": input,
    }
}

let CreateCall = function(nonce, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, from, to, value, input) {
    return {
        "from": from,
        "chainId": NumToHex(1),
        "nonce": NumToHex(nonce),
        "gas": NumToHex(gas),
        "gasPrice": NumToHex(gasPrice),
        // "maxFeePerGas": NumToHex(maxFeePerGas),
        // "maxPriorityFeePerGas": NumToHex(maxPriorityFeePerGas),
        "to": to,
        "value": NumToHex(value),
        "input": input,
    }
}

let GenerateTxSigningHash = function(tx) {

    let chainId = HexToBigInt(tx.chainId)
    let nonce = HexToBigInt(tx.nonce)
    let gas = HexToBigInt(tx.gas)
    let gasPrice = HexToBigInt(tx.gasPrice)
    let to = tx.to
    let value = HexToBigInt(tx.value)
    let input = tx.input
    let bytesTo = to.slice(2);
    let bytesInput = input.slice(2);
    let expectedBufferSize = 8 * 5;
    if (to !== '') {
        expectedBufferSize += 20
    }
    if (input !== '') {
        expectedBufferSize += input.slice(2).length / 2
    }

    let buf = Buffer.alloc(expectedBufferSize)
    let offset = 0
    buf.writeBigInt64BE(chainId, offset)
    offset += 8
    buf.writeBigInt64BE(nonce, offset)
    offset += 8
    buf.writeBigInt64BE(gas, offset)
    offset += 8
    buf.writeBigInt64BE(gasPrice, offset)
    offset += 8

    buf.write(to.slice(2), offset, 'hex')
    offset += bytesTo.length / 2
    buf.writeBigInt64BE(value, offset)
    offset += 8
    buf.write(bytesInput, offset, 'hex')

    return '0x' + crypto.createHash('sha256').update(buf).digest('hex')
}

let SignTx = function(tx, signer) {
    let signingHash = GenerateTxSigningHash(tx).slice(2)
    tx.signature = signer.Sign(Buffer.from(signingHash, 'hex'))
    tx.pk = signer.pk
}

module.exports = {
    NumToHex,
    HexToBigInt,
    CreateTx,
    CreateCall,
    GenerateTxSigningHash,
    SignTx,
}