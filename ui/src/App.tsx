import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

import { ReadCollections } from './components/ReadCollections'
import { WatchEvents } from './components/WatchEvents'
import { CreateCollection } from './components/CreateCollection'
import { MintToken } from './components/MintToken'

export function App() {
  const { isConnected } = useAccount()

  return (
    <>
      <h3>FaraWay Collections Factory</h3>

      <ConnectButton />

      {isConnected && (
        <>
          <hr />
          <h2>Collections</h2>
          <ReadCollections />
          <br />
          <hr />
          <h2>Watch Contract Events</h2>
          <WatchEvents />
          <br />
          <hr />
          <CreateCollection />
          <br />
          <hr />
          <MintToken />
        </>
      )}
    </>
  )
}
