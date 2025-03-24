# Guess Game Contracts

Before you begin, make sure you install [Foundry](https://book.getfoundry.sh/getting-started/installation).

In this workshop, you will learn about:

- Automata DCAP Portal contract, can be found in the [Automata DCAP SDK](https://github.com/automata-network/dcap-sd) repo.
- Integrate `Guess.sol` with Automata DCAP Portal by importing the `DcapLibCallback` library.
- Guard functions to require a valid DCAP Quote, using `fromDcapPortal` modifier.
- The structure of the Attestation Output that is returned by the Automata DCAP Attestation upon successful DCAP Quote verification, which yields useful information about the quote, such as the TCB Status, TCB Advisory ID, FMSPC, ISV Enclave Report etc.
- The structure of the ISV Enclave Report, this is needed to extract `MRSIGNER`, `MRENCLAVE` and the report data.

Refer to the [`demo`](https://github.com/preston4896/sgx-guess/blob/demo/contracts/src/Guess.sol) branch for a complete example of `Guess.sol`.

Once you have fully implemented `Guess.sol`, run the command to compile the contract:

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