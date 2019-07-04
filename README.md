# BNBridge

### Features:
- [x] Swap a token from ERC20 to BEP2.


### Repository
## ./bnbridge
Front end website allowing for BNB to ERC bridge support.

## ./sdk
API used to interact with the CLI utility, Binance javascript SDK and Web3.js to enable BNB to ERC bridge utility.


### Installation
    git clone https://github.com/DOSNetwork/bnbridge.exchange.git
    ./install.sh  (Linux Environment)

    set (`DBUSER`, `DBNAME`, `DBPASSWORD`, `KEY`, `PRIVATE_KEY`) to environment variables.
    go to sdk/sql and run `<testnet/mainnet>-setup.sh` to instantiate the DB.
    Keep secrets (`PRIVATE_KEY`, `KEY`, `DBPASSWORD`) offline and to yourself.
    unset environment variables, specifically secrets, and clear bash history.
    update ./config/index.js with
        - databse connection details (the same value as `DBUSER`, `DBNAME`, `DBPASSWORD`).
        - Binance connection details for mainnet/testnet.
        - Ethereum connection details for mainnet/testnet.
    Config https keys and certifications for production.

    cd ./sdk
    node ./api.bnbridge.exchange.js
    or
    pm2 start api.bnbridge.exchange.js

    cd ../bnbridge
    vi ./src/config.js
    Modify config urls that the bnbridge.excahnge API is running at. (http://localhost:8000 by default)
