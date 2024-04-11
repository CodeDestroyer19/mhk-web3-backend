import { ethers } from "ethers";
import { generatePrivateKey } from "./Web3Service.js";
import MyStorefrontJSON from "../../artifacts/contracts/Store/CreateStore.sol/MyStorefront.json" assert { type: "json" };

// Provider setup
const provider = new ethers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545"
);

// Wallet setup - replace 'YOUR_PRIVATE_KEY' with your actual private key
const privateKey =
  "0x302f5a588de387f5d6a9280da6cbeb42de41705eaafbe7bb837f83b5b5f1d692";

const wallet = new ethers.Wallet(privateKey, provider);

const { abi, bytecode } = MyStorefrontJSON;

// Contract deployment
async function DeployContractService() {
  const ContractFactory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await ContractFactory.deploy();
  await contract.waitForDeployment();
  return { contract: contract.address, abi: abi };
}

export default DeployContractService;
