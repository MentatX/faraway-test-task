import { useState } from 'react'
import { BaseError } from 'viem'
import { type Address, useContractRead } from 'wagmi'

import { factoryContractConfig } from './contracts'

export function ReadCollections() {
  return (
    <div>
      <div>
        <Collections />
      </div>
    </div>
  )
}

function Collections() {
  const { data, error, isLoading, isSuccess } = useContractRead({
    ...factoryContractConfig,
    functionName: 'collections',
    // enabled: Boolean(address),
  })

  return (
    <div>
       <div>Collections:</div>
      {isLoading && <div>loading...</div>}
      {isSuccess && data?.toString()}
      {error && <div>{(error as BaseError).shortMessage}</div>}
    </div>
  )
}
