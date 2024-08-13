import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { ICMetamask, ICWalletConnect } from "./assets";
import { config } from "./config";
import { Mint, Stake } from "./pages";

const queryClient = new QueryClient();

createWeb3Modal({
  wagmiConfig: config,
  projectId: "291acc201bb4795913ea996cfc44335e",
  enableAnalytics: true,
  enableOnramp: true,
  connectorImages: {
    walletConnect: ICWalletConnect,
    injected: ICMetamask,
  },
  themeMode: "light",
  themeVariables: {
    "--w3m-border-radius-master": "2px",
  },
});

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Mint />} />
            <Route path="/staking" element={<Stake />} />
          </Routes>
        </Router>
        <Toaster position="top-right" reverseOrder={false} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
