#!/usr/bin/env node

/**
 * Working ETH Transfer Demo
 * This script sends ETH transactions that work with local testnet
 */

const { ethers } = require('ethers');

// Configuration
const RPC_URL = 'http://localhost:8545';
const CHAIN_ID = 1337;

// Pre-funded account (from genesis.json)
const FROM_PRIVATE_KEY = '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318';
const FROM_ADDRESS = '0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf';
const TO_ADDRESS = '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF';

async function sendTransactionWithMining() {
    try {
        console.log('🚀 Starting ETH Transfer with Auto-Mining...\n');
        
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(FROM_PRIVATE_KEY, provider);
        
        // Step 1: Check balances
        console.log('💰 Current Balances:');
        const fromBalance = await provider.getBalance(FROM_ADDRESS);
        const toBalance = await provider.getBalance(TO_ADDRESS);
        console.log(`From: ${ethers.formatEther(fromBalance)} ETH`);
        console.log(`To: ${ethers.formatEther(toBalance)} ETH`);
        
        // Step 2: Enable mining with etherbase
        console.log('\n⛏️  Setting up mining...');
        try {
            // Set etherbase to one of our pre-funded accounts
            await provider.send('miner_setEtherbase', [FROM_ADDRESS]);
            console.log('✅ Etherbase set to:', FROM_ADDRESS);
            
            // Start mining
            await provider.send('miner_start', [1]);
            console.log('✅ Mining started');
        } catch (e) {
            console.log('⚠️  Mining setup failed:', e.message);
            console.log('Continuing anyway...');
        }
        
        // Step 3: Send transaction with very low gas
        console.log('\n📤 Sending Transaction...');
        const amount = ethers.parseEther('0.5'); // Send 0.5 ETH
        
        const tx = await wallet.sendTransaction({
            to: TO_ADDRESS,
            value: amount,
            gasLimit: 21000,
            gasPrice: ethers.parseUnits('0.1', 'gwei') // Very low gas price
        });
        
        console.log('✅ Transaction sent!');
        console.log('Hash:', tx.hash);
        console.log('From:', tx.from);
        console.log('To:', tx.to);
        console.log('Value:', ethers.formatEther(tx.value), 'ETH');
        
        // Step 4: Wait for confirmation
        console.log('\n⏳ Waiting for confirmation...');
        try {
            const receipt = await tx.wait(1, 15000); // Wait max 15 seconds
            console.log('✅ Transaction confirmed in block:', receipt.blockNumber);
            console.log('Gas used:', receipt.gasUsed.toString());
            
            // Step 5: Check final balances
            console.log('\n💰 Final Balances:');
            const fromBalanceFinal = await provider.getBalance(FROM_ADDRESS);
            const toBalanceFinal = await provider.getBalance(TO_ADDRESS);
            console.log(`From: ${ethers.formatEther(fromBalanceFinal)} ETH`);
            console.log(`To: ${ethers.formatEther(toBalanceFinal)} ETH`);
            
            const transferred = ethers.formatEther(toBalanceFinal - toBalance);
            console.log(`\n🎉 Successfully transferred ${transferred} ETH!`);
            
        } catch (waitError) {
            console.log('⏰ Transaction sent but confirmation timed out');
            console.log('This is normal for networks without active mining');
            console.log('Transaction hash:', tx.hash);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (error.code === 'INSUFFICIENT_FUNDS') {
            console.log('\n💡 The account might not have enough ETH for gas fees');
            console.log('Let me check the actual balance...');
            
            try {
                const provider = new ethers.JsonRpcProvider(RPC_URL);
                const balance = await provider.getBalance(FROM_ADDRESS);
                console.log('Current balance:', ethers.formatEther(balance), 'ETH');
                
                if (balance > 0) {
                    console.log('Account has funds. This might be a gas price or network issue.');
                }
            } catch (e) {
                console.log('Could not check balance');
            }
        }
    }
}

if (require.main === module) {
    sendTransactionWithMining().catch(console.error);
}

module.exports = { sendTransactionWithMining };