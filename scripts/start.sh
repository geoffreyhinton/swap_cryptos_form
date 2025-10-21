#!/bin/bash

# Initialize Geth with genesis block and start the node
set -e

echo "🚀 Starting Geth Testnet Node..."

# Set default values
NETWORK_ID=${NETWORK_ID:-1337}
CHAIN_ID=${CHAIN_ID:-1337}
HTTP_PORT=${HTTP_PORT:-8545}
WS_PORT=${WS_PORT:-8546}
P2P_PORT=${P2P_PORT:-30303}
MINING=${MINING:-true}
MINER_THREADS=${MINER_THREADS:-1}

DATA_DIR="/app/data"
GENESIS_FILE="/app/genesis.json"

# Initialize geth if data directory doesn't exist
if [ ! -d "$DATA_DIR/geth" ]; then
    echo "📦 Initializing Geth with genesis block..."
    geth --datadir $DATA_DIR init $GENESIS_FILE
fi

# Create accounts if keystore is empty
if [ ! "$(ls -A /app/keystore 2>/dev/null)" ]; then
    echo "🔑 Creating default accounts..."
    /app/scripts/create-accounts.sh
fi

# Copy accounts to data directory
if [ -d "/app/keystore" ] && [ "$(ls -A /app/keystore)" ]; then
    echo "📋 Copying accounts to data directory..."
    cp -r /app/keystore/* $DATA_DIR/keystore/ 2>/dev/null || true
fi

echo "⚙️  Starting Geth node..."
echo "Network ID: $NETWORK_ID"
echo "Chain ID: $CHAIN_ID"
echo "HTTP RPC: http://localhost:$HTTP_PORT"
echo "WebSocket: ws://localhost:$WS_PORT"
echo "Mining: $MINING"

# Build geth command
GETH_CMD="geth \
    --datadir $DATA_DIR \
    --networkid $NETWORK_ID \
    --port $P2P_PORT \
    --http \
    --http.addr 0.0.0.0 \
    --http.port $HTTP_PORT \
    --http.api eth,net,web3,personal,miner,admin,debug \
    --http.corsdomain '*' \
    --ws \
    --ws.addr 0.0.0.0 \
    --ws.port $WS_PORT \
    --ws.api eth,net,web3,personal,miner,admin,debug \
    --ws.origins '*' \
    --allow-insecure-unlock \
    --unlock 0,1,2 \
    --password /dev/null \
    --metrics \
    --metrics.addr 0.0.0.0 \
    --metrics.port 6060 \
    --nodiscover \
    --maxpeers 0"

# Add mining if enabled
if [ "$MINING" = "true" ]; then
    GETH_CMD="$GETH_CMD --mine --miner.threads $MINER_THREADS --miner.etherbase 0x947f0dC0B7462e022ae8B54DBCAC315E9Eba8b75"
fi

echo "🎯 Executing: $GETH_CMD"
exec $GETH_CMD