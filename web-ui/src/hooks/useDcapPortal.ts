import { useCallback } from 'react'
import { usePublicClient, useWalletClient } from 'wagmi'
import { automataTestnet } from '../config/wagmi'
import { Interface } from 'ethers'
import Guess from '../abi/guess.json'
import DcapPortal from '../abi/DcapPortal.json'


export function useDcapPortal() {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient({ chainId: automataTestnet.id })
  if (!publicClient) throw new Error('Failed to get public client')

  const portalAddress = import.meta.env.VITE_DCAP_PORTAL_ADDRESS
  if (!portalAddress) {
    throw new Error('VITE_DCAP_PORTAL_ADDRESS not set')
  }

  const verifyAndAttestOnChain = useCallback(async (
    quote: Uint8Array,
    guessContractAddress: string
  ) => {    
    if (!walletClient) throw new Error('Wallet not connected')

    const guessIface = new Interface(Guess.abi)
    const attestAndSetSignerCalldata = guessIface.encodeFunctionData('attestAndSetSigner', [])
    
    const callback = {
      value: 0,
      to: guessContractAddress,
      params: attestAndSetSignerCalldata
    }

    console.log("simulate before...")

    // Call verifyAndAttestOnChain on DCAP Portal
    // This will internally trigger attestAndSetSigner on the Guess contract if verification passes
    // Convert quote Uint8Array to hexadecimal string
    const quoteHex = '0x' + Array.from(quote)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      
    const { request } = await publicClient.simulateContract({
      account: walletClient.account.address,
      address: portalAddress,
      abi: DcapPortal.abi,
      functionName: 'verifyAndAttestOnChain',
      args: [
        quoteHex,
        callback
      ]
    })

    console.log("simulate after...")

    return walletClient.writeContract(request)
  }, [walletClient, publicClient, portalAddress])

  return {
    verifyAndAttestOnChain,
  }
}
