import { useChainId, useSwitchChain } from 'wagmi'
import { automataTestnet } from '../config/wagmi'

interface NetworkCheckProps {
  chainId: number
}

export function NetworkCheck({ chainId }: NetworkCheckProps) {
  const currentChainId = useChainId()
  const { switchChain } = useSwitchChain()

  if (currentChainId === chainId) return null

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <p className="text-sm text-yellow-800">
            Please switch to {automataTestnet.name} to play the game
          </p>
        </div>
        <button
          onClick={() => switchChain?.({ chainId })}
          className="px-3 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200"
        >
          Switch Network
        </button>
      </div>
    </div>
  )
}
