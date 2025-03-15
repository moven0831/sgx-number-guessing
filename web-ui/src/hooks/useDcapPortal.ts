import { useCallback } from 'react'
import { usePublicClient, useWalletClient } from 'wagmi'
import { automataTestnet } from '../config/wagmi'
import GuessAbi from '../abi/guess.json'

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

    // Call verifyAndAttestOnChain on DCAP Portal
    // This will internally trigger attestAndSetSigner on the Guess contract if verification passes
    const { request } = await publicClient.simulateContract({
      account: walletClient.account.address,
      address: portalAddress as `0x${string}`,
      abi: [{
        name: 'verifyAndAttestOnChain',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'quote', type: 'bytes' },
          { name: 'callback', type: 'tuple', components: [
            { name: 'target', type: 'address' },
            { name: 'extraData', type: 'bytes' }
          ]}
        ],
        outputs: [],
      }],
      functionName: 'verifyAndAttestOnChain',
      args: [
        `0x${Buffer.from(quote).toString('hex')}` as `0x${string}`,
        {
          target: guessContractAddress as `0x${string}`,
          extraData: '0x' as `0x${string}` // No extra data needed for attestAndSetSigner
        }
      ]
    })

    return walletClient.writeContract(request)
  }, [walletClient, publicClient, portalAddress])

  return {
    verifyAndAttestOnChain,
  }
}
