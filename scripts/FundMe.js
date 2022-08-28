const { ethers, getNamedAccounts } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundme = await ethers.getContract("FundMe", deployer)
    console.log("Funding contracts ........")
    const transactionresponse = await fundme.fund({
        value: ethers.utils.parseEther("0.1"),
    })
    await transactionresponse.wait(1)
    console.log("Funded contract....")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
