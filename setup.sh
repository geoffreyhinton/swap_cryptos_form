#!/bin/bash

echo "🚀 Setting up Go-Ethereum Docker Testnet..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose > /dev/null 2>&1; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

echo "✅ Docker is running"

# Build and start the containers
echo "🏗️  Building containers..."
docker-compose build

echo "🚀 Starting Ethereum testnet..."
docker-compose up -d

echo "⏳ Waiting for node to initialize..."
sleep 10

# Check if node is running
echo "🔍 Checking node status..."
if curl -s -X POST -H "Content-Type: application/json" \
   --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
   http://localhost:8545 > /dev/null; then
    echo "✅ Geth node is running successfully!"
    echo ""
    echo "📋 Network Information:"
    echo "  - HTTP RPC: http://localhost:8545"
    echo "  - WebSocket: ws://localhost:8546"
    echo "  - Chain ID: 1337"
    echo "  - Network ID: 1337"
    echo ""
    echo "💰 Pre-funded accounts are ready with 10,000 ETH each"
    echo ""
    echo "🔧 Useful commands:"
    echo "  - Check status: ./scripts/status.sh"
    echo "  - View logs: docker-compose logs -f geth"
    echo "  - Stop node: docker-compose down"
    echo ""
    echo "🌐 Optional: Start block explorer with:"
    echo "  docker-compose --profile explorer up -d"
    echo "  Then visit: http://localhost:4000"
else
    echo "❌ Node failed to start. Check logs with: docker-compose logs geth"
    exit 1
fi