import { ethers } from "ethers";
import MyStorefrontJSON from "../../artifacts/contracts/Store/CreateStore.sol/MyStorefront.json" assert { type: "json" };

// Provider setup
const provider = new ethers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545"
);

const privateKey =
  "0x302f5a588de387f5d6a9280da6cbeb42de41705eaafbe7bb837f83b5b5f1d692";

const wallet = new ethers.Wallet(privateKey, provider);

const { abi, bytecode } = MyStorefrontJSON;

// Contract deployment
async function DeployContractService(userAddress) {
  const ContractFactory = new ethers.ContractFactory(abi, bytecode, wallet);
  // Transaction overrides for deployment
  const overrides = {
    gasLimit: 3000000n, // Convert gas limit to hexadecimal
    gasPrice: ethers.parseUnits("20", "gwei"), // Use utils from ethers
  };

  const contract = await ContractFactory.deploy(
    "0xC88E0094e5212f7f4e06eFF772c2C181A23Ea641"
  );
  await contract.deployed();
  return contract.address;
}

export default DeployContractService;
