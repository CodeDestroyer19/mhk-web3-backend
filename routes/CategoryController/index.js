/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Operations related to Categories
 */

import { ethers } from "ethers";
import Bugsnag from "@bugsnag/js";
import StorefrontContractJSON from "../../artifacts/contracts/Storefront.sol/Storefront.json";

const contractAddress = "0xb861ea3cce8995866915b2953edb3e9e6901c4dd"; // Update with your actual contract address
const { abi } = StorefrontContractJSON;
const provider = new ethers.providers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.bnbchain.org:8545/"
);

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Operations related to categories
 */

/**
 * @swagger
 * /api/addCategory/{storeId}:
 *   post:
 *     summary: Add a new category
 *     description: Add a new category to the specified store in the storefront contract.
 *     tags: [Categories]
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
 *               name:
 *                 type: string
 *                 description: Name of the category.
 *               description:
 *                 type: string
 *                 description: Description of the category.
 *               parentId:
 *                 type: integer
 *                 description: ID of the parent category (if any).
 *     responses:
 *       200:
 *         description: Category added successfully.
 *       500:
 *         description: Internal server error.
 */
export const addCategory = async (req, res) => {
  const { storeId } = req.params;
  const { name, description, parentId } = req.body;

  const privateKey =
    "0x302f5a588de387f5d6a9280da6cbeb42de41705eaafbe7bb837f83b5b5f1d692"; // Replace with your actual private key
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    const tx = await contract.addCategory(storeId, name, description, parentId);
    await tx.wait();
    res.status(200).json({ message: "Category added successfully" });
  } catch (error) {
    console.error("Error adding category:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/updateCategory/{storeId}/{categoryId}:
 *   put:
 *     summary: Update a category
 *     description: Update details of a category for a specific store.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: categoryId
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
 *               name:
 *                 type: string
 *                 description: Updated name of the category.
 *               description:
 *                 type: string
 *                 description: Updated description of the category.
 *               parentId:
 *                 type: integer
 *                 description: Updated ID of the parent category (if any).
 *     responses:
 *       200:
 *         description: Category updated successfully.
 *       400:
 *         description: Bad request. Invalid or missing parameters.
 *       404:
 *         description: Category not found for the specified store.
 *       500:
 *         description: Internal server error.
 */
export const updateCategory = async (req, res) => {
  try {
    const { storeId, categoryId } = req.params;
    const { name, description, parentId } = req.body;

    // Connect to the contract
    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Call the updateCategory function on the contract to update the category details
    const transaction = await contract.updateCategory(
      storeId,
      categoryId,
      name,
      description,
      parentId
    );

    // Wait for the transaction to be mined
    await transaction.wait();

    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/deleteCategory/{storeId}/{categoryId}:
 *   delete:
 *     summary: Delete a category
 *     description: Delete a category from a specific store.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully.
 *       404:
 *         description: Category not found for the specified store.
 *       500:
 *         description: Internal server error.
 */
export const deleteCategory = async (req, res) => {
  try {
    const { storeId, categoryId } = req.params;

    // Connect to the contract
    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Call the deleteCategory function on the contract to delete the category
    const transaction = await contract.deleteCategory(storeId, categoryId);

    // Wait for the transaction to be mined
    await transaction.wait();

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/getCategory/{storeId}/{categoryId}:
 *   get:
 *     summary: Get a single category for a specific store
 *     description: Retrieve details of a single category for a specific store.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category for the specified store retrieved successfully.
 *       404:
 *         description: Category not found for the specified store.
 *       500:
 *         description: Internal server error.
 */
export const getCategory = async (req, res) => {
  try {
    const { storeId, categoryId } = req.params;

    // Connect to the contract
    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Call getCategory function on the contract to get category details for the specified store and category ID
    const category = await contract.getCategory(storeId, categoryId);

    // Check if the category exists
    if (!category.id || category.id.toNumber() === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/getAllCategories/{storeId}:
 *   get:
 *     summary: Get all categories for a specific store
 *     description: Retrieve details of all categories for a specific store.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categories for the specified store retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
export const getAllCategories = async (req, res) => {
  try {
    const { storeId } = req.params;

    // Connect to the contract
    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Call getAllCategories function on the contract to get all categories for the specified store
    const categories = await contract.getAllCategories(storeId);

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    Bugsnag.notify(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Implement the getAllCategories similarly as in the product controller.
