require("@nomicfoundation/hardhat-toolbox");
const { vars } = require("hardhat/config");

// Sepolia settings are read from Hardhat's configuration variables, which are
// stored outside this project (npx hardhat vars set NAME), so the RPC URL and
// the private key never end up in the repository.
const networks = {};
if (vars.has("SEPOLIA_RPC_URL") && vars.has("SEPOLIA_PRIVATE_KEY")) {
  networks.sepolia = {
    url: vars.get("SEPOLIA_RPC_URL"),
    accounts: [vars.get("SEPOLIA_PRIVATE_KEY")],
  };
}

module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "cancun",
    },
  },
  networks,
  // Sourcify verification needs no account. Etherscan is used as well once
  // an API key is set with npx hardhat vars set ETHERSCAN_API_KEY.
  etherscan: {
    enabled: vars.has("ETHERSCAN_API_KEY"),
    apiKey: vars.get("ETHERSCAN_API_KEY", ""),
  },
  sourcify: {
    enabled: true,
  },
};
