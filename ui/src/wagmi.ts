import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { sepolia, goerli, mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const walletConnectProjectId = '2410e2238b4e19e54811b573b32bb8f3'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, ...(import.meta.env?.MODE === 'development' ? [sepolia, goerli] : [])],
  [
    publicProvider(),
  ],
)

const { connectors } = getDefaultWallets({
  appName: 'FairWay Collection',
  chains,
  projectId: walletConnectProjectId,
})

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export { chains }
