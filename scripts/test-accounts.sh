#!/bin/bash

# Generate test accounts with known private keys for easy testing
echo "🔑 Generating test accounts with known private keys..."

# Create a directory for account information
mkdir -p /tmp/test-accounts

echo "📝 Test Account Details:"
echo "=========================="

# Account 1
echo "Account 1:"
echo "Address: 0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf"
echo "Private Key: 0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318"
echo "Balance: 10,000 ETH"
echo ""

# Account 2
echo "Account 2:"
echo "Address: 0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF" 
echo "Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
echo "Balance: 10,000 ETH"
echo ""

# Account 3
echo "Account 3:"
echo "Address: 0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69"
echo "Private Key: 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6"
echo "Balance: 10,000 ETH"
echo ""

echo "💡 Use these private keys to import accounts into MetaMask or use in your scripts"
echo "⚠️  Warning: These are test accounts only - never use these keys with real ETH!"