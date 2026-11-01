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

| | Sepolia |
|---|---|
| ALUAssetRegistry | [0x9f92D707a21A3212aBCd5Fd22E74A6fEBA19e63f](https://sepolia.etherscan.io/address/0x9f92D707a21A3212aBCd5Fd22E74A6fEBA19e63f) |
| ALULogoToken | [0xD5B6E32ac49F4dC38F429773b5AA1C49e50CcA75](https://sepolia.etherscan.io/address/0xD5B6E32ac49F4dC38F429773b5AA1C49e50CcA75) |
| Logo registration (token 1) | [0x1fd1670e63c441deff...](https://sepolia.etherscan.io/tx/0x1fd1670e63c441deff6de9a121d2bc934a3d22db063873314663d949fbf4424a) |
| Deployer and logo owner | [0xA105E8D690313a5ffad15f807f108a3d011Eb79D](https://sepolia.etherscan.io/address/0xA105E8D690313a5ffad15f807f108a3d011Eb79D) |

Both contracts are verified on Etherscan: the source code is readable in each contract's Contract tab, and the view functions can be called from Read Contract. The same addresses are in [q2_alu_logo_registry/deployments/sepolia.json](q2_alu_logo_registry/deployments/sepolia.json).

## Screenshots

| File | Shows |
|---|---|
| [images/q2_01_hardhat_node.png](images/q2_01_hardhat_node.png) | the local node and its test wallet addresses |
| [images/q2_02a_logo_hash_sha256sum.png](images/q2_02a_logo_hash_sha256sum.png) | the SHA-256 hash of the ALU logo from sha256sum |
| [images/q2_02b_logo_hash_script.png](images/q2_02b_logo_hash_script.png) | the same hash from scripts/hash-logo.js |
| [images/q2_03_compile.png](images/q2_03_compile.png) | compiling the contracts |
| [images/q2_04_tests.png](images/q2_04_tests.png) | the 8 required tests passing |
| [images/q2_05_deploy_local.png](images/q2_05_deploy_local.png) | deployment and logo registration on the local node |
| [images/q2_06a_deploy_sepolia.png](images/q2_06a_deploy_sepolia.png) | deployment on Sepolia |
| [images/q2_06b_sepolia_json.png](images/q2_06b_sepolia_json.png) | the saved Sepolia addresses |
| [images/q2_07_etherscan.png](images/q2_07_etherscan.png) | the registration transaction on Etherscan |
| [images/q2_08a_remix_verify_true.png](images/q2_08a_remix_verify_true.png) | verifyLogoIntegrity in Remix on Sepolia with the real hash: true |
| [images/q2_08b_remix_verify_false.png](images/q2_08b_remix_verify_false.png) | verifyLogoIntegrity in Remix on Sepolia with a wrong hash: false |
| [images/q2_09a_remix_distribute.png](images/q2_09a_remix_distribute.png) | distributeShares of 100,000 ALUT from Remix on Sepolia |
| [images/q2_09b_etherscan_distribute.png](images/q2_09b_etherscan_distribute.png) | that transfer on Etherscan |
| [images/q2_09c_remix_ownership_owner.png](images/q2_09c_remix_ownership_owner.png) | ownershipPercentage of the logo owner: 90 |
| [images/q2_09d_remix_ownership_recipient.png](images/q2_09d_remix_ownership_recipient.png) | ownershipPercentage of the recipient: 10 |

Screenshots for the exchange report are listed in [q1_exchange_exploration/README.md](q1_exchange_exploration/README.md).
