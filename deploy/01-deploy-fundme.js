const { network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainid = network.config.chainId
    console.log(`this is the deployer: ${deployer}`)
    let ethUSDPriceFeed
    if (developmentChains.includes(network.name)) {
        const ethUSDAggregator = await deployments.get("MockV3Aggregator")
        ethUSDPriceFeed = ethUSDAggregator.address
    } else {
        ethUSDPriceFeed = networkConfig[chainid]["ethUSDPriceFeed"]
    }
    const args = [ethUSDPriceFeed]
    const fundme = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundme.address, args)
    }
    log("--------------------------------------------")

    // for (let i = 0; i < 10; i++) {
    //     log(
    //         `location${i}: ${await ethers.provider.getStorageAt(
    //             fundme.address,
    //             i
    //         )}`
    //     )
    // }
}
module.exports.tags = ["all", "fundme"]
