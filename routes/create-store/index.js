/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Operations related to storefronts
 */

/**
 * @swagger
 * /api/createStorefront:
 *   post:
 *     summary: Create a new storefront
 *     description: Create a new storefront with provided metadata.
 *     tags: [Stores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               metadata:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the storefront.
 *                   description:
 *                     type: string
 *                     description: Description of the storefront.
 *     responses:
 *       200:
 *         description: Storefront created successfully.
 *       400:
 *         description: Bad request. Invalid or missing parameters.
 */
import { ethers } from "ethers";
import { generatePrivateKey } from "../../src/Service/Web3Service.js";
import DeployContractService from "../../src/Service/DeployContractService.js";
const { JsonRpcProvider, Wallet, Contract } = ethers;

const provider = new JsonRpcProvider("https://bsc-dataseed.binance.org/");
const privateKey = generatePrivateKey();
const { contract, abi } = DeployContractService();
const contractAddress = contract; // Address of the deployed smart contract

// const wallet = new Wallet(privateKey, provider);
// const contractusr = new Contract(contractAddress, abi, wallet);

const createStore = async (req, res) => {
  try {
    const { metadata } = req.body;
    if (!metadata || !metadata.name || !metadata.description) {
      return res.status(400).json({ error: "Invalid or missing metadata" });
    }

    const transaction = await contractusr.createStorefront(
      metadata.name,
      metadata.description
    );
    await transaction.wait();

    res.status(200).json({ message: "Storefront created successfully" });
  } catch (error) {
    console.error("Error creating storefront:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default createStore;
