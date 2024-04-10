import { ethers } from "ethers";

// Generate a random private key
export function generatePrivateKey() {
  const randomBytes = ethers.randomBytes(32); // Generate 32 random bytes
  const privateKey = ethers.hexlify(randomBytes); // Convert bytes to hexadecimal string
  return privateKey;
}
