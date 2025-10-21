# Use the official Go Ethereum image
FROM ethereum/client-go:latest

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
CMD ["/app/scripts/start.sh"]