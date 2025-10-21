#!/usr/bin/env python3

"""
Python Blockchain Event Listener
Alternative implementation using web3.py for WebSocket subscriptions
"""

import json
import asyncio
import websockets
import requests
from web3 import Web3
from datetime import datetime
import signal
import sys

class BlockchainEventListener:
    def __init__(self, rpc_url="http://localhost:8545", ws_url="ws://localhost:8546"):
        self.rpc_url = rpc_url
        self.ws_url = ws_url
        self.web3 = Web3(Web3.HTTPProvider(rpc_url))
        self.ws = None
        self.running = True
        
        # Test accounts
        self.test_accounts = [
            "0x2c7536E3605D9C16a7a3D7b1898e529396a65c23",
            "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
            "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
        ]
        
        # Setup signal handlers
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)

    def signal_handler(self, signum, frame):
        print("\n👋 Shutting down gracefully...")
        self.running = False
        if self.ws:
            asyncio.create_task(self.ws.close())
        sys.exit(0)

    async def initialize(self):
        """Initialize connections and verify connectivity"""
        try:
            print("🚀 Initializing Python Blockchain Event Listener...\n")
            
            # Test HTTP connection
            if self.web3.is_connected():
                block_number = self.web3.eth.block_number
                chain_id = self.web3.eth.chain_id
                print(f"✅ HTTP Provider connected - Block: {block_number}")
                print(f"🌐 Chain ID: {chain_id}")
                
                # Test WebSocket connection
                try:
                    self.ws = await websockets.connect(self.ws_url)
                    print("✅ WebSocket Provider connected")
                    print()
                    return True
                except Exception as e:
                    print(f"❌ WebSocket connection failed: {e}")
                    print("🔄 Falling back to HTTP polling mode")
                    return True
            else:
                print("❌ HTTP Provider connection failed")
                return False
                
        except Exception as e:
            print(f"❌ Failed to initialize: {e}")
            return False

    async def subscribe_to_blocks(self):
        """Subscribe to new block headers"""
        print("📦 Subscribing to new blocks...")
        
        if self.ws:
            # WebSocket subscription
            subscribe_msg = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "eth_subscribe",
                "params": ["newHeads"]
            }
            await self.ws.send(json.dumps(subscribe_msg))
            
            async for message in self.ws:
                if not self.running:
                    break
                    
                try:
                    data = json.loads(message)
                    if "params" in data and "result" in data["params"]:
                        block_header = data["params"]["result"]
                        await self.handle_new_block(block_header)
                except Exception as e:
                    print(f"❌ Error processing block message: {e}")
        else:
            # Fallback to polling
            await self.poll_for_blocks()

    async def handle_new_block(self, block_header):
        """Handle new block event"""
        try:
            block_number = int(block_header["number"], 16)
            block_hash = block_header["hash"]
            timestamp = int(block_header["timestamp"], 16)
            
            # Get full block details
            block = self.web3.eth.get_block(block_number, full_transactions=True)
            
            print(f"\n🆕 NEW BLOCK #{block_number}")
            print(f"   Hash: {block_hash[:16]}...")
            print(f"   Timestamp: {datetime.fromtimestamp(timestamp).isoformat()}")
            print(f"   Transactions: {len(block.transactions)}")
            print(f"   Gas Used: {block.gasUsed:,}")
            
            # Process transactions in this block
            for tx in block.transactions:
                await self.handle_transaction(tx, block_number, is_new=True)
                
        except Exception as e:
            print(f"❌ Error handling block: {e}")

    async def handle_transaction(self, tx, block_number=None, is_new=False):
        """Handle individual transaction"""
        try:
            value_eth = self.web3.from_wei(tx.value, 'ether')
            
            # Check if it involves our test accounts
            is_our_tx = (tx['from'] in self.test_accounts or 
                        (tx.to and tx.to in self.test_accounts))
            
            if is_our_tx or value_eth > 0:
                status = "NEW" if is_new else "CONFIRMED"
                print(f"\n💸 {status} TRANSACTION")
                print(f"   Hash: {tx.hash.hex()[:16]}...")
                print(f"   From: {tx['from'][:8]}...")
                print(f"   To: {tx.to[:8] + '...' if tx.to else 'Contract Creation'}")
                print(f"   Value: {value_eth} ETH")
                print(f"   Gas Price: {self.web3.from_wei(tx.gasPrice, 'gwei')} gwei")
                if block_number:
                    print(f"   Block: #{block_number}")
                
                # Check if it's our account
                if is_our_tx:
                    direction = "SENT" if tx['from'] in self.test_accounts else "RECEIVED"
                    print(f"   👤 {direction} by our account!")
                    
        except Exception as e:
            print(f"❌ Error handling transaction: {e}")

    async def poll_for_blocks(self):
        """Fallback polling method for blocks"""
        print("🔄 Using HTTP polling for blocks (WebSocket unavailable)")
        last_block = self.web3.eth.block_number
        
        while self.running:
            try:
                current_block = self.web3.eth.block_number
                
                if current_block > last_block:
                    # Process new blocks
                    for block_num in range(last_block + 1, current_block + 1):
                        block = self.web3.eth.get_block(block_num, full_transactions=True)
                        
                        print(f"\n🆕 NEW BLOCK #{block_num}")
                        print(f"   Hash: {block.hash.hex()[:16]}...")
                        print(f"   Timestamp: {datetime.fromtimestamp(block.timestamp).isoformat()}")
                        print(f"   Transactions: {len(block.transactions)}")
                        print(f"   Gas Used: {block.gasUsed:,}")
                        
                        for tx in block.transactions:
                            await self.handle_transaction(tx, block_num, is_new=True)
                    
                    last_block = current_block
                
                # Wait before next poll
                await asyncio.sleep(2)
                
            except Exception as e:
                print(f"❌ Error in block polling: {e}")
                await asyncio.sleep(5)

    async def monitor_account_balances(self):
        """Monitor balance changes for test accounts"""
        print("💰 Starting account balance monitor...")
        
        # Get initial balances
        balances = {}
        for account in self.test_accounts:
            try:
                balance = self.web3.eth.get_balance(account)
                balances[account] = balance
                balance_eth = self.web3.from_wei(balance, 'ether')
                print(f"   {account[:8]}...: {balance_eth:.4f} ETH")
            except Exception as e:
                print(f"❌ Error getting balance for {account}: {e}")
        
        print()
        
        # Monitor for changes
        while self.running:
            try:
                for account in self.test_accounts:
                    current_balance = self.web3.eth.get_balance(account)
                    
                    if account in balances and current_balance != balances[account]:
                        old_balance_eth = self.web3.from_wei(balances[account], 'ether')
                        new_balance_eth = self.web3.from_wei(current_balance, 'ether')
                        change = new_balance_eth - old_balance_eth
                        
                        direction = "📈" if change > 0 else "📉"
                        print(f"\n💰 BALANCE CHANGE {direction}")
                        print(f"   Account: {account[:8]}...")
                        print(f"   Previous: {old_balance_eth:.6f} ETH")
                        print(f"   Current: {new_balance_eth:.6f} ETH")
                        print(f"   Change: {change:+.6f} ETH")
                        
                        balances[account] = current_balance
                
                await asyncio.sleep(10)  # Check every 10 seconds
                
            except Exception as e:
                print(f"❌ Error monitoring balances: {e}")
                await asyncio.sleep(10)

    def show_network_stats(self):
        """Display network statistics"""
        try:
            block_number = self.web3.eth.block_number
            chain_id = self.web3.eth.chain_id
            gas_price = self.web3.eth.gas_price
            
            print("📊 NETWORK STATISTICS")
            print(f"   Latest Block: #{block_number}")
            print(f"   Chain ID: {chain_id}")
            print(f"   Gas Price: {self.web3.from_wei(gas_price, 'gwei')} gwei")
            print()
            
        except Exception as e:
            print(f"❌ Error getting network stats: {e}")

    async def run(self):
        """Main run method"""
        # Initialize
        if not await self.initialize():
            return
        
        # Show initial stats
        self.show_network_stats()
        
        # Start monitoring tasks
        tasks = [
            asyncio.create_task(self.subscribe_to_blocks()),
            asyncio.create_task(self.monitor_account_balances())
        ]
        
        print("🎯 Python Event listener is running! Press Ctrl+C to stop.\n")
        print("📝 Try sending a transaction through MetaMask to see events!\n")
        print("=" * 80)
        
        try:
            await asyncio.gather(*tasks)
        except KeyboardInterrupt:
            print("\n👋 Stopping event listener...")
        finally:
            for task in tasks:
                task.cancel()
            if self.ws:
                await self.ws.close()

async def main():
    listener = BlockchainEventListener()
    await listener.run()

if __name__ == "__main__":
    asyncio.run(main())