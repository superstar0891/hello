import {atariSwapRouterContract, atariSwapFactoryContract, wrappedNativeCoinAddress, atariWorldCoin, atariSwapPair} from './contracts'
import {ethers} from 'ethers';

const testnet = `https://rough-long-pond.matic.quiknode.pro/01a9046869df5462fd704ed75fafd477f014e12b/`;
// const testnet = "wss://rough-long-pond.matic.quiknode.pro/01a9046869df5462fd704ed75fafd477f014e12b/";
const provider = new ethers.providers.JsonRpcProvider(testnet);

const AtariSwapRouterContract = new ethers.Contract(atariSwapRouterContract.matic, atariSwapRouterContract.abi, provider);
const AtariSwapFactoryContract = new ethers.Contract(atariSwapFactoryContract.matic, atariSwapFactoryContract.abi, provider);
const AtariWorldCoin = new ethers.Contract (atariWorldCoin.matic, atariWorldCoin.abi, provider);
const AtariSwapPair = new ethers.Contract (atariSwapPair.matic, atariSwapPair.abi, provider);
const wNativeCoinAddress = wrappedNativeCoinAddress.matic;

export {AtariSwapRouterContract, AtariSwapFactoryContract, AtariWorldCoin, wNativeCoinAddress, AtariSwapPair};