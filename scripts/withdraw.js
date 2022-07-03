const { ethers, getNamedAccounts, network } = require("hardhat");

async function main() {
  const { deployer } = (await getNamedAccounts()).deployer;
  const fundme = await ethers.getContract("FundMe", deployer);

  const ts = await fundme.withdraw();
  await ts.wait(1);
  console.log("Withdraw successful!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
