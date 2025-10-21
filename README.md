# Go-Ethereum Docker Testnet

A complete Docker setup for running a local Ethereum testnet using go-ethereum (Geth) with pre-funded accounts for development and testing.

## Features

- 🚀 Ready-to-use Ethereum testnet with go-ethereum
- 💰 10 pre-funded accounts with 10,000 ETH each
- ⛏️ Built-in mining for instant transactions
- 🌐 HTTP and WebSocket RPC endpoints
- 📊 Optional Blockscout explorer integration
- 🔧 Fully configurable through environment variables
- 📋 Easy account management and monitoring

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- `curl` and `jq` for status checking (optional)
- `bc` for balance calculations (optional)

### 1. Start the Testnet

```bash
# Start the Ethereum node
docker-compose up -d

# Check logs
docker-compose logs -f geth

# Start with block explorer (optional)
docker-compose --profile explorer up -d
```

### 2. Verify the Setup

```bash
# Make scripts executable (if needed)
chmod +x scripts/*.sh

# Check node status and balances
./scripts/status.sh
```

## Configuration

### Environment Variables

Edit `.env` file to customize the setup:

```env
# Network Configuration
NETWORK_ID=1337          # Custom network ID
CHAIN_ID=1337           # EIP-155 chain ID

# Port Configuration  
HTTP_PORT=8545          # HTTP RPC port
WS_PORT=8546           # WebSocket RPC port
P2P_PORT=30303         # P2P networking port

# Mining Configuration
MINING=true            # Enable/disable mining
MINER_THREADS=1        # Number of mining threads
```

### Pre-funded Accounts

The genesis block includes 10 accounts with 10,000 ETH each:

| Address | Balance |
|---------|---------|
| `0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf` | 10,000 ETH |
| `0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF` | 10,000 ETH |
| `0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69` | 10,000 ETH |
| `0x1efF47bc3a10a45D4B230B5d10E37751FE6AA718` | 10,000 ETH |
| `0xe1AB8145F7E55DC933d51a18c793F901A3A0b276` | 10,000 ETH |
| `0xE57bFE9F44b819898F47BF37E5AF72a0783e1141` | 10,000 ETH |
| `0xd41c057fd1c78805AAC12B0A94a405c0461A6FBb` | 10,000 ETH |
| `0xF1F6619B38A98d6De0800F1DefC0a6399eB6d30C` | 10,000 ETH |
| `0xF7Edc8FA1eCc32967F827C9043FcAe6ba73afA5c` | 10,000 ETH |
| `0x947f0dC0B7462e022ae8B54DBCAC315E9Eba8b75` | 10,000 ETH (miner) |

## Usage

### Connecting to the Network

**HTTP RPC Endpoint:**
```
http://localhost:8545
```

**WebSocket Endpoint:**
```
ws://localhost:8546
```

### Web3 Connection Examples

**JavaScript (ethers.js):**
```javascript
const { ethers } = require('ethers');
const provider = new ethers.JsonRpcProvider('http://localhost:8545');
```

**Python (web3.py):**
```python
from web3 import Web3
w3 = Web3(Web3.HTTPProvider('http://localhost:8545'))
```

**MetaMask Configuration:**
- Network Name: Local Testnet
- RPC URL: `http://localhost:8545`
- Chain ID: `1337`
- Currency Symbol: `ETH`

### Basic Operations

**Check account balance:**
```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf","latest"],"id":1}' \
  http://localhost:8545
```

**Get latest block number:**
```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545
```

**List accounts:**
```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_accounts","params":[],"id":1}' \
  http://localhost:8545
```

## Available Endpoints

| Service | URL | Description |
|---------|-----|-------------|
| Geth HTTP RPC | http://localhost:8545 | Main JSON-RPC endpoint |
| Geth WebSocket | ws://localhost:8546 | WebSocket RPC endpoint |
| Geth Metrics | http://localhost:6060/debug/metrics | Node metrics |
| Blockscout Explorer | http://localhost:4000 | Block explorer (with `--profile explorer`) |

## Available RPC Methods

The node exposes the following API namespaces:
- `eth` - Ethereum protocol methods
- `net` - Network information
- `web3` - Web3 client information  
- `personal` - Account management
- `miner` - Mining control
- `admin` - Administrative functions
- `debug` - Debugging utilities

## Scripts

| Script | Description |
|--------|-------------|
| `scripts/start.sh` | Initialize and start Geth node |
| `scripts/create-accounts.sh` | Create new test accounts |
| `scripts/status.sh` | Check node status and balances |

## File Structure

```
├── Dockerfile              # Geth container definition
├── docker-compose.yml      # Container orchestration
├── genesis.json           # Genesis block configuration
├── .env                   # Environment variables
├── keystore/              # Ethereum account keystore
│   └── README.md          # Keystore documentation
└── scripts/               # Utility scripts
    ├── start.sh           # Node startup script
    ├── create-accounts.sh # Account creation
    └── status.sh          # Status checker
```

## Development

### Adding Custom Accounts

1. Generate keystore files using Geth or other tools
2. Place them in the `keystore/` directory
3. Add corresponding addresses to `genesis.json` alloc section
4. Rebuild the container

### Modifying Genesis Configuration

Edit `genesis.json` to:
- Change pre-funded account balances
- Modify consensus parameters (Clique PoA settings)
- Adjust gas limits and difficulty
- Add custom contract deployments

### Custom Network Parameters

- **Chain ID:** 1337 (configurable via `.env`)
- **Network ID:** 1337 (configurable via `.env`)
- **Block Time:** ~5 seconds (Clique PoA)
- **Gas Limit:** 134,217,728 (0x8000000)
- **Consensus:** Clique Proof of Authority

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs geth

# Rebuild container
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Node Not Mining
```bash
# Check mining status
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_mining","params":[],"id":1}' \
  http://localhost:8545

# Enable mining via RPC
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"miner_start","params":[1],"id":1}' \
  http://localhost:8545
```

### Reset Blockchain Data
```bash
# Stop and remove all data
docker-compose down -v

# Start fresh
docker-compose up -d
```

## Security Notes

⚠️ **Warning:** This setup is for development only!

- All accounts have empty passwords
- CORS is disabled (`*` origins allowed)
- Insecure unlock is enabled
- No authentication on RPC endpoints

Never use this configuration on mainnet or with real funds.

## License

This project is provided as-is for development and educational purposes.