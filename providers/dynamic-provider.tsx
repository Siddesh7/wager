"use client";

import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import {DynamicWagmiConnector} from "@dynamic-labs/wagmi-connector";
import {createConfig, WagmiProvider} from "wagmi";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {http} from "viem";
import {gnosisChiado, mainnet} from "viem/chains";

import {EthereumWalletConnectors} from "@dynamic-labs/ethereum";

const config = createConfig({
  chains: [gnosisChiado],
  transports: {
    [gnosisChiado.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function DynamicProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "d4eb7ec5-0a96-4166-99f6-e5bc52dd41f3",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
