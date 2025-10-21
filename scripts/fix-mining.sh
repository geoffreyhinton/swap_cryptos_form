#!/bin/bash

# Quick fix for mining and pending transactions

echo "🔧 Fixing queued transactions..."

# Set etherbase
echo "Setting mining account..."
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"miner_setEtherbase","params":["0x2c7536E3605D9C16a7a3D7b1898e529396a65c23"],"id":1}' \
  http://localhost:8545

# Unlock account for mining (mining account needs to be unlocked)
echo "Attempting to unlock mining account..."
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"personal_unlockAccount","params":["0x2c7536E3605D9C16a7a3D7b1898e529396a65c23","password",0],"id":1}' \
  http://localhost:8545

# Alternative: try without password
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"personal_unlockAccount","params":["0x2c7536E3605D9C16a7a3D7b1898e529396a65c23","",300],"id":1}' \
  http://localhost:8545

# Start mining
echo "Starting mining..."
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"miner_start","params":[1],"id":1}' \
  http://localhost:8545

# Check mining status
echo "Checking mining status..."
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_mining","params":[],"id":1}' \
  http://localhost:8545

echo -e "\n✅ Mining should now be active!"
echo "Check MetaMask - your transactions should start confirming."