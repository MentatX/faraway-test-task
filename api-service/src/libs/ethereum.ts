/**
 * Ethereum routines
 * @see https://github.com/ethers-io/ethers.js
 *
 * @file ethereum.js
 * @author Oleg Kuzmenko
 */

import ethers from 'ethers';

import config from './config.js';
import logger from '../utils/logger.js';

const log = logger(import.meta.url);

const { formatEther, formatUnits } = ethers.utils;

const GAS_PRICE_RATE = 1;

const PROVIDER_URI = config.get('provider-uri');
const PRIVATE_KEY = config.get('operator:private-key');

// Connect to the Infura provider
const NETWORK = process.env.NODE_ENV === 'production' ? 'homestead' : /* 'goerli' */ 'sepolia';

const provider = new ethers.providers.StaticJsonRpcProvider(PROVIDER_URI);

// A Signer from a private key
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const contract:IContractData = {};


// NOTE: dummy in-memory storage
let DB = {
    events: {
        collectionCreated: [],
        tokenMinted: [],
    }
};

/**
 * Init Ethereum library.
 * @return {Promise<ILoaderStatus>} Resolve with init status.
 * @public
 */
export async function init(): Promise<ILoaderStatus> {
    let network = await provider.ready;
    
    /* if (network.name !== NETWORK) {
        throw new Error('Wrong network');
    } */

    contract.factory = await load('FarawayFactory');

    // TODO: add historical events for real indexer service.

    // NOTE: It's better to use block parser, but not live events listener.
    contract.factory.on('CollectionCreated', async (...params: never) => {
        // TODO: parse event to optimize DB
        DB.events.collectionCreated.push(params);

        log.debug(`Event::CollectionCreated [${params}]`);    
    });

    contract.factory.on('TokenMinted', async (...params: never) => {
        // TODO: parse event to optimize DB
        DB.events.tokenMinted.push(params);

        log.debug(`Event::TokenMinted [${params}]`);        
    });

    return { success: 1, message: `Ethereum OK [${network.name}]` };
}

/**
 * Load contracts and connect to the operator.
 * @param {string} name - Contract name.
 * @return {Promise<ethers.ethers.Contract>} Resolve with instance of the Contract with a Signer (RW).
 * @private
 */
async function load(name: string): Promise<ethers.ethers.Contract> {
    const abi = config.get(`contracts:${name}:abi`);
    const address = config.get(`contracts:${name}:address`);

    // We connect to the Contract using a Provider, so we will only
    // have read-only access to the Contract
    let contract = new ethers.Contract(address, abi, provider);

    // Create a new instance of the Contract with a Signer, which allows
    // update methods
    contract = contract.connect(wallet);

    log.info(`Load contract: [${address}]`);

    return contract;
}

/**
 * Get the Ethereum info.
 * @return {Promise<object>} Resolve with lib data.
 * @public
 */
async function info(): Promise<object> {
    let data = {};
    for (const key of Object.keys(contract)) {
        data = Object.assign(data, {
            [key]: {
                address: contract[key].address,
                collections: await contract[key].collections()
            }
        })
    }

    return {
        operator: {
            address: wallet.address,
            balance: formatEther(await wallet.getBalance()),
        },
        contract: data
    }
}

/**
 * Get raw events data.
 * @public
 */
function getEvents() {
    return DB.events;
}

/**
 * Get the ETH balance of an address.
 * @param {string} [address] - The address to get the balance of.
 * @return {Promise<string>} Resolve with the balance of an address in 'ethers' unit.
 * @public
 */
async function balance(address: string): Promise<string> {
    return formatEther(await provider.getBalance(address));
}

/**
 * Get gas price.
 * @return {Promise<number>} Resolve the current or normilized gas price.
 * @private
 */
async function getGasPrice(): Promise<number> {
    let gasPrice = await provider.getGasPrice();

    if (process.env.NODE_ENV !== 'production') {
        gasPrice = gasPrice.mul(GAS_PRICE_RATE);
    }

    return gasPrice.toNumber();
}

export default {
    info,
    balance,

    getEvents
}