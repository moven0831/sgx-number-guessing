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

  async getSignerAddress(): Promise<string> {
    return this.rpcCall<string>('get_signer_address')
  }

  async getRound(): Promise<number> {
    return this.rpcCall<number>('get_round')
  }

  async getSignerAttestation(): Promise<Uint8Array> {
    const result = await this.rpcCall<number[]>('get_signer_attestation')
    return new Uint8Array(result)
  }

  async guessNumber(userAddress: string, number: number): Promise<GuessResponse> {
    const result = await this.rpcCall<{
      type: 'Correct' | 'TooHigh' | 'TooLow'
      winningOutput?: {
        message_bytes: number[]
        signature: number[]
      }
    }>('guess_number', [userAddress, number])

    // Transform the response to match our interface
    if (result.type === 'Correct' && result.winningOutput) {
      return {
        type: 'Correct',
        winningOutput: {
          messageBytes: new Uint8Array(result.winningOutput.message_bytes),
          signature: new Uint8Array(result.winningOutput.signature),
        },
      }
    }

    return { type: result.type }
  }

  async rotateKey(): Promise<string> {
    return this.rpcCall<string>('rotate_key')
  }
}

// Export singleton instance
export const teeApi = new TeeApi()
