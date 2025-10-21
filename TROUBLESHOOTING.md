# 🔧 Fixing Queued Transactions in MetaMask

## The Problem
Your transactions are stuck because MetaMask's nonce (transaction counter) is out of sync with the blockchain. This commonly happens with local testnets.

## 🎯 Solution 1: Reset Account (Fastest Fix)

1. **Open MetaMask**
2. **Click your account icon** (top right)
3. **Go to Settings** → **Advanced**
4. **Scroll down and click "Reset Account"**
5. **Confirm the reset**

This will:
- Clear all pending transactions
- Reset the nonce counter
- Keep your account and balance intact
- **NOTE: This will clear transaction history but NOT your balance**

## 🎯 Solution 2: Speed Up or Cancel Transactions

For each queued transaction in MetaMask:
1. **Click on the transaction**
2. **Click "Speed Up"** or **"Cancel"**
3. **Increase the gas price** if speeding up
4. **Confirm the action**

## 🎯 Solution 3: Restart the Blockchain (Nuclear Option)

If the above doesn't work:

```bash
# Stop and restart the blockchain
cd /Users/vinh/react_projects/swap_cryptos_form
docker-compose down
docker-compose up -d

# Wait a few seconds, then check
docker-compose logs geth | tail -10
```

## ✅ After Fixing

1. **Verify your balance** - should still show ~10,000 ETH
2. **Send a small test transaction** (0.1 ETH)
3. **Check that it confirms quickly**

## 🔍 Prevention

To avoid this in the future:
- Don't send multiple transactions rapidly on local testnet
- Wait for each transaction to confirm before sending the next
- Use lower amounts for testing (0.1-1 ETH instead of large amounts)

## 🚨 Emergency Commands

If nothing works, here are some debugging commands:

```bash
# Check if geth is mining
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_mining","params":[],"id":1}' http://localhost:8545

# Get latest block number
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:8545

# Check account balance
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC","latest"],"id":1}' http://localhost:8545
```