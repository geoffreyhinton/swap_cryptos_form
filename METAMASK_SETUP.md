# MetaMask Setup Guide

## Adding Local Testnet to MetaMask

### 1. Add Custom Network
1. Open MetaMask
2. Click the network dropdown (usually shows "Ethereum Mainnet")
3. Click "Add network" or "Custom RPC"
4. Enter these details:

```
Network Name: Local Ethereum Testnet
New RPC URL: http://localhost:8545
Chain ID: 1337
Currency Symbol: ETH
Block Explorer URL: (leave empty)
```

### 2. Import Test Account
1. Click the account icon in MetaMask
2. Select "Import Account"
3. Choose "Private Key"
4. Enter one of these test private keys:

**Account 1 (10,000 ETH):**
```
Private Key: 0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318
Address: 0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf
```

**Account 2 (10,000 ETH):**
```
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
Address: 0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF
```

**Account 3 (10,000 ETH):**
```
Private Key: 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6
Address: 0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69
```

### 3. Verify Setup
1. Switch to "Local Ethereum Testnet" network
2. Check that your account shows ~10,000 ETH balance
3. You can now send transactions using MetaMask!

### 4. Sending Transactions
1. Click "Send" in MetaMask
2. Enter recipient address (use another test account)
3. Enter amount (e.g., 1 ETH)
4. Confirm transaction
5. Transaction should confirm almost instantly

## ⚠️ Important Security Notes
- These are **TEST ACCOUNTS ONLY**
- Never use these private keys on mainnet or with real ETH
- Private keys are publicly known - only for local development
- Always use fresh accounts for production applications

## Troubleshooting

### MetaMask shows 0 ETH balance
- Make sure you're connected to the Local Testnet (Chain ID 1337)
- Verify the RPC URL is http://localhost:8545
- Check that the Docker container is running: `docker-compose logs geth`

### Transaction fails
- Make sure you have enough ETH for gas fees
- Try increasing gas limit in MetaMask advanced settings
- Check that the recipient address is valid

### Can't connect to network
- Verify Docker container is running: `docker ps`
- Test RPC endpoint: `curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' http://localhost:8545`
- Check if port 8545 is accessible