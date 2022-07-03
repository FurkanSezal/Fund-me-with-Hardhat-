import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("FundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    connectButton.innerHTML = "Connected";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } else {
    connectButton.innerHTML = "Please install MetaMask";
  }
}

// fund
async function fund() {
  const ethAmounth = document.getElementById("ethAmounth").value;
  console.log(`${ethAmounth} Funding ... `);
  if (typeof window.ethereum !== "undefined") {
    // what we need?
    // we need provider/ connection to the blockchain
    // signer/ wallet/ account
    // contract Address & ABI
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const tx = await contract.fund({
        value: ethers.utils.parseEther(ethAmounth),
      });
      await listenForTransactionMined(tx, provider);
    } catch (error) {
      console.log(error);
    }
  }
}

// get balance
async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      const balance = await provider.getBalance(contractAddress);
      console.log(ethers.utils.formatEther(balance));
    } catch (error) {
      console.log(error);
    }
  } else {
    balanceButton.innerHTML = "Please install MetaMask";
  }
}

async function withdraw() {
  console.log("Withdrawing...");
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const tx = await contract.withdraw();
      await listenForTransactionMined(tx, provider);
    } catch (error) {
      console.log(error);
    }
  }
}
function listenForTransactionMined(tx, provider) {
  console.log(`Mining ${tx.hash}... `);
  return new Promise((resolve, reject) => {
    provider.once(tx.hash, (tx_receipt) => {
      console.log(`Completed with ${tx_receipt.confirmations} confirmations`);
    });
    resolve();
  });
}
