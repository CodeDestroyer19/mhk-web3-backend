/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Operations related to customers
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
 * /api/addCustomer/{storeId}:
 *   post:
 *     summary: Add a new customer
 *     description: Add a new customer to the specified store.
 *     tags: [Customers]
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
 *               email:
 *                 type: string
 *                 description: Email of the customer.
 *               name:
 *                 type: string
 *                 description: Name of the customer.
 *               password:
 *                 type: string
 *                 description: Password of the customer.
 *               shippingAddress:
 *                 type: string
 *                 description: Shipping address of the customer.
 *               billingAddress:
 *                 type: string
 *                 description: Billing address of the customer.
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number of the customer.
 *     responses:
 *       200:
 *         description: Customer added successfully.
 *       400:
 *         description: Bad request. Invalid or missing parameters.
 *       500:
 *         description: Internal server error.
 */
export const addCustomer = async (req, res) => {
  const { storeId } = req.params;
  const {
    email,
    name,
    password,
    shippingAddress,
    billingAddress,
    phoneNumber,
  } = req.body;
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
      data: contract.interface.encodeFunctionData("addCustomer", [
        email,
        name,
        password,
        shippingAddress,
        billingAddress,
        phoneNumber,
      ]),
      gasLimit: gasLimit.toHexString(), // Convert gas limit to hex string
      gasPrice: gasPrice.toHexString(), // Convert gas price to hex string
      chainId: 97, // Update with your chain ID
    };

    const signed = await wallet.signTransaction(transactionParameters);
    const tx = await provider.sendTransaction(signed);

    await tx.wait();

    res.status(200).json({ message: "Customer added successfully" });
  } catch (error) {
    console.error("Error adding customer:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/updateCustomer/{storeId}/{customerId}:
 *   put:
 *     summary: Update a customer
 *     description: Update details of a customer for a specific store.
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: customerId
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
 *               email:
 *                 type: string
 *                 description: Updated email of the customer.
 *               name:
 *                 type: string
 *                 description: Updated name of the customer.
 *               password:
 *                 type: string
 *                 description: Updated password of the customer.
 *               shippingAddress:
 *                 type: string
 *                 description: Updated shipping address of the customer.
 *               billingAddress:
 *                 type: string
 *                 description: Updated billing address of the customer.
 *               phoneNumber:
 *                 type: string
 *                 description: Updated phone number of the customer.
 *     responses:
 *       200:
 *         description: Customer updated successfully.
 *       400:
 *         description: Bad request. Invalid or missing parameters.
 *       500:
 *         description: Internal server error.
 */
export const updateCustomer = async (req, res) => {
  const { storeId, customerId } = req.params;
  const {
    email,
    name,
    password,
    shippingAddress,
    billingAddress,
    phoneNumber,
  } = req.body;
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
      data: contract.interface.encodeFunctionData("updateCustomer", [
        customerId,
        email,
        name,
        password,
        shippingAddress,
        billingAddress,
        phoneNumber,
      ]),
      gasLimit: gasLimit.toHexString(), // Convert gas limit to hex string
      gasPrice: gasPrice.toHexString(), // Convert gas price to hex string
      chainId: 97, // Update with your chain ID
    };

    const signed = await wallet.signTransaction(transactionParameters);
    const tx = await provider.sendTransaction(signed);

    await tx.wait();

    res.status(200).json({ message: "Customer updated successfully" });
  } catch (error) {
    console.error("Error updating customer:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/deleteCustomer/{storeId}/{customerId}:
 *   delete:
 *     summary: Delete a customer
 *     description: Delete a customer from a specific store.
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer deleted successfully.
 *       404:
 *         description: Customer not found for the specified store.
 *       500:
 *         description: Internal server error.
 */
export const deleteCustomer = async (req, res) => {
  const { storeId, customerId } = req.params;
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
      data: contract.interface.encodeFunctionData("deleteCustomer", [
        customerId,
      ]),
      gasLimit: gasLimit.toHexString(), // Convert gas limit to hex string
      gasPrice: gasPrice.toHexString(), // Convert gas price to hex string
      chainId: 97, // Update with your chain ID
    };

    const signed = await wallet.signTransaction(transactionParameters);
    const tx = await provider.sendTransaction(signed);

    await tx.wait();

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/getCustomer/{storeId}/{customerId}:
 *   get:
 *     summary: Get a customer
 *     description: Retrieve details of a customer for a specific store.
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer details retrieved successfully.
 *       404:
 *         description: Customer not found for the specified store.
 *       500:
 *         description: Internal server error.
 */
export const getCustomer = async (req, res) => {
  const { storeId, customerId } = req.params;
  const contract = new ethers.Contract(contractAddress, abi, provider);

  try {
    const customer = await contract.getCustomer(storeId, customerId);
    if (!customer.id || customer.id.toNumber() === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/getAllCustomers/{storeId}:
 *   get:
 *     summary: Get all customers for a specific store
 *     description: Retrieve details of all customers for a specific store.
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customers for the specified store retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
export const getAllCustomers = async (req, res) => {
  const { storeId } = req.params;
  const contract = new ethers.Contract(contractAddress, abi, provider);

  try {
    const customers = await contract.getAllCustomers(storeId);
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
