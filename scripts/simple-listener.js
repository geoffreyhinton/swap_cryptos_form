#!/usr/bin/env node

/**
 * Simple Blockchain Event Listener
 * Reliable WebSocket-based event monitoring for your local testnet
 */

const { ethers } = require('ethers');

class SimpleBlockchainListener {
    constructor(rpcUrl = 'http://localhost:8545', wsUrl = 'ws://localhost:8546') {
        this.rpcUrl = rpcUrl;
        this.wsUrl = wsUrl;
        this.provider = null;
        this.wsProvider = null;
        this.isRunning = false;
        this.listeners = [];
        
        // Test accounts to monitor
        this.testAccounts = [
            '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
            '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
            '0x90F79bf6EB2c4f870365E785982E1f101E93b906'
        ];
    }

    async initialize() {
        try {
            console.log('🚀 Initializing Simple Blockchain Event Listener...\n');
            
            // HTTP provider for queries
            this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
            
            // WebSocket provider for events
            this.wsProvider = new ethers.WebSocketProvider(this.wsUrl);
            
            // Test connections
            const [httpBlock, wsBlock] = await Promise.all([
                this.provider.getBlockNumber(),
                this.wsProvider.getBlockNumber()
            ]);
            
            console.log('✅ HTTP Provider connected - Block:', httpBlock);
            console.log('✅ WebSocket Provider connected - Block:', wsBlock);
            console.log('🌐 Chain ID:', (await this.provider.getNetwork()).chainId.toString());
            console.log();
            
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize:', error.message);
            return false;
        }
    }

    async showNetworkStats() {
        try {
            const [blockNumber, network] = await Promise.all([
                this.provider.getBlockNumber(),
                this.provider.getNetwork()
            ]);

            console.log('📊 NETWORK STATISTICS');
            console.log(`   Latest Block: #${blockNumber}`);
            console.log(`   Chain ID: ${network.chainId}`);
            console.log(`   Network Name: ${network.name || 'Local Testnet'}`);
            
            // Show test account balances
            console.log('\n💰 Test Account Balances:');
            for (const account of this.testAccounts) {
                const balance = await this.provider.getBalance(account);
                const balanceEth = ethers.formatEther(balance);
                console.log(`   ${account.slice(0, 8)}...: ${balanceEth} ETH`);
            }
            console.log();
        } catch (error) {
            console.error('❌ Error getting network stats:', error.message);
        }
    }

    subscribeToBlocks() {
        console.log('📦 Subscribing to new blocks...');
        
        const blockListener = async (blockNumber) => {
            try {
                const block = await this.provider.getBlock(blockNumber, true);
                if (block) {
                    console.log(`\n🆕 NEW BLOCK #${blockNumber}`);
                    console.log(`   Hash: ${block.hash.slice(0, 16)}...`);
                    console.log(`   Timestamp: ${new Date(block.timestamp * 1000).toISOString()}`);
                    console.log(`   Transactions: ${block.transactions.length}`);
                    console.log(`   Gas Used: ${parseInt(block.gasUsed).toLocaleString()}`);
                    
                    // Process transactions in this block
                    if (block.transactions.length > 0) {
                        await this.processBlockTransactions(block);
                    }
                }
            } catch (error) {
                console.error('   ❌ Error fetching block:', error.message);
            }
        };

        this.wsProvider.on('block', blockListener);
        this.listeners.push({ event: 'block', listener: blockListener });
        
        return this;
    }

    async processBlockTransactions(block) {
        console.log(`   💸 Processing ${block.transactions.length} transaction(s)...`);
        
        for (const tx of block.transactions) {
            // Check if transaction involves our test accounts
            const fromIsTestAccount = this.testAccounts.includes(tx.from);
            const toIsTestAccount = tx.to && this.testAccounts.includes(tx.to);
            
            if (fromIsTestAccount || toIsTestAccount) {
                const value = ethers.formatEther(tx.value);
                const gasPrice = ethers.formatUnits(tx.gasPrice, 'gwei');
                
                console.log(`\n   👤 TEST ACCOUNT TRANSACTION`);
                console.log(`      Hash: ${tx.hash.slice(0, 16)}...`);
                console.log(`      From: ${tx.from.slice(0, 8)}... ${fromIsTestAccount ? '(Test Account)' : ''}`);
                console.log(`      To: ${tx.to ? tx.to.slice(0, 8) + '...' : 'Contract'} ${toIsTestAccount ? '(Test Account)' : ''}`);
                console.log(`      Value: ${value} ETH`);
                console.log(`      Gas Price: ${gasPrice} gwei`);
                console.log(`      Nonce: ${tx.nonce}`);
                
                if (fromIsTestAccount && toIsTestAccount) {
                    console.log(`      🔄 INTERNAL TRANSFER between test accounts`);
                } else if (fromIsTestAccount) {
                    console.log(`      🔴 OUTGOING from test account`);
                } else if (toIsTestAccount) {
                    console.log(`      🟢 INCOMING to test account`);
                }
            }
        }
    }

    subscribeToPendingTransactions() {
        console.log('⏳ Subscribing to pending transactions...');
        
        const pendingListener = async (txHash) => {
            try {
                const tx = await this.provider.getTransaction(txHash);
                if (tx) {
                    // Check if involves test accounts
                    const fromIsTestAccount = this.testAccounts.includes(tx.from);
                    const toIsTestAccount = tx.to && this.testAccounts.includes(tx.to);
                    
                    if (fromIsTestAccount || toIsTestAccount) {
                        const value = ethers.formatEther(tx.value);
                        console.log(`\n⏳ PENDING TEST ACCOUNT TRANSACTION`);
                        console.log(`   Hash: ${tx.hash.slice(0, 16)}...`);
                        console.log(`   From: ${tx.from.slice(0, 8)}... ${fromIsTestAccount ? '(Test)' : ''}`);
                        console.log(`   To: ${tx.to ? tx.to.slice(0, 8) + '...' : 'Contract'} ${toIsTestAccount ? '(Test)' : ''}`);
                        console.log(`   Value: ${value} ETH`);
                    }
                }
            } catch (error) {
                // Pending transactions often fail to fetch, this is normal
                // console.error('   ❌ Error fetching pending tx:', error.message);
            }
        };

        this.wsProvider.on('pending', pendingListener);
        this.listeners.push({ event: 'pending', listener: pendingListener });
        
        return this;
    }

    async startBalanceMonitor() {
        console.log('💰 Starting balance monitor...');
        
        // Get initial balances
        const initialBalances = {};
        for (const account of this.testAccounts) {
            try {
                initialBalances[account] = await this.provider.getBalance(account);
            } catch (error) {
                console.error(`Error getting initial balance for ${account}:`, error.message);
            }
        }
        
        // Monitor for changes
        const balanceChecker = async () => {
            for (const account of this.testAccounts) {
                try {
                    const currentBalance = await this.provider.getBalance(account);
                    
                    if (initialBalances[account] && currentBalance !== initialBalances[account]) {
                        const oldBalanceEth = ethers.formatEther(initialBalances[account]);
                        const newBalanceEth = ethers.formatEther(currentBalance);
                        const change = parseFloat(newBalanceEth) - parseFloat(oldBalanceEth);
                        
                        const direction = change > 0 ? '📈' : '📉';
                        console.log(`\n💰 BALANCE CHANGE ${direction}`);
                        console.log(`   Account: ${account.slice(0, 8)}...`);
                        console.log(`   Previous: ${oldBalanceEth} ETH`);
                        console.log(`   Current: ${newBalanceEth} ETH`);
                        console.log(`   Change: ${change > 0 ? '+' : ''}${change.toFixed(6)} ETH`);
                        
                        initialBalances[account] = currentBalance;
                    }
                } catch (error) {
                    console.error(`Error checking balance for ${account}:`, error.message);
                }
            }
        };
        
        // Check every 10 seconds
        const balanceInterval = setInterval(balanceChecker, 10000);
        this.listeners.push({ event: 'interval', listener: balanceInterval });
        
        return this;
    }

    async start() {
        if (this.isRunning) {
            console.log('⚠️ Listener is already running');
            return;
        }
        
        this.isRunning = true;
        
        // Initialize all subscriptions
        this.subscribeToBlocks()
            .subscribeToPendingTransactions();
        
        await this.startBalanceMonitor();
        
        console.log('🎯 Event listener is running! Press Ctrl+C to stop.\n');
        console.log('📝 Try sending a transaction through MetaMask to see events!\n');
        console.log('=' .repeat(80));
    }

    stop() {
        console.log('\n🛑 Stopping all event listeners...');
        this.isRunning = false;
        
        // Remove all listeners
        this.listeners.forEach(({ event, listener }) => {
            try {
                if (event === 'interval') {
                    clearInterval(listener);
                } else {
                    this.wsProvider.off(event, listener);
                }
                console.log(`   ✅ Stopped ${event} listener`);
            } catch (error) {
                console.error(`   ❌ Error stopping ${event} listener:`, error.message);
            }
        });
        
        this.listeners = [];
        
        if (this.wsProvider) {
            this.wsProvider.destroy();
        }
    }

    setupGracefulShutdown() {
        const shutdown = () => {
            console.log('\n\n👋 Shutting down gracefully...');
            this.stop();
            process.exit(0);
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    }
}

// Main execution
async function main() {
    const listener = new SimpleBlockchainListener();
    
    // Initialize
    const initialized = await listener.initialize();
    if (!initialized) {
        process.exit(1);
    }
    
    // Show initial stats
    await listener.showNetworkStats();
    
    // Setup graceful shutdown
    listener.setupGracefulShutdown();
    
    // Start listening
    await listener.start();
    
    // Keep the process running
    setInterval(() => {
        // This keeps the process alive
    }, 1000);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { SimpleBlockchainListener };