import { ethers } from "ethers";
import { generatePrivateKey } from "./Web3Service.js";
import fs from "fs";
import MyStorefrontJSON from "../../artifacts/contracts/Store/CreateStore.sol/MyStorefront.json" assert { type: "json" };

// Provider setup
const provider = new ethers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545"
);

// Wallet setup - replace 'YOUR_PRIVATE_KEY' with your actual private key
const privateKey = generatePrivateKey();
console.log(privateKey);
const wallet = new ethers.Wallet(privateKey, provider);

const { abi, bytecode } = MyStorefrontJSON;

// Contract deployment
async function DeployContractService() {
  console.log(abi);
  const ContractFactory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await ContractFactory.deploy();
  await contract.deployed();
  return { contract: contract.address, abi: abi };
}

export default DeployContractService;
