import { useState } from 'react'
import { BaseError } from 'viem'
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

import { factoryContractConfig } from './contracts'
import { useDebounce } from '../hooks/useDebounce'
import { stringify } from '../utils/stringify'

import type { Address } from 'wagmi'

export function MintToken() {
  const [collection, setCollection] = useState('')
  const [recipient, setRecipient] = useState('')
  
  const [tokenId, setTokenId] = useState('')
  const debouncedTokenId = useDebounce(tokenId)
  
  const [tokenUri, setTokenUri] = useState('')
  

  const { config } = usePrepareContractWrite({
    ...factoryContractConfig,
    functionName: 'mintToken',
    enabled: Boolean(debouncedTokenId),
    args: [collection as Address, recipient as Address, BigInt(debouncedTokenId), tokenUri],
  })
  const { write, data, error, isLoading, isError } = useContractWrite(config)
  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
  } = useWaitForTransaction({ hash: data?.hash })

  return (
    <>
      <h3>Mint Token</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          write?.()
        }}
      >
        <input
          placeholder="collection"
          size={40}
          onChange={(e) => setCollection(e.target.value)}
        />
        <input
          placeholder="recipient"
          size={40}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          placeholder="token id"
          size={10}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <input
          placeholder="token URI"
          size={30}
          onChange={(e) => setTokenUri(e.target.value)}
        />
        <button disabled={!write} type="submit">
          Mint
        </button>
      </form>

      {isLoading && <div>Check wallet...</div>}
      {isPending && <div>Transaction pending...</div>}
      {isSuccess && (
        <>
          <div>Transaction Hash: {data?.hash}</div>
          <div>
            Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
          </div>
        </>
      )}
      {isError && <div>{(error as BaseError)?.shortMessage}</div>}
    </>
  )
}
