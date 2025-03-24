import './App.css'
import { WalletConnect } from './components/WalletConnect'
import { NetworkCheck, useIsCorrectNetwork } from './components/NetworkCheck'
import { GuessGame } from './components/GuessGame'
import { useAccount } from 'wagmi'

function App() {
  const { isConnected } = useAccount()
  const isCorrectNetwork = useIsCorrectNetwork()
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            SGX Number Guessing Game
          </h1>
        </header>

        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <NetworkCheck />
            <WalletConnect className="mt-4" />
          </div>

          {isConnected && isCorrectNetwork && <GuessGame />}
        </div>
      </div>
    </div>
  )
}

export default App
