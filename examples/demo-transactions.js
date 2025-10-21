#!/usr/bin/env node

/**
 * Simple ETH Transfer Demo - Works with any Ethereum testnet
 * This version manually manages the transaction without waiting for mining
 */

const { ethers } = require('ethers');

// Configuration
const RPC_URL = 'http://localhost:8545';
const CHAIN_ID = 1337;

// Test accounts with known private keys
const ACCOUNTS = {
    account1: {
        privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
        address: '0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf'
    },
    account2: {
        privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
        address: '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF'
    },
    account3: {
        privateKey: '0x7c852118294e51e653712a81e5800f419141751be58f605c371e15141b007a6',
        address: '0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69'
    }
};

async function checkBalances() {
    console.log('💰 Checking account balances...');
    
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    
    for (const [name, account] of Object.entries(ACCOUNTS)) {
        try {
            const balance = await provider.getBalance(account.address);
            console.log(`${name}: ${account.address} = ${ethers.formatEther(balance)} ETH`);
        } catch (error) {
            console.log(`${name}: Error - ${error.message}`);
        }
    }
}

async function sendETH() {
    try {
        console.log('🚀 Preparing to send ETH...');
        
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(ACCOUNTS.account1.privateKey, provider);
        
        const fromAddress = ACCOUNTS.account1.address;
        const toAddress = ACCOUNTS.account2.address;
        const amount = ethers.parseEther('0.5'); // Send 0.5 ETH
        
        console.log(`\n📤 From: ${fromAddress}`);
        console.log(`📥 To: ${toAddress}`);
        console.log(`💎 Amount: ${ethers.formatEther(amount)} ETH`);
        
        // Check network and balances
        const network = await provider.getNetwork();
        console.log(`🌐 Network: Chain ID ${network.chainId}`);
        
        const fromBalance = await provider.getBalance(fromAddress);
        const toBalance = await provider.getBalance(toAddress);
        
        console.log(`\n💰 Balances before:`);
        console.log(`From: ${ethers.formatEther(fromBalance)} ETH`);
        console.log(`To: ${ethers.formatEther(toBalance)} ETH`);
        
        // Get current gas price and nonce
        const feeData = await provider.getFeeData();
        const nonce = await provider.getTransactionCount(fromAddress);
        
        console.log(`\n⚙️ Transaction details:`);
        console.log(`Nonce: ${nonce}`);
        console.log(`Gas Price: ${ethers.formatUnits(feeData.gasPrice, 'gwei')} gwei`);
        
        // Create transaction
        const tx = {
            to: toAddress,
            value: amount,
            gasLimit: 21000,
            gasPrice: feeData.gasPrice,
            nonce: nonce,
            chainId: CHAIN_ID
        };
        
        // Sign and send transaction
        const signedTx = await wallet.signTransaction(tx);
        console.log(`\n📝 Transaction signed`);
        console.log(`Signed TX: ${signedTx}`);
        
        // Send raw transaction
        const txResponse = await provider.broadcastTransaction(signedTx);
        console.log(`\n📡 Transaction broadcasted: ${txResponse.hash}`);
        
        // Note: We don't wait for confirmation since there's no mining
        console.log(`\n✅ Transaction submitted successfully!`);
        console.log(`📋 Transaction Hash: ${txResponse.hash}`);
        console.log(`\n💡 Note: This transaction will be pending until mining is enabled.`);
        console.log(`🔧 To enable mining, you can run: curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"miner_start","params":[1],"id":1}' http://localhost:8545`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code) {
            console.error(`Error code: ${error.code}`);
        }
    }
}

async function main() {
    console.log('🌟 Ethereum Testnet Transaction Demo');
    console.log('=====================================\n');
    
    await checkBalances();
    console.log('\n' + '='.repeat(50) + '\n');
    await sendETH();
}

// Export functions for use as module
module.exports = { checkBalances, sendETH, ACCOUNTS };

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}