#!/usr/bin/env node

/**
 * Send ETH Transaction Example using ethers.js
 * This script shows how to send ETH from a pre-funded account
 */

const { ethers } = require('ethers');

// Configuration
const RPC_URL = 'http://localhost:8545';
const CHAIN_ID = 1337;

// Pre-funded account details (from genesis)
const FROM_PRIVATE_KEY = '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318';
const FROM_ADDRESS = '0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf';

// Destination account (you can change this)
const TO_ADDRESS = '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF';

async function sendTransaction() {
    try {
        console.log('🚀 Connecting to local Ethereum testnet...');
        
        // Create provider and signer
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(FROM_PRIVATE_KEY, provider);
        
        console.log(`📤 Sending from: ${FROM_ADDRESS}`);
        console.log(`📥 Sending to: ${TO_ADDRESS}`);
        
        // Check balances before transaction
        const fromBalanceBefore = await provider.getBalance(FROM_ADDRESS);
        const toBalanceBefore = await provider.getBalance(TO_ADDRESS);
        
        console.log(`\n💰 Balances before transaction:`);
        console.log(`From: ${ethers.formatEther(fromBalanceBefore)} ETH`);
        console.log(`To: ${ethers.formatEther(toBalanceBefore)} ETH`);
        
        // Transaction details
        const amount = ethers.parseEther('1.5'); // Send 1.5 ETH
        
        console.log(`\n📋 Transaction details:`);
        console.log(`Amount: ${ethers.formatEther(amount)} ETH`);
        
        // Check network info and get proper gas price
        const network = await provider.getNetwork();
        console.log(`Network Chain ID: ${network.chainId}`);
        
        // Use very low gas price for local testnet
        const gasPrice = ethers.parseUnits('1', 'gwei'); // Much lower gas price
        console.log(`Gas Price: ${ethers.formatUnits(gasPrice, 'gwei')} gwei`);
        
        // Create and send transaction with low gas price
        const tx = await wallet.sendTransaction({
            to: TO_ADDRESS,
            value: amount,
            gasLimit: 21000,
            gasPrice: gasPrice
        });
        
        console.log(`\n⏳ Transaction sent: ${tx.hash}`);
        console.log('Checking if mining is active...');
        
        // Check if mining is active
        try {
            const isMining = await provider.send('eth_mining', []);
            console.log(`Mining active: ${isMining}`);
            
            if (!isMining) {
                console.log('⚠️  Mining is not active. Transaction will remain pending.');
                console.log('💡 To enable mining, run:');
                console.log('   curl -X POST -H "Content-Type: application/json" --data \'{"jsonrpc":"2.0","method":"miner_start","params":[1],"id":1}\' http://localhost:8545');
                return;
            }
        } catch (e) {
            console.log('Could not check mining status');
        }
        
        console.log('Waiting for confirmation...');
        
        // Wait for confirmation with timeout
        try {
            const receipt = await tx.wait(1, 30000); // Wait max 30 seconds
            
            console.log(`\n✅ Transaction confirmed!`);
            console.log(`Block number: ${receipt.blockNumber}`);
            console.log(`Gas used: ${receipt.gasUsed.toString()}`);
        } catch (waitError) {
            console.log(`\n⏰ Transaction sent but not confirmed yet (this is normal for local testnets without mining)`);
            console.log(`Transaction hash: ${tx.hash}`);
            console.log(`You can check the transaction status later or enable mining.`);
        }
        
        // Check balances after transaction
        const fromBalanceAfter = await provider.getBalance(FROM_ADDRESS);
        const toBalanceAfter = await provider.getBalance(TO_ADDRESS);
        
        console.log(`\n💰 Balances after transaction:`);
        console.log(`From: ${ethers.formatEther(fromBalanceAfter)} ETH`);
        console.log(`To: ${ethers.formatEther(toBalanceAfter)} ETH`);
        
        console.log(`\n🎉 Successfully sent ${ethers.formatEther(amount)} ETH!`);
        
    } catch (error) {
        console.error('❌ Error sending transaction:', error.message);
        
        if (error.code === 'INSUFFICIENT_FUNDS') {
            console.log('\n💡 Troubleshooting tips:');
            console.log('1. Check if the account has enough ETH for gas fees');
            console.log('2. Try lowering the gas price');
            console.log('3. Make sure the node is properly initialized');
            console.log('4. Verify the account balance with: npm run check-balance');
        } else if (error.message.includes('gas')) {
            console.log('\n💡 Gas-related error. Try:');
            console.log('1. Lowering gas price to 0.1 gwei');
            console.log('2. Check if mining is enabled');
        }
        
        console.log('\n🔧 Debug info:');
        console.log('Network RPC:', RPC_URL);
        console.log('From Address:', FROM_ADDRESS);
        console.log('Chain ID:', CHAIN_ID);
    }
}

// Run if called directly
if (require.main === module) {
    sendTransaction();
}

module.exports = { sendTransaction };