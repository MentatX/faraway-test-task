import { BaseError } from 'viem'
import { useContractWrite, useWaitForTransaction } from 'wagmi'

import { factoryContractConfig } from './contracts'
import { stringify } from '../utils/stringify'

export function CreateCollection() {
  const { write, data, error, isLoading, isError } = useContractWrite({
    ...factoryContractConfig,
    functionName: 'createCollection',
  })
  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
  } = useWaitForTransaction({ hash: data?.hash })

  return (
    <>
      <h3>Create Collection</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const collectionName = formData.get('collectionName') as string
          const collectionSymbol = formData.get('collectionSymbol') as string
          write({
            args: [collectionName, collectionSymbol],
          })
        }}
      >
        <input name="collectionName" placeholder="name" />
        <input name="collectionSymbol" placeholder="symbol" />
        <button disabled={isLoading} type="submit">
          Create
        </button>
      </form>

      {isLoading && <div>Check wallet...</div>}
      {isPending && <div>Transaction pending...</div>}
      {isSuccess && (
        <>
          <div>Transaction Hash: {data?.hash}</div>
          {/* <div>
            Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
          </div> */}
        </>
      )}
      {isError && <div>{(error as BaseError)?.shortMessage}</div>}
    </>
  )
}
