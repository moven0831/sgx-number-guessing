package main

import (
	"context"
	"fmt"
	"os"

	"github.com/automata-network/dcap-sdk/packages/godcap"
	"github.com/automata-network/dcap-sdk/packages/godcap/zkdcap"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
)

var ctx = context.Background()

// provide your own Guess address here...
var guessAddr = common.HexToAddress("0x8e90261d08f40d84b83bb8461909ec6ff9c5f984")

func main() {
	// Read wallet private key from env
	privateKeyStr := os.Getenv("PRIVATE_KEY")
	if privateKeyStr == "" {
		println("Please provide the PRIVATE_KEY env var")
		return
	}

	// Initiation
	portal, err := godcap.NewDcapPortal(ctx,
		godcap.WithChainConfig(godcap.ChainAutomataTestnet),
		godcap.WithPrivateKey(privateKeyStr),
	)
	// error handling
	if err != nil {
		fmt.Printf("Failed to instantiate DcapPortal: %v\n", err)
	}

	// generate the callback
	callback := godcap.NewCallbackFromAbiJSON(GuessABI).
		WithParams("attestAndSetSigner").
		WithTo(guessAddr)

	// read quote from file

	var quote []byte
	var tx *types.Transaction

	// you must provide the NETWORK_PRIVATE_KEY env var
	{
		// read the quote
		quote, err = os.ReadFile("./sample/quote.bin")
		if err != nil {
			fmt.Printf("Failed to read quote: %v\n", err)
		}

		// generate proof
		var zkProofType = zkdcap.ZkTypeSuccinct
		zkproof, err := portal.GenerateZkProof(ctx, zkProofType, quote)
		if err != nil {
			fmt.Printf("Failed to generate SP1 Proof: %v\n", err)
		}

		tx, err = portal.VerifyAndAttestWithZKProof(nil, zkproof, callback)
		if err != nil {
			fmt.Printf("Failed to verify SP1 Proof onchain: %v\n", err)
		}
	}

	receipt := <-portal.WaitTx(ctx, tx)
	fmt.Printf("%#v\n", receipt)
}
