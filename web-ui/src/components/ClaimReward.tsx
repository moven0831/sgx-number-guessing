import { useState } from 'react'
import { useGuessContract } from '../hooks/useGuessContract'

interface ClaimRewardProps {
  round: number
  winningNumber: number
  signature: Uint8Array
}

export function ClaimReward({ round, winningNumber, signature }: ClaimRewardProps) {
  const { claimReward } = useGuessContract()
  const [isClaiming, setIsClaiming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [claimed, setClaimed] = useState(false)

  const handleClaim = async () => {
    if (claimed) return
    setError(null)
    setIsClaiming(true)

    try {
      // Submit reward claim
      await claimReward(round, winningNumber, signature)
      setClaimed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim reward')
    } finally {
      setIsClaiming(false)
    }
  }

  if (claimed) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-600 font-medium">🎉 Reward claimed successfully!</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
      <p className="text-sm text-green-600 font-medium">
        🎯 Congratulations! You guessed correctly.
      </p>

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
