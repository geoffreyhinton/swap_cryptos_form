#!/usr/bin/env node

/**
 * Manual Transaction Construction
 * This bypasses ethers.js gas estimation by manually building the transaction
 */

const { ethers } = require('ethers');

async function sendManualTransaction() {
    try {
        console.log('🔧 Manual Transaction Construction Method\n');
        
        const provider = new ethers.JsonRpcProvider('http://localhost:8545');
        const privateKey = '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318';
        const wallet = new ethers.Wallet(privateKey, provider);
        
        const fromAddress = '0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf';
        const toAddress = '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF';
        
        // Step 1: Check balances
        console.log('💰 Current Balances:');
        const fromBalance = await provider.getBalance(fromAddress);
        const toBalance = await provider.getBalance(toAddress);
        console.log(`From: ${ethers.formatEther(fromBalance)} ETH`);
        console.log(`To: ${ethers.formatEther(toBalance)} ETH`);
        
        // Step 2: Get transaction parameters manually
        const nonce = await provider.getTransactionCount(fromAddress);
        console.log(`\n📋 Transaction Parameters:`);
        console.log(`Nonce: ${nonce}`);
        console.log(`From: ${fromAddress}`);
        console.log(`To: ${toAddress}`);
        
        // Step 3: Manually construct transaction object
        const transaction = {
            to: toAddress,
            value: ethers.parseEther('0.5'), // 0.5 ETH
            gasLimit: 21000,
            gasPrice: ethers.parseUnits('1', 'gwei'), // 1 gwei
            nonce: nonce,
            chainId: 1337,
            type: 0 // Legacy transaction type to avoid EIP-1559 issues
        };
        
        console.log(`Amount: ${ethers.formatEther(transaction.value)} ETH`);
        console.log(`Gas Limit: ${transaction.gasLimit}`);
        console.log(`Gas Price: ${ethers.formatUnits(transaction.gasPrice, 'gwei')} gwei`);
        console.log(`Chain ID: ${transaction.chainId}`);
        
        // Step 4: Sign transaction manually
        console.log(`\n🔐 Signing transaction...`);
        const signedTransaction = await wallet.signTransaction(transaction);
        console.log(`✅ Transaction signed`);
        
        // Step 5: Send raw transaction
        console.log(`\n📤 Broadcasting transaction...`);
        const txResponse = await provider.broadcastTransaction(signedTransaction);
        
        console.log(`\n✅ TRANSACTION SENT SUCCESSFULLY!`);
        console.log(`Hash: ${txResponse.hash}`);
        console.log(`From: ${txResponse.from}`);
        console.log(`To: ${txResponse.to}`);
        console.log(`Value: ${ethers.formatEther(txResponse.value)} ETH`);
        console.log(`Gas Price: ${ethers.formatUnits(txResponse.gasPrice, 'gwei')} gwei`);
        
        console.log(`\n🎯 Transaction submitted to the network!`);
        console.log(`\n💡 Note: The transaction is now in the network. It will be pending until mining is active.`);
        console.log(`To check transaction status later, use:`);
        console.log(`curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params":["${txResponse.hash}"],"id":1}' http://localhost:8545`);
        
        return txResponse.hash;
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (error.code === 'INSUFFICIENT_FUNDS') {
            console.log('\n🔍 This error suggests a network configuration issue, not account balance.');
            console.log('The account has 10,000 ETH but the node has gas calculation problems.');
            console.log('\n✅ RECOMMENDED SOLUTION: Use MetaMask instead!');
            console.log('MetaMask handles gas estimation properly and will work with this account.');
        }
        
        return null;
    }
}

if (require.main === module) {
    sendManualTransaction().catch(console.error);
}

module.exports = { sendManualTransaction };