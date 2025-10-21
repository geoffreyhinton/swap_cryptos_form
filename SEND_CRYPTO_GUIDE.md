# How to Send Crypto from Pre-funded Account

## 🎯 **Quick Answer**

To send crypto from the pre-funded account `0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf`, you need its **private key**:

```
Address: 0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf
Private Key: 0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318
Balance: 10,000 ETH
```

## 🚀 **Method 1: Using MetaMask (Easiest)**

### Step 1: Import Account to MetaMask
1. Open MetaMask
2. Click account icon → "Import Account"
3. Select "Private Key"
4. Paste: `0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318`
5. Click "Import"

### Step 2: Add Local Network
```
Network Name: Local Testnet
RPC URL: http://localhost:8545
Chain ID: 1337
Currency: ETH
```

### Step 3: Send Transaction
1. Click "Send" in MetaMask
2. Enter recipient address (use another test account):
   - `0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF`
3. Enter amount (e.g., 1 ETH)
4. Click "Next" → "Confirm"

## 💻 **Method 2: Using JavaScript (ethers.js)**

```javascript
const { ethers } = require('ethers');

async function sendETH() {
    // Setup
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');
    const privateKey = '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318';
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Transaction details
    const tx = await wallet.sendTransaction({
        to: '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF',  // Recipient
        value: ethers.parseEther('1.0'),  // 1 ETH
        gasLimit: 21000
    });
    
    console.log('Transaction Hash:', tx.hash);
    
    // Wait for confirmation (if mining is enabled)
    const receipt = await tx.wait();
    console.log('Transaction confirmed in block:', receipt.blockNumber);
}

sendETH();
```

## 🐍 **Method 3: Using Python (web3.py)**

```python
from web3 import Web3

# Setup
w3 = Web3(Web3.HTTPProvider('http://localhost:8545'))
private_key = '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318'
from_address = '0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf'
to_address = '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF'

# Build transaction
transaction = {
    'to': to_address,
    'value': Web3.to_wei(1, 'ether'),  # 1 ETH
    'gas': 21000,
    'gasPrice': Web3.to_wei('20', 'gwei'),
    'nonce': w3.eth.get_transaction_count(from_address),
    'chainId': 1337
}

# Sign and send
signed_txn = w3.eth.account.sign_transaction(transaction, private_key)
tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
print(f'Transaction Hash: {tx_hash.hex()}')
```

## 🏗️ **Method 4: Using curl (Advanced)**

```bash
# This requires building and signing transactions manually
# See examples/send-eth-curl.sh for details
./examples/send-eth-curl.sh
```

## 🧪 **All Available Test Accounts**

| Account | Address | Private Key | Balance |
|---------|---------|-------------|---------|
| Account 1 | `0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf` | `0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318` | 10,000 ETH |
| Account 2 | `0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF` | `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a` | 10,000 ETH |
| Account 3 | `0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69` | `0x7c852118294e51e653712a81e5800f419141751be58f605c371e15141b007a6` | 10,000 ETH |

## 🛠️ **Running the Examples**

### Check Balances
```bash
npm run check-balance
```

### Send ETH (JavaScript)
```bash
node examples/demo-transactions.js
```

### Send ETH (Python)
```bash
python3 examples/send-eth-web3.py
```

### View Account Details
```bash
./scripts/test-accounts.sh
```

## ⚠️ **Important Notes**

### Mining Requirement
- **For transactions to be confirmed**, the blockchain needs mining enabled
- Current setup: Dev mode with automatic mining
- Check mining status: `curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_mining","params":[],"id":1}' http://localhost:8545`

### Security Warning
- ⚠️ **These are TEST ACCOUNTS only**
- Private keys are publicly known
- **NEVER use these keys with real ETH or on mainnet**
- Always generate new accounts for production

### Network Configuration
- **RPC URL**: `http://localhost:8545`
- **WebSocket**: `ws://localhost:8546`
- **Chain ID**: `1337`
- **Network ID**: `1337`

## 🎯 **Quick Test Transaction**

To quickly test sending crypto, run:

```bash
cd /Users/vinh/react_projects/swap_cryptos_form
node -e "
const { ethers } = require('ethers');
const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const wallet = new ethers.Wallet('0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318', provider);

wallet.sendTransaction({
    to: '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF',
    value: ethers.parseEther('0.5'),
    gasLimit: 21000
}).then(tx => {
    console.log('✅ Transaction sent!');
    console.log('Hash:', tx.hash);
    console.log('From:', tx.from);
    console.log('To:', tx.to);
    console.log('Value:', ethers.formatEther(tx.value), 'ETH');
}).catch(console.error);
"
```

This will send 0.5 ETH from Account 1 to Account 2! 🚀