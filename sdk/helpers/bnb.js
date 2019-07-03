const BnbApiClient = require('@binance-chain/javascript-sdk');
const axios = require('axios');
const config = require('../config')

const pty = require('node-pty');
const httpClient = axios.create({ baseURL: config.api });
const bnbClient = new BnbApiClient(config.api);
bnbClient.chooseNetwork(config.network);

const bnb = {

  validateAddress(address) {
    const addressValid = bnbClient.checkAddress(address);
    return addressValid
  },

  getFees(callback) {
    const url = `${config.api}api/v1/fees`;

    httpClient
      .get(url)
      .then((res) => {
        callback(null, res)
      })
      .catch((error) => {
        callback(error)
      });
  },

  transfer(mnemonic, publicTo, amount, asset, message, sequence, callback) {
    mnemonic = mnemonic.replace(/(\r\n|\n|\r)/gm, "");
    const privateFrom = BnbApiClient.crypto.getPrivateKeyFromMnemonic(mnemonic);
    const addressFrom = BnbApiClient.crypto.getAddressFromPrivateKey(privateFrom, config.prefix);
    bnbClient.setPrivateKey(privateFrom).then(_ => {
      bnbClient.initChain().then(_ => {
        // const sequence = res.data.sequence || 0
        console.log((new Date()).getTime())
        console.log("seq: " + sequence)
        return bnbClient.transfer(addressFrom, publicTo, amount, asset, message, sequence)
      })
      .then((result) => {
        if (result.status === 200) {
          callback(null, result)
        } else {
          callback(result)
        }
      })
      .catch((error) => {
        callback(error)
      });
    })
  },

  getBalance(address, callback) {
    bnbClient.getBalance(address).then((balances) => { callback(null, balances ) });
  },

  createAccountWithKeystore(password) {
    bncClient.createAccountWithKeystore(password)
  },

  createAccountWithMneomnic() {
    let result = bnbClient.createAccountWithMneomnic()
    return result
  },

  generateKeyStore(privateKey, password) {
    const result = BnbApiClient.crypto.generateKeyStore(privateKey, password);
    return result
  }

}

module.exports = bnb
