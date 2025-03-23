import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { teeApi } from '../api/tee'
import { useGuessContract } from '../hooks/useGuessContract'
import { TeeKeyStatus } from './TeeKeyStatus'
import { ClaimReward } from './ClaimReward'

export function GuessGame() {
  const { contractAddress: GuessAddress } = useGuessContract()
  const { address } = useAccount()
  const [isTeeKeyRegistered, setIsTeeKeyRegistered] = useState(false)
  const [guess, setGuess] = useState('')
  const [currentRound, setCurrentRound] = useState<number | null>(null)
  const [result, setResult] = useState<{
    type: 'TooHigh' | 'TooLow' | 'Correct'
    winningOutput?: {
      messageBytes: Uint8Array
      signature: Uint8Array
    }
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rewardClaimed, setRewardClaimed] = useState(false)

  useEffect(() => {
    if (isTeeKeyRegistered) {
      teeApi.getRound(GuessAddress).then(setCurrentRound).catch(console.error)
    }
  }, [isTeeKeyRegistered])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) return

    setError(null)
    setIsSubmitting(true)

    try {
      const response = await teeApi.guessNumber(GuessAddress, address, Number(guess))
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting your guess')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getResultMessage = () => {
    if (!result) return null
    
    switch (result.type) {
      case 'TooHigh':
        return <span className="text-red-600">Too high! Try a lower number.</span>
      case 'TooLow':
        return <span className="text-red-600">Too low! Try a higher number.</span>
      case 'Correct':
        return <span className="text-green-600">Correct! You can now claim your reward.</span>
      default:
        return null
    }
  }

  const handleNextRound = async () => {
    if (!rewardClaimed) {
      const confirmNext = window.confirm('You haven\'t claimed your reward yet. Are you sure you want to proceed to the next round?')
      if (!confirmNext) return
    }
    const newRound = await teeApi.getRound(GuessAddress)
    setCurrentRound(newRound)
    setGuess('')
    setResult(null)
    setRewardClaimed(false)
  }

  if (address) {
    return (
      <div className="space-y-6">
        <TeeKeyStatus onRegistrationChange={setIsTeeKeyRegistered}/>

        {isTeeKeyRegistered ? (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h2 className="font-medium text-yellow-800 mb-2">How to Play:</h2>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>Enter a number between 1 and 20.</li>
            <li>If you guess correctly, you win a reward!</li>
            <li>The number changes after each correct guess.</li>
          </ul>
        </div>
  
        {currentRound !== null && (
          <div className="text-sm text-gray-600">
            Current Round: {currentRound}
          </div>
        )}
  
        {(result === null || result.type !== 'Correct') && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
    
            <div>
              <label htmlFor="guess" className="block text-sm font-medium text-gray-700">
                Your Guess
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="guess"
                  value={guess}
                  onChange={(e) => {
                    const val = e.target.value
                    if (!val || (Number(val) >= 1 && Number(val) <= 20)) {
                      setGuess(val)
                    }
                  }}
                  min="1"
                  max="20"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter a number (1-20)"
                  required
                />
              </div>
            </div>
    
            <button
              type="submit"
              disabled={isSubmitting || !guess}
              className={`
                w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                ${isSubmitting || !guess
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              `}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                'Submit Guess'
              )}
            </button>
          </form>
        )}

        {result && (
            <div className={`p-3 text-sm rounded-md
              ${result.type === 'Correct' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-yellow-50 border border-yellow-200'}`}>
              {getResultMessage()}
            </div>
        )}
  
        {result && result.type === 'Correct' && (
          <div className="space-y-6">
            <ClaimReward
              round={currentRound!}
              winningNumber={Number(guess)}
              signature={result.winningOutput!.signature}
              onClaimStateChange={setRewardClaimed}
            />

            <div>
              {!rewardClaimed && (
                <div className="mb-4 p-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md">
                  ⚠️ Don't forget to claim your reward before proceeding to the next round!
                </div>
              )}
              <button
                onClick={handleNextRound}
                className={`px-3 py-2 text-sm font-medium rounded-md text-white ${
                  rewardClaimed ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400'
                }`}
              >
                Next Round
              </button>
            </div>
          </div>
        )}

      </div>
        ) : (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              You must submit attestation to register TEE key first before playing the game.
            </p>

            <p className="text-sm text-yellow-800"> 
              If you need test tokens, click <a href="https://www.l2faucet.com/automata" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">here</a> to get your wallet funded. 
            </p>
          </div>
        )}
      </div>
    )
  } else {
    return null
  }
}
