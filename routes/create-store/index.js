/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Operations related to storefronts
 */

import { ethers } from "ethers";
import { generatePrivateKey } from "../../src/Service/Web3Service.js";
import DeployContractService from "../../src/Service/DeployContractService.js";
const { JsonRpcProvider, Wallet, Contract } = ethers;
import MyStorefrontJSON from "../../artifacts/contracts/Store/CreateStore.sol/MyStorefront.json" assert { type: "json" };
import Bugsnag from "@bugsnag/js";

/**
 * @swagger
 * /api/createStorefront:
 *   post:
 *     summary: Create a new storefront
 *     description: Create a new storefront with provided metadata for a user.
 *     tags: [Stores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userAddress:
 *                 type: string
 *                 description: Address of the user creating the storefront.
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
export const createStore = async (req, res) => {
  const privateKey =
    "0x302f5a588de387f5d6a9280da6cbeb42de41705eaafbe7bb837f83b5b5f1d692";
  const { abi } = MyStorefrontJSON;
  const contractAddress = "0xC88E0094e5212f7f4e06eFF772c2C181A23Ea641"; // Address of the deployed smart contract
  const provider = new ethers.JsonRpcProvider(
    "https://data-seed-prebsc-1-s1.bnbchain.org:8545/"
  );
  const wallet = new Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    const { metadata, userAddress } = req.body;
    if (!metadata || !metadata.name || !metadata.description) {
      return res.status(400).json({ error: "Invalid or missing metadata" });
    }

    console.log("We start here");
    const creatorAddress = userAddress; // Address used for validation
    console.log(creatorAddress + "8");
    const hasStore = await contract.hasStore(creatorAddress);
    console.log("Here we are");

    if (hasStore) {
      return res.status(400).json({ error: "Store already created" });
    }
    // Estimate gas limit
    const gasLimit = await provider.estimateGas({
      to: contractAddress,
      data: contract.interface.encodeFunctionData("createStorefront", [
        JSON.stringify(metadata),
      ]),
    });

    // Get fee data
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice;

    // Adjust gas limit and gas price (optional)
    const adjustedGasLimit = Number(gasLimit) * 2; // Adjust gas limit if necessary
    const adjustedGasPrice = Number(gasPrice) * 1; // Adjust gas price if necessary

    // Create transaction object
    const transaction = {
      to: contractAddress,
      data: contract.interface.encodeFunctionData("createStorefront", [
        JSON.stringify(metadata),
      ]),
      gasLimit: adjustedGasLimit.toString(),
      gasPrice: adjustedGasPrice.toString(),
      chainId: 97, // Assuming BSC Testnet, adjust for your network
    };

    // Sign and send transaction
    const sentTransaction = await wallet.sendTransaction(transaction);

    // Wait for transaction to be mined
    const mined = await provider.waitForTransaction(sentTransaction.hash);
    console.log(mined);

    res.status(200).json({ message: "Storefront created successfully" });
  } catch (error) {
    console.error("Error creating storefront:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/getStorefront/{storefrontId}:
 *   get:
 *     summary: Get a storefront by ID
 *     description: Retrieve a specific storefront based on its ID.
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: storefrontId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Storefront data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               # Update this with your actual storefront data structure
 *               properties:
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Storefront not found.
 *       500:
 *         description: Internal server error.
 */
export const getStorefront = async (req, res) => {
  const { storefrontId } = req.params; // Assuming storefront ID is retrieved from request params

  // ... Retrieve private key securely (avoid hardcoding) ...

  const provider = new ethers.JsonRpcProvider(
    "https://data-seed-prebsc-1-s1.bnbchain.org:8545/"
  );
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    const storefrontData = await contract.getStorefront(storefrontId);
    const parsedData = JSON.parse(storefrontData); // Assuming data is stored as a string

    res.status(200).json({ data: parsedData });
  } catch (error) {
    console.error("Error getting storefront:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/updateStorefront/{storefrontId}:
 *   put:
 *     summary: Update a storefront
 *     description: Update an existing storefront with provided changes.
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: storefrontId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             # Update this with your actual update data structure
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Storefront updated successfully.
 *       400:
 *         description: Bad request. Invalid or missing parameters.
 *       404:
 *         description: Storefront not found.
 *       500:
 *         description: Internal server error.
 */
export const updateStorefront = async (req, res) => {
  const { storefrontId } = req.params;
  const { updates } = req.body; // Assuming updates object contains changes to storefront metadata

  // ... Retrieve private key securely ...

  const provider = new ethers.JsonRpcProvider(
    "https://data-seed-prebsc-1-s1.bnbchain.org:8545/"
  );
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    const tx = await contract.updateStorefront(
      storefrontId,
      JSON.stringify(updates)
    );
    await provider.waitForTransaction(tx.hash);

    res.status(200).json({ message: "Storefront updated successfully" });
  } catch (error) {
    console.error("Error updating storefront:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/deleteStorefront/{storefrontId}:
 *   delete:
 *     summary: Delete a storefront
 *     description: Delete a storefront by its ID.
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: storefrontId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Storefront deleted successfully.
 *       404:
 *         description: Storefront not found.
 *       500:
 *         description: Internal server error.
 */

export const deleteStorefront = async (req, res) => {
  const { storefrontId } = req.params;

  // ... Retrieve private key securely ...

  const provider = new ethers.JsonRpcProvider(
    "https://data-seed-prebsc-1-s1.bnbchain.org:8545/"
  );
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    const tx = await contract.deleteStorefront(storefrontId);
    await provider.waitForTransaction(tx.hash);

    res.status(200).json({ message: "Storefront deleted successfully" });
  } catch (error) {
    console.error("Error deleting storefront:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
