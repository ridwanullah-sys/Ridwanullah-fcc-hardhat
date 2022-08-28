const { assert } = require("chai")
const { network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundme
          let deployer
          let sendValue = ethers.utils.parseEther("0.1")

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              fundme = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async function () {
              await fundme.fund({ value: sendValue })
              await fundme.withdraw()
              const endingFundmeBalance = await fundme.provider.getBalance()
              assert.equal(endingFundmeBalance.toString(), "0")
          })
      })
