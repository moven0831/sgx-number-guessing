# Guess Game Web-UI

Once you have completed and deployed `Guess.sol` to Automata Testnet. You are ready to run the web-ui locally on your machine.

Before you begin, make sure you have both [`Node`](https://nodejs.org/en) and [`npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.

Install the dependencies, by running:

```bash
npm install
```

After installing the dependencies, create `.env` with the provided example.

```bash
cp .env.example .env
```

Provide the following values to the environment:

```
VITE_TEE_SERVER_URL=
VITE_GUESS_CONTRACT_ADDRESS=
```

Serve the web UI at http://localhost:3000

```bash
npm run dev
```