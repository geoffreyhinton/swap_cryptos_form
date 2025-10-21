#!/bin/bash

# Check Geth node status and account balances
set -e

echo "🔍 Checking Geth node status..."

# Check if node is running
if curl -s -X POST -H "Content-Type: application/json" \
   --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
   http://localhost:8545 > /dev/null; then
    echo "✅ Geth node is running"
else
    echo "❌ Geth node is not responding"
    exit 1
fi

# Get network info
echo "📊 Network Information:"
CHAIN_ID=$(curl -s -X POST -H "Content-Type: application/json" \
   --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
   http://localhost:8545 | jq -r '.result')
echo "Chain ID: $((CHAIN_ID))"

BLOCK_NUMBER=$(curl -s -X POST -H "Content-Type: application/json" \
   --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
   http://localhost:8545 | jq -r '.result')
echo "Latest Block: $((BLOCK_NUMBER))"

# Check accounts and balances
echo "💰 Account Balances:"
ACCOUNTS=$(curl -s -X POST -H "Content-Type: application/json" \
   --data '{"jsonrpc":"2.0","method":"eth_accounts","params":[],"id":1}' \
   http://localhost:8545 | jq -r '.result[]')

for account in $ACCOUNTS; do
    BALANCE=$(curl -s -X POST -H "Content-Type: application/json" \
       --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"$account\",\"latest\"],\"id\":1}" \
       http://localhost:8545 | jq -r '.result')
    
    # Convert hex to decimal and then to ETH
    BALANCE_WEI=$((BALANCE))
    BALANCE_ETH=$(echo "scale=6; $BALANCE_WEI / 1000000000000000000" | bc -l)
    echo "$account: $BALANCE_ETH ETH"
done

echo "🌐 RPC Endpoints:"
echo "HTTP: http://localhost:8545"
echo "WebSocket: ws://localhost:8546"
echo "Metrics: http://localhost:6060/debug/metrics"