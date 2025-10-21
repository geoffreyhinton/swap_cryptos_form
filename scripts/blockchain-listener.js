#!/usr/bin/env node

/**
 * Blockchain Event Listener
 * Subscribes to various blockchain events in real-time
 */

const { ethers } = require('ethers');

class BlockchainEventListener {
    constructor(rpcUrl = 'http://localhost:8545', wsUrl = 'ws://localhost:8546') {
        this.rpcUrl = rpcUrl;
        this.wsUrl = wsUrl;
        this.provider = null;
        this.wsProvider = null;
        this.listeners = new Map();
    }

    async initialize() {
        try {
            console.log('🚀 Initializing Blockchain Event Listener...\n');
            
            // HTTP provider for general queries
            this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
            
            // WebSocket provider for real-time events
            this.wsProvider = new ethers.WebSocketProvider(this.wsUrl);
            
            // Test connections
            const [httpBlock, wsBlock] = await Promise.all([
                this.provider.getBlockNumber(),
                this.wsProvider.getBlockNumber()
            ]);
            
            console.log('✅ HTTP Provider connected - Block:', httpBlock);
            console.log('✅ WebSocket Provider connected - Block:', wsBlock);
            console.log('🌐 Chain ID:', await this.provider.getNetwork().then(n => n.chainId));
            console.log();
            
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize:', error.message);
            return false;
        }
    }

    // Listen to new blocks
    subscribeToBlocks() {
        console.log('📦 Subscribing to new blocks...');
        
        const blockListener = async (blockNumber) => {
            try {
                const block = await this.provider.getBlock(blockNumber);
                console.log(`\n🆕 NEW BLOCK #${blockNumber}`);
                console.log(`   Hash: ${block.hash.slice(0, 16)}...`);
                console.log(`   Timestamp: ${new Date(block.timestamp * 1000).toISOString()}`);
                console.log(`   Transactions: ${block.transactions.length}`);
                console.log(`   Gas Used: ${parseInt(block.gasUsed).toLocaleString()}`);
                
                if (block.transactions.length > 0) {
                    console.log(`   💸 Contains ${block.transactions.length} transaction(s)`);
                }
            } catch (error) {
                console.error('   ❌ Error fetching block:', error.message);
            }
        };

        this.wsProvider.on('block', blockListener);
        this.listeners.set('blocks', blockListener);
        
        return this;
    }

    // Listen to pending transactions
    subscribeToPendingTransactions() {
        console.log('⏳ Subscribing to pending transactions...');
        
        const pendingTxListener = async (txHash) => {
            try {
                const tx = await this.provider.getTransaction(txHash);
                if (tx) {
                    const value = ethers.formatEther(tx.value);
                    console.log(`\n⏳ PENDING TRANSACTION`);
                    console.log(`   Hash: ${tx.hash.slice(0, 16)}...`);
                    console.log(`   From: ${tx.from.slice(0, 8)}...`);
                    console.log(`   To: ${tx.to ? tx.to.slice(0, 8) + '...' : 'Contract Creation'}`);
                    console.log(`   Value: ${value} ETH`);
                    console.log(`   Gas Price: ${ethers.formatUnits(tx.gasPrice, 'gwei')} gwei`);
                }
            } catch (error) {
                console.error('   ❌ Error fetching pending tx:', error.message);
            }
        };

        this.wsProvider.on('pending', pendingTxListener);
        this.listeners.set('pending', pendingTxListener);
        
        return this;
    }

    // Listen to specific address transactions
    subscribeToAddressTransactions(address) {
        console.log(`👤 Subscribing to transactions for address: ${address}`);
        
        // Instead of using invalid filter, we'll monitor through block events
        // and check each transaction
        const addressListener = async (blockNumber) => {
            try {
                const block = await this.provider.getBlock(blockNumber, true);
                if (block && block.transactions) {
                    for (const tx of block.transactions) {
                        // Check if our address is involved
                        if (tx.from.toLowerCase() === address.toLowerCase() || 
                           (tx.to && tx.to.toLowerCase() === address.toLowerCase())) {
                            
                            const value = ethers.formatEther(tx.value);
                            const direction = tx.from.toLowerCase() === address.toLowerCase() ? 'SENT' : 'RECEIVED';
                            
                            console.log(`\n� ${direction} TRANSACTION (${address.slice(0, 8)}...)`);
                            console.log(`   Hash: ${tx.hash.slice(0, 16)}...`);
                            console.log(`   From: ${tx.from.slice(0, 8)}...`);
                            console.log(`   To: ${tx.to ? tx.to.slice(0, 8) + '...' : 'Contract Creation'}`);
                            console.log(`   Value: ${value} ETH`);
                            console.log(`   Block: #${blockNumber}`);
                        }
                    }
                }
            } catch (error) {
                console.error('   ❌ Error processing address transaction:', error.message);
            }
        };

        // Use block events to monitor transactions
        this.wsProvider.on('block', addressListener);
        this.listeners.set(`address_${address}`, addressListener);
        
        return this;
    }

    // Listen to contract events (if you have smart contracts)
    subscribeToContractEvents(contractAddress, abi) {
        console.log(`📋 Subscribing to contract events: ${contractAddress}`);
        
        try {
            const contract = new ethers.Contract(contractAddress, abi, this.wsProvider);
            
            // Listen to all events
            contract.on('*', (event) => {
                console.log(`\n📋 CONTRACT EVENT`);
                console.log(`   Contract: ${contractAddress.slice(0, 8)}...`);
                console.log(`   Event: ${event.event || 'Unknown'}`);
                console.log(`   Block: ${event.blockNumber}`);
                console.log(`   Transaction: ${event.transactionHash.slice(0, 16)}...`);
                console.log(`   Data:`, event.args);
            });
            
            this.listeners.set(`contract_${contractAddress}`, contract);
        } catch (error) {
            console.error('❌ Error setting up contract listener:', error.message);
        }
        
        return this;
    }

    // Listen to ERC-20 Transfer events (common pattern)
    subscribeToERC20Transfers(tokenAddress = null) {
        console.log('🪙 Subscribing to ERC-20 Transfer events...');
        
        try {
            // ERC-20 Transfer event signature: Transfer(address,address,uint256)
            const transferTopic = ethers.id('Transfer(address,address,uint256)');
            
            const filter = {
                topics: [transferTopic]
            };
            
            // If specific token address is provided, add it to the filter
            if (tokenAddress) {
                filter.address = tokenAddress;
            }

            const transferListener = (log) => {
                try {
                    // Decode the transfer event
                    const iface = new ethers.Interface(['event Transfer(address indexed from, address indexed to, uint256 value)']);
                    const decoded = iface.parseLog(log);
                    
                    if (decoded) {
                        const value = ethers.formatUnits(decoded.args.value, 18); // Assuming 18 decimals
                        console.log(`\n🪙 ERC-20 TRANSFER`);
                        console.log(`   Token: ${log.address.slice(0, 8)}...`);
                        console.log(`   From: ${decoded.args.from.slice(0, 8)}...`);
                        console.log(`   To: ${decoded.args.to.slice(0, 8)}...`);
                        console.log(`   Amount: ${value} tokens`);
                        console.log(`   Block: ${log.blockNumber}`);
                        console.log(`   Tx: ${log.transactionHash.slice(0, 16)}...`);
                    }
                } catch (error) {
                    console.error('   ❌ Error decoding transfer:', error.message);
                }
            };

            this.wsProvider.on(filter, transferListener);
            this.listeners.set('erc20_transfers', transferListener);
        } catch (error) {
            console.log('   ⚠️ ERC-20 event listening not available on this network');
        }
        
        return this;
    }

    // Monitor gas prices
    async startGasPriceMonitor() {
        console.log('⛽ Starting gas price monitor...');
        
        let lastGasPrice = null;
        
        const checkGasPrice = async () => {
            try {
                const feeData = await this.provider.getFeeData();
                const currentGasPrice = feeData.gasPrice;
                
                if (lastGasPrice && !currentGasPrice.eq(lastGasPrice)) {
                    const change = currentGasPrice.gt(lastGasPrice) ? '📈' : '📉';
                    console.log(`\n⛽ GAS PRICE CHANGE ${change}`);
                    console.log(`   Previous: ${ethers.formatUnits(lastGasPrice, 'gwei')} gwei`);
                    console.log(`   Current: ${ethers.formatUnits(currentGasPrice, 'gwei')} gwei`);
                }
                
                lastGasPrice = currentGasPrice;
            } catch (error) {
                console.error('   ❌ Error checking gas price:', error.message);
            }
        };

        // Check every 30 seconds
        setInterval(checkGasPrice, 30000);
        await checkGasPrice(); // Initial check
        
        return this;
    }

    // Get network statistics
    async showNetworkStats() {
        try {
            const [blockNumber, network, balance] = await Promise.all([
                this.provider.getBlockNumber(),
                this.provider.getNetwork(),
                this.provider.getBalance('0x2c7536E3605D9C16a7a3D7b1898e529396a65c23') // Your main test account
            ]);

            console.log('📊 NETWORK STATISTICS');
            console.log(`   Latest Block: #${blockNumber}`);
            console.log(`   Chain ID: ${network.chainId}`);
            console.log(`   Network Name: ${network.name || 'Unknown'}`);
            console.log(`   Test Account Balance: ${ethers.formatEther(balance)} ETH`);
            console.log();
        } catch (error) {
            console.error('❌ Error getting network stats:', error.message);
        }
    }

    // Stop all listeners
    stopAllListeners() {
        console.log('\n🛑 Stopping all event listeners...');
        
        for (const [name, listener] of this.listeners) {
            try {
                if (name.startsWith('contract_')) {
                    listener.removeAllListeners();
                } else if (name.startsWith('address_')) {
                    this.wsProvider.off('block', listener);
                } else if (name === 'erc20_transfers') {
                    // Remove ERC-20 transfer listener
                    this.wsProvider.removeAllListeners();
                } else {
                    this.wsProvider.off('block', listener);
                    this.wsProvider.off('pending', listener);
                }
                console.log(`   ✅ Stopped ${name} listener`);
            } catch (error) {
                console.error(`   ❌ Error stopping ${name}:`, error.message);
            }
        }
        
        this.listeners.clear();
        
        if (this.wsProvider) {
            this.wsProvider.destroy();
        }
    }

    // Handle graceful shutdown
    setupGracefulShutdown() {
        const shutdown = () => {
            console.log('\n\n👋 Shutting down gracefully...');
            this.stopAllListeners();
            process.exit(0);
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    }
}

// Main execution
async function main() {
    const listener = new BlockchainEventListener();
    
    // Initialize
    const initialized = await listener.initialize();
    if (!initialized) {
        process.exit(1);
    }
    
    // Show initial stats
    await listener.showNetworkStats();
    
    // Subscribe to various events
    listener
        .subscribeToBlocks()
        .subscribeToPendingTransactions()
        .subscribeToAddressTransactions('0x2c7536E3605D9C16a7a3D7b1898e529396a65c23') // Your main account
        .subscribeToAddressTransactions('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC') // Second account
        .subscribeToERC20Transfers(); // Listen to any ERC-20 transfers
    
    // Start gas price monitoring
    await listener.startGasPriceMonitor();
    
    // Setup graceful shutdown
    listener.setupGracefulShutdown();
    
    console.log('🎯 Event listener is running! Press Ctrl+C to stop.\n');
    console.log('📝 Try sending a transaction through MetaMask to see events in real-time!\n');
    console.log('=' .repeat(80));
    
    // Keep the process running
    setInterval(() => {
        // This keeps the process alive
    }, 1000);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { BlockchainEventListener };