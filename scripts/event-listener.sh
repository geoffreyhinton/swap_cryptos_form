#!/bin/bash

# Blockchain Event Listener Manager
# Provides easy commands to start different types of blockchain event listeners

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
RPC_URL="http://localhost:8545"
WS_URL="ws://localhost:8546"

print_banner() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                  🔍 Blockchain Event Listener                ║"
    echo "║                                                              ║"
    echo "║  Listen to real-time blockchain events on your local testnet ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

check_dependencies() {
    echo -e "${YELLOW}🔍 Checking dependencies...${NC}"
    
    # Check if geth is running
    if ! curl -s "$RPC_URL" > /dev/null 2>&1; then
        echo -e "${RED}❌ Geth node is not running at $RPC_URL${NC}"
        echo -e "${YELLOW}💡 Start your Docker testnet first: docker-compose up -d${NC}"
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        echo -e "${YELLOW}💡 Install Node.js from https://nodejs.org/${NC}"
        exit 1
    fi
    
    # Check if ethers is available
    if ! node -e "require('ethers')" 2>/dev/null; then
        echo -e "${YELLOW}📦 Installing ethers.js...${NC}"
        npm install ethers
    fi
    
    echo -e "${GREEN}✅ All dependencies are ready!${NC}"
}

install_python_deps() {
    echo -e "${YELLOW}🐍 Installing Python dependencies...${NC}"
    
    # Check if Python3 is available
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}❌ Python3 is not installed${NC}"
        exit 1
    fi
    
    # Install Python dependencies
    pip3 install -r requirements.txt
    echo -e "${GREEN}✅ Python dependencies installed!${NC}"
}

show_menu() {
    echo -e "${BLUE}📋 Available Event Listeners:${NC}\n"
    echo "1. 🚀 Full Blockchain Listener (Node.js) - All events"
    echo "2. 💸 Transaction Monitor (Node.js) - Focus on transactions"
    echo "3. 🐍 Python Event Listener - Alternative implementation"
    echo "4. 📊 Quick Balance Check - Check current balances"
    echo "5. 🛠️  Install Python Dependencies"
    echo "6. ❌ Exit"
    echo
}

quick_balance_check() {
    echo -e "${YELLOW}💰 Checking current balances...${NC}"
    
    accounts=(
        "0x2c7536E3605D9C16a7a3D7b1898e529396a65c23:Main Account"
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC:Second Account"
        "0x90F79bf6EB2c4f870365E785982E1f101E93b906:Third Account"
    )
    
    for account_info in "${accounts[@]}"; do
        IFS=':' read -r address label <<< "$account_info"
        
        balance=$(curl -s -X POST -H "Content-Type: application/json" \
            --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"$address\",\"latest\"],\"id\":1}" \
            "$RPC_URL" | jq -r '.result')
        
        if [ "$balance" != "null" ] && [ "$balance" != "" ]; then
            # Convert hex to decimal and then to ETH
            balance_dec=$((16#${balance#0x}))
            balance_eth=$(echo "scale=6; $balance_dec / 1000000000000000000" | bc -l)
            echo -e "${GREEN}$label: $balance_eth ETH${NC}"
        else
            echo -e "${RED}$label: Error getting balance${NC}"
        fi
    done
    echo
}

run_full_listener() {
    echo -e "${GREEN}🚀 Starting Full Blockchain Event Listener...${NC}"
    echo -e "${YELLOW}📝 This will monitor: blocks, transactions, gas prices, and more${NC}"
    echo -e "${YELLOW}⏹️  Press Ctrl+C to stop${NC}\n"
    
    node scripts/blockchain-listener.js
}

run_transaction_monitor() {
    echo -e "${GREEN}💸 Starting Transaction Monitor...${NC}"
    echo -e "${YELLOW}📝 This will monitor transactions for your test accounts${NC}"
    echo -e "${YELLOW}⏹️  Press Ctrl+C to stop${NC}\n"
    
    node scripts/transaction-monitor.js
}

run_python_listener() {
    echo -e "${GREEN}🐍 Starting Python Event Listener...${NC}"
    echo -e "${YELLOW}📝 This is an alternative Python implementation${NC}"
    echo -e "${YELLOW}⏹️  Press Ctrl+C to stop${NC}\n"
    
    python3 scripts/blockchain-listener.py
}

main() {
    print_banner
    check_dependencies
    
    while true; do
        show_menu
        read -p "🔢 Select an option (1-6): " choice
        echo
        
        case $choice in
            1)
                run_full_listener
                ;;
            2)
                run_transaction_monitor
                ;;
            3)
                run_python_listener
                ;;
            4)
                quick_balance_check
                ;;
            5)
                install_python_deps
                ;;
            6)
                echo -e "${GREEN}👋 Goodbye!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Invalid option. Please choose 1-6.${NC}\n"
                ;;
        esac
        
        echo
        read -p "Press Enter to return to menu..."
        clear
    done
}

# Run main function
main "$@"