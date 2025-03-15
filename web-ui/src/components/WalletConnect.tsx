import { useAccount, useConnect, useDisconnect } from 'wagmi'

interface WalletConnectProps {
  className?: string
}

export function WalletConnect({ className = '' }: WalletConnectProps) {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        <p className="text-sm text-gray-600">
          Connected:{' '}
          <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
            {address.slice(0, 6)}...{address.slice(-4)}
          </code>
        </p>
        <button
          onClick={() => disconnect()}
          className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className={className}>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className={`
            w-full py-2 px-4 rounded-md text-sm font-medium text-white
            ${isPending 
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'}
          `}
        >
          {isPending ? 'Connecting...' : `Connect with ${connector.name}`}
        </button>
      ))}
    </div>
  )
}
