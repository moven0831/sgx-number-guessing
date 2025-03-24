import { AddressLike } from 'ethers'

type ApiCorrectResponse = {
  Correct: {
    messageBytes: Uint8Array
    signature: Uint8Array
  }
}

type ApiGuessResponse = 'TooHigh' | 'TooLow' | ApiCorrectResponse

export interface GuessResponse {
  type: 'Correct' | 'TooHigh' | 'TooLow'
  winningOutput?: {
    messageBytes: Uint8Array
    signature: Uint8Array
  }
}

export class TeeApi {
  private baseUrl: string

  constructor() {
    const url = import.meta.env.VITE_TEE_SERVER_URL
    if (!url) {
      throw new Error('TEE_SERVER_URL environment variable not set')
    }
    this.baseUrl = url
  }

  private async rpcCall<T>(method: string, params: any[] = []): Promise<T> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    if (data.error) {
      throw new Error(data.error.message || 'RPC call failed')
    }

    return data.result
  }

  async getSignerAttestation(guessAddress?: AddressLike): Promise<Uint8Array> {
    let params = guessAddress ? [guessAddress] : [];
    const result = await this.rpcCall<number[]>('get_attestation', params);
    return new Uint8Array(result)
  }

  async initState(guessAddress: AddressLike): Promise<boolean> {
    try {
      await this.rpcCall<void>('init_state', [guessAddress])
      return true
    } catch (err) {
      throw new Error("Failed to initiate TEE session. You may have provided an invalid VITE_GUESS_CONTRACT_ADDRESS")
    }
  }

  async getSignerAddress(guessAddress: AddressLike): Promise<string> {
    return this.rpcCall<string>('get_signer_address', [guessAddress])
  }

  async getRound(guessAddress: AddressLike): Promise<number> {
    return this.rpcCall<number>('get_round', [guessAddress])
  }

  async guessNumber(guessAddress: AddressLike, userAddress: AddressLike, number: number): Promise<GuessResponse> {
    const result = await this.rpcCall<ApiGuessResponse>('guess_number', [guessAddress, userAddress, number])

    // Transform the response to match our interface
    if (typeof result === 'object' && result.Correct) {
      return {
        type: 'Correct',
        winningOutput: {
          messageBytes: new Uint8Array(result.Correct.messageBytes),
          signature: new Uint8Array(result.Correct.signature),
        },
      }
    }

    const resultType = result as 'TooHigh' | 'TooLow'
    return { type: resultType, winningOutput: undefined }
  }

  async rotateKey(guessAddress: AddressLike): Promise<string> {
    return this.rpcCall<string>('rotate_key', [guessAddress])
  }
}

// Export singleton instance
export const teeApi = new TeeApi()
