import {atariSwapRouterContract, atariSwapFactoryContract, wrappedNativeCoinAddress, atariWorldCoin, atariSwapPair} from './contracts'
import {ethers} from 'ethers';

const testnet = `https://bsc-dataseed1.ninicoin.io/`;
const provider = new ethers.providers.JsonRpcProvider(testnet);

const AtariSwapRouterContract = new ethers.Contract(atariSwapRouterContract.bsc, atariSwapRouterContract.abi, provider);
const AtariSwapFactoryContract = new ethers.Contract(atariSwapFactoryContract.bsc, atariSwapFactoryContract.abi, provider);
const AtariWorldCoin = new ethers.Contract (atariWorldCoin.bsc, atariWorldCoin.abi, provider);
const AtariSwapPair = new ethers.Contract (atariSwapPair.bsc, atariSwapPair.abi, provider);
const wNativeCoinAddress = wrappedNativeCoinAddress.bsc;

export {AtariSwapRouterContract, AtariSwapFactoryContract, AtariWorldCoin, wNativeCoinAddress, AtariSwapPair};