#!/usr/bin/env node

const { ethers } = require('ethers');

// The private key from our genesis.json
const privateKey = '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318';

console.log('🔐 Private Key Verification\n');

try {
    // Create wallet from private key
    const wallet = new ethers.Wallet(privateKey);
    
    console.log('Private Key:', privateKey);
    console.log('Expected Address:', wallet.address);
    console.log('Expected Address (lowercase):', wallet.address.toLowerCase());
    
    // Check if it matches our expected address
    const expectedAddress = '0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf';
    
    if (wallet.address.toLowerCase() === expectedAddress.toLowerCase()) {
        console.log('\n✅ CORRECT: Private key generates the expected address');
    } else {
        console.log('\n❌ ERROR: Address mismatch!');
        console.log('Expected:', expectedAddress);
        console.log('Generated:', wallet.address);
    }
    
} catch (error) {
    console.error('❌ Error:', error.message);
}

console.log('\n🔍 All Test Account Mappings:');

// Test all our private keys
const testAccounts = [
    {
        name: 'Account 1',
        privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
        expectedAddress: '0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf'
    },
    {
        name: 'Account 2', 
        privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
        expectedAddress: '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF'
    },
    {
        name: 'Account 3',
        privateKey: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
        expectedAddress: '0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69'
    }
];

testAccounts.forEach(account => {
    try {
        const wallet = new ethers.Wallet(account.privateKey);
        const matches = wallet.address.toLowerCase() === account.expectedAddress.toLowerCase();
        
        console.log(`\n${account.name}:`);
        console.log(`  Private Key: ${account.privateKey}`);
        console.log(`  Generated:   ${wallet.address}`);
        console.log(`  Expected:    ${account.expectedAddress}`);
        console.log(`  Match:       ${matches ? '✅' : '❌'}`);
        
    } catch (error) {
        console.log(`\n${account.name}: ❌ Error - ${error.message}`);
    }
});