#!/usr/bin/env node

const { ethers } = require('ethers');

async function checkBlockchainStatus() {
    try {
        const provider = new ethers.JsonRpcProvider('http://localhost:8545');
        
        console.log('🔍 Blockchain Status Check\n');
        
        // Check current block number
        const blockNumber = await provider.getBlockNumber();
        console.log(`📦 Current Block Number: ${blockNumber}`);
        
        // Check if block 0 (genesis) exists
        if (blockNumber >= 0) {
            const block0 = await provider.getBlock(0);
            console.log(`\n📋 Genesis Block (Block 0):`);
            console.log(`  Hash: ${block0.hash}`);
            console.log(`  Timestamp: ${new Date(block0.timestamp * 1000).toISOString()}`);
            console.log(`  Transactions: ${block0.transactions.length}`);
        }
        
        // Check if there are any newer blocks
        if (blockNumber > 0) {
            console.log(`\n📋 Latest Block (Block ${blockNumber}):`);
            const latestBlock = await provider.getBlock(blockNumber);
            console.log(`  Hash: ${latestBlock.hash}`);
            console.log(`  Timestamp: ${new Date(latestBlock.timestamp * 1000).toISOString()}`);
            console.log(`  Transactions: ${latestBlock.transactions.length}`);
            
            // Show transaction details if any
            if (latestBlock.transactions.length > 0) {
                console.log(`\n💸 Transactions in Latest Block:`);
                for (let i = 0; i < latestBlock.transactions.length; i++) {
                    const tx = await provider.getTransaction(latestBlock.transactions[i]);
                    console.log(`  Transaction ${i + 1}:`);
                    console.log(`    Hash: ${tx.hash}`);
                    console.log(`    From: ${tx.from}`);
                    console.log(`    To: ${tx.to}`);
                    console.log(`    Value: ${ethers.formatEther(tx.value)} ETH`);
                    console.log(`    Gas Price: ${ethers.formatUnits(tx.gasPrice, 'gwei')} gwei`);
                }
            }
        }
        
        // Check account balances
        console.log(`\n💰 Account Balances:`);
        const accounts = [
            '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
            '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
            '0x90F79bf6EB2c4f870365E785982E1f101E93b906'
        ];
        
        for (let account of accounts) {
            const balance = await provider.getBalance(account);
            console.log(`  ${account}: ${ethers.formatEther(balance)} ETH`);
        }
        
        // Check pending transactions
        console.log(`\n⏳ Checking for pending transactions...`);
        try {
            const pendingBlock = await provider.getBlock('pending');
            if (pendingBlock && pendingBlock.transactions.length > 0) {
                console.log(`  Found ${pendingBlock.transactions.length} pending transactions`);
            } else {
                console.log(`  No pending transactions`);
            }
        } catch (error) {
            console.log(`  Could not check pending transactions: ${error.message}`);
        }
        
    } catch (error) {
        console.error('❌ Error checking blockchain:', error.message);
    }
}

// Also try to enable mining
async function enableMining() {
    try {
        console.log('\n⛏️  Attempting to enable mining...');
        
        // Try to set etherbase to one of our accounts
        const setEtherbaseResponse = await fetch('http://localhost:8545', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'miner_setEtherbase',
                params: ['0x2c7536E3605D9C16a7a3D7b1898e529396a65c23'],
                id: 1
            })
        });
        
        const etherbaseResult = await setEtherbaseResponse.json();
        console.log('Set etherbase result:', etherbaseResult);
        
        // Try to start mining
        const startMiningResponse = await fetch('http://localhost:8545', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'miner_start',
                params: [1],
                id: 2
            })
        });
        
        const miningResult = await startMiningResponse.json();
        console.log('Start mining result:', miningResult);
        
    } catch (error) {
        console.log('Mining setup error:', error.message);
    }
}

if (require.main === module) {
    checkBlockchainStatus()
        .then(() => enableMining())
        .then(() => {
            console.log('\n🔄 Waiting 5 seconds then rechecking...');
            setTimeout(() => checkBlockchainStatus(), 5000);
        })
        .catch(console.error);
}