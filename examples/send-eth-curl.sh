#!/bin/bash

# Send ETH using curl and JSON-RPC (manual method)
# This shows the raw RPC calls for educational purposes

echo "🚀 Sending ETH using raw JSON-RPC calls..."

RPC_URL="http://localhost:8545"
FROM_ADDRESS="0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf"
TO_ADDRESS="0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF"
AMOUNT="0xDE0B6B3A7640000"  # 1 ETH in wei (hex)

echo "📤 From: $FROM_ADDRESS"
echo "📥 To: $TO_ADDRESS"
echo "💰 Amount: 1 ETH"

# First, check current balances
echo -e "\n💰 Checking balances..."

echo "From balance:"
curl -s -X POST -H "Content-Type: application/json" \
  --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"$FROM_ADDRESS\",\"latest\"],\"id\":1}" \
  $RPC_URL | python3 -c "
import sys, json
data = json.load(sys.stdin)
balance_wei = int(data['result'], 16)
balance_eth = balance_wei / 10**18
print(f'{balance_eth:,.2f} ETH')
"

echo "To balance:"
curl -s -X POST -H "Content-Type: application/json" \
  --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"$TO_ADDRESS\",\"latest\"],\"id\":1}" \
  $RPC_URL | python3 -c "
import sys, json
data = json.load(sys.stdin)
balance_wei = int(data['result'], 16)
balance_eth = balance_wei / 10**18
print(f'{balance_eth:,.2f} ETH')
"

echo -e "\n⚠️  Note: To send transactions using raw RPC calls, you need to:"
echo "1. Get the account nonce"
echo "2. Build and sign the transaction offline"
echo "3. Send the signed raw transaction"
echo ""
echo "💡 For easier transaction sending, use the JavaScript or Python examples:"
echo "   - node examples/send-eth-ethers.js"
echo "   - python3 examples/send-eth-web3.py"
echo ""
echo "🔑 Or import the private key into MetaMask:"
echo "   Private Key: 0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318"