# Use Alpine Linux as base with go-ethereum
FROM alpine:latest

# Install dependencies
RUN apk add --no-cache \
    bash \
    curl \
    jq \
    bc \
    ca-certificates

# Install Go Ethereum
RUN wget -O /tmp/geth.tar.gz https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.13.5-916d6a44.tar.gz && \
    cd /tmp && \
    tar -xzf geth.tar.gz && \
    mv geth-linux-amd64-*/geth /usr/local/bin/ && \
    rm -rf /tmp/geth*

# Set working directory
WORKDIR /app

# Create necessary directories
RUN mkdir -p /app/data /app/keystore /app/scripts

# Copy configuration files
COPY genesis.json /app/
COPY scripts/ /app/scripts/
COPY keystore/ /app/keystore/

# Make scripts executable
RUN chmod +x /app/scripts/*.sh

# Expose ports
# 8545: HTTP-RPC server
# 8546: WS-RPC server  
# 30303: P2P network
# 6060: Metrics server
EXPOSE 8545 8546 30303 6060

# Set default command
CMD ["/bin/bash", "/app/scripts/start.sh"]