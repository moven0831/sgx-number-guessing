import { useSwitchChain, useAccount } from 'wagmi'
import { automataTestnet } from '../config/wagmi'
import { useState } from 'react'

export function useIsCorrectNetwork() {
  const { chainId, isConnected } = useAccount()
  return isConnected && chainId === automataTestnet.id
}

export function NetworkCheck() {
  const { chainId, isConnected } = useAccount()
  const { switchChain, isPending } = useSwitchChain()
  const [error, setError] = useState<string>('')

  if (!isConnected) return null
  if (chainId === automataTestnet.id) return null

  const handleNetworkSwitch = async () => {
    try {
      setError('')
      await switchChain({ chainId: automataTestnet.id })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch network')
    }
  }

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <p className="text-sm text-yellow-800">
            Please switch to {automataTestnet.name} to play the game
          </p>
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
        <button
          onClick={handleNetworkSwitch}
          disabled={isPending}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            isPending 
              ? 'bg-yellow-50 text-yellow-400 cursor-not-allowed'
              : 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
          }`}
        >
          {isPending ? 'Switching...' : 'Switch Network'}
        </button>
      </div>
    </div>
  )
}
