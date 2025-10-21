# Use Alpine Linux as base and install geth using apk
FROM alpine:3.18

# Install geth from Alpine packages and other tools
RUN apk add --no-cache \
    geth \
    bash \
    curl

# Set working directory
WORKDIR /app

# Create necessary directories
RUN mkdir -p /app/data /app/keystore

# Copy configuration files
COPY genesis.json /app/genesis.json

# Create an empty password file
RUN echo "" > /app/password.txt

# Expose ports
EXPOSE 8545 8546 30303 6060

# Initialize the blockchain and start geth
CMD ["sh", "-c", "\
    echo '🚀 Starting Geth Testnet Node...' && \
    if [ ! -d '/app/data/geth' ]; then \
        echo '📦 Initializing Geth with genesis block...' && \
        geth --datadir /app/data init /app/genesis.json; \
    fi && \
    echo '⚙️ Starting Geth node...' && \
    geth \
        --datadir /app/data \
        --networkid 1337 \
        --port 30303 \
        --http \
        --http.addr 0.0.0.0 \
        --http.port 8545 \
        --http.api eth,net,web3,personal,miner,admin,debug \
        --http.corsdomain '*' \
        --ws \
        --ws.addr 0.0.0.0 \
        --ws.port 8546 \
        --ws.api eth,net,web3,personal,miner,admin,debug \
        --ws.origins '*' \
        --allow-insecure-unlock \
        --password /app/password.txt \
        --nodiscover \
        --maxpeers 0 \
        --mine \
        --miner.threads 1 \
        --miner.etherbase 0x947f0dC0B7462e022ae8B54DBCAC315E9Eba8b75 \
        --verbosity 3"]