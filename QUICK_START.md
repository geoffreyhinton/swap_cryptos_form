# Quick Start Guide

## 🚀 Start Your Docker Ethereum Testnet

1. **Start the testnet:**
   ```bash
   docker-compose up -d
   ```

2. **Verify it's running:**
   ```bash
   curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_accounts","params":[],"id":1}' http://localhost:8545
   ```

## 💰 Pre-funded Accounts

Your testnet has 10 accounts, each with **10,000 ETH**:

| Account | Private Key | Balance |
|---------|------------|---------|
| `0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf` | `0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318` | 10,000 ETH |
| `0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF` | `0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c` | 10,000 ETH |
| *...and 8 more* | | |

## 💸 Send Crypto - Choose Your Method

### Method 1: MetaMask (Recommended ✅)
1. Add Custom Network in MetaMask:
   - Network Name: `Local Testnet`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`

2. Import account using private key: `0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318`

3. Send ETH normally through MetaMask interface

### Method 2: Code Examples
```bash
# Install dependencies
npm install ethers

# Try the manual transaction method
node examples/manual-transaction.js
```

## 🔍 Check Balances
```bash
# Check account balance
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf","latest"],"id":1}' http://localhost:8545
```

## 🛑 Stop the testnet
```bash
docker-compose down
```

---
**Need help?** Check `SOLUTION.md` for detailed troubleshooting!