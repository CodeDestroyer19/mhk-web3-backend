/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Operations related to storefronts
 */

import { ethers } from "ethers";
import Bugsnag from "@bugsnag/js";
import MyStorefrontJSON from "../../artifacts/contracts/Store/CreateStore.sol/MyStorefront.json" assert { type: "json" };

const contractAddress = "0x7898acc91e901e81a50a3bd17a8e67acf4aa7554";
const { abi } = MyStorefrontJSON;
const provider = new ethers.providers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.bnbchain.org:8545/"
);

/**
 * @swagger
 * /api/createStorefront/{userAddress}:
 *   post:
 *     summary: Create a new storefront
 *     description: Create a new storefront with provided metadata for a user.
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: userAddress
 *         required: true
 *         schema:
 *           type: string
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
export const createStore = async (req, res) => {
  const { metadata } = req.body;
  const { userAddress } = req.params;
  const privateKey =
    "0x6aba2664ef3d34b005229cc5db8ba5fac0955fb10a3ebc050cb5324edffaec1b";
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    if (userAddress.toLowerCase() !== wallet.address.toLowerCase()) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    if (!metadata || !metadata.name || !metadata.description) {
      return res.status(400).json({ error: "Invalid or missing metadata" });
    }

    const creatorAddress = userAddress; // Address used for validation
    const hasStore = await contract.hasStore(creatorAddress);
    console.log("Here we are");

    if (hasStore) {
      return res.status(400).json({ error: "Store already created" });
    }

    const gasLimit = ethers.BigNumber.from("200000"); // Adjust gas limit as needed
    const gasPrice = ethers.utils.parseUnits("5", "gwei"); // Adjust gas price as needed

    const nonce = await provider.getTransactionCount(wallet.address, "latest");

    const transactionParameters = {
      nonce: nonce,
      to: contractAddress,
      data: contract.interface.encodeFunctionData("createStorefront", [
        JSON.stringify(metadata),
      ]),
      gasLimit: gasLimit.toHexString(), // Convert gas limit to hex string
      gasPrice: gasPrice.toHexString(), // Convert gas price to hex string
      chainId: 97,
    };

    const signed = await wallet.signTransaction(transactionParameters);
    const tx = await provider.sendTransaction(signed);

    let receipt = null;

    while (receipt === null) {
      try {
        receipt = await provider.getTransactionReceipt(tx.hash);

        if (receipt === null) {
          console.log(`Trying again to fetch txn receipt....`);

          continue;
        }

        const mined = await tx.wait(receipt.confirmations);
        console.log(`Receipt confirmations:`, mined);

        console.info(
          `Transaction receipt : https://www.bscscan.com/tx/${receipt.logs[1].transactionHash}`
        );
      } catch (e) {
        console.log(`Receipt error:`, e);
        break;
      }
    }

    res.status(200).json({ message: "Storefront created successfully" });
  } catch (error) {
    console.error("Error creating storefront:", error);
    Bugsnag.notify(error);
    let errorMessage = "Internal server error";
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};

/**
 * @swagger
 * /api/getStorefront/{userAddress}:
 *   get:
 *     summary: Get a storefront by ID
 *     description: Retrieve a specific storefront based on its ID.
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: userAddress
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
  const { userAddress } = req.params;
  const privateKey =
    "0x6aba2664ef3d34b005229cc5db8ba5fac0955fb10a3ebc050cb5324edffaec1b";
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    if (userAddress.toLowerCase() !== wallet.address.toLowerCase()) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    const storefrontData = await contract.getStorefront(userAddress);
    const parsedData = JSON.parse(storefrontData); // Assuming data is stored as a string

    res.status(200).json({ data: parsedData });
  } catch (error) {
    console.error("Error getting storefront:", error);
    Bugsnag.notify(error);
    res.status(500).json({
      error: "Internal server error: " + error.message.toString(),
    });
  }
};

/**
 * @swagger
 * /api/updateStorefront/{userAddress}:
 *   put:
 *     summary: Update a storefront
 *     description: Update an existing storefront with provided changes.
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: userAddress
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Storefront updated successfully.
 *       400:
 *         description: Bad request. Invalid or missing parameters.
 *       404:
 *         description: Storefront not found.
 *       500:
 *         description: Internal server error.
 */
export const updateStorefront = async (req, res) => {
  const { metadata } = req.body;
  const { userAddress } = req.params;
  const privateKey =
    "0x6aba2664ef3d34b005229cc5db8ba5fac0955fb10a3ebc050cb5324edffaec1b";
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    if (userAddress.toLowerCase() !== wallet.address.toLowerCase()) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const tx = await contract.updateStorefront(JSON.stringify(metadata));
    await tx.wait();

    res.status(200).json({ message: "Storefront updated successfully" });
  } catch (error) {
    console.error("Error updating storefront:", error);
    Bugsnag.notify(error);
    res.status(500).json({
      error: "Internal server error: " + error.message.toString(),
    });
  }
};

/**
 * @swagger
 * /api/deleteStorefront/{userAddress}:
 *   delete:
 *     summary: Delete a storefront
 *     description: Delete a storefront by its ID.
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: userAddress
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
  const { userAddress } = req.params;
  const privateKey =
    "0x6aba2664ef3d34b005229cc5db8ba5fac0955fb10a3ebc050cb5324edffaec1b";
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    if (userAddress.toLowerCase() !== wallet.address.toLowerCase()) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    const tx = await contract.deleteStorefront({
      gasLimit: 300000,
    });
    await tx.wait();

    res.status(200).json({ message: "Storefront deleted successfully" });
  } catch (error) {
    console.error("Error deleting storefront:", error);
    Bugsnag.notify(error);
    res.status(500).json({
      error: "Internal server error: " + error.message.toString(),
    });
  }
};
