/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Operations related to orders
 */

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
 * /api/createOrder/{storeId}:
 *   post:
 *     summary: Create a new order
 *     description: Create a new order for the specified store.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: storeId
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
 *               customerId:
 *                 type: integer
 *                 description: ID of the customer placing the order.
 *               orderStatus:
 *                 type: string
 *                 description: Status of the order.
 *               subtotal:
 *                 type: integer
 *                 description: Subtotal of the order.
 *               tax:
 *                 type: integer
 *                 description: Tax amount of the order.
 *               shippingCost:
 *                 type: integer
 *                 description: Shipping cost of the order.
 *               total:
 *                 type: integer
 *                 description: Total amount of the order.
 *     responses:
 *       200:
 *         description: Order created successfully.
 *       400:
 *         description: Bad request. Invalid or missing parameters.
 *       500:
 *         description: Internal server error.
 */
export const createOrder = async (req, res) => {
  const { storeId } = req.params;
  const { customerId, orderStatus, subtotal, tax, shippingCost, total } =
    req.body;
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
      data: contract.interface.encodeFunctionData("createOrder", [
        customerId,
        orderStatus,
        subtotal,
        tax,
        shippingCost,
        total,
      ]),
      gasLimit: gasLimit.toHexString(), // Convert gas limit to hex string
      gasPrice: gasPrice.toHexString(), // Convert gas price to hex string
      chainId: 97, // Update with your chain ID
    };

    const signed = await wallet.signTransaction(transactionParameters);
    const tx = await provider.sendTransaction(signed);

    await tx.wait();

    res.status(200).json({ message: "Order created successfully" });
  } catch (error) {
    console.error("Error creating order:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/updateOrder/{storeId}/{orderId}:
 *   put:
 *     summary: Update an order
 *     description: Update details of an order for a specific store.
 *     tags: [Orders]
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
 *               orderStatus:
 *                 type: string
 *                 description: Updated status of the order.
 *               subtotal:
 *                 type: integer
 *                 description: Updated subtotal of the order.
 *               tax:
 *                 type: integer
 *                 description: Updated tax amount of the order.
 *               shippingCost:
 *                 type: integer
 *                 description: Updated shipping cost of the order.
 *               total:
 *                 type: integer
 *                 description: Updated total amount of the order.
 *     responses:
 *        200:
 *          description: Order updated successfully.
 *        400:
 *          description: Bad request. Invalid or missing parameters.
 *        404:
 *          description: Order not found for the specified store.
 *        500:
 *          description: Internal server error.
 */
export const updateOrder = async (req, res) => {
  const { storeId, orderId } = req.params;
  const { orderStatus, subtotal, tax, shippingCost, total } = req.body;
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
      data: contract.interface.encodeFunctionData("updateOrder", [
        orderId,
        orderStatus,
        subtotal,
        tax,
        shippingCost,
        total,
      ]),
      gasLimit: gasLimit.toHexString(), // Convert gas limit to hex string
      gasPrice: gasPrice.toHexString(), // Convert gas price to hex string
      chainId: 97, // Update with your chain ID
    };

    const signed = await wallet.signTransaction(transactionParameters);
    const tx = await provider.sendTransaction(signed);

    await tx.wait();

    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/deleteOrder/{storeId}/{orderId}:
 *   delete:
 *     summary: Delete an order
 *     description: Delete an order from a specific store.
 *     tags: [Orders]
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
 *         description: Order deleted successfully.
 *       404:
 *         description: Order not found for the specified store.
 *       500:
 *         description: Internal server error.
 */
export const deleteOrder = async (req, res) => {
  const { storeId, orderId } = req.params;
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
      data: contract.interface.encodeFunctionData("deleteOrder", [orderId]),
      gasLimit: gasLimit.toHexString(), // Convert gas limit to hex string
      gasPrice: gasPrice.toHexString(), // Convert gas price to hex string
      chainId: 97, // Update with your chain ID
    };

    const signed = await wallet.signTransaction(transactionParameters);
    const tx = await provider.sendTransaction(signed);

    await tx.wait();

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/getOrder/{storeId}/{orderId}:
 *   get:
 *     summary: Get an order
 *     description: Retrieve details of an order for a specific store.
 *     tags: [Orders]
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
 *         description: Order details retrieved successfully.
 *       404:
 *         description: Order not found for the specified store.
 *       500:
 *         description: Internal server error.
 */
export const getOrder = async (req, res) => {
  const { storeId, orderId } = req.params;
  const contract = new ethers.Contract(contractAddress, abi, provider);

  try {
    const order = await contract.getOrder(storeId, orderId);
    if (!order.id || order.id.toNumber() === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/getAllOrders/{storeId}:
 *   get:
 *     summary: Get all orders for a specific store
 *     description: Retrieve details of all orders for a specific store.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orders for the specified store retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
export const getAllOrders = async (req, res) => {
  const { storeId } = req.params;
  const contract = new ethers.Contract(contractAddress, abi, provider);

  try {
    const orders = await contract.getAllOrders(storeId);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
