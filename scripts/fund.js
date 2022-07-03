const { ethers, getNamedAccounts, network } = require("hardhat");

async function main() {
  const sendValue = ethers.utils.parseEther("0.1");
  const { deployer } = (await getNamedAccounts()).deployer;
  const fundme = await ethers.getContract("FundMe", deployer);

  const tx = await fundme.fund({ value: sendValue });
  await tx.wait(1);
  console.log("Fund sucecessful!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
