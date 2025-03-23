import { useState, useEffect, useCallback } from 'react'
import { BytesLike } from 'ethers';
import { usePublicClient } from 'wagmi'
import { useGuessContract } from '../hooks/useGuessContract'
import guessNFTAbi from '../abi/GuessNFT.json'

const NFT_CONTRACT_ADDRESS = '0xef43fd7cfe8125683978c131b988dcf7d4344530'

interface ClaimRewardProps {
  round: number
  winningNumber: number
  signature: Uint8Array
  onClaimStateChange?: (claimed: boolean) => void
}

export function ClaimReward({ round, winningNumber, signature, onClaimStateChange }: ClaimRewardProps) {
  const { claimReward } = useGuessContract()
  const [isClaiming, setIsClaiming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [claimed, setClaimed] = useState(false)
  const [tokenId, setTokenId] = useState<BytesLike | null>(null)
  const [nftMetadata, setNftMetadata] = useState<{ name: string; image: string, description: string } | null>(null)

  const publicClient = usePublicClient()
  
  const fetchTokenURI = useCallback(async (id: BytesLike) => {
    if (!id || !publicClient) return
    
    try {
      const tokenURI = await publicClient.readContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: guessNFTAbi,
        functionName: 'tokenURI',
        args: [id],
      })
      
      if (tokenURI) {
        try {
          const metadata = JSON.parse(tokenURI as string)
          setNftMetadata(metadata)
        } catch (err) {
          console.error('Error parsing NFT metadata:', err)
        }
      }
    } catch (err) {
      console.error('Error fetching token URI:', err)
    }
  }, [publicClient])
  
  // Fetch token URI when tokenId changes
  useEffect(() => {
    if (tokenId !== null) {
      fetchTokenURI(tokenId)
    }
  }, [tokenId, fetchTokenURI])

  const handleClaim = async () => {
    if (claimed) return
    setError(null)
    setIsClaiming(true)

    try {
      // Submit reward claim
      const txHash = await claimReward(round, winningNumber, signature)
      if (!publicClient) {
        throw new Error('WagmiError: Public client not available')
      }
      
      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })

      if (receipt.status === 'success') {
        // Get tokenId from events
        const tokenId = receipt.logs[0]?.topics[3]
        if (tokenId) {
          setTokenId(tokenId)
        }
        setClaimed(true)
        onClaimStateChange?.(true)
      } else {
        throw new Error('Transaction Failed')
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim reward')
    }

    setIsClaiming(false)
  }

  if (claimed) {

    let tokenIdDecimalString = BigInt(tokenId as string).toString()

    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
        <p className="text-sm text-green-600 font-medium">🎉 Reward claimed successfully!</p>
        
        {/* NFT Display */}
        {nftMetadata && (
          <div className="space-y-3">
            <div className="w-full max-w-md mx-auto rounded-lg overflow-hidden border border-gray-200">
              <div
                className="w-full"
                dangerouslySetInnerHTML={{ 
                  __html: atob(nftMetadata.image.replace('data:image/svg+xml;base64,', ''))
                }}
              />
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">{nftMetadata.name}</p>
              <p className="text-sm text-gray-600 mb-2">{nftMetadata.description}</p>
              <a
                href={`https://explorer-testnet.ata.network/token/${NFT_CONTRACT_ADDRESS}/instance/${tokenIdDecimalString}`}
                target="_blank"
                rel="noopener noreferrer" 
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                View on Explorer →
              </a>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
      <div className="space-y-4">
        <p className="text-sm text-green-600 font-medium">
          🎯 Congratulations! You guessed correctly.
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <button
        onClick={handleClaim}
        disabled={isClaiming}
        className={`
          px-3 py-2 text-sm font-medium rounded-md
          ${isClaiming
            ? 'bg-green-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'}
        `}
      >
        {isClaiming ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Claiming Reward...
          </div>
        ) : (
          'Claim Reward'
        )}
      </button>

      <p className="text-xs text-green-600 text-center">
        Round: {round} • Number: {winningNumber}
      </p>
    </div>
  )
}
