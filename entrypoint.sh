#!/bin/bash

# Function to install Node.js modules
install_node_modules() {
    echo "Installing Node.js modules..."
    npm cache clean --force
    npm install
}

# Function to run Hardhat commands
run_hardhat() {
    echo "Running Hardhat commands..."
    npm install hardhat@^2.19.0 @nomicfoundation/hardhat-toolbox@^5.0.0
    # Add more Hardhat commands here if needed
    npx hardhat compile
}

# Main entry point
main() {
    install_node_modules
    run_hardhat
    echo "Node.js modules installation and Hardhat commands completed."
    echo "Starting the application..."
    exec "$@"
}

# Call the main function with any command-line arguments passed to the script
main "$@"
