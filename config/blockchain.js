const { Alchemy, Network } = require("alchemy-sdk");
const { ethers } = require("ethers");

const { NETWORK_URL, PRIVATE_KEY } = require('../config/configContracts');

// Configuración de Alchemy
const config = {
    apiKey: "YBVW4zoplvrcqR4dlP4lXanRnfHiz71w",
    network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(config);

// Función para obtener el número de bloque
const getBlockNumber = async () => {
    try {
        const blockNumber = await alchemy.core.getBlockNumber();
        console.log('Último número de bloque:', blockNumber);
        return blockNumber;
    } catch (error) {
        console.error('Error al obtener el número del bloque:', error);
    }
};

// Configuración de ethers.js
const provider = new ethers.JsonRpcProvider(NETWORK_URL);

const signer = new ethers.Wallet(PRIVATE_KEY, provider);
getBlockNumber();
module.exports = { getBlockNumber, provider, signer };