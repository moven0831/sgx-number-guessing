const { hexlify } = require("ethers")
const fs = require('fs')

function main() {
    let option = process.argv[2]
    if (option === "--binfile" || option === "-b") {
        let path = process.argv[3]
        if (!path) {
            console.error('Please provide a path to a file')
            return
        }
        const data = fs.readFileSync(path)
        const hexData = hexlify(data)
        console.log(hexData)
    } else if (option === "--array" || option === "-a") {
        let array = process.argv[3]; // needs to be a string consists of numbers separated by commas
        if (!array) {
            console.error('Please provide valid Uint8Array')
            return
        }
        const uint8Array = new Uint8Array(array.split(',').map(Number))
        const hexData = hexlify(uint8Array)
        console.log(hexData)
    } else {
        console.error('Invalid option')
    }
}

main()