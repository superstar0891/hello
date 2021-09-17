import React from 'react';
import { useWallet} from 'use-wallet'
import {useState, useEffect} from "react"
import {Grid} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import IconButton from '@material-ui/core/IconButton';
import SwapForm from './swapform';
import loadingScreen from "../../assets/img/box.gif";
import image6 from '../../assets/img/6.png';

import {AtariSwapRouterContract,AtariWorldCoin, wNativeCoinAddress, AtariSwapPair} from  "../../contract/maticContracts"
import {ethers} from "ethers";

function BuyCard2(props){
    const {changeToken,refreshData} = props;
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

    const [focus,setFocus] = useState(1);
    
    const [loading, setLoading] = useState(false);

    const [error,setError] = useState(false);

    const [initRate, setInitRate] = useState(0);
    const [cInitialRate, setcInitialRate] = useState(0);
    const [rate, setRate] = useState(0);
    const [priceImpact, setPriceImpact] = useState(0);

    //test
    useEffect(()=>{
        async function getData() {
            var reserves =await AtariSwapPair.getReserves();  
            var initRate =( Number ( ethers.utils.formatUnits(reserves[0].toString())))/
                            (Number(ethers.utils.formatUnits( reserves[1].toString(),0)));
            //console.log("initrate ",initRate);
            setInitRate(initRate);
        }
        if(connected) 
            getData();  
    },[connected])

    //conneted state
    useEffect(() => {
        if(wallet.status=="connected"){
            setConnected(true);
        }
        else {
            setConnected(false);
        }
    }, [wallet.status])
  
    // reverse
    const handleReverse = ()=>{
        var temp = token1;
        changeToken(token2);
        setToken1(token2);
        setToken2(temp);
    }


    useEffect(() => {
        if(focus===2){
            setAmount1(amount2);
        }
        else {
            setAmount2(amount1)
        }
        setFocus(focus===1?2:1);
    },[tokenAddress1])

    // setTokenaddress
    useEffect(()=>{
        var tokenAddress1 = token1=="Atari Token (ATRI)"? AtariWorldCoin.address:wNativeCoinAddress;
        setTokenAddress1(tokenAddress1);

        var tokenAddress2 = token2=="Atari Token (ATRI)"? AtariWorldCoin.address:wNativeCoinAddress;
        setTokenAddress2(tokenAddress2);

        async function getBalances(){
            if(connected){
                const provider = new ethers.providers.Web3Provider(wallet.ethereum);
                const signer =await provider.getSigner();
                var signedAtariWorldCoin= AtariWorldCoin.connect(signer);
                var userAddress =await signer.getAddress();

                var balance1 =ethers.utils.formatUnits(await signedAtariWorldCoin.balanceOf(userAddress),0);
                var balance2 =ethers.utils.formatUnits(await signer.getBalance());

                setBalance1(token1=="Atari Token (ATRI)"? balance1:balance2) ;
                setBalance2(token2=="Atari Token (ATRI)"? balance1:balance2) ;

                //console.log(balance1.toString(),balance2);
            }
        }
        getBalances();
    },[token1,token2,connected])

    //handleAmount 
    const handleAmount1 = async (e)=>{
        var value = token1==="Atari Token (ATRI)"?parseFloat(Number(e.target.value).toFixed(0)):parseFloat(Number(e.target.value).toFixed(18));
        setFocus(1);
        setAmount1(value);
        //console.log(amount1);
    } 

    const handleAmount2 = async (e)=>{
        var value = token2==="Atari Token (ATRI)"?parseFloat(Number(e.target.value).toFixed(0)):parseFloat(Number(e.target.value).toFixed(18));
        setFocus(2);
        setAmount2(value);
        //console.log(amount2);
    }

    //handle amount1 change
    useEffect(()=>{
        if(focus===1){
            if(amount1===0)
                setAmount2(0);
            else
                getAmountOut();
        }
    },[amount1])

    //handle amount2 change
    useEffect(()=>{
        if(focus===2){
            if(amount2===0)
                setAmount2(0);
            else
                getAmountIn();
        }
    },[amount2])

    const getAmountIn = async ()=>{
        var decimals1 = token1=="Atari Token (ATRI)"?0:18;
        var decimals2 = token1=="Atari Token (ATRI)"?18:0;

        var path = [tokenAddress1,tokenAddress2];
        //console.log(path)
        var pairData = await AtariSwapRouterContract.getAmountsIn(ethers.utils.parseUnits((Number(amount2).toFixed(decimals2)).toString(),decimals2),path)
        .catch((err)=>{
            //console.log(err);
            setAmount1(0);
        });
        if(pairData!=null){
            setAmount1(ethers.utils.formatUnits(pairData[0],decimals1));
            var rate = ethers.utils.formatUnits(pairData[0],decimals1) / ethers.utils.formatUnits(pairData[1],decimals2);
            setRate(rate);
        }

    }

    const getAmountOut = async ()=>{
        var decimals1 = token1=="Atari Token (ATRI)"?0:18;
        var decimals2 = token1=="Atari Token (ATRI)"?18:0;
        
        var path = [tokenAddress1,tokenAddress2];
        //console.log(path)
        //petCoin decimals
        var pairData = await AtariSwapRouterContract.getAmountsOut(ethers.utils.parseUnits((Number(amount1).toFixed(decimals1)).toString(),decimals1),path)
        .catch((err)=>{
            //console.log(err);
            setAmount2(0);
        });
        if(pairData!=null){
            setAmount2(ethers.utils.formatUnits(pairData[1],decimals2));
            var rate = ethers.utils.formatUnits(pairData[0],decimals1) / ethers.utils.formatUnits(pairData[1],decimals2);
            setRate(rate);
        }

    }

    //handle swap
    const handleSwap = async ()=>{
        if(connected&&error===false){
            setLoading(true);
            if(token1=="Atari Token (ATRI)"){
                await swapTokenToBNB().catch(()=>{
                    setLoading(false);
                });
            }
            else {
                await swapBNBToToken().catch(()=>{
                    setLoading(false);
                });
            }
            //console.log("handleswap : finish")
        }
    }

    const swapBNBToToken =async ()=>{
        var path = [tokenAddress1,tokenAddress2];

        const provider = new ethers.providers.Web3Provider(wallet.ethereum);
        const signer =await provider.getSigner();
        const signedAtariSwapRouterContract = AtariSwapRouterContract.connect(signer);
        var userAddress =await signer.getAddress();

        var date=new Date();
        var seconds = Math.floor(date.getTime() / 1000)+1000000;

        var BNBAmount = ethers.utils.parseUnits(amount1.toString());
        
        var tx =await signedAtariSwapRouterContract.swapExactETHForTokens(0,path,userAddress,seconds,{value:BNBAmount})
        .catch((err)=>{
            setLoading(false);
            //console.log(err);
        })

        if(tx!=null){
            await tx.wait();
            setLoading(false);
            refreshData();
        }

    }

    const swapToToken = async ()=>{

        var path = [tokenAddress1,tokenAddress2];

        const provider = new ethers.providers.Web3Provider(wallet.ethereum);
        const signer =await provider.getSigner();
        const signedAtariSwapRouterContract = AtariSwapRouterContract.connect(signer);
        var userAddress =await signer.getAddress();

        var date=new Date();
        var seconds = Math.floor(date.getTime() / 1000)+1000000;

        var TokenAmount = ethers.utils.parseUnits(amount1.toString(),0);
        
        //console.log("Swap to Eth",TokenAmount,0,path,userAddress,seconds)
        var tx =await signedAtariSwapRouterContract.swapExactTokensForETH(TokenAmount,0,path,userAddress,seconds)
        .catch((err)=>{
            setLoading(false);
            //console.log(err);
        })

        if(tx!=null){
            await tx.wait();
            setLoading(false);
            refreshData();
        }
    }

    const swapTokenToBNB =async ()=>{

        const provider = new ethers.providers.Web3Provider(wallet.ethereum);
        const signer =await provider.getSigner();
        var signedAtariWorldCoin= AtariWorldCoin.connect(signer);
        var userAddress =await signer.getAddress();

        var liquidityCoinAmount = ethers.utils.parseUnits(amount1.toString(),0);
        
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
                swapToToken();
            }
        }
        else {
            swapToToken();
        }
    }

    useEffect(()=>{
        //console.log(balance1,amount1.toString());
        if(Number(balance1)<Number(amount1))
            {
                setError(true);
            }
        else setError(false)
    },[amount1,balance1])
    
    // initial rate
    useEffect(()=>{
        if(Number(initRate)==0){
            setInitRate(0);
        }
        else {
            var cInitialRate = token1=="Atari Token (ATRI)"? 1/initRate:initRate;
            setcInitialRate(cInitialRate);
        }
    },[initRate,token1])

    //price impact
    useEffect(()=>{
        if(cInitialRate!=0&&rate!=0){
            var priceImpact = (rate-cInitialRate)*100/cInitialRate;
            priceImpact = parseFloat(priceImpact.toFixed(2));
            setPriceImpact(priceImpact);
        }
        else {
            setPriceImpact(0);
        }
    },[cInitialRate,rate])

    var styledRate =parseFloat(Number(rate===0?cInitialRate===0?"0":1/cInitialRate:1/rate).toFixed(3));

    return(
        <div className = "x-defi-buyCard2">
            <SwapForm token = {token1} from = "From" tokenAddress = {tokenAddress1} amount = {amount1} handleAmount = {handleAmount1}/>
            <div className="swap_middle">
                <div className = "text-left">
                    <IconButton color="primary" aria-label="upload picture" component="span"  onClick={handleReverse}>
                        <ArrowDownwardIcon style = {{color: "white"}}/>
                    </IconButton>
                    <span style={{color:'rgba(255,255,255,0.4)', fontSize:15}}>1 {token1} = {styledRate} {token2}</span>
                </div>
                <div style = {{ marginLeft:'auto',alignSelf:'center'}} className = "text-right">
                    <span style={{ fontWeight: "bold" ,color:'rgba(255,255,255,0.4)', fontSize:20}}>Price Impact {priceImpact}%</span>
                </div>
                <div style={{marginLeft:'auto', marginRight:40, alignSelf:'center'}} className = "text-right" onClick={handleReverse}>
                    <img src={image6} alt = ""/>
                </div>
            </div>
            
            <SwapForm token = {token2} from = "To" tokenAddress = {tokenAddress2} amount = {amount2} handleAmount = {handleAmount2}/>
            
            <div className = "text-center padding-top">
                <button className = "swap-button" onClick = {handleSwap}>{loading?<img src ={loadingScreen}  width = "40px" alt= "loading"/>:error===true?"Insufficient balance":"Swap"}</button>
            </div>
        </div>
    )
}

export default BuyCard2;