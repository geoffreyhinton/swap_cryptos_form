#!/usr/bin/env node

/**
 * Quick Event Listener Demo
 * Simple demonstration of blockchain event subscription
 */

const { ethers } = require('ethers');

async function quickDemo() {
    console.log('🚀 Quick Blockchain Event Listener Demo\n');
    
    try {
        // Connect to your local testnet
        const provider = new ethers.JsonRpcProvider('http://localhost:8545');
        const wsProvider = new ethers.WebSocketProvider('ws://localhost:8546');
        
        // Test connection
        const blockNumber = await provider.getBlockNumber();
        console.log('✅ Connected to local testnet');
        console.log(`📦 Current Block: ${blockNumber}`);
        console.log(`🌐 Chain ID: ${(await provider.getNetwork()).chainId}`);
        console.log();
        
        // Your test accounts
        const testAccounts = [
            '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
            '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
            '0x90F79bf6EB2c4f870365E785982E1f101E93b906'
        ];
        
        // Show current balances
        console.log('💰 Current Account Balances:');
        for (const account of testAccounts) {
            const balance = await provider.getBalance(account);
            const balanceEth = ethers.formatEther(balance);
            console.log(`   ${account.slice(0, 8)}...: ${balanceEth} ETH`);
        }
        console.log();
        
        // Listen to new blocks
        console.log('👂 Listening for new blocks...');
        wsProvider.on('block', async (blockNumber) => {
            console.log(`\n🆕 New Block: #${blockNumber}`);
            
            try {
                const block = await provider.getBlock(blockNumber, true);
                console.log(`   Timestamp: ${new Date(block.timestamp * 1000).toISOString()}`);
                console.log(`   Transactions: ${block.transactions.length}`);
                
                // Check for transactions involving our accounts
                for (const tx of block.transactions) {
                    const isOurTx = testAccounts.includes(tx.from) || 
                                   (tx.to && testAccounts.includes(tx.to));
                    
                    if (isOurTx) {
                        const value = ethers.formatEther(tx.value);
                        console.log(`   💸 Our Transaction Found!`);
                        console.log(`      Hash: ${tx.hash.slice(0, 16)}...`);
                        console.log(`      From: ${tx.from.slice(0, 8)}...`);
                        console.log(`      To: ${tx.to ? tx.to.slice(0, 8) + '...' : 'Contract'}`);
                        console.log(`      Value: ${value} ETH`);
                    }
                }
            } catch (error) {
                console.log(`   ❌ Error fetching block details: ${error.message}`);
            }
        });
        
        console.log('🎯 Event listener is active!');
        console.log('📝 Send a transaction through MetaMask to see it in real-time!');
        console.log('⏹️  Press Ctrl+C to stop\n');
        console.log('=' .repeat(60));
        
        // Keep the script running
        process.on('SIGINT', () => {
            console.log('\n\n👋 Stopping event listener...');
            wsProvider.destroy();
            process.exit(0);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    quickDemo();
}

module.exports = { quickDemo };