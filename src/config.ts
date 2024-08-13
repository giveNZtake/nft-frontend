import { http, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

export const projectId = "291acc201bb4795913ea996cfc44335e";

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
  connectors: [
    injected({ shimDisconnect: true }),
    walletConnect({ projectId, showQrModal: false }),
  ],
});
