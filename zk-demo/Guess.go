// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package main

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
	_ = abi.ConvertType
)

// GuessMetaData contains all meta data concerning the Guess contract.
var GuessMetaData = &bind.MetaData{
	ABI: "[{\"type\":\"constructor\",\"inputs\":[{\"name\":\"_dcapPortal\",\"type\":\"address\",\"internalType\":\"address\"},{\"name\":\"_mrsigner\",\"type\":\"bytes32\",\"internalType\":\"bytes32\"},{\"name\":\"_mrEnclave\",\"type\":\"bytes32\",\"internalType\":\"bytes32\"},{\"name\":\"_nft\",\"type\":\"address\",\"internalType\":\"address\"}],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"attestAndSetSigner\",\"inputs\":[],\"outputs\":[],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"claimReward\",\"inputs\":[{\"name\":\"round\",\"type\":\"uint64\",\"internalType\":\"uint64\"},{\"name\":\"winningNumber\",\"type\":\"uint64\",\"internalType\":\"uint64\"},{\"name\":\"signature\",\"type\":\"bytes\",\"internalType\":\"bytes\"}],\"outputs\":[],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"mrEnclave\",\"inputs\":[],\"outputs\":[{\"name\":\"\",\"type\":\"bytes32\",\"internalType\":\"bytes32\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"mrSigner\",\"inputs\":[],\"outputs\":[{\"name\":\"\",\"type\":\"bytes32\",\"internalType\":\"bytes32\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"nft\",\"inputs\":[],\"outputs\":[{\"name\":\"\",\"type\":\"address\",\"internalType\":\"contractIGuessNFT\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"nonce\",\"inputs\":[],\"outputs\":[{\"name\":\"\",\"type\":\"uint64\",\"internalType\":\"uint64\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"signer\",\"inputs\":[],\"outputs\":[{\"name\":\"\",\"type\":\"address\",\"internalType\":\"address\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"supportsInterface\",\"inputs\":[{\"name\":\"interfaceId\",\"type\":\"bytes4\",\"internalType\":\"bytes4\"}],\"outputs\":[{\"name\":\"\",\"type\":\"bool\",\"internalType\":\"bool\"}],\"stateMutability\":\"view\"},{\"type\":\"event\",\"name\":\"RewardClaimed\",\"inputs\":[{\"name\":\"winner\",\"type\":\"address\",\"indexed\":true,\"internalType\":\"address\"},{\"name\":\"round\",\"type\":\"uint64\",\"indexed\":true,\"internalType\":\"uint64\"},{\"name\":\"guess\",\"type\":\"uint64\",\"indexed\":false,\"internalType\":\"uint64\"}],\"anonymous\":false},{\"type\":\"event\",\"name\":\"SignerUpdated\",\"inputs\":[{\"name\":\"signer\",\"type\":\"address\",\"indexed\":true,\"internalType\":\"address\"}],\"anonymous\":false},{\"type\":\"error\",\"name\":\"CALLER_NOT_DCAP_PORTAL\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"Contract_Mismatch\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"ECDSAInvalidSignature\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"ECDSAInvalidSignatureLength\",\"inputs\":[{\"name\":\"length\",\"type\":\"uint256\",\"internalType\":\"uint256\"}]},{\"type\":\"error\",\"name\":\"ECDSAInvalidSignatureS\",\"inputs\":[{\"name\":\"s\",\"type\":\"bytes32\",\"internalType\":\"bytes32\"}]},{\"type\":\"error\",\"name\":\"INVALID_ATTESTATION_OUTPUT\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"INVALID_ATTESTATION_TEE\",\"inputs\":[{\"name\":\"tee\",\"type\":\"bytes4\",\"internalType\":\"bytes4\"}]},{\"type\":\"error\",\"name\":\"INVALID_BLOCKHASH\",\"inputs\":[{\"name\":\"want\",\"type\":\"bytes32\",\"internalType\":\"bytes32\"},{\"name\":\"got\",\"type\":\"bytes32\",\"internalType\":\"bytes32\"},{\"name\":\"number\",\"type\":\"uint256\",\"internalType\":\"uint256\"}]},{\"type\":\"error\",\"name\":\"INVALID_BLOCKNUMBER\",\"inputs\":[{\"name\":\"current\",\"type\":\"uint256\",\"internalType\":\"uint256\"},{\"name\":\"got\",\"type\":\"uint256\",\"internalType\":\"uint256\"}]},{\"type\":\"error\",\"name\":\"Invalid_Enclave_Signature\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"Invalid_Quote_Body\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"MAGIC_NUMBER_MISMATCH\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"MRENCLAVE_Mismatch\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"MRSIGNER_Mismatch\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"ORIGIN_NOT_ALLOWED\",\"inputs\":[{\"name\":\"\",\"type\":\"address\",\"internalType\":\"address\"}]},{\"type\":\"error\",\"name\":\"SGX_Only\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"UNKNOWN_VERSION\",\"inputs\":[{\"name\":\"\",\"type\":\"uint8\",\"internalType\":\"uint8\"}]}]",
}

// GuessABI is the input ABI used to generate the binding from.
// Deprecated: Use GuessMetaData.ABI instead.
var GuessABI = GuessMetaData.ABI

// Guess is an auto generated Go binding around an Ethereum contract.
type Guess struct {
	GuessCaller     // Read-only binding to the contract
	GuessTransactor // Write-only binding to the contract
	GuessFilterer   // Log filterer for contract events
}

// GuessCaller is an auto generated read-only Go binding around an Ethereum contract.
type GuessCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// GuessTransactor is an auto generated write-only Go binding around an Ethereum contract.
type GuessTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// GuessFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type GuessFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// GuessSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type GuessSession struct {
	Contract     *Guess            // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// GuessCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type GuessCallerSession struct {
	Contract *GuessCaller  // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts // Call options to use throughout this session
}

// GuessTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type GuessTransactorSession struct {
	Contract     *GuessTransactor  // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// GuessRaw is an auto generated low-level Go binding around an Ethereum contract.
type GuessRaw struct {
	Contract *Guess // Generic contract binding to access the raw methods on
}

// GuessCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type GuessCallerRaw struct {
	Contract *GuessCaller // Generic read-only contract binding to access the raw methods on
}

// GuessTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type GuessTransactorRaw struct {
	Contract *GuessTransactor // Generic write-only contract binding to access the raw methods on
}

// NewGuess creates a new instance of Guess, bound to a specific deployed contract.
func NewGuess(address common.Address, backend bind.ContractBackend) (*Guess, error) {
	contract, err := bindGuess(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &Guess{GuessCaller: GuessCaller{contract: contract}, GuessTransactor: GuessTransactor{contract: contract}, GuessFilterer: GuessFilterer{contract: contract}}, nil
}

// NewGuessCaller creates a new read-only instance of Guess, bound to a specific deployed contract.
func NewGuessCaller(address common.Address, caller bind.ContractCaller) (*GuessCaller, error) {
	contract, err := bindGuess(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &GuessCaller{contract: contract}, nil
}

// NewGuessTransactor creates a new write-only instance of Guess, bound to a specific deployed contract.
func NewGuessTransactor(address common.Address, transactor bind.ContractTransactor) (*GuessTransactor, error) {
	contract, err := bindGuess(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &GuessTransactor{contract: contract}, nil
}

// NewGuessFilterer creates a new log filterer instance of Guess, bound to a specific deployed contract.
func NewGuessFilterer(address common.Address, filterer bind.ContractFilterer) (*GuessFilterer, error) {
	contract, err := bindGuess(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &GuessFilterer{contract: contract}, nil
}

// bindGuess binds a generic wrapper to an already deployed contract.
func bindGuess(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := GuessMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Guess *GuessRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Guess.Contract.GuessCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Guess *GuessRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Guess.Contract.GuessTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Guess *GuessRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Guess.Contract.GuessTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Guess *GuessCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Guess.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Guess *GuessTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Guess.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Guess *GuessTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Guess.Contract.contract.Transact(opts, method, params...)
}

// MrEnclave is a free data retrieval call binding the contract method 0x59ba060b.
//
// Solidity: function mrEnclave() view returns(bytes32)
func (_Guess *GuessCaller) MrEnclave(opts *bind.CallOpts) ([32]byte, error) {
	var out []interface{}
	err := _Guess.contract.Call(opts, &out, "mrEnclave")

	if err != nil {
		return *new([32]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)

	return out0, err

}

// MrEnclave is a free data retrieval call binding the contract method 0x59ba060b.
//
// Solidity: function mrEnclave() view returns(bytes32)
func (_Guess *GuessSession) MrEnclave() ([32]byte, error) {
	return _Guess.Contract.MrEnclave(&_Guess.CallOpts)
}

// MrEnclave is a free data retrieval call binding the contract method 0x59ba060b.
//
// Solidity: function mrEnclave() view returns(bytes32)
func (_Guess *GuessCallerSession) MrEnclave() ([32]byte, error) {
	return _Guess.Contract.MrEnclave(&_Guess.CallOpts)
}

// MrSigner is a free data retrieval call binding the contract method 0x2c756087.
//
// Solidity: function mrSigner() view returns(bytes32)
func (_Guess *GuessCaller) MrSigner(opts *bind.CallOpts) ([32]byte, error) {
	var out []interface{}
	err := _Guess.contract.Call(opts, &out, "mrSigner")

	if err != nil {
		return *new([32]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)

	return out0, err

}

// MrSigner is a free data retrieval call binding the contract method 0x2c756087.
//
// Solidity: function mrSigner() view returns(bytes32)
func (_Guess *GuessSession) MrSigner() ([32]byte, error) {
	return _Guess.Contract.MrSigner(&_Guess.CallOpts)
}

// MrSigner is a free data retrieval call binding the contract method 0x2c756087.
//
// Solidity: function mrSigner() view returns(bytes32)
func (_Guess *GuessCallerSession) MrSigner() ([32]byte, error) {
	return _Guess.Contract.MrSigner(&_Guess.CallOpts)
}

// Nft is a free data retrieval call binding the contract method 0x47ccca02.
//
// Solidity: function nft() view returns(address)
func (_Guess *GuessCaller) Nft(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _Guess.contract.Call(opts, &out, "nft")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Nft is a free data retrieval call binding the contract method 0x47ccca02.
//
// Solidity: function nft() view returns(address)
func (_Guess *GuessSession) Nft() (common.Address, error) {
	return _Guess.Contract.Nft(&_Guess.CallOpts)
}

// Nft is a free data retrieval call binding the contract method 0x47ccca02.
//
// Solidity: function nft() view returns(address)
func (_Guess *GuessCallerSession) Nft() (common.Address, error) {
	return _Guess.Contract.Nft(&_Guess.CallOpts)
}

// Nonce is a free data retrieval call binding the contract method 0xaffed0e0.
//
// Solidity: function nonce() view returns(uint64)
func (_Guess *GuessCaller) Nonce(opts *bind.CallOpts) (uint64, error) {
	var out []interface{}
	err := _Guess.contract.Call(opts, &out, "nonce")

	if err != nil {
		return *new(uint64), err
	}

	out0 := *abi.ConvertType(out[0], new(uint64)).(*uint64)

	return out0, err

}

// Nonce is a free data retrieval call binding the contract method 0xaffed0e0.
//
// Solidity: function nonce() view returns(uint64)
func (_Guess *GuessSession) Nonce() (uint64, error) {
	return _Guess.Contract.Nonce(&_Guess.CallOpts)
}

// Nonce is a free data retrieval call binding the contract method 0xaffed0e0.
//
// Solidity: function nonce() view returns(uint64)
func (_Guess *GuessCallerSession) Nonce() (uint64, error) {
	return _Guess.Contract.Nonce(&_Guess.CallOpts)
}

// Signer is a free data retrieval call binding the contract method 0x238ac933.
//
// Solidity: function signer() view returns(address)
func (_Guess *GuessCaller) Signer(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _Guess.contract.Call(opts, &out, "signer")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Signer is a free data retrieval call binding the contract method 0x238ac933.
//
// Solidity: function signer() view returns(address)
func (_Guess *GuessSession) Signer() (common.Address, error) {
	return _Guess.Contract.Signer(&_Guess.CallOpts)
}

// Signer is a free data retrieval call binding the contract method 0x238ac933.
//
// Solidity: function signer() view returns(address)
func (_Guess *GuessCallerSession) Signer() (common.Address, error) {
	return _Guess.Contract.Signer(&_Guess.CallOpts)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_Guess *GuessCaller) SupportsInterface(opts *bind.CallOpts, interfaceId [4]byte) (bool, error) {
	var out []interface{}
	err := _Guess.contract.Call(opts, &out, "supportsInterface", interfaceId)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_Guess *GuessSession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _Guess.Contract.SupportsInterface(&_Guess.CallOpts, interfaceId)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_Guess *GuessCallerSession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _Guess.Contract.SupportsInterface(&_Guess.CallOpts, interfaceId)
}

// AttestAndSetSigner is a paid mutator transaction binding the contract method 0xa83877fb.
//
// Solidity: function attestAndSetSigner() returns()
func (_Guess *GuessTransactor) AttestAndSetSigner(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Guess.contract.Transact(opts, "attestAndSetSigner")
}

// AttestAndSetSigner is a paid mutator transaction binding the contract method 0xa83877fb.
//
// Solidity: function attestAndSetSigner() returns()
func (_Guess *GuessSession) AttestAndSetSigner() (*types.Transaction, error) {
	return _Guess.Contract.AttestAndSetSigner(&_Guess.TransactOpts)
}

// AttestAndSetSigner is a paid mutator transaction binding the contract method 0xa83877fb.
//
// Solidity: function attestAndSetSigner() returns()
func (_Guess *GuessTransactorSession) AttestAndSetSigner() (*types.Transaction, error) {
	return _Guess.Contract.AttestAndSetSigner(&_Guess.TransactOpts)
}

// ClaimReward is a paid mutator transaction binding the contract method 0x43fc7e8e.
//
// Solidity: function claimReward(uint64 round, uint64 winningNumber, bytes signature) returns()
func (_Guess *GuessTransactor) ClaimReward(opts *bind.TransactOpts, round uint64, winningNumber uint64, signature []byte) (*types.Transaction, error) {
	return _Guess.contract.Transact(opts, "claimReward", round, winningNumber, signature)
}

// ClaimReward is a paid mutator transaction binding the contract method 0x43fc7e8e.
//
// Solidity: function claimReward(uint64 round, uint64 winningNumber, bytes signature) returns()
func (_Guess *GuessSession) ClaimReward(round uint64, winningNumber uint64, signature []byte) (*types.Transaction, error) {
	return _Guess.Contract.ClaimReward(&_Guess.TransactOpts, round, winningNumber, signature)
}

// ClaimReward is a paid mutator transaction binding the contract method 0x43fc7e8e.
//
// Solidity: function claimReward(uint64 round, uint64 winningNumber, bytes signature) returns()
func (_Guess *GuessTransactorSession) ClaimReward(round uint64, winningNumber uint64, signature []byte) (*types.Transaction, error) {
	return _Guess.Contract.ClaimReward(&_Guess.TransactOpts, round, winningNumber, signature)
}

// GuessRewardClaimedIterator is returned from FilterRewardClaimed and is used to iterate over the raw logs and unpacked data for RewardClaimed events raised by the Guess contract.
type GuessRewardClaimedIterator struct {
	Event *GuessRewardClaimed // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *GuessRewardClaimedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(GuessRewardClaimed)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(GuessRewardClaimed)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *GuessRewardClaimedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *GuessRewardClaimedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// GuessRewardClaimed represents a RewardClaimed event raised by the Guess contract.
type GuessRewardClaimed struct {
	Winner common.Address
	Round  uint64
	Guess  uint64
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterRewardClaimed is a free log retrieval operation binding the contract event 0x8ae63c70b0b369ab5bcfd750632fb339b7a09ea17120104258094ea779aab239.
//
// Solidity: event RewardClaimed(address indexed winner, uint64 indexed round, uint64 guess)
func (_Guess *GuessFilterer) FilterRewardClaimed(opts *bind.FilterOpts, winner []common.Address, round []uint64) (*GuessRewardClaimedIterator, error) {

	var winnerRule []interface{}
	for _, winnerItem := range winner {
		winnerRule = append(winnerRule, winnerItem)
	}
	var roundRule []interface{}
	for _, roundItem := range round {
		roundRule = append(roundRule, roundItem)
	}

	logs, sub, err := _Guess.contract.FilterLogs(opts, "RewardClaimed", winnerRule, roundRule)
	if err != nil {
		return nil, err
	}
	return &GuessRewardClaimedIterator{contract: _Guess.contract, event: "RewardClaimed", logs: logs, sub: sub}, nil
}

// WatchRewardClaimed is a free log subscription operation binding the contract event 0x8ae63c70b0b369ab5bcfd750632fb339b7a09ea17120104258094ea779aab239.
//
// Solidity: event RewardClaimed(address indexed winner, uint64 indexed round, uint64 guess)
func (_Guess *GuessFilterer) WatchRewardClaimed(opts *bind.WatchOpts, sink chan<- *GuessRewardClaimed, winner []common.Address, round []uint64) (event.Subscription, error) {

	var winnerRule []interface{}
	for _, winnerItem := range winner {
		winnerRule = append(winnerRule, winnerItem)
	}
	var roundRule []interface{}
	for _, roundItem := range round {
		roundRule = append(roundRule, roundItem)
	}

	logs, sub, err := _Guess.contract.WatchLogs(opts, "RewardClaimed", winnerRule, roundRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(GuessRewardClaimed)
				if err := _Guess.contract.UnpackLog(event, "RewardClaimed", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseRewardClaimed is a log parse operation binding the contract event 0x8ae63c70b0b369ab5bcfd750632fb339b7a09ea17120104258094ea779aab239.
//
// Solidity: event RewardClaimed(address indexed winner, uint64 indexed round, uint64 guess)
func (_Guess *GuessFilterer) ParseRewardClaimed(log types.Log) (*GuessRewardClaimed, error) {
	event := new(GuessRewardClaimed)
	if err := _Guess.contract.UnpackLog(event, "RewardClaimed", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// GuessSignerUpdatedIterator is returned from FilterSignerUpdated and is used to iterate over the raw logs and unpacked data for SignerUpdated events raised by the Guess contract.
type GuessSignerUpdatedIterator struct {
	Event *GuessSignerUpdated // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *GuessSignerUpdatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(GuessSignerUpdated)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(GuessSignerUpdated)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *GuessSignerUpdatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *GuessSignerUpdatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// GuessSignerUpdated represents a SignerUpdated event raised by the Guess contract.
type GuessSignerUpdated struct {
	Signer common.Address
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterSignerUpdated is a free log retrieval operation binding the contract event 0x5553331329228fbd4123164423717a4a7539f6dfa1c3279a923b98fd681a6c73.
//
// Solidity: event SignerUpdated(address indexed signer)
func (_Guess *GuessFilterer) FilterSignerUpdated(opts *bind.FilterOpts, signer []common.Address) (*GuessSignerUpdatedIterator, error) {

	var signerRule []interface{}
	for _, signerItem := range signer {
		signerRule = append(signerRule, signerItem)
	}

	logs, sub, err := _Guess.contract.FilterLogs(opts, "SignerUpdated", signerRule)
	if err != nil {
		return nil, err
	}
	return &GuessSignerUpdatedIterator{contract: _Guess.contract, event: "SignerUpdated", logs: logs, sub: sub}, nil
}

// WatchSignerUpdated is a free log subscription operation binding the contract event 0x5553331329228fbd4123164423717a4a7539f6dfa1c3279a923b98fd681a6c73.
//
// Solidity: event SignerUpdated(address indexed signer)
func (_Guess *GuessFilterer) WatchSignerUpdated(opts *bind.WatchOpts, sink chan<- *GuessSignerUpdated, signer []common.Address) (event.Subscription, error) {

	var signerRule []interface{}
	for _, signerItem := range signer {
		signerRule = append(signerRule, signerItem)
	}

	logs, sub, err := _Guess.contract.WatchLogs(opts, "SignerUpdated", signerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(GuessSignerUpdated)
				if err := _Guess.contract.UnpackLog(event, "SignerUpdated", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseSignerUpdated is a log parse operation binding the contract event 0x5553331329228fbd4123164423717a4a7539f6dfa1c3279a923b98fd681a6c73.
//
// Solidity: event SignerUpdated(address indexed signer)
func (_Guess *GuessFilterer) ParseSignerUpdated(log types.Log) (*GuessSignerUpdated, error) {
	event := new(GuessSignerUpdated)
	if err := _Guess.contract.UnpackLog(event, "SignerUpdated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
