import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";

export const automataTestnet = {
  id: 1_398_243,
  name: 'Automata Testnet',
  network: 'automata-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ATA',
    symbol: 'ATA',
  },
  rpcUrls: {
    default: { 
      http: ['https://1rpc.io/ata/testnet']
    },
    public: {
      http: ['https://1rpc.io/ata/testnet']
    },
  },
  blockExplorers: {
    default: {
      name: 'Automata Testnet Explorer',
      url: 'https://explorer-testnet.ata.network',
    },
  },
} as const;

export const config = createConfig({
  chains: [automataTestnet],
  connectors: [
    injected()
  ],
  transports: {
    [automataTestnet.id]: http(),
  },
});
