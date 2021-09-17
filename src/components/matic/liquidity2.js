import React from 'react';
import { useWallet, UseWalletProvider } from 'use-wallet'
import {useState, useEffect} from "react"
import {Grid} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import SwapForm from './swapform';
import loadingScreen from "../../assets/img/box.gif";

import {AtariSwapRouterContract, AtariWorldCoin, wNativeCoinAddress, AtariSwapPair} from "../../contract/maticContracts"
import {ethers} from "ethers";

function Liquidity2(props){
    const {refreshData} = props;
    const wallet = useWallet();
    const [connected, setConnected] = useState(false);
    const [token1, setToken1] = useState("Matic (MATIC)");
    const [token2, setToken2] = useState("Atari Token (ATRI)");
    const [tokenAddress1, setTokenAddress1] = useState("");
    const [tokenAddress2, setTokenAddress2] = useState("");
    const [balance1, setBalance1] = useState(0);
    const [balance2, setBalance2] = useState(0);
    const [amount1, setAmount1] = useState(0);
    const [amount2, setAmount2] = useState(0);
    const [amount3, setAmount3] = useState(0);
    const [reserve0,setReserve0] = useState(0);
    const [reserve1,setReserve1] = useState(0);
    const [lpBalance, setLpBalance] = useState(0);
    const [lpFTMBalance, setLpFTMBalance] = useState(0);
    const [lpATARIBalance, setLpATARIBalance] = useState(0);

    
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(false);
    const [error1,setError1] = useState(false);

    async function getData() {
        //console.log("getData")
        var reserves =await AtariSwapPair.getReserves().catch(()=>{
            reserves = [0,0];
        });

        if(reserves ===undefined||reserves ==null){
            reserves = [0,0];
        }

        setReserve1(ethers.utils.formatUnits(reserves[0].toString()));
        setReserve0(ethers.utils.formatUnits(reserves[1].toString(),0));

        //console.log("reserve",ethers.utils.formatUnits(reserves[0].toString()),ethers.utils.formatUnits( reserves[1].toString(),0));
        
        const provider = new ethers.providers.Web3Provider(wallet.ethereum);
        const signer =await provider.getSigner();
        var userAddress =await signer.getAddress();
        var lpBalance =await AtariSwapPair.balanceOf(userAddress);
        var totalSupply = await AtariSwapPair.totalSupply();
        var lpFTMBalance = (lpBalance/totalSupply).toString() *ethers.utils.formatUnits(reserves[0].toString());
        var lpATARIBalance = (lpBalance/totalSupply).toString() *ethers.utils.formatUnits(reserves[1].toString(),0);
        //console.log("lpBalance",lpBalance)

        setLpBalance(ethers.utils.formatUnits(lpBalance))
        setLpFTMBalance(lpFTMBalance);
        setLpATARIBalance(lpATARIBalance);
    }
    //test
    useEffect(()=>{
        if(connected)
            getData();  
    },[connected])

    //conneted state
    useEffect(() => {
        if(wallet.status==="connected"){
            setConnected(true);
        }
        else {
            setConnected(false);
        }
    }, [wallet.status])
  

    // setTokenaddress
    useEffect(()=>{
        var tokenAddress1 = token1==="Atari Token (ATRI)"? AtariWorldCoin.address:wNativeCoinAddress;
        setTokenAddress1(tokenAddress1);

        var tokenAddress2 = token2==="Atari Token (ATRI)"? AtariWorldCoin.address:wNativeCoinAddress;
        setTokenAddress2(tokenAddress2);

        async function getBalances(){
            if(connected){
                const provider = new ethers.providers.Web3Provider(wallet.ethereum);
                const signer =await provider.getSigner();
                var signedAtariWorldCoin= AtariWorldCoin.connect(signer);
                var userAddress =await signer.getAddress();

                var balance1 =ethers.utils.formatUnits(await signedAtariWorldCoin.balanceOf(userAddress),0);
                var balance2 =ethers.utils.formatUnits(await signer.getBalance());

                setBalance1(token1==="Atari Token (ATRI)"? balance1:balance2) ;
                setBalance2(token2==="Atari Token (ATRI)"? balance1:balance2) ;

                //console.log(balance1.toString(),balance2);
            }
        }
        getBalances();
    },[token1,token2,connected])

    
    useEffect(()=>{
        //console.log(balance1,amount1.toString());
        if(Number(balance1)<Number(amount1)||Number(balance2)<Number(amount2))
            {
                setError(true);
            }
        else setError(false)
    },[amount1,amount2])

    //handleAmount 
    const handleAmount1 = async (e)=>{
        setAmount1(e.target.value);
        if(reserve0!==0&&reserve1!==0){
            setAmount2(parseFloat(Number(e.target.value*reserve0/reserve1).toFixed(0)));
        }
        //console.log(amount1);
    } 

    const handleAmount2 = async (e)=>{
        setAmount2(parseFloat(Number(e.target.value).toFixed(0)));
        if(reserve0!==0&&reserve1!==0){
            setAmount1(parseFloat(Number(e.target.value).toFixed(0))*reserve1/reserve0);
        }
        //console.log(amount2);
    }
    
    const handleAmount3 = async (event, newValue)=>{
        setAmount3(newValue);
    }

    useEffect(()=>{
        if(Number(amount3*lpBalance/100)>Number(lpBalance))
            {
                setError1(true);
            }
        else setError1(false)
    },[amount3])

    const handleAddLiquidity = async () =>{
        if(connected&&error===false){
            setLoading(true)
            const provider = new ethers.providers.Web3Provider(wallet.ethereum);
            const signer =await provider.getSigner();
            var signedAtariWorldCoin= AtariWorldCoin.connect(signer);
            var userAddress =await signer.getAddress();

            var liquidityCoinAmount = ethers.utils.parseUnits((Number(amount2).toFixed(0)).toString(),0);
            
            //approve 
            var allowance =await signedAtariWorldCoin.allowance(userAddress,AtariSwapRouterContract.address);
            if(allowance<liquidityCoinAmount) {
                var tx = await signedAtariWorldCoin.approve(AtariSwapRouterContract.address,liquidityCoinAmount.mul(100))
                    .catch((err)=>{
                        //console.log(err);
                        setLoading(false)
                    });
                if(tx!=null){
                    await tx.wait();
                    addLiquidity();
                }
            }
            else {
                addLiquidity();
            }
        }
    }

    const addLiquidity = async ()=>{
        const provider = new ethers.providers.Web3Provider(wallet.ethereum);
        const signer =await provider.getSigner();
        var signedAtariSwapRouterContract = AtariSwapRouterContract.connect(signer);

        var liquidityBNBAmount = ethers.utils.parseUnits((Number(amount1).toFixed(18)).toString());
        var liquidityCoinAmount = ethers.utils.parseUnits((Number(amount2).toFixed(0)).toString(),0);
        var userAddress =await signer.getAddress();
        
		 var date=new Date();
		 var seconds = Math.floor(date.getTime() / 1000)+1000000;

        var tx =await signedAtariSwapRouterContract.addLiquidityETH(AtariWorldCoin.address,liquidityCoinAmount,0,0,userAddress,seconds,{value:liquidityBNBAmount})
        .catch((err)=>{
            //console.log(err)
            setLoading(false);
        })
        
        if(tx!=null){
            await tx.wait();
            setLoading(false);
            getData();  
            refreshData();
        }
    }
    
    const handleRemoveLiquidity = async () =>{
        if(connected&&error===false){
            setLoading(true)
            const provider = new ethers.providers.Web3Provider(wallet.ethereum);
            const signer =await provider.getSigner();
            var signedAtariSwapPair= AtariSwapPair.connect(signer);
            var userAddress =await signer.getAddress();

            var liquidityAmount = ethers.utils.parseUnits((amount3*lpBalance).toFixed(16).toString(),16);
            
            //approve 
            var allowance =await signedAtariSwapPair.allowance(userAddress,AtariSwapRouterContract.address);
            if(allowance<liquidityAmount) {
                var tx = await signedAtariSwapPair.approve(AtariSwapRouterContract.address,liquidityAmount.mul(100))
                    .catch((err)=>{
                        //console.log(err);
                        setLoading(false)
                    });
                if(tx!=null){
                    await tx.wait();
                    removeLiquidity();
                }
            }
            else {
                removeLiquidity();
            }
        }
    }

    const removeLiquidity =async ()=>{
        if(connected&&error1===false){
            setLoading(true)
            const provider = new ethers.providers.Web3Provider(wallet.ethereum);
            const signer =await provider.getSigner();
            var userAddress =await signer.getAddress();

            var date=new Date();
            var seconds = Math.floor(date.getTime() / 1000)+1000000;
            
            var signedAtariSwapRouterContract = AtariSwapRouterContract.connect(signer);

            var liquidityAmount = ethers.utils.parseUnits((amount3*lpBalance).toFixed(16).toString(),16);
            var tx =await signedAtariSwapRouterContract.removeLiquidityETH(AtariWorldCoin.address,liquidityAmount,0,0,userAddress,seconds)
            .catch((err)=>{
                //console.log(err);
                setLoading(false);
            })
            
            if(tx!=null){
                await tx.wait();
                setLoading(false);
                getData();  
                refreshData();
            }
        }
    }
    return(
        <div className = "x-defi-buyCard2">
            <div>
                <SwapForm token = {token1} from = "Balnace" tokenAddress = {tokenAddress1} amount = {amount1} handleAmount = {handleAmount1}/>
                <div className = "spacer"></div>
                <SwapForm token = {token2} from = "Balance" tokenAddress = {tokenAddress2} amount = {amount2} handleAmount = {handleAmount2}/>
                
                <Grid container className = "Lp-balance-field">
                    <Grid xs={12} sm={12} md={4}>
                        LP token Balance {parseFloat(Number(lpBalance).toFixed(12))}
                    </Grid>
                    <Grid xs={12} sm={12} md={4}>
                        MATIC {parseFloat(Number(lpFTMBalance).toFixed(4))}
                    </Grid>
                    <Grid xs={12} sm={12} md={4}>
                        ATARI {parseFloat(Number(lpATARIBalance).toFixed(0))}
                    </Grid>
                </Grid>
                
                <Grid container className = "Lp-balance-field">
                    <Grid xs={12} sm={12} md={4}>
                        Remove LP {parseFloat(Number(amount3*lpBalance/100).toFixed(12))}
                    </Grid>
                    <Grid xs={12} sm={12} md={4}>
                        <Slider value={amount3} onChange={handleAmount3} aria-labelledby="continuous-slider" />
                    </Grid>
                    <Grid xs={12} sm={12} md={4}>
                        {amount3}%
                    </Grid>
                </Grid>
                <div className = "text-center padding-top">
                    <button className = "liquidity-button" onClick={handleAddLiquidity} >{loading?<img src ={loadingScreen} alt = "loading" width = "40px"/>:error===true?"Insufficient balance":"Add Liquidity"}</button>
                    <button className = "liquidity-button" onClick={handleRemoveLiquidity} >{loading?<img src ={loadingScreen} alt = "loading" width = "40px"/>:error1===true?"Insufficient balance":"Remove Liquidity"}</button>
                </div>
            </div>
        </div>
    )
}

export default Liquidity2;