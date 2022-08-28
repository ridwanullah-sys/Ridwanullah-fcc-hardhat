const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundme
          let deployer
          let MockV3Aggregator
          let sendValue = ethers.utils.parseEther("0.1")

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture("all")
              fundme = await ethers.getContract("FundMe", deployer)
              MockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("constructor", async function () {
              it("sets the aggregator addresses correctly", async function () {
                  const response = await fundme.getPriceFeed()
                  assert.equal(response, MockV3Aggregator.address)
              })
          })

          describe("fundme", async function () {
              it("is amount sent enough", async function () {
                  await expect(fundme.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })

              it("updated to amount funded in eth", async function () {
                  await fundme.fund({ value: sendValue })
                  const response = await fundme.getAmountFundedByAddress(
                      deployer
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })

              it("add funder to founders array", async function () {
                  await fundme.fund({ value: sendValue })
                  const response = await fundme.getFunder(0)
                  assert.equal(response, deployer)
              })
          })

          describe("withdraw", async function () {
              beforeEach(async function () {
                  await fundme.fund({ value: sendValue })
              })

              it("withdraw ETH from a simple founder", async function () {
                  //Arrange
                  const startingFundmeBalance =
                      await fundme.provider.getBalance(fundme.address)
                  const startingDeployerBalance =
                      await fundme.provider.getBalance(deployer)

                  //Act
                  const transactionresponse = await fundme.withdraw()
                  const transactionreciept = await transactionresponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionreciept
                  const gascost = gasUsed.mul(effectiveGasPrice)

                  const endingFundmeBalance = await fundme.provider.getBalance(
                      fundme.address
                  )
                  const endingDeployerBalance =
                      await fundme.provider.getBalance(deployer)

                  //Assert
                  assert.equal(endingFundmeBalance, 0)
                  assert.equal(
                      startingFundmeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gascost).toString()
                  )
              })

              it("Allow us to withdraw on multiple founder", async function () {
                  const accounts = await ethers.getSigners()

                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectContracts = await fundme.connect(
                          accounts[i]
                      )
                      await fundMeConnectContracts.fund({ value: sendValue })
                  }

                  //Arrange
                  const startingFundmeBalance =
                      await fundme.provider.getBalance(fundme.address)
                  const startingDeployerBalance =
                      await fundme.provider.getBalance(deployer)

                  //Act
                  const transactionresponse = await fundme.withdraw()
                  const transactionreciept = await transactionresponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionreciept
                  const gascost = gasUsed.mul(effectiveGasPrice)

                  const endingFundmeBalance = await fundme.provider.getBalance(
                      fundme.address
                  )
                  const endingDeployerBalance =
                      await fundme.provider.getBalance(deployer)

                  //Assert
                  assert.equal(endingFundmeBalance, 0)
                  assert.equal(
                      startingFundmeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gascost).toString()
                  )

                  //make sure that the funders are reset to 0
                  await expect(fundme.getFunder(0)).to.be.reverted

                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await fundme.getAmountFundedByAddress(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })

              it("allow only owner to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const fundMeConnectedContract = await fundme.connect(
                      accounts[1]
                  )
                  await expect(
                      fundMeConnectedContract.withdraw()
                  ).to.be.revertedWithCustomError(fundme, "Fundme__NotOwner")
              })
          })

          describe("cheaper withdraw .....", async function () {
              beforeEach(async function () {
                  await fundme.fund({ value: sendValue })
              })

              it("withdraw ETH from a simple founder", async function () {
                  //Arrange
                  const startingFundmeBalance =
                      await fundme.provider.getBalance(fundme.address)
                  const startingDeployerBalance =
                      await fundme.provider.getBalance(deployer)

                  //Act
                  const transactionresponse = await fundme.Cheaperwithdraw()
                  const transactionreciept = await transactionresponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionreciept
                  const gascost = gasUsed.mul(effectiveGasPrice)

                  const endingFundmeBalance = await fundme.provider.getBalance(
                      fundme.address
                  )
                  const endingDeployerBalance =
                      await fundme.provider.getBalance(deployer)

                  //Assert
                  assert.equal(endingFundmeBalance, 0)
                  assert.equal(
                      startingFundmeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gascost).toString()
                  )
              })

              it("Allow us to withdraw on multiple founder", async function () {
                  const accounts = await ethers.getSigners()

                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectContracts = await fundme.connect(
                          accounts[i]
                      )
                      await fundMeConnectContracts.fund({ value: sendValue })
                  }

                  //Arrange
                  const startingFundmeBalance =
                      await fundme.provider.getBalance(fundme.address)
                  const startingDeployerBalance =
                      await fundme.provider.getBalance(deployer)

                  //Act
                  const transactionresponse = await fundme.Cheaperwithdraw()
                  const transactionreciept = await transactionresponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionreciept
                  const gascost = gasUsed.mul(effectiveGasPrice)

                  const endingFundmeBalance = await fundme.provider.getBalance(
                      fundme.address
                  )
                  const endingDeployerBalance =
                      await fundme.provider.getBalance(deployer)

                  //Assert
                  assert.equal(endingFundmeBalance, 0)
                  assert.equal(
                      startingFundmeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gascost).toString()
                  )

                  //make sure that the getFunder are reset to 0
                  await expect(fundme.getFunder(0)).to.be.reverted

                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await fundme.getAmountFundedByAddress(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
          })
      })
