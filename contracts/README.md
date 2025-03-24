# Guess Game Contracts

Before you begin, make sure you install [Foundry](https://book.getfoundry.sh/getting-started/installation).

This branch provides the complete implementation of `Guess.sol`, to try out building your own implementation, check out to the [`workshop`](https://github.com/preston4896/sgx-guess/blob/workshop/contracts/src/Guess.sol) branch.

---

Compile the contract:

```
forge build
```

Test the contract:

```
forge test
```

Then finally, perform the following steps to deploy the contract.

Step 1: Configure keystore

> ℹ️ **NOTE**: Click [here](https://www.l2faucet.com/) to request ATA testnet tokens.

```bash
cast wallet import -k keystore DEPLOYER --interactive
```

Step 2: Create `.env` using the provided example

```bash
cp .example.env .env
```

Step 3: Fill in missing `env` values, then source it

```bash
source .env
```

Step 4: Run the deployment script

```bash
forge script GuessScript --rpc-url $RPC_URL --keystore keystore/DEPLOYER -vvvv --broadcast --sig "deployGuess(address)" <NFT_ADDRESS>
```