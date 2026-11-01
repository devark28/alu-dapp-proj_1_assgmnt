# Protecting the ALU Logo on Ethereum

Two parts of one project on digital assets:

| Folder | Content |
|---|---|
| [q1_exchange_exploration/](q1_exchange_exploration/README.md) | exploring a cryptocurrency exchange: account verification, payment methods, orders, transaction records and security features |
| [q2_alu_logo_registry/](q2_alu_logo_registry/README.md) | a Hardhat project that registers the official ALU logo as an ERC-721 NFT with its SHA-256 fingerprint, and splits its ownership into 1,000,000 ERC-20 shares |

## Question 2 in short

ALU's logo can be copied, edited and claimed by anyone. `ALUAssetRegistry` writes a permanent, timestamped record on Ethereum that ties ALU's wallet to the exact bytes of the official logo file, through the file's SHA-256 hash. Anyone holding a copy of the logo can hash it and ask the contract whether it is the registered original; a copy that differs by a single byte gets "Warning: logo does not match." `ALULogoToken` then splits ownership of that registered logo into 1,000,000 ALUT shares that ALU can distribute to stakeholders.

| | |
|---|---|
| Logo SHA-256 | `0xe03128e7ed668d74c334ed965edf89d0e1b3da112f6aeb6233bfd191ad829348` |
| Solidity | 0.8.28 |
| Hardhat | 2.29.1 |
| OpenZeppelin Contracts | 5.6.1 |
| Tests | 8 required tests and 6 edge-case tests, all passing |

Quick start, from `q2_alu_logo_registry/`:

```
npm install
npx hardhat compile
npx hardhat test
npx hardhat node                                        in a second terminal
npx hardhat run scripts/deploy.js --network localhost
```

Deployment to the Sepolia testnet, verification of the source code and use from Remix are explained step by step in [q2_alu_logo_registry/README.md](q2_alu_logo_registry/README.md).

## Sepolia deployment

| Contract | Address |
|---|---|
| ALUAssetRegistry | `<add after deploying>` |
| ALULogoToken | `<add after deploying>` |

The registration transaction and the contracts can be inspected on [sepolia.etherscan.io](https://sepolia.etherscan.io).

## Screenshots

| File | Shows |
|---|---|
| [images/q2_01_hardhat_node.png](images/q2_01_hardhat_node.png) | the local node and its test wallet addresses |
| [images/q2_02_logo_hash.png](images/q2_02_logo_hash.png) | the SHA-256 hash of the ALU logo |
| [images/q2_03_compile.png](images/q2_03_compile.png) | compiling the contracts |
| [images/q2_04_tests.png](images/q2_04_tests.png) | the 8 required tests passing |
| [images/q2_05_deploy_local.png](images/q2_05_deploy_local.png) | deployment and logo registration on the local node |
| [images/q2_06_deploy_sepolia.png](images/q2_06_deploy_sepolia.png) | deployment on Sepolia |
| [images/q2_07_etherscan.png](images/q2_07_etherscan.png) | the registration transaction on Etherscan |
| [images/q2_08_remix_verify.png](images/q2_08_remix_verify.png) | verifyLogoIntegrity in Remix, true and false |
| [images/q2_09_remix_tokens.png](images/q2_09_remix_tokens.png) | distributeShares and ownershipPercentage in Remix |

Screenshots for the exchange report are listed in [q1_exchange_exploration/README.md](q1_exchange_exploration/README.md).
