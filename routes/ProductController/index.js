/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Operations related to products
 */

import { ethers } from "ethers";
import Bugsnag from "@bugsnag/js";
import MyStorefrontJSON from "../../artifacts/contracts/Store/CreateStore.sol/MyStorefront.json" assert { type: "json" };

const contractAddress = "0xb861ea3cce8995866915b2953edb3e9e6901c4dd";
const { abi } = MyStorefrontJSON;
const provider = new ethers.providers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.bnbchain.org:8545/"
);

/**
 * @swagger
 * /api/createProduct/{storeId}/{productId}:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product and map it to the specified store.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
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
 *                   categoryId:
 *                     type: integer
 *                     description: ID of the category the product belongs to.
 *                   name:
 *                     type: string
 *                     description: Name of the product.
 *                   description:
 *                     type: string
 *                     description: Description of the product.
 *                   price:
 *                     type: number
 *                     description: Price of the product.
 *                   image:
 *                     type: string
 *                     description: Image URL of the product.
 *                   stock:
 *                     type: integer
 *                     description: Stock quantity of the product.
 *     responses:
 *       200:
 *         description: Product created and mapped to store successfully.
 *       400:
 *         description: Bad request. Invalid or missing parameters.
 */
export const createProduct = async (req, res) => {
  const { metadata } = req.body;
  const { storeId, productId } = req.params;
  const privateKey =
    "0x302f5a588de387f5d6a9280da6cbeb42de41705eaafbe7bb837f83b5b5f1d692";
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    if (
      !metadata ||
      !metadata.categoryId ||
      !metadata.name ||
      !metadata.description ||
      !metadata.price ||
      !metadata.image ||
      !metadata.stock
    ) {
      return res.status(400).json({ error: "Invalid or missing metadata" });
    }

    const gasLimit = ethers.BigNumber.from("200000"); // Adjust gas limit as needed
    const gasPrice = ethers.utils.parseUnits("5", "gwei"); // Adjust gas price as needed
    const nonce = await provider.getTransactionCount(wallet.address, "latest");

    const transactionParameters = {
      nonce: nonce,
      to: contractAddress,
      data: contract.interface.encodeFunctionData("createProduct", [
        storeId,
        productId,
        metadata.categoryId,
        metadata.name,
        metadata.description,
        metadata.price,
        metadata.image,
        metadata.stock,
      ]),
      gasLimit: gasLimit.toHexString(), // Convert gas limit to hex string
      gasPrice: gasPrice.toHexString(), // Convert gas price to hex string
      chainId: 97, // Update with your chain ID
    };

    const signed = await wallet.signTransaction(transactionParameters);
    const tx = await provider.sendTransaction(signed);

    await tx.wait();

    res
      .status(200)
      .json({ message: "Product created and mapped to store successfully" });
  } catch (error) {
    console.error("Error creating product:", error);
    Bugsnag.notify(error);
    res.status(500).json({
      error: "Internal server error: " + error.message.toString(),
    });
  }
};

/**
 * @swagger
 * /api/products/{storeId}:
 *   get:
 *     summary: Get all products for a specific store
 *     description: Retrieve details of all products for a specific store.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products for the specified store retrieved successfully.
 *       400:
 *         description: Bad request. Invalid or missing parameters.
 *       500:
 *         description: Internal server error.
 */
export const getAllProducts = async (req, res) => {
  try {
    const { storeId } = req.params;

    // Connect to the contract
    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Call getProductCountForStore function on the contract to get product count for the store
    const productCount = await contract.getProductCountForStore(storeId);

    const products = [];
    for (let i = 0; i < productCount; i++) {
      // Call getProductForStore function on the contract to get product details for the store
      const product = await contract.getProductForStore(storeId, i);
      products.push(product);
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/products/{storeId}/{productId}:
 *   get:
 *     summary: Get a single product for a specific store
 *     description: Retrieve details of a single product for a specific store.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product for the specified store retrieved successfully.
 *       400:
 *         description: Bad request. Invalid or missing parameters.
 *       404:
 *         description: Product not found for the specified store.
 *       500:
 *         description: Internal server error.
 */
export const getProduct = async (req, res) => {
  try {
    const { storeId, productId } = req.params;

    // Connect to the contract
    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Call getProductForStore function on the contract to get product details for the specified store and product ID
    const product = await contract.getProductForStore(storeId, productId);

    // Check if the product exists
    if (!product.id || product.id.toNumber() === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/updateProduct/{storeId}/{productId}:
 *   put:
 *     summary: Update a product
 *     description: Update details of a product for a specific store.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
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
 *                   categoryId:
 *                     type: integer
 *                     description: ID of the category the product belongs to.
 *                   name:
 *                     type: string
 *                     description: Name of the product.
 *                   description:
 *                     type: string
 *                     description: Description of the product.
 *                   price:
 *                     type: number
 *                     description: Price of the product.
 *                   image:
 *                     type: string
 *                     description: Image URL of the product.
 *                   stock:
 *                     type: integer
 *                     description: Stock quantity of the product.
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       400:
 *         description: Bad request. Invalid or missing parameters.
 *       404:
 *         description: Product not found for the specified store.
 *       500:
 *         description: Internal server error.
 */
export const updateProduct = async (req, res) => {
  try {
    const { storeId, productId } = req.params;
    const { metadata } = req.body;

    // Connect to the contract
    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Call the updateProduct function on the contract to update the product details
    const transaction = await contract.updateProduct(
      storeId,
      productId,
      metadata.categoryId,
      metadata.name,
      metadata.description,
      metadata.price,
      metadata.image,
      metadata.stock
    );

    // Wait for the transaction to be mined
    await transaction.wait();

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/deleteProduct/{storeId}/{productId}:
 *   delete:
 *     summary: Delete a product
 *     description: Delete a product from a specific store.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       404:
 *         description: Product not found for the specified store.
 *       500:
 *         description: Internal server error.
 */
export const deleteProduct = async (req, res) => {
  try {
    const { storeId, productId } = req.params;

    // Connect to the contract
    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Call the deleteProduct function on the contract to delete the product
    const transaction = await contract.deleteProduct(storeId, productId);

    // Wait for the transaction to be mined
    await transaction.wait();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
