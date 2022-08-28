const { ethers, getNamedAccounts } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundme = await ethers.getContract("FundMe", deployer)
    console.log("withdrawing funds ........")
    const transactionresponse = await fundme.withdraw()
    await transactionresponse.wait(1)
    console.log("funds withdrawn....")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
