import { ethers } from "ethers";
import Bugsnag from "@bugsnag/js";
import MyStorefrontJSON from "../../artifacts/contracts/Product/Product.sol/MyProduct.json" assert { type: "json" };

const contractAddress = "0xb861ea3cce8995866915b2953edb3e9e6901c4dd";
const { abi } = MyStorefrontJSON;
const provider = new ethers.providers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.bnbchain.org:8545/"
);

/**
 * @swagger
 * tags:
 *   name: OrderItems
 *   description: Operations related to order items
 */

/**
 * @swagger
 * /api/addOrderItem/{storeId}/{orderId}:
 *   post:
 *     summary: Add a new order item
 *     description: Add a new order item to the specified order.
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: orderId
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
 *               productId:
 *                 type: integer
 *                 description: ID of the product in the order item.
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product in the order item.
 *               price:
 *                 type: number
 *                 description: Price per unit of the product in the order item.
 *     responses:
 *       200:
 *         description: Order item added successfully.
 *       400:
 *         description: Bad request. Invalid or missing parameters.
 *       404:
 *         description: Order not found for the specified store.
 *       500:
 *         description: Internal server error.
 */
export const addOrderItem = async (req, res) => {
  const { storeId, orderId } = req.params;
  const { productId, quantity, price } = req.body;
  const privateKey =
    "0x302f5a588de387f5d6a9280da6cbeb42de41705eaafbe7bb837f83b5b5f1d692";
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    const gasLimit = ethers.BigNumber.from("200000"); // Adjust gas limit as needed
    const gasPrice = ethers.utils.parseUnits("5", "gwei"); // Adjust gas price as needed
    const nonce = await provider.getTransactionCount(wallet.address, "latest");

    const transactionParameters = {
      nonce: nonce,
      to: contractAddress,
      data: contract.interface.encodeFunctionData("addOrderItem", [
        orderId,
        productId,
        quantity,
        price,
      ]),
      gasLimit: gasLimit.toHexString(), // Convert gas limit to hex string
      gasPrice: gasPrice.toHexString(), // Convert gas price to hex string
      chainId: 97, // Update with your chain ID
    };

    const signed = await wallet.signTransaction(transactionParameters);
    const tx = await provider.sendTransaction(signed);

    await tx.wait();

    res.status(200).json({ message: "Order item added successfully" });
  } catch (error) {
    console.error("Error adding order item:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/updateOrderItem/{storeId}/{orderItemId}:
 *   put:
 *     summary: Update an order item
 *     description: Update details of an order item for a specific order.
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: orderItemId
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
 *               quantity:
 *                 type: integer
 *                 description: Updated quantity of the product in the order item.
 *               price:
 *                 type: number
 *                 description: Updated price per unit of the product in the order item.
 *     responses:
 *       200:
 *         description: Order item updated successfully.
 *       400:
 *         description: Bad request. Invalid or missing parameters.
 *       404:
 *         description: Order item not found for the specified store.
 *       500:
 *         description: Internal server error.
 */
export const updateOrderItem = async (req, res) => {
  const { storeId, orderItemId } = req.params;
  const { quantity, price } = req.body;
  const privateKey =
    "0x302f5a588de387f5d6a9280da6cbeb42de41705eaafbe7bb837f83b5b5f1d692";
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    const gasLimit = ethers.BigNumber.from("200000"); // Adjust gas limit as needed
    const gasPrice = ethers.utils.parseUnits("5", "gwei"); // Adjust gas price as needed
    const nonce = await provider.getTransactionCount(wallet.address, "latest");

    const transactionParameters = {
      nonce: nonce,
      to: contractAddress,
      data: contract.interface.encodeFunctionData("updateOrderItem", [
        orderItemId,
        quantity,
        price,
      ]),
      gasLimit: gasLimit.toHexString(), // Convert gas limit to hex string
      gasPrice: gasPrice.toHexString(), // Convert gas price to hex string
      chainId: 97, // Update with your chain ID
    };

    const signed = await wallet.signTransaction(transactionParameters);
    const tx = await provider.sendTransaction(signed);

    await tx.wait();

    res.status(200).json({ message: "Order item updated successfully" });
  } catch (error) {
    console.error("Error updating order item:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/deleteOrderItem/{storeId}/{orderItemId}:
 *   delete:
 *     summary: Delete an order item
 *     description: Delete an order item from a specific order.
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: orderItemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order item deleted successfully.
 *       404:
 *         description: Order item not found for the specified store.
 *       500:
 *         description: Internal server error.
 */
export const deleteOrderItem = async (req, res) => {
  const { storeId, orderItemId } = req.params;
  const privateKey =
    "0x302f5a588de387f5d6a9280da6cbeb42de41705eaafbe7bb837f83b5b5f1d692";
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    const gasLimit = ethers.BigNumber.from("200000"); // Adjust gas limit as needed
    const gasPrice = ethers.utils.parseUnits("5", "gwei"); // Adjust gas price as needed
    const nonce = await provider.getTransactionCount(wallet.address, "latest");

    const transactionParameters = {
      nonce: nonce,
      to: contractAddress,
      data: contract.interface.encodeFunctionData("deleteOrderItem", [
        orderItemId,
      ]),
      gasLimit: gasLimit.toHexString(), // Convert gas limit to hex string
      gasPrice: gasPrice.toHexString(), // Convert gas price to hex string
      chainId: 97, // Update with your chain ID
    };

    const signed = await wallet.signTransaction(transactionParameters);
    const tx = await provider.sendTransaction(signed);

    await tx.wait();

    res.status(200).json({ message: "Order item deleted successfully" });
  } catch (error) {
    console.error("Error deleting order item:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/getOrderItem/{storeId}/{orderItemId}:
 *   get:
 *     summary: Get an order item
 *     description: Retrieve details of a specific order item.
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: orderItemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order item retrieved successfully.
 *       404:
 *         description: Order item not found for the specified store.
 *       500:
 *         description: Internal server error.
 */
export const getOrderItem = async (req, res) => {
  const { storeId, orderItemId } = req.params;
  const privateKey =
    "0x302f5a588de387f5d6a9280da6cbeb42de41705eaafbe7bb837f83b5b5f1d692";
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    const orderItem = await contract.getOrderItem(orderItemId);
    res.status(200).json(orderItem);
  } catch (error) {
    console.error("Error getting order item:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/getOrderItems/{storeId}/{orderId}:
 *   get:
 *     summary: Get order items
 *     description: Retrieve all order items for a specific order.
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order items retrieved successfully.
 *       404:
 *         description: Order not found for the specified store.
 *       500:
 *         description: Internal server error.
 */
export const getOrderItems = async (req, res) => {
  const { storeId, orderId } = req.params;
  const privateKey =
    "0x302f5a588de387f5d6a9280da6cbeb42de41705eaafbe7bb837f83b5b5f1d692";
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    const orderItems = await contract.getOrderItems(orderId);
    res.status(200).json(orderItems);
  } catch (error) {
    console.error("Error getting order items:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
