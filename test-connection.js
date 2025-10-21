#!/usr/bin/env node

/**
 * Quick test to verify RPC connection and account balance
 */

const { ethers } = require('ethers');

async function testConnection() {
    try {
        console.log('🔍 Testing RPC Connection...\n');
        
        const provider = new ethers.JsonRpcProvider('http://localhost:8545');
        
        // Test 1: Check network
        const network = await provider.getNetwork();
        console.log(`✅ Connected to network: Chain ID ${network.chainId}`);
        
        // Test 2: Check account balance
        const address = '0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf';
        const balance = await provider.getBalance(address);
        const balanceEth = ethers.formatEther(balance);
        
        console.log(`✅ Account: ${address}`);
        console.log(`✅ Balance: ${balanceEth} ETH`);
        
        // Test 3: Check if this matches what MetaMask should see
        console.log(`\n📋 MetaMask should show:`);
        console.log(`   Network: Chain ID 1337`);
        console.log(`   Balance: ${balanceEth} ETH`);
        console.log(`   Address: ${address}`);
        
        if (parseFloat(balanceEth) > 9999) {
            console.log(`\n🎉 SUCCESS! Your testnet is working correctly.`);
            console.log(`If MetaMask shows 0, it's a MetaMask connection issue.`);
        } else {
            console.log(`\n❌ ERROR: Expected balance ~10,000 ETH, got ${balanceEth} ETH`);
        }
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure Docker is running: docker-compose ps');
        console.log('2. Check RPC endpoint: curl http://localhost:8545');
        console.log('3. Restart testnet: docker-compose restart');
    }
}

testConnection().catch(console.error);