#!/bin/bash

# Create accounts for testing
set -e

echo "🔑 Creating test accounts..."

DATA_DIR="/app/data"
KEYSTORE_DIR="/app/keystore"

# Create keystore directory if it doesn't exist
mkdir -p $KEYSTORE_DIR

# Create empty password file
echo "" > /tmp/empty_password.txt

# Create 3 accounts with empty passwords
for i in {1..3}; do
    echo "Creating account $i..."
    geth --datadir $DATA_DIR account new --password /tmp/empty_password.txt
done

echo "✅ Created 3 test accounts"
echo "💡 All accounts have empty passwords and are pre-funded in genesis"

# List all accounts
echo "📋 Available accounts:"
geth --datadir $DATA_DIR account list