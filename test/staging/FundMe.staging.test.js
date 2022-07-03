const { ethers, getNamedAccounts, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert } = require("chai");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", () => {
      let fundme;
      let deployer;
      const sendValue = ethers.utils.parseEther("0.1");
      beforeEach(async function () {
        // deploy first
        deployer = (await getNamedAccounts()).deployer;
        fundme = await ethers.getContract("FundMe", deployer);
      });
      it("allow people to fund and withdraw", async () => {
        const tx = await fundme.fund({ value: sendValue });
        await tx.wait();

        const ts = await fundme.withdraw();
        await ts.wait();

        const endingBalance = await fundme.provider.getBalance(fundme.address);
        console.log(endingBalance.toString() + " should equal 0");
        assert.equal(endingBalance.toString(), "0");
      });
    });
