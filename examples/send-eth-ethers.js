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
        
        // Create and send transaction
        const tx = await wallet.sendTransaction({
            to: TO_ADDRESS,
            value: amount,
            gasLimit: 21000,
            gasPrice: ethers.parseUnits('20', 'gwei')
        });
        
        console.log(`\n⏳ Transaction sent: ${tx.hash}`);
        console.log('Waiting for confirmation...');
        
        // Wait for confirmation
        const receipt = await tx.wait();
        
        console.log(`\n✅ Transaction confirmed!`);
        console.log(`Block number: ${receipt.blockNumber}`);
        console.log(`Gas used: ${receipt.gasUsed.toString()}`);
        
        // Check balances after transaction
        const fromBalanceAfter = await provider.getBalance(FROM_ADDRESS);
        const toBalanceAfter = await provider.getBalance(TO_ADDRESS);
        
        console.log(`\n💰 Balances after transaction:`);
        console.log(`From: ${ethers.formatEther(fromBalanceAfter)} ETH`);
        console.log(`To: ${ethers.formatEther(toBalanceAfter)} ETH`);
        
        console.log(`\n🎉 Successfully sent ${ethers.formatEther(amount)} ETH!`);
        
    } catch (error) {
        console.error('❌ Error sending transaction:', error.message);
    }
}

// Run if called directly
if (require.main === module) {
    sendTransaction();
}

module.exports = { sendTransaction };