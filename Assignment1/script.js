const ethers = require('ethers');
require("dotenv").config();

// CONNECT TO BLOCKCHAIN
const sepolia_provider = process.env.PROVIDER_SEPOLIA;
const ganache_provider = process.env.PROVIDER_GANCHE;
const key = process.env.PRIVATE_KEY;

// BRIDGE SMART CONTRACTS
const sepoliaAddress = process.env.SEPOLIA_SC;
const ganacheAddress = process.env.GANACHE_SC;

// TOKEN ADDRESSES
const tokenSepolia = process.env.TOKEN_SEPOLIA;
const tokenGanache = process.env.TOKEN_GANACHE;

// ABI
const SepoliaAbi = require('./JSON/SEPOLIA.json');
const GanacheAbi = require('./JSON/GANACHE.json');

const tokenAbi = require('./JSON/TOKEN.json');

// THE MAIN FUNCTION
const main = async () => {

// CONNECT TO GANACHE WALLET
console.log("Connecting to GANACHE TESTNET...");
const ganacheProvider = new ethers.providers.JsonRpcProvider(ganache_provider);
const ganacheWallet = new ethers.Wallet(String(key), ganacheProvider);
console.log("Connected! \n");

console.log("Connecting to SEPOLIA TESTNET...");
const sepoliaProvider = new ethers.providers.JsonRpcProvider(sepolia_provider);
const sepoliaWallet = new ethers.Wallet(String(key), sepoliaProvider);
console.log("Connected! \n");

// CONNECT TO THE BRIDGE SMART CONTRACT ON EACH NETWORK
console.log("Connecting to SEPOLIA BRIDGE SMART CONTRACT...");
let sepoliaBridge = new ethers.Contract(sepoliaAddress, SepoliaAbi, sepoliaWallet);
console.log("Connected! \n");

console.log("Connecting to GANACHE SMART CONTRACT...");
let ganacheBridge = new ethers.Contract(ganacheAddress, GanacheAbi, ganacheWallet);
console.log("Connected! \n");

// CONNECT TO THE TOKEN SMART CONTRACT ON EACH NETWORK
console.log("Connecting to SEPOLIA TOKEN SMART CONTRACT...");
let sepoliaToken = new ethers.Contract(tokenSepolia, tokenAbi, sepoliaWallet);
console.log("Connected! \n");

console.log("Connecting to GANACHE TOKEN SMART CONTRACT...");
let ganacheToken = new ethers.Contract(tokenGanache, tokenAbi, ganacheWallet);
console.log("Connected! \n");

// SEND TOKENS FROM SEPOLIA BRIDGE
const sendTokensFromSepolia = async (address, amount) => {
    try {
        console.log("Sending from Sepolia bridge...");
        console.log("To: " + address);
        console.log("Amount: " + amount);

        // Estimate gas limit
        let gasLimit = await sepoliaBridge.estimateGas.sendTokens(address, amount, {from: sepoliaWallet.address});

        let tx = await sepoliaBridge.sendTokens(address, amount, {from: sepoliaWallet.address, gasLimit: gasLimit.toString()});

        tx.wait();

        console.log("Sent!");

    } catch (error) {
        console.log("Error: " + error);
    }
}

// SEND TOKENS FROM GANACHE BRIDGE
const sendTokensFromGanache = async (address, amount) => {
    try {
        console.log("Sending from Ganache bridge...");
        console.log("To: " + address);
        console.log("Amount: " + amount);

        // Estimate gas limit
        let gasLimit = await ganacheBridge.estimateGas.sendTokens(address, amount, {from: ganacheWallet.address});

        let tx = await ganacheBridge.sendTokens(address, amount, {from: ganacheWallet.address, gasLimit: gasLimit.toString()});

        tx.wait();

        console.log("Sent!");

    } catch (error) {
        console.log("Error: " + error);
    }
}

// LISTEN FOR TRANSFER EVENTS ON SEPOLIA
sepoliaToken.on("Transfer", (from, to, value) => {
    let info = {
      from: from,
      to: to,
      value: value,
    };

    if(String(to) === sepoliaAddress) {
        try {
            sendTokensFromSepolia(String(info.from), String(info.value));
        } catch (error) {
            console.log("Error on transfer from sepolia bridge: " + error);
        }
    }
  });

// LISTEN FOR TRANSFER EVENTS ON GANACHE
ganacheToken.on("Transfer", (from, to, value) => {
    let info = {
      from: from,
      to: to,
      value: value,
    };

    if(String(to) === ganacheAddress) {
        try {
            sendTokensFromGanache(String(info.from), String(info.value));
        } catch (error) {
            console.log("Error on transfer from ganache bridge: " + error);
        }
    }
  });

} 

main();