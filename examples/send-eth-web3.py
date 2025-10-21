#!/usr/bin/env python3

"""
Send ETH Transaction Example using web3.py
This script shows how to send ETH from a pre-funded account using Python
"""

from web3 import Web3
import json

# Configuration
RPC_URL = 'http://localhost:8545'
CHAIN_ID = 1337

# Pre-funded account details (from genesis)
FROM_PRIVATE_KEY = '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318'
FROM_ADDRESS = '0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf'

# Destination account (you can change this)
TO_ADDRESS = '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF'

def send_transaction():
    try:
        print('🚀 Connecting to local Ethereum testnet...')
        
        # Create web3 connection
        w3 = Web3(Web3.HTTPProvider(RPC_URL))
        
        if not w3.is_connected():
            raise Exception("Failed to connect to Ethereum node")
        
        print(f'📤 Sending from: {FROM_ADDRESS}')
        print(f'📥 Sending to: {TO_ADDRESS}')
        
        # Check balances before transaction
        from_balance_before = w3.eth.get_balance(FROM_ADDRESS)
        to_balance_before = w3.eth.get_balance(TO_ADDRESS)
        
        print(f'\n💰 Balances before transaction:')
        print(f'From: {Web3.from_wei(from_balance_before, "ether")} ETH')
        print(f'To: {Web3.from_wei(to_balance_before, "ether")} ETH')
        
        # Transaction details
        amount_wei = Web3.to_wei(2.5, 'ether')  # Send 2.5 ETH
        
        print(f'\n📋 Transaction details:')
        print(f'Amount: {Web3.from_wei(amount_wei, "ether")} ETH')
        
        # Get nonce
        nonce = w3.eth.get_transaction_count(FROM_ADDRESS)
        
        # Build transaction
        transaction = {
            'to': TO_ADDRESS,
            'value': amount_wei,
            'gas': 21000,
            'gasPrice': Web3.to_wei('20', 'gwei'),
            'nonce': nonce,
            'chainId': CHAIN_ID
        }
        
        # Sign transaction
        signed_txn = w3.eth.account.sign_transaction(transaction, FROM_PRIVATE_KEY)
        
        # Send transaction
        tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        
        print(f'\n⏳ Transaction sent: {tx_hash.hex()}')
        print('Waiting for confirmation...')
        
        # Wait for confirmation
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        
        print(f'\n✅ Transaction confirmed!')
        print(f'Block number: {receipt.blockNumber}')
        print(f'Gas used: {receipt.gasUsed}')
        
        # Check balances after transaction
        from_balance_after = w3.eth.get_balance(FROM_ADDRESS)
        to_balance_after = w3.eth.get_balance(TO_ADDRESS)
        
        print(f'\n💰 Balances after transaction:')
        print(f'From: {Web3.from_wei(from_balance_after, "ether")} ETH')
        print(f'To: {Web3.from_wei(to_balance_after, "ether")} ETH')
        
        print(f'\n🎉 Successfully sent {Web3.from_wei(amount_wei, "ether")} ETH!')
        
        return tx_hash.hex()
        
    except Exception as error:
        print(f'❌ Error sending transaction: {str(error)}')
        return None

if __name__ == '__main__':
    send_transaction()