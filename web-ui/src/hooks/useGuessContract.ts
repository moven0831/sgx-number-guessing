import { useCallback } from 'react'
import { usePublicClient, useWalletClient } from 'wagmi'
import { automataTestnet } from '../config/wagmi'
import { hexlify } from 'ethers'
import GuessAbi from '../abi/guess.json'

export function useGuessContract() {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient({ chainId: automataTestnet.id })
  if (!publicClient) throw new Error('Failed to get public client')

  const contractAddress = import.meta.env.VITE_GUESS_CONTRACT_ADDRESS
  if (!contractAddress) {
    throw new Error('VITE_GUESS_CONTRACT_ADDRESS not set')
  }

  const readContract = useCallback(async (functionName: string, args: any[] = []) => {
    return publicClient.readContract({
      address: contractAddress,
      abi: GuessAbi.abi,
      functionName,
      args,
    })
  }, [publicClient])

  const writeContract = useCallback(async (functionName: string, args: any[] = []) => {
    if (!walletClient) throw new Error('Wallet not connected')
    
    const { request } = await publicClient.simulateContract({
      account: walletClient.account.address,
      address: contractAddress,
      abi: GuessAbi.abi,
      functionName,
      args,
    })

    return walletClient.writeContract(request)
  }, [walletClient, publicClient])

  const checkSignerRegistration = useCallback(async (teeAddress: string): Promise<boolean> => {
    const currentSigner = await readContract('signer')
    return currentSigner === teeAddress
  }, [readContract])

  const attestAndSetSigner = useCallback(async () => {
    return writeContract('attestAndSetSigner')
  }, [writeContract])

  const claimReward = useCallback(async (
    round: number,
    winningNumber: number,
    signature: Uint8Array
  ) => {
    const hexSignature = hexlify(signature)
    return writeContract('claimReward', [round, winningNumber, hexSignature])
  }, [writeContract])

  const getNonce = useCallback(async (): Promise<number> => {
    const nonce = await readContract('nonce')
    return Number(nonce)
  }, [readContract])

  return {
    checkSignerRegistration,
    attestAndSetSigner,
    claimReward,
    getNonce,
  }
}
