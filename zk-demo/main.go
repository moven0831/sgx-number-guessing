package main

import (
	"context"
	"fmt"
	"os"

	// "github.com/automata-network/dcap-sdk/packages/godcap"
	// "github.com/automata-network/dcap-sdk/packages/godcap/zkdcap"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
)

var ctx = context.Background()

// TODO: provide your own Guess address here...
var guessAddr = common.HexToAddress("")

func main() {
	// Read wallet private key from env
	privateKeyStr := os.Getenv("PRIVATE_KEY")
	if privateKeyStr == "" {
		println("Please provide the PRIVATE_KEY env var")
		return
	}

	// Step 1: Instantiate DCAP Portal

	// Step 2: generate the callback

	// read quote from file
	var quote []byte
	var tx *types.Transaction

	// you must provide the NETWORK_PRIVATE_KEY env var
	{
		// Step 3: read the quote
		quote, err = os.ReadFile("./sample/quote.bin")
		if err != nil {
			fmt.Printf("Failed to read quote: %v\n", err)
		}

		// Step 4: generate proof

		// Step 5: sends the proof onchain to be verified

	}

	// Step 6: wait for the transaction to confirm
	receipt := <-portal.WaitTx(ctx, tx)
	fmt.Printf("%#v\n", receipt)
}
