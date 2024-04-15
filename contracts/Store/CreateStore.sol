// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MyStorefront is OwnableUpgradeable, UUPSUpgradeable {
    // Structs
    struct Product {
        uint256 id;
        uint256 categoryId;
        string name;
        string description;
        uint256 price;
        string image;
        uint256 stock;
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct Category {
        uint256 id;
        string name;
        string description;
        uint256 parentId;
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct Customer {
        uint256 id;
        string email;
        string name;
        string password;
        string shippingAddress;
        string billingAddress;
        string phoneNumber;
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct Order {
        uint256 id;
        uint256 customerId;
        string orderStatus;
        uint256 subtotal;
        uint256 tax;
        uint256 shippingCost;
        uint256 total;
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct OrderItem {
        uint256 id;
        uint256 orderId;
        uint256 productId;
        uint256 quantity;
        uint256 price;
        uint256 createdAt;
    }

    struct Storefront {
        string metadata;
        mapping(uint256 => Product) products;
        mapping(uint256 => Category) categories;
        mapping(uint256 => Customer) customers;
        mapping(uint256 => Order) orders;
        mapping(uint256 => OrderItem) orderItems;
        uint256 productCount;
        uint256 categoryCount;
        uint256 customerCount;
        uint256 orderCount;
        uint256 orderItemCount;
    }

    // State variables
    mapping(address => Storefront) public storefronts; // Mapping of storefront owners to storefronts
    mapping(address => bool) public oldUserStoreFronts; // Mapping of old users to existing storefronts

    // Events
    event StorefrontCreated(address owner, string metadata);
    event StorefrontUpdated(address owner, string metadata);
    event StorefrontDeleted(address owner);
    event ProductAdded(address indexed owner, uint256 productId);
    event ProductUpdated(address indexed owner, uint256 productId);
    event ProductDeleted(address indexed owner, uint256 productId);
    event CategoryAdded(address indexed owner, uint256 categoryId);
    event CategoryUpdated(address indexed owner, uint256 categoryId);
    event CategoryDeleted(address indexed owner, uint256 categoryId);
    event CustomerAdded(address indexed owner, uint256 customerId);
    event CustomerUpdated(address indexed owner, uint256 customerId);
    event CustomerDeleted(address indexed owner, uint256 customerId);
    event OrderAdded(address indexed owner, uint256 orderId);
    event OrderUpdated(address indexed owner, uint256 orderId);
    event OrderDeleted(address indexed owner, uint256 orderId);
    event OrderItemAdded(address indexed owner, uint256 orderItemId);
    event OrderItemUpdated(address indexed owner, uint256 orderItemId);
    event OrderItemDeleted(address indexed owner, uint256 orderItemId);

    /**
     * @dev Initializes the contract setting the initial owner.
     * @param initialOwner The address of the initial owner.
     */
    function initialize(address initialOwner) public initializer {
        __Ownable_init(initialOwner);
        createStorefront("");
    }

    /**
     * @dev Creates a new storefront with the specified metadata.
     * @param _metadata The metadata associated with the storefront.
     */
    function createStorefront(string memory _metadata) public {
        require(bytes(_metadata).length > 0, "Missing metadata");

        if (bytes(storefronts[msg.sender].metadata).length > 0) {
            revert("Storefront already exists");
        }

        storefronts[msg.sender].metadata = _metadata;
    }

    /**
     * @dev Retrieves the metadata of a storefront.
     * @param _owner The address of the storefront owner.
     * @return The metadata associated with the storefront.
     */
    function getStorefront(address _owner) public view returns (address, string memory) {
        Storefront storage storefront = storefronts[_owner]; // Accessing storage
        return (_owner, storefront.metadata);
    }

    /**
     * @dev Updates the metadata of the caller's storefront.
     * @param _metadata The new metadata to be set.
     */
    function updateStorefront(string memory _metadata) external {
        require(bytes(_metadata).length > 0, "Missing metadata");

        address sender = _msgSender();
        require(bytes(storefronts[sender].metadata).length > 0, "Storefront does not exist");

        storefronts[sender].metadata = _metadata;
        emit StorefrontUpdated(sender, _metadata);
    }

/**
 * @dev Deletes the caller's storefront.
 */
function deleteStorefront() external {
    address sender = _msgSender();
    require(bytes(storefronts[sender].metadata).length > 0, "Storefront does not exist");

    // Delete all mappings associated with the storefront
    Storefront storage storefront = storefronts[sender];
    for (uint256 i = 1; i <= storefront.productCount; i++) {
        if (storefront.products[i].id != 0) {
            delete storefront.products[i];
        }
    }
    for (uint256 i = 1; i <= storefront.categoryCount; i++) {
        if (storefront.categories[i].id != 0) {
            delete storefront.categories[i];
        }
    }
    for (uint256 i = 1; i <= storefront.customerCount; i++) {
        if (storefront.customers[i].id != 0) {
            delete storefront.customers[i];
        }
    }
    for (uint256 i = 1; i <= storefront.orderCount; i++) {
        if (storefront.orders[i].id != 0) {
            delete storefront.orders[i];
        }
    }
    for (uint256 i = 1; i <= storefront.orderItemCount; i++) {
        if (storefront.orderItems[i].id != 0) {
            delete storefront.orderItems[i];
        }
    }

    // Delete the storefront itself
    delete storefronts[sender];

    emit StorefrontDeleted(sender);
}


    /**
     * @dev Checks if a user has a storefront.
     * @param user The address of the user.
     * @return A boolean indicating whether the user has a storefront.
     */
    function hasStore(address user) public view returns (bool) {
        return bytes(storefronts[user].metadata).length > 0 || oldUserStoreFronts[user];
    }

        // Product CRUD operations
    function addProduct(
        uint256 _categoryId,
        string memory _name,
        string memory _description,
        uint256 _price,
        string memory _image,
        uint256 _stock
    ) public {
        Storefront storage storefront = storefronts[msg.sender];
        uint256 productId = storefront.productCount + 1;
        Product storage product = storefront.products[productId];
        product.id = productId;
        product.categoryId = _categoryId;
        product.name = _name;
        product.description = _description;
        product.price = _price;
        product.image = _image;
        product.stock = _stock;
        product.createdAt = block.timestamp;
        product.updatedAt = block.timestamp;
        storefront.productCount++;
        emit ProductAdded(msg.sender, productId);
    }

    function updateProduct(
        uint256 _productId,
        string memory _name,
        string memory _description,
        uint256 _price,
        string memory _image,
        uint256 _stock
    ) public {
        Storefront storage storefront = storefronts[msg.sender];
        Product storage product = storefront.products[_productId];
        require(product.id == _productId, "Product not found");
        product.name = _name;
        product.description = _description;
        product.price = _price;
        product.image = _image;
        product.stock = _stock;
        product.updatedAt = block.timestamp;
        emit ProductUpdated(msg.sender, _productId);
    }

    function deleteProduct(uint256 _productId) public {
        Storefront storage storefront = storefronts[msg.sender];
        Product storage product = storefront.products[_productId];
        require(product.id == _productId, "Product not found");
        delete storefront.products[_productId];
        emit ProductDeleted(msg.sender, _productId);
    }

    // Get product details by ID
    function getProduct(uint256 _productId) public view returns (Product memory) {
        Storefront storage storefront = storefronts[msg.sender];
        return storefront.products[_productId];
    }

    // Get all products
    function getAllProducts() public view returns (Product[] memory) {
        Storefront storage storefront = storefronts[msg.sender];
        Product[] memory products = new Product[](storefront.productCount);
        for (uint256 i = 1; i <= storefront.productCount; i++) {
            products[i - 1] = storefront.products[i];
        }
        return products;
    }

        // Category CRUD operations

    /**
     * @dev Adds a new category.
     * @param _name The name of the category.
     * @param _description The description of the category.
     * @param _parentId The ID of the parent category (if any).
     */
    function addCategory(
        string memory _name,
        string memory _description,
        uint256 _parentId
    ) public {
        Storefront storage storefront = storefronts[msg.sender];
        uint256 categoryId = storefront.categoryCount + 1;
        Category storage category = storefront.categories[categoryId];
        category.id = categoryId;
        category.name = _name;
        category.description = _description;
        category.parentId = _parentId;
        category.createdAt = block.timestamp;
        category.updatedAt = block.timestamp;
        storefront.categoryCount++;
        emit CategoryAdded(msg.sender, categoryId);
    }

    /**
     * @dev Updates an existing category.
     * @param _categoryId The ID of the category to update.
     * @param _name The updated name of the category.
     * @param _description The updated description of the category.
     * @param _parentId The updated ID of the parent category (if any).
     */
    function updateCategory(
        uint256 _categoryId,
        string memory _name,
        string memory _description,
        uint256 _parentId
    ) public {
        Storefront storage storefront = storefronts[msg.sender];
        Category storage category = storefront.categories[_categoryId];
        require(category.id == _categoryId, "Category not found");
        category.name = _name;
        category.description = _description;
        category.parentId = _parentId;
        category.updatedAt = block.timestamp;
        emit CategoryUpdated(msg.sender, _categoryId);
    }

    /**
     * @dev Deletes an existing category.
     * @param _categoryId The ID of the category to delete.
     */
    function deleteCategory(uint256 _categoryId) public {
        Storefront storage storefront = storefronts[msg.sender];
        Category storage category = storefront.categories[_categoryId];
        require(category.id == _categoryId, "Category not found");
        delete storefront.categories[_categoryId];
        emit CategoryDeleted(msg.sender, _categoryId);
    }

    /**
     * @dev Retrieves a category by its ID.
     * @param _categoryId The ID of the category to retrieve.
     * @return The category details.
     */
    function getCategory(uint256 _categoryId) public view returns (Category memory) {
        Storefront storage storefront = storefronts[msg.sender];
        return storefront.categories[_categoryId];
    }

    /**
     * @dev Retrieves all categories.
     * @return An array containing all categories.
     */
    function getAllCategories() public view returns (Category[100] memory) {
        Storefront storage storefront = storefronts[msg.sender];
        Category[100] memory categories;
        uint256 count = 0;
        for (uint256 i = 1; i <= storefront.categoryCount; i++) {
            if (count < 100) {
                categories[count] = storefront.categories[i];
                count++;
            } else {
                break;
            }
        }
        return categories;
    }

        // Customer CRUD operations

    /**
     * @dev Adds a new customer.
     * @param _email The email of the customer.
     * @param _name The name of the customer.
     * @param _password The password of the customer.
     * @param _shippingAddress The shipping address of the customer.
     * @param _billingAddress The billing address of the customer.
     * @param _phoneNumber The phone number of the customer.
     */
    function addCustomer(
        string memory _email,
        string memory _name,
        string memory _password,
        string memory _shippingAddress,
        string memory _billingAddress,
        string memory _phoneNumber
    ) public {
        Storefront storage storefront = storefronts[msg.sender];
        uint256 customerId = storefront.customerCount + 1;
        Customer storage customer = storefront.customers[customerId];
        customer.id = customerId;
        customer.email = _email;
        customer.name = _name;
        customer.password = _password;
        customer.shippingAddress = _shippingAddress;
        customer.billingAddress = _billingAddress;
        customer.phoneNumber = _phoneNumber;
        customer.createdAt = block.timestamp;
        customer.updatedAt = block.timestamp;
        storefront.customerCount++;
        emit CustomerAdded(msg.sender, customerId);
    }

    /**
     * @dev Updates an existing customer.
     * @param _customerId The ID of the customer to update.
     * @param _email The updated email of the customer.
     * @param _name The updated name of the customer.
     * @param _password The updated password of the customer.
     * @param _shippingAddress The updated shipping address of the customer.
     * @param _billingAddress The updated billing address of the customer.
     * @param _phoneNumber The updated phone number of the customer.
     */
    function updateCustomer(
        uint256 _customerId,
        string memory _email,
        string memory _name,
        string memory _password,
        string memory _shippingAddress,
        string memory _billingAddress,
        string memory _phoneNumber
    ) public {
        Storefront storage storefront = storefronts[msg.sender];
        Customer storage customer = storefront.customers[_customerId];
        require(customer.id == _customerId, "Customer not found");
        customer.email = _email;
        customer.name = _name;
        customer.password = _password;
        customer.shippingAddress = _shippingAddress;
        customer.billingAddress = _billingAddress;
        customer.phoneNumber = _phoneNumber;
        customer.updatedAt = block.timestamp;
        emit CustomerUpdated(msg.sender, _customerId);
    }

    /**
     * @dev Deletes an existing customer.
     * @param _customerId The ID of the customer to delete.
     */
    function deleteCustomer(uint256 _customerId) public {
        Storefront storage storefront = storefronts[msg.sender];
        Customer storage customer = storefront.customers[_customerId];
        require(customer.id == _customerId, "Customer not found");
        delete storefront.customers[_customerId];
        emit CustomerDeleted(msg.sender, _customerId);
    }

    /**
     * @dev Retrieves a customer by their ID.
     * @param _customerId The ID of the customer to retrieve.
     * @return The customer details.
     */
    function getCustomer(uint256 _customerId) public view returns (Customer memory) {
        Storefront storage storefront = storefronts[msg.sender];
        return storefront.customers[_customerId];
    }

    /**
     * @dev Retrieves all customers.
     * @return An array containing all customers.
     */
    function getAllCustomers() public view returns (Customer[100] memory) {
        Storefront storage storefront = storefronts[msg.sender];
        Customer[100] memory customers;
        uint256 count = 0;
        for (uint256 i = 1; i <= storefront.customerCount; i++) {
            if (count < 100) {
                customers[count] = storefront.customers[i];
                count++;
            } else {
                break;
            }
        }
        return customers;
    }

    // Order CRUD operations

    /**
     * @dev Creates a new order.
     * @param _customerId The ID of the customer placing the order.
     * @param _orderStatus The status of the order.
     * @param _subtotal The subtotal of the order.
     * @param _tax The tax amount of the order.
     * @param _shippingCost The shipping cost of the order.
     * @param _total The total amount of the order.
     */
    function createOrder(
        uint256 _customerId,
        string memory _orderStatus,
        uint256 _subtotal,
        uint256 _tax,
        uint256 _shippingCost,
        uint256 _total
    ) public {
        Storefront storage storefront = storefronts[msg.sender];
        uint256 orderId = storefront.orderCount + 1;
        Order storage order = storefront.orders[orderId];
        order.id = orderId;
        order.customerId = _customerId;
        order.orderStatus = _orderStatus;
        order.subtotal = _subtotal;
        order.tax = _tax;
        order.shippingCost = _shippingCost;
        order.total = _total;
        order.createdAt = block.timestamp;
        order.updatedAt = block.timestamp;
        storefront.orderCount++;
        emit OrderAdded(msg.sender, orderId);
    }

    /**
     * @dev Updates an existing order.
     * @param _orderId The ID of the order to update.
     * @param _orderStatus The updated status of the order.
     * @param _subtotal The updated subtotal of the order.
     * @param _tax The updated tax amount of the order.
     * @param _shippingCost The updated shipping cost of the order.
     * @param _total The updated total amount of the order.
     */
    function updateOrder(
        uint256 _orderId,
        string memory _orderStatus,
        uint256 _subtotal,
        uint256 _tax,
        uint256 _shippingCost,
        uint256 _total
    ) public {
        Storefront storage storefront = storefronts[msg.sender];
        Order storage order = storefront.orders[_orderId];
        require(order.id == _orderId, "Order not found");
        order.orderStatus = _orderStatus;
        order.subtotal = _subtotal;
        order.tax = _tax;
        order.shippingCost = _shippingCost;
        order.total = _total;
        order.updatedAt = block.timestamp;
        emit OrderUpdated(msg.sender, _orderId);
    }

    /**
     * @dev Deletes an existing order.
     * @param _orderId The ID of the order to delete.
     */
    function deleteOrder(uint256 _orderId) public {
        Storefront storage storefront = storefronts[msg.sender];
        Order storage order = storefront.orders[_orderId];
        require(order.id == _orderId, "Order not found");
        delete storefront.orders[_orderId];
        emit OrderDeleted(msg.sender, _orderId);
    }

    /**
     * @dev Retrieves an order by its ID.
     * @param _orderId The ID of the order to retrieve.
     * @return The order details.
     */
    function getOrder(uint256 _orderId) public view returns (Order memory) {
        Storefront storage storefront = storefronts[msg.sender];
        return storefront.orders[_orderId];
    }

    /**
     * @dev Retrieves all orders.
     * @return An array containing all orders.
     */
    function getAllOrders() public view returns (Order[100] memory) {
        Storefront storage storefront = storefronts[msg.sender];
        Order[100] memory orders;
        uint256 count = 0;
        for (uint256 i = 1; i <= storefront.orderCount; i++) {
            if (count < 100) {
                orders[count] = storefront.orders[i];
                count++;
            } else {
                break;
            }
        }
        return orders;
    }

    // Order Item CRUD operations

    /**
     * @dev Adds a new order item.
     * @param _orderId The ID of the order to which the item belongs.
     * @param _productId The ID of the product in the order item.
     * @param _quantity The quantity of the product in the order item.
     * @param _price The price per unit of the product in the order item.
     */
    function addOrderItem(
        uint256 _orderId,
        uint256 _productId,
        uint256 _quantity,
        uint256 _price
    ) public {
        Storefront storage storefront = storefronts[msg.sender];
        require(storefront.orders[_orderId].id == _orderId, "Order not found");
        uint256 orderItemId = storefront.orderItemCount + 1;
        OrderItem storage orderItem = storefront.orderItems[orderItemId];
        orderItem.id = orderItemId;
        orderItem.orderId = _orderId;
        orderItem.productId = _productId;
        orderItem.quantity = _quantity;
        orderItem.price = _price;
        orderItem.createdAt = block.timestamp;
        storefront.orderItemCount++;
        emit OrderItemAdded(msg.sender, _orderId);
    }

    /**
     * @dev Updates an existing order item.
     * @param _orderItemId The ID of the order item to update.
     * @param _quantity The updated quantity of the product in the order item.
     * @param _price The updated price per unit of the product in the order item.
     */
    function updateOrderItem(
        uint256 _orderItemId,
        uint256 _quantity,
        uint256 _price
    ) public {
        Storefront storage storefront = storefronts[msg.sender];
        OrderItem storage orderItem = storefront.orderItems[_orderItemId];
        require(orderItem.id == _orderItemId, "Order item not found");
        orderItem.quantity = _quantity;
        orderItem.price = _price;
        orderItem.createdAt = block.timestamp;
        emit OrderItemUpdated(msg.sender, _orderItemId);
    }

    /**
     * @dev Deletes an existing order item.
     * @param _orderItemId The ID of the order item to delete.
     */
    function deleteOrderItem(uint256 _orderItemId) public {
        Storefront storage storefront = storefronts[msg.sender];
        OrderItem storage orderItem = storefront.orderItems[_orderItemId];
        require(orderItem.id == _orderItemId, "Order item not found");
        delete storefront.orderItems[_orderItemId];
        emit OrderItemDeleted(msg.sender,  _orderItemId);
    }

    /**
     * @dev Retrieves an order item by its ID.
     * @param _orderItemId The ID of the order item to retrieve.
     * @return The order item details.
     */
    function getOrderItem(uint256 _orderItemId) public view returns (OrderItem memory) {
        Storefront storage storefront = storefronts[msg.sender];
        return storefront.orderItems[_orderItemId];
    }

    /**
     * @dev Retrieves all order items for a given order.
     * @param _orderId The ID of the order.
     * @return An array containing all order items for the specified order.
     */
    function getOrderItems(uint256 _orderId) public view returns (OrderItem[100] memory) {
        Storefront storage storefront = storefronts[msg.sender];
        OrderItem[100] memory orderItems;
        uint256 count = 0;
        for (uint256 i = 1; i <= storefront.orderItemCount; i++) {
            if (storefront.orderItems[i].orderId == _orderId) {
                if (count < 100) {
                    orderItems[count] = storefront.orderItems[i];
                    count++;
                } else {
                    break;
                }
            }
        }
        return orderItems;
    }

    /**
     * @dev Allows the owner to upgrade the contract.
     * @param newImplementation The address of the new implementation contract.
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
