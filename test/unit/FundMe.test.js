const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", () => {
      let fundme;
      let deployer;
      let mockV3Aggregator;
      const sendValue = ethers.utils.parseEther("1");
      beforeEach(async function () {
        // deploy first
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]); // deploy all deploy folder with "all" tag
        fundme = await ethers.getContract("FundMe", deployer); // connect last deployed contract
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });

      describe("constructor", function () {
        it("sets the aggregator addresses correctly", async () => {
          const response = await fundme.priceFeed();

          assert.equal(response, mockV3Aggregator.address);
        });
      });
      describe("Check the owner", async () => {
        it("sets the owner right", async () => {
          const owner = await fundme.i_owner();

          assert.equal(owner, deployer);
        });
      });

      describe("fund", async () => {
        it("Fails if you dont send enough eth!", async () => {
          await expect(fundme.fund()).to.be.reverted;
        });
        it("uptated the amount funded data structure", async () => {
          await fundme.fund({ value: sendValue });
          const response = await fundme.addressToAmountFunded(deployer);
          assert.equal(response.toString(), sendValue.toString());
        });
        it("Adds funder to array of funders", async () => {
          await fundme.fund({ value: sendValue });
          const funder = await fundme.funders(0);
          assert.equal(funder, deployer);
        });
      });
      describe("withdraw", async () => {
        beforeEach(async function () {
          await fundme.fund({ value: sendValue });
        });
        it("withdraw eth from a single funder", async () => {
          const startingFundmeBalance = await fundme.provider.getBalance(
            fundme.address
          );
          const startingDeployerBalance = await fundme.provider.getBalance(
            deployer
          );
          const tx_res = await fundme.withdraw();
          const tx_receipt = await tx_res.wait(1);
          const { gasUsed, effectiveGasPrice } = tx_receipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          const endingFundmeBalance = await fundme.provider.getBalance(
            fundme.address
          );
          const endingDeployerBalance = await fundme.provider.getBalance(
            deployer
          );
          assert.equal(endingFundmeBalance, 0);
          assert.equal(
            startingFundmeBalance.add(startingDeployerBalance),
            endingDeployerBalance.add(gasCost).toString()
          );
        });
        it("allows us to withdraw multiple funders", async () => {
          // Arrange
          const accounts = await ethers.getSigners();
          for (let i = 1; i < 6; i++) {
            const fundmeConnectedContract = await fundme.connect(accounts[i]);
            await fundmeConnectedContract.fund({ value: sendValue });
          }

          const startingFundmeBalance = await fundme.provider.getBalance(
            fundme.address
          );
          const startingDeployerBalance = await fundme.provider.getBalance(
            deployer
          );
          // Act

          const tx_res = await fundme.withdraw();
          const tx_receipt = await tx_res.wait(1);
          const { gasUsed, effectiveGasPrice } = tx_receipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);

          // Assert
          const endingFundmeBalance = await fundme.provider.getBalance(
            fundme.address
          );
          const endingDeployerBalance = await fundme.provider.getBalance(
            deployer
          );
          assert.equal(endingFundmeBalance, 0);
          assert.equal(
            startingFundmeBalance.add(startingDeployerBalance),
            endingDeployerBalance.add(gasCost).toString()
          );
          // make sure that funders array reset properly
          await expect(fundme.funders(0)).to.be.reverted;
          for (i = 1; i < 6; i++) {
            assert.equal(
              await fundme.addressToAmountFunded(accounts[i].address),
              0
            );
          }
        });
        it("OnlyOwner withdraw", async () => {
          const accounts = await ethers.getSigners();
          const attackerConnectedContract = await fundme.connect(accounts[1]);
          await expect(attackerConnectedContract.withdraw()).to.be.reverted;
        });
      });
    });
