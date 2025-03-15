import './App.css'
import { WalletConnect } from './components/WalletConnect'
import { NetworkCheck } from './components/NetworkCheck'
import { GuessGame } from './components/GuessGame'
import { automataTestnet } from './config/wagmi'

function App() {
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
            <NetworkCheck chainId={automataTestnet.id} />
            <WalletConnect className="mt-4" />
          </div>

          <GuessGame />
        </div>
      </div>
    </div>
  )
}

export default App
