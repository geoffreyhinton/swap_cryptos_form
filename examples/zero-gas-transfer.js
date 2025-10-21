#!/usr/bin/env node

/**
 * Zero-Gas ETH Transfer 
 * This bypasses gas issues by using zero gas price
 */

const { ethers } = require('ethers');

async function sendWithZeroGas() {
    try {
        console.log('🚀 Attempting zero-gas transaction...\n');
        
        const provider = new ethers.JsonRpcProvider('http://localhost:8545');
        const privateKey = '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318';
        const wallet = new ethers.Wallet(privateKey, provider);
        
        const fromAddress = '0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf';
        const toAddress = '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF';
        
        console.log('💰 Checking balances...');
        const fromBalance = await provider.getBalance(fromAddress);
        const toBalance = await provider.getBalance(toAddress);
        console.log(`From: ${ethers.formatEther(fromBalance)} ETH`);
        console.log(`To: ${ethers.formatEther(toBalance)} ETH`);
        
        console.log('\n📤 Sending with zero gas price...');
        
        // Try with zero gas price
        const tx = await wallet.sendTransaction({
            to: toAddress,
            value: ethers.parseEther('0.1'), // Small amount
            gasLimit: 21000,
            gasPrice: 0 // Zero gas price
        });
        
        console.log('✅ Transaction sent with zero gas!');
        console.log('Hash:', tx.hash);
        console.log('From:', tx.from);
        console.log('To:', tx.to);
        console.log('Value:', ethers.formatEther(tx.value), 'ETH');
        console.log('Gas Price:', tx.gasPrice, 'wei');
        
        console.log('\n🎯 Transaction submitted successfully!');
        console.log('Note: Transaction may not be mined without active mining, but it shows the accounts work.');
        
    } catch (error) {
        console.error('❌ Zero gas failed:', error.message);
        
        if (error.message.includes('insufficient funds')) {
            console.log('\n🔍 Let me check the network configuration...');
            
            try {
                const provider = new ethers.JsonRpcProvider('http://localhost:8545');
                
                // Check network
                const network = await provider.getNetwork();
                console.log('Network Chain ID:', network.chainId.toString());
                
                // Check gas price
                const feeData = await provider.getFeeData();
                console.log('Network gas price:', ethers.formatUnits(feeData.gasPrice, 'gwei'), 'gwei');
                
                // Check nonce
                const nonce = await provider.getTransactionCount('0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf');
                console.log('Account nonce:', nonce);
                
            } catch (e) {
                console.log('Could not get network info');
            }
        }
    }
}

if (require.main === module) {
    sendWithZeroGas().catch(console.error);
}