import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { teeApi } from '../api/tee'
import { useGuessContract } from '../hooks/useGuessContract'
import { useDcapPortal } from '../hooks/useDcapPortal'

export function TeeKeyStatus() {
  const { address } = useAccount()
  const { checkSignerRegistration } = useGuessContract()
  const { verifyAndAttestOnChain } = useDcapPortal()
  
  const [teeAddress, setTeeAddress] = useState<string | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [isGettingAttestation, setIsGettingAttestation] = useState(false)
  const [isAttesting, setIsAttesting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch TEE signer address and check registration status
  const fetchTeeStatus = async () => {
    try {
      const address = await teeApi.getSignerAddress()
      setTeeAddress(address)
      const registered = await checkSignerRegistration(address)
      setIsRegistered(registered)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch TEE status')
    }
  }

  useEffect(() => {
    if (address) {
      fetchTeeStatus()
    }
  }, [address])

  const handleRotateKey = async () => {
    if (!address) return
    setError(null)
    setIsRotating(true)

    let confirmMessage = 'Are you sure you want to rotate TEE keys? This action will invalidate all previous attestations.'
    
    if (window.confirm(confirmMessage)) {
      try {
        const newAddress = await teeApi.rotateKey()
        setTeeAddress(newAddress)
        setIsRegistered(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to rotate key')
      }
    }

    setIsRotating(false)
  }

  const handleGetDcap = async () => {
    if (!address || !teeAddress) return
    setError(null)
    setIsGettingAttestation(true)

    try {
      // Get attestation quote and verify on-chain
      const quote = await teeApi.getSignerAttestation()

      // once users have the quote, prompt them to save as a binary file

      // Create a blob from the Uint8Array
      const blob = new Blob([quote], { type: 'application/octet-stream' })

      // Create a URL for the blob
      const url = URL.createObjectURL(blob)

      // Create a temporary download link
      const downloadLink = document.createElement('a')
      downloadLink.href = url
      downloadLink.download = `quote-${teeAddress}.bin`
      downloadLink.style.display = 'none'

      // Append to document, trigger click, and remove
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)

      // Clean up the URL object
      URL.revokeObjectURL(url)

      // const guessContractAddress = import.meta.env.VITE_GUESS_CONTRACT_ADDRESS
      // if (!guessContractAddress) throw new Error('GUESS_CONTRACT_ADDRESS not set')

      // await verifyAndAttestOnChain(quote, guessContractAddress)
      // setIsRegistered(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to attest TEE')
    }

    setIsGettingAttestation(false)
  }

  const handleAttestKey = async() => {
    if (!address || !teeAddress) return
    setError(null)
    setIsAttesting(true)

    try {
      const guessContractAddress = import.meta.env.VITE_GUESS_CONTRACT_ADDRESS
      if (!guessContractAddress) throw new Error('GUESS_CONTRACT_ADDRESS not set')
      
      // prompt users to upload binary file and read it as a Uint8Array
      // Show a prompt to the user
      alert("You must request and download the DCAP quote for the key before proceeding.")
      // Create a hidden file input
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = '.bin'
      fileInput.style.display = 'none'
      document.body.appendChild(fileInput)

      // Promisify the file selection
      const quoteData = await new Promise<Uint8Array>((resolve, reject) => {
        fileInput.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0]
          if (!file) {
            reject(new Error('No file selected'))
            return
          }
          
          try {
            const arrayBuffer = await file.arrayBuffer()
            const uint8Array = new Uint8Array(arrayBuffer)
            resolve(uint8Array)
          } catch (error) {
            reject(error || new Error('Failed to read file'))
          } finally {
            document.body.removeChild(fileInput)
          }
        }
        
        fileInput.onerror = () => {
          document.body.removeChild(fileInput)
          reject(new Error('File selection failed'))
        }
        
        // Trigger file selection dialog
        fileInput.click()
      })

      await verifyAndAttestOnChain(quoteData, guessContractAddress)
      
      const keyIsRegistered = await checkSignerRegistration(teeAddress)
      setIsRegistered(keyIsRegistered)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to attest TEE')
    }
      
    setIsAttesting(false)
  }

  return (
    <div className="p-4 rounded-lg bg-white border border-gray-200 space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">TEE Status</h3>
        {teeAddress ? (
          <>
            <p className="text-sm text-gray-600">
              Current TEE Address: <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{teeAddress}</code>
            </p>
            <p className="text-sm">
              Status:{' '}
              {isRegistered ? (
                <span className="text-green-600 font-medium">Registered</span>
              ) : (
                <span className="text-yellow-600 font-medium">Not Registered</span>
              )}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-600">Loading TEE status...</p>
        )}
      </div>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleRotateKey}
          disabled={isRotating || isAttesting}
          className={`
            px-3 py-2 text-sm font-medium rounded-md
            ${isRotating || isAttesting
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          {isRotating ? 'Rotating Key...' : 'Rotate Key'}
        </button>

        {!isRegistered && (
          <button
            onClick={handleGetDcap}
            disabled={!teeAddress || isRotating || isAttesting || isGettingAttestation}
            className={`
              px-3 py-2 text-sm font-medium rounded-md
              ${!teeAddress || isRotating || isAttesting || isGettingAttestation
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {isGettingAttestation ? 'Getting Attestation Report...' : 'Get Attestation Report'}
          </button>
        )}

        {!isRegistered && (
          <button
            onClick={handleAttestKey}
            disabled={!teeAddress || isRotating || isAttesting || isGettingAttestation}
            className={`
              px-3 py-2 text-sm font-medium rounded-md
              ${!teeAddress || isRotating || isAttesting || isGettingAttestation
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {isAttesting ? 'Attesting...' : 'Attest Key Onchain'}
          </button>
        )}
      </div>
    </div>
  )
}
