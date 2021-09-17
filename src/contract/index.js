import {atariSwapRouterContract, atariSwapFactoryContract, wrappedNativeCoinAddress, atariWorldCoin, atariSwapPair} from './contracts'
import {ethers} from 'ethers';

// const testnetRPC =  `https://fantom.infura.io/v3/0c5409f01bb944168d3bb4b03a674f15`;

const testnet = `https://bitter-falling-wildflower.fantom.quiknode.pro/0e59098f9c21e5fdfe83e1e37d7d895959000c8b/`;
// const testnet = "wss://rough-long-pond.matic.quiknode.pro/01a9046869df5462fd704ed75fafd477f014e12b/";
const provider = new ethers.providers.JsonRpcProvider(testnet);

const AtariSwapRouterContract = new ethers.Contract(atariSwapRouterContract.fantom, atariSwapRouterContract.abi, provider);
const AtariSwapFactoryContract = new ethers.Contract(atariSwapFactoryContract.fantom, atariSwapFactoryContract.abi, provider);
const AtariWorldCoin = new ethers.Contract (atariWorldCoin.fantom, atariWorldCoin.abi, provider);
const AtariSwapPair = new ethers.Contract (atariSwapPair.fantom, atariSwapPair.abi, provider);
const wNativeCoinAddress = wrappedNativeCoinAddress.fantom;

export {AtariSwapRouterContract, AtariSwapFactoryContract, AtariWorldCoin, wNativeCoinAddress, AtariSwapPair};