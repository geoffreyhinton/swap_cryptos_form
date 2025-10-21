# Keystore Directory

This directory will contain the Ethereum account keystore files. Initially empty, accounts will be created automatically when the container starts.

## Pre-funded Test Accounts

The genesis configuration includes 10 pre-funded accounts with 10,000 ETH each:

- `0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf`
- `0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF`
- `0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69`
- `0x1efF47bc3a10a45D4B230B5d10E37751FE6AA718`
- `0xe1AB8145F7E55DC933d51a18c793F901A3A0b276`
- `0xE57bFE9F44b819898F47BF37E5AF72a0783e1141`
- `0xd41c057fd1c78805AAC12B0A94a405c0461A6FBb`
- `0xF1F6619B38A98d6De0800F1DefC0a6399eB6d30C`
- `0xF7Edc8FA1eCc32967F827C9043FcAe6ba73afA5c`
- `0x947f0dC0B7462e022ae8B54DBCAC315E9Eba8b75` (mining account)

## Adding Your Own Accounts

To add your own keystore files:
1. Place JSON keystore files in this directory
2. Rebuild the container
3. The accounts will be available when the node starts