import { useState } from 'react'
import type { Log } from 'viem'
import { useContractEvent } from 'wagmi'

import { usdcContractConfig, factoryContractConfig } from './contracts'
import { stringify } from '../utils/stringify'

export function WatchEvents() {
  const [collectionLogs, setCollectionLogs] = useState<Log[]>([])
  useContractEvent({
    ...factoryContractConfig,
    eventName: 'CollectionCreated',
    listener: (logs) => setCollectionLogs((x) => [...x, ...logs]),
  })

  const [tokenLogs, setTokenLogs] = useState<Log[]>([])
  useContractEvent({
    ...factoryContractConfig,
    eventName: 'TokenMinted',
    listener: (logs) => setTokenLogs((x) => [...x, ...logs]),
  })

  return (
    <div>
      <details>
        <summary>{collectionLogs.length} `CollectionCreated`s logged</summary>
        {collectionLogs
          .reverse()
          .map((log) => stringify(log))
          .join('\n\n\n\n')}
      </details>

      <details>
        <summary>{tokenLogs.length} `TokenMinted`s logged</summary>
        {tokenLogs
          .reverse()
          .map((log) => stringify(log))
          .join('\n\n\n\n')}
      </details>
    </div>
  )
}
