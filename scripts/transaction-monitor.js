#!/usr/bin/env node

/**
 * Simple Transaction Monitor
 * Monitors specific accounts for incoming/outgoing transactions
 */

const { ethers } = require('ethers');

class TransactionMonitor {
    constructor(rpcUrl = 'http://localhost:8545') {
        this.rpcUrl = rpcUrl;
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.monitoredAddresses = new Set();
        this.lastBlock = 0;
        this.isRunning = false;
    }

    async initialize() {
        try {
            console.log('🚀 Initializing Transaction Monitor...\n');
            
            const blockNumber = await this.provider.getBlockNumber();
            const network = await this.provider.getNetwork();
            
            console.log('✅ Connected to blockchain');
            console.log(`📦 Current Block: ${blockNumber}`);
            console.log(`🌐 Chain ID: ${network.chainId}`);
            console.log();
            
            this.lastBlock = blockNumber;
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize:', error.message);
            return false;
        }
    }

    addAddress(address, label = '') {
        this.monitoredAddresses.add({ address: address.toLowerCase(), label });
        console.log(`👀 Monitoring address: ${address} ${label ? `(${label})` : ''}`);
    }

    async checkNewTransactions() {
        try {
            const currentBlock = await this.provider.getBlockNumber();
            
            if (currentBlock > this.lastBlock) {
                // Check blocks from lastBlock+1 to currentBlock
                for (let blockNum = this.lastBlock + 1; blockNum <= currentBlock; blockNum++) {
                    await this.processBlock(blockNum);
                }
                this.lastBlock = currentBlock;
            }
        } catch (error) {
            console.error('❌ Error checking transactions:', error.message);
        }
    }

    async processBlock(blockNumber) {
        try {
            const block = await this.provider.getBlock(blockNumber, true);
            
            if (block && block.transactions.length > 0) {
                console.log(`\n📦 Processing Block #${blockNumber} (${block.transactions.length} transactions)`);
                
                for (const tx of block.transactions) {
                    await this.checkTransaction(tx, blockNumber);
                }
            }
        } catch (error) {
            console.error(`❌ Error processing block ${blockNumber}:`, error.message);
        }
    }

    async checkTransaction(tx, blockNumber) {
        const fromAddress = tx.from.toLowerCase();
        const toAddress = tx.to ? tx.to.toLowerCase() : null;
        
        // Check if any monitored address is involved
        const monitoredAddressArray = Array.from(this.monitoredAddresses);
        const fromMonitored = monitoredAddressArray.find(addr => addr.address === fromAddress);
        const toMonitored = toAddress ? monitoredAddressArray.find(addr => addr.address === toAddress) : null;
        
        if (fromMonitored || toMonitored) {
            const value = ethers.formatEther(tx.value);
            const gasPrice = ethers.formatUnits(tx.gasPrice, 'gwei');
            
            console.log(`\n💸 MONITORED TRANSACTION DETECTED`);
            console.log(`   Hash: ${tx.hash}`);
            console.log(`   Block: #${blockNumber}`);
            console.log(`   From: ${tx.from} ${fromMonitored ? `(${fromMonitored.label})` : ''}`);
            console.log(`   To: ${tx.to || 'Contract Creation'} ${toMonitored ? `(${toMonitored.label})` : ''}`);
            console.log(`   Value: ${value} ETH`);
            console.log(`   Gas Price: ${gasPrice} gwei`);
            console.log(`   Nonce: ${tx.nonce}`);
            
            if (fromMonitored) {
                console.log(`   🔴 OUTGOING from ${fromMonitored.label || 'monitored address'}`);
            }
            if (toMonitored) {
                console.log(`   🟢 INCOMING to ${toMonitored.label || 'monitored address'}`);
            }
            
            // Get transaction receipt for status
            try {
                const receipt = await this.provider.getTransactionReceipt(tx.hash);
                if (receipt) {
                    console.log(`   Status: ${receipt.status === 1 ? '✅ Success' : '❌ Failed'}`);
                    console.log(`   Gas Used: ${receipt.gasUsed.toString()}`);
                }
            } catch (error) {
                console.log(`   Receipt: ⏳ Pending`);
            }
            
            console.log(`   Timestamp: ${new Date().toISOString()}`);
        }
    }

    async start() {
        if (this.isRunning) {
            console.log('⚠️  Monitor is already running');
            return;
        }
        
        this.isRunning = true;
        console.log('🎯 Transaction monitor started! Checking every 2 seconds...\n');
        
        const monitorLoop = async () => {
            while (this.isRunning) {
                await this.checkNewTransactions();
                await sleep(2000); // Check every 2 seconds
            }
        };
        
        monitorLoop();
    }

    stop() {
        this.isRunning = false;
        console.log('\n🛑 Transaction monitor stopped');
    }

    async getAccountBalances() {
        console.log('\n💰 Current Balances:');
        for (const addr of this.monitoredAddresses) {
            try {
                const balance = await this.provider.getBalance(addr.address);
                const balanceEth = ethers.formatEther(balance);
                console.log(`   ${addr.address}: ${balanceEth} ETH ${addr.label ? `(${addr.label})` : ''}`);
            } catch (error) {
                console.log(`   ${addr.address}: Error getting balance`);
            }
        }
        console.log();
    }
}

// Helper function for sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// Fix the sleep issue
Object.defineProperty(global, 'sleep', {
    value: sleep,
    writable: false
});

// Main execution
async function main() {
    const monitor = new TransactionMonitor();
    
    // Initialize
    const initialized = await monitor.initialize();
    if (!initialized) {
        process.exit(1);
    }
    
    // Add your test accounts
    monitor.addAddress('0x2c7536E3605D9C16a7a3D7b1898e529396a65c23', 'Main Test Account');
    monitor.addAddress('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 'Second Test Account');
    monitor.addAddress('0x90F79bf6EB2c4f870365E785982E1f101E93b906', 'Third Test Account');
    
    // Show current balances
    await monitor.getAccountBalances();
    
    // Start monitoring
    await monitor.start();
    
    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n👋 Shutting down gracefully...');
        monitor.stop();
        process.exit(0);
    });
    
    // Manual checking loop (since we can't use setInterval with async properly)
    while (monitor.isRunning) {
        await monitor.checkNewTransactions();
        await sleep(2000);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { TransactionMonitor };