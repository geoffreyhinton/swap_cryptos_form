# 🔍 Blockchain Event Listener Scripts

Monitor your local Ethereum testnet in real-time! These scripts allow you to subscribe to various blockchain events and track transactions, blocks, and account changes.

## 📋 Available Scripts

### 1. 🌟 Simple Blockchain Listener (`simple-listener.js`) **RECOMMENDED**
**Reliable and easy-to-use event monitoring**
- ✅ New block notifications with transaction details
- ✅ Pending transaction monitoring for test accounts
- ✅ Real-time balance change tracking
- ✅ Clean, readable output with emoji indicators
- ✅ No complex filters - just works!
- ✅ Perfect for development and testing

### 2. 🚀 Advanced Blockchain Listener (`blockchain-listener.js`)
**Most comprehensive event monitoring (complex)**
- ✅ New block notifications
- ✅ Pending transaction monitoring  
- ✅ Account-specific transaction tracking
- ✅ ERC-20 token transfer events
- ✅ Contract event monitoring
- ✅ Gas price monitoring
- ✅ Real-time WebSocket subscriptions

### 3. 💸 Transaction Monitor (`transaction-monitor.js`)
**Focus on transaction tracking**
- ✅ Monitor specific addresses
- ✅ Incoming/outgoing transaction alerts
- ✅ Balance change notifications
- ✅ Transaction status tracking
- ✅ Detailed transaction information

### 4. 🐍 Python Event Listener (`blockchain-listener.py`)
**Alternative Python implementation**
- ✅ WebSocket and HTTP polling fallback
- ✅ Account balance monitoring
- ✅ Block and transaction processing
- ✅ Graceful error handling

### 5. ⚡ Quick Demo (`quick-demo.js`)
**Simple getting-started example**
- ✅ Basic block listening
- ✅ Account balance display
- ✅ Transaction detection for test accounts

## 🚀 Quick Start

### Option 1: Use the Interactive Script Manager
```bash
# Run the interactive menu
./scripts/event-listener.sh
```

### Option 2: Run Individual Scripts
```bash
# Simple listener (RECOMMENDED - most reliable)
node scripts/simple-listener.js

# Advanced blockchain listener (Node.js)
node scripts/blockchain-listener.js

# Transaction monitor (Node.js)
node scripts/transaction-monitor.js

# Quick demo
node scripts/quick-demo.js

# Python listener (requires dependencies)
pip3 install -r requirements.txt
python3 scripts/blockchain-listener.py
```

## 📦 Prerequisites

### Required
- ✅ **Docker testnet running**: `docker-compose up -d`
- ✅ **Node.js** with `ethers` package: `npm install ethers`

### Optional (for Python scripts)
- 🐍 **Python 3** with dependencies: `pip3 install -r requirements.txt`

## 🔧 Configuration

All scripts are configured to work with your local testnet by default:
- **RPC URL**: `http://localhost:8545`
- **WebSocket URL**: `ws://localhost:8546`  
- **Chain ID**: `1337`

### Monitored Test Accounts
The scripts automatically monitor these pre-funded accounts:
- `0x2c7536E3605D9C16a7a3D7b1898e529396a65c23` (Main Account)
- `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` (Second Account)  
- `0x90F79bf6EB2c4f870365E785982E1f101E93b906` (Third Account)

## 📊 What You'll See

### New Block Events
```
🆕 NEW BLOCK #135
   Hash: 0x1234567890abcdef...
   Timestamp: 2025-10-21T13:45:30.000Z
   Transactions: 1
   Gas Used: 21,000
```

### Transaction Events  
```
💸 NEW TRANSACTION
   Hash: 0xabcdef1234567890...
   From: 0x2c7536e3...
   To: 0x3c44cddd...
   Value: 1.0 ETH
   Block: #135
```

### Balance Changes
```
💰 BALANCE CHANGE 📉
   Account: 0x2c7536e3...
   Previous: 9998.999983 ETH
   Current: 9997.999983 ETH
   Change: -1.000000 ETH
```

## 🎯 Use Cases

### Development & Testing
- **Transaction Debugging**: See exactly when and how transactions are processed
- **Gas Optimization**: Monitor gas usage patterns
- **Account Monitoring**: Track balance changes across multiple accounts

### Learning & Exploration
- **Blockchain Understanding**: See real-time blockchain activity
- **Event Patterns**: Understand how events flow through the network
- **WebSocket vs HTTP**: Compare real-time vs polling approaches

### Integration Testing
- **dApp Testing**: Monitor your dApp's transactions in real-time
- **Smart Contract Events**: Track contract interactions
- **Performance Testing**: Monitor transaction throughput

## 🛠️ Customization

### Adding Custom Addresses
```javascript
// In blockchain-listener.js
listener.subscribeToAddressTransactions('0xYourCustomAddress');

// In transaction-monitor.js  
monitor.addAddress('0xYourCustomAddress', 'My Custom Account');
```

### Monitoring Smart Contracts
```javascript
// Add contract event monitoring
const contractABI = [/* your contract ABI */];
listener.subscribeToContractEvents('0xContractAddress', contractABI);
```

### Custom Event Filters
```javascript
// Monitor specific ERC-20 tokens
listener.subscribeToERC20Transfers('0xTokenContractAddress');
```

## 🔍 Testing the Event Listeners

1. **Start the event listener**:
   ```bash
   node scripts/quick-demo.js
   ```

2. **Send a test transaction** through MetaMask:
   - From: `0x2c7536E3605D9C16a7a3D7b1898e529396a65c23`
   - To: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
   - Amount: Any amount (e.g., 0.1 ETH)

3. **Watch real-time events** appear in your terminal! 🎉

## 🚨 Troubleshooting

### "Connection refused" errors
- ✅ Make sure Docker testnet is running: `docker ps`
- ✅ Check RPC endpoint: `curl http://localhost:8545`

### WebSocket connection failures  
- 🔄 Scripts automatically fall back to HTTP polling
- ✅ Ensure port 8546 is not blocked

### "Module not found" errors
- 📦 Install dependencies: `npm install ethers`
- 🐍 For Python: `pip3 install -r requirements.txt`

### No events appearing
- 🔍 Check if mining is active: blocks should be increasing
- 💸 Send a test transaction to trigger events
- 📊 Verify account addresses match your MetaMask accounts

## 🎓 Learning Resources

- **Ethers.js Documentation**: [docs.ethers.org](https://docs.ethers.org)
- **Web3.py Documentation**: [web3py.readthedocs.io](https://web3py.readthedocs.io)
- **Ethereum JSON-RPC**: [ethereum.org/en/developers/docs/apis/json-rpc](https://ethereum.org/en/developers/docs/apis/json-rpc/)

---

**🎉 Happy blockchain monitoring!** Your local testnet is now under full surveillance. 👀