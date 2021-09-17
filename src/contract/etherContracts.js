import {atariSwapRouterContract, atariSwapFactoryContract, wrappedNativeCoinAddress, atariWorldCoin, atariSwapPair} from './contracts'
import {ethers} from 'ethers';

const testnet = `https://lingering-solitary-water.quiknode.pro/8192d08b2f8d3bedd01226d7e6232b2c9dea4fcc/`;
const provider = new ethers.providers.JsonRpcProvider(testnet);

const AtariSwapRouterContract = new ethers.Contract(atariSwapRouterContract.mainnet, atariSwapRouterContract.abi, provider);
const AtariSwapFactoryContract = new ethers.Contract(atariSwapFactoryContract.mainnet, atariSwapFactoryContract.abi, provider);
const AtariWorldCoin = new ethers.Contract (atariWorldCoin.mainnet, atariWorldCoin.abi, provider);
const AtariSwapPair = new ethers.Contract (atariSwapPair.mainnet, atariSwapPair.abi, provider);
const wNativeCoinAddress = wrappedNativeCoinAddress.mainnet;

export {AtariSwapRouterContract, AtariSwapFactoryContract, AtariWorldCoin, wNativeCoinAddress, AtariSwapPair};