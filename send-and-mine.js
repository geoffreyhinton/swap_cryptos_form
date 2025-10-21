#!/usr/bin/env node

const { ethers } = require('ethers');

async function sendTransactionAndMine() {
    try {
        console.log('🚀 Sending transaction and enabling mining...\n');
        
        const provider = new ethers.JsonRpcProvider('http://localhost:8545');
        
        // Create wallet with your private key
        const privateKey = '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318';
        const wallet = new ethers.Wallet(privateKey, provider);
        
        console.log('👤 From Account:', wallet.address);
        console.log('💰 Initial Balance:', ethers.formatEther(await provider.getBalance(wallet.address)), 'ETH');
        
        // Send transaction to Account 2
        const toAddress = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';
        console.log('🎯 To Account:', toAddress);
        console.log('💰 Recipient Initial Balance:', ethers.formatEther(await provider.getBalance(toAddress)), 'ETH');
        
        console.log('\n📤 Sending 1 ETH...');
        
        const tx = await wallet.sendTransaction({
            to: toAddress,
            value: ethers.parseEther('1.0'),
            gasLimit: 21000,
            gasPrice: ethers.parseUnits('1', 'gwei')
        });
        
        console.log('✅ Transaction sent!');
        console.log('📋 Transaction Hash:', tx.hash);
        console.log('⏳ Waiting for confirmation...');
        
        // Wait for transaction to be mined
        const receipt = await tx.wait();
        
        if (receipt) {
            console.log('\n🎉 TRANSACTION CONFIRMED!');
            console.log('📦 Block Number:', receipt.blockNumber);
            console.log('⛽ Gas Used:', receipt.gasUsed.toString());
            console.log('💰 Status:', receipt.status === 1 ? 'Success' : 'Failed');
            
            // Check final balances
            console.log('\n💰 Final Balances:');
            console.log('From:', ethers.formatEther(await provider.getBalance(wallet.address)), 'ETH');
            console.log('To:', ethers.formatEther(await provider.getBalance(toAddress)), 'ETH');
            
            // Get block details
            const block = await provider.getBlock(receipt.blockNumber);
            console.log('\n📋 Block Details:');
            console.log('Hash:', block.hash);
            console.log('Timestamp:', new Date(block.timestamp * 1000).toISOString());
            console.log('Transactions:', block.transactions.length);
            
            return receipt;
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (error.message.includes('insufficient funds')) {
            console.log('\n💡 This might be a gas estimation issue.');
            console.log('Try using MetaMask instead for more reliable transaction sending.');
        }
        
        return null;
    }
}

// Simple mining activation
async function activateMining() {
    try {
        console.log('\n⛏️  Activating mining...');
        
        // Import the account into geth
        const importResponse = await fetch('http://localhost:8545', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'personal_importRawKey',
                params: [
                    '4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318', // without 0x prefix
                    'password' // simple password
                ],
                id: 1
            })
        });
        
        const importResult = await importResponse.json();
        console.log('Account import:', importResult);
        
        // Unlock the account
        const unlockResponse = await fetch('http://localhost:8545', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'personal_unlockAccount',
                params: [
                    '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
                    'password',
                    0 // unlock indefinitely
                ],
                id: 2
            })
        });
        
        const unlockResult = await unlockResponse.json();
        console.log('Account unlock:', unlockResult);
        
        // Set etherbase
        const etherbaseResponse = await fetch('http://localhost:8545', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'miner_setEtherbase',
                params: ['0x2c7536E3605D9C16a7a3D7b1898e529396a65c23'],
                id: 3
            })
        });
        
        const etherbaseResult = await etherbaseResponse.json();
        console.log('Set etherbase:', etherbaseResult);
        
        // Start mining
        const miningResponse = await fetch('http://localhost:8545', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'miner_start',
                params: [1],
                id: 4
            })
        });
        
        const miningResult = await miningResponse.json();
        console.log('Start mining:', miningResult);
        
    } catch (error) {
        console.log('Mining activation error:', error.message);
    }
}

if (require.main === module) {
    activateMining()
        .then(() => {
            console.log('\n⏳ Waiting 3 seconds for mining to start...');
            return new Promise(resolve => setTimeout(resolve, 3000));
        })
        .then(() => sendTransactionAndMine())
        .catch(console.error);
}