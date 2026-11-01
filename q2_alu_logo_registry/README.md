# ALU Logo Registry and Tokenisation

This project protects the official ALU logo on the Ethereum blockchain with two Solidity contracts.

`ALUAssetRegistry` is an ERC-721 contract that registers the logo as a unique NFT and stores its SHA-256 fingerprint, the file type, the wallet that registered it and the time of registration. Anyone can later hash a logo file they have and ask the contract whether it matches the registered original, and the same file can never be registered twice.

`ALULogoToken` is an ERC-20 contract that splits ownership of that logo into 1,000,000 ALU Logo Tokens (ALUT). The logo owner receives every token at deployment and can distribute them as shares to stakeholders. The NFT proves which file is the official logo; the tokens record who owns what share of it.

## Registered logo

| | |
|---|---|
| File | `alu-logo.png` (1258 x 228 pixels, PNG) |
| SHA-256 | `0xe03128e7ed668d74c334ed965edf89d0e1b3da112f6aeb6233bfd191ad829348` |

Anyone can check the hash independently:

```
sha256sum alu-logo.png
```

or, on any system with Node.js, from this folder:

```
node scripts/hash-logo.js alu-logo.png
```

Both print `e03128e7ed668d74c334ed965edf89d0e1b3da112f6aeb6233bfd191ad829348` (the scripts add the `0x` prefix that a Solidity `bytes32` argument takes). Changing a single byte of the file gives a completely different hash.

## Deployed on Sepolia

| | Address |
|---|---|
| ALUAssetRegistry | [0x9f92D707a21A3212aBCd5Fd22E74A6fEBA19e63f](https://sepolia.etherscan.io/address/0x9f92D707a21A3212aBCd5Fd22E74A6fEBA19e63f) |
| ALULogoToken | [0xD5B6E32ac49F4dC38F429773b5AA1C49e50CcA75](https://sepolia.etherscan.io/address/0xD5B6E32ac49F4dC38F429773b5AA1C49e50CcA75) |
| Logo registration (token 1) | [transaction 0x1fd1670e...4424a](https://sepolia.etherscan.io/tx/0x1fd1670e63c441deff6de9a121d2bc934a3d22db063873314663d949fbf4424a) |

Both contracts are verified on Etherscan, so the source code can be read there. Anyone can call `verifyLogoIntegrity(1, 0xe03128e7ed668d74c334ed965edf89d0e1b3da112f6aeb6233bfd191ad829348)` on the registry from Etherscan's Read Contract tab or from Remix and get `true, "Logo is authentic."`.

## Versions

| Tool | Version |
|---|---|
| Solidity | 0.8.28, optimizer on (200 runs), EVM version `cancun` |
| Hardhat | 2.29.1, with `@nomicfoundation/hardhat-toolbox` 6.1.2 (ethers v6, Mocha, Chai) |
| OpenZeppelin Contracts | 5.6.1 |
| Node.js | 24.18 (any current LTS release works) |

## Install

```
npm install
```

This installs Hardhat, the toolbox and OpenZeppelin at the exact versions in `package.json`.

## Compile

```
npx hardhat compile
```

## Run the tests

```
npx hardhat test test/ALUAssetRegistry.test.js    the 8 required tests
npx hardhat test                                   all 14 tests, including edge cases
```

## Deploy on a local blockchain

In one terminal, start a local Ethereum node. It prints 20 test accounts with 10,000 test ETH each:

```
npx hardhat node
```

In a second terminal, deploy both contracts to it:

```
npx hardhat run scripts/deploy.js --network localhost
```

The script hashes `alu-logo.png`, deploys `ALUAssetRegistry`, registers the logo with that hash, checks it with `verifyLogoIntegrity`, deploys `ALULogoToken` with the deployer as logo owner, and saves the addresses to `deployments/localhost.json`.

## Deploy on the Sepolia testnet

Sepolia needs an RPC URL (from an Alchemy app on Ethereum Sepolia) and the private key of a MetaMask account that holds Sepolia ETH. Store both with Hardhat's configuration variables, which live in your user folder rather than in this project, so they never reach Git:

```
npx hardhat vars set SEPOLIA_RPC_URL
npx hardhat vars set SEPOLIA_PRIVATE_KEY
```

Each command asks for the value. Use a wallet made for testing, never one that holds real funds. Then deploy:

```
npx hardhat run scripts/deploy.js --network sepolia
```

The addresses are saved to `deployments/sepolia.json`. To publish the verified source code on Etherscan, so anyone can read it and call the view functions from the browser, create a free API key at etherscan.io (My Account, then API Keys), store it, and verify both contracts:

```
npx hardhat vars set ETHERSCAN_API_KEY
npx hardhat verify --network sepolia <ALUAssetRegistry address>
npx hardhat verify --network sepolia <ALULogoToken address> <deployer address>
```

## Using the contracts in Remix

The deployed contracts can be tested from Remix (remix.ethereum.org) with MetaMask:

1. Create `ALUAssetRegistry.sol` and `ALULogoToken.sol` in Remix with the contents of `contracts/`. Remix fetches the OpenZeppelin imports itself.
2. In the Solidity compiler tab choose 0.8.28, open Advanced Configurations, enable the optimizer with 200 runs, set the EVM version to `cancun`, and compile both files.
3. In Deploy & run transactions, choose the environment "Browser Extension" and, next to it, "Sepolia Testnet - MetaMask" (older Remix versions call it "Injected Provider - MetaMask"). The account box must show your MetaMask address and Sepolia balance; an address starting `0x5B38` with 100 ETH is Remix's built-in test chain, where the deployed contracts do not exist.
4. Select `ALUAssetRegistry`, paste its Sepolia address into the box under the Deploy button ("Load contract from Address") and click At Address; do the same for `ALULogoToken`.
5. Call `verifyLogoIntegrity` with token ID `1` and the hash above (returns true), then with any other hash (returns false). Call `getAsset(1)`, `distributeShares` to another address, and `ownershipPercentage`.

Remix can also deploy the contracts directly: deploy `ALUAssetRegistry`, call `registerAsset("ALU Official Logo", "image/png", <hash>)`, then deploy `ALULogoToken` with your MetaMask address as `logoOwner`.

## Contracts

### ALUAssetRegistry (ERC-721, name "ALU Asset Registry", symbol "ALUAR")

| Member | Description |
|---|---|
| `AssetMetadata` | `name`, `fileType`, `contentHash` (bytes32), `registeredBy`, `registeredAt` (Unix time) |
| `assets(tokenId)` | token ID to its `AssetMetadata` |
| `isHashRegistered(hash)` | true once a file hash has been registered |
| `registerAsset(name, fileType, contentHash)` | rejects an empty value or a hash already registered; mints the next token ID to the caller, saves the metadata, emits `AssetRegistered`, returns the token ID |
| `verifyLogoIntegrity(tokenId, contentHash)` | view: `(true, "Logo is authentic.")` or `(false, "Warning: logo does not match.")` |
| `getAsset(tokenId)` | view: the full `AssetMetadata` |
| `totalAssets()` | view: how many assets are registered |

### ALULogoToken (ERC-20, name "ALU Logo Token", symbol "ALUT")

| Member | Description |
|---|---|
| `constructor(logoOwner)` | mints all 1,000,000 ALUT to `logoOwner`, who also becomes the contract owner |
| `decimals()` | 0, so one token is one share |
| `distributeShares(recipient, amount)` | owner only; rejects zero amounts and the zero address; moves shares from the owner to the recipient and emits `SharesDistributed` |
| `ownershipPercentage(holder)` | view: the holder's share of the supply as a whole percentage, rounded down |

## Files

| Path | Content |
|---|---|
| `contracts/ALUAssetRegistry.sol` | ERC-721 registration contract |
| `contracts/ALULogoToken.sol` | ERC-20 tokenisation contract |
| `scripts/deploy.js` | deploys both contracts and registers the logo |
| `scripts/hash-logo.js` | computes the SHA-256 hash of a file |
| `test/ALUAssetRegistry.test.js` | the 8 required tests |
| `test/EdgeCases.test.js` | 6 more tests: empty inputs, unknown token IDs, access control, rounding |
| `alu-logo.png` | the registered logo file |
| `hardhat.config.js` | compiler settings, Sepolia network and Etherscan verification |
| `deployments/` | addresses written by the deployment script |

## Problems and how they were solved

- **The logo file was WebP, not PNG.** The downloaded ALU logo was a WebP image saved with a `.png` name. Registering it as `image/png` would have recorded a false file type. It was converted losslessly to a real PNG (every pixel is identical), and that PNG is the file that was hashed and registered.
- **OpenZeppelin 5.6 did not compile at first.** The compiler failed with `The "mcopy" instruction is only available for Cancun-compatible VMs`. OpenZeppelin 5.6 uses an instruction added in Ethereum's Cancun upgrade, while Hardhat 2 compiles for an older EVM by default. Setting `evmVersion: "cancun"` fixed it; Sepolia and Remix both support Cancun.
- **The order of steps in registerAsset.** `_safeMint` calls `onERC721Received` on the receiver when the receiver is a contract, which hands control to outside code in the middle of the function. If the hash were only marked as used after minting, that code could call `registerAsset` again with the same hash. The hash and the metadata are therefore saved before `_safeMint` (the checks-effects-interactions pattern).
- **Whole shares, not 18 decimals.** ERC-20 tokens normally have 18 decimals, so `distributeShares(recipient, 100000)` would move 0.0000000000001 ALUT instead of 100,000. Because ALUT represents shares, `decimals()` returns 0 and every amount is a whole number of shares.
- **Sourcify verification failed.** `npx hardhat verify` first tried Sourcify and got `404: API v1 is removed`: Sourcify retired the API version that Hardhat 2's verification plugin (2.1.3, the latest for Hardhat 2) still uses. The contracts were verified on Etherscan instead, whose current API the plugin supports, and Sourcify was turned off in `hardhat.config.js`.
- **npm skipped two install scripts.** npm 11 does not run package install scripts by default and warned about `keccak` and `secp256k1`. Both fall back to pure JavaScript versions, so nothing needed to change.
