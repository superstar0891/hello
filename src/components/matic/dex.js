import React from 'react';
import {Grid} from '@material-ui/core';
import BuyCard2 from './buyCard2';
import LiquidityCard2 from './liquidity2'
import { useWallet, UseWalletProvider } from 'use-wallet'
import {useState, useEffect} from "react"
import image1 from '../../assets/img/1.png';
import image2 from '../../assets/img/matic-bg.png';
import image3 from '../../assets/img/3.png';
import image7 from '../../assets/img/7.png';
import { AtariWorldCoin,AtariSwapPair } from  "../../contract/maticContracts"

import {ethers} from "ethers";


function Dex(){
    const wallet = useWallet();
    const [connected, setConnected] = useState(false);
    const [toggleValue, setToggleValue] = useState(0);
    const [balance1, setBalance1] = useState(0);
    const [balance2, setBalance2] = useState(0);
    const [token1, setToken1] = useState("Matic (MATIC)");
    const [reserve0,setReserve0] = useState(0);
    const [reserve1,setReserve1] = useState(0);

    useEffect(() => {
        if(wallet.status==="connected"){
            setConnected(true);
        }
        else {
            setConnected(false);
        }
    }, [wallet.status])

    const handleToggleSwap = ()=>{
        setToggleValue(0);
    }

    const handleToggleLiquidity = ()=>{
        changeToken("Matic (MATIC)");
        setToggleValue(1);
    }

    async function getBalances(){
        
        var reserves =await AtariSwapPair.getReserves().catch(()=>{
            reserves = [0,0];
        });

        if(reserves ===undefined||reserves ==null){
            reserves = [0,0];
        }

        setReserve1(ethers.utils.formatUnits(reserves[0].toString()));
        setReserve0(ethers.utils.formatUnits(reserves[1].toString(),0));

        if(connected){
            const provider = new ethers.providers.Web3Provider(wallet.ethereum);
            const signer =await provider.getSigner();
            var signedAtariWorldCoin= AtariWorldCoin.connect(signer);
            var userAddress =await signer.getAddress();

            var balance1 =ethers.utils.formatUnits(await signedAtariWorldCoin.balanceOf(userAddress),0);
            var balance2 =ethers.utils.formatUnits(await signer.getBalance());

            setBalance1(balance1) ;
            setBalance2(balance2) ;
            //console.log(balance1.toString(),balance2);
        }
    }

    useEffect(() => {
        getBalances();
    },[connected])

    const changeToken = (token)=>{
        setToken1(token);
    }
    const FTMCard = ()=>{
        return (
            <div style={{display:'flex', textAlign:'right', justifyContent:'center'}}>
                <div style={{alignSelf:'center'}}>
                    <p style={{color:'white', fontSize:12, textAlign:'right'}}>Matic (MATIC)</p>
                    <p style={{color:'white', fontSize:25, fontWeight:700,textAlign:'right'}}>{parseFloat(Number(balance2).toFixed(4))}</p>
                </div>
                <div style={{marginLeft:0}}>
                    <img src={image2} alt="" style={{width:150}} />
                </div>
            </div>  
            )
        };

    const ATARICard = ()=>{
        return (
            <div style={{display:'flex', textAlign:'center',justifyContent:'center'}}>
                <div style={{marginLeft:0}}>
                    <img src={image1} alt="" style={{width:150}} />
                </div>
                <div style={{alignSelf:'center'}}>
                    <p style={{color:'white', fontSize:12, textAlign:'left'}}>Atari Token (ATRI)</p>
                    <p style={{color:'white', fontSize:25, fontWeight:700,textAlign:'left'}}>{parseFloat(Number(balance1).toFixed(4))}</p>
                </div>
            </div>           
        )
    }

    return(
        <div className = "x-defi-lp">
            <div className = 'x-defi-top-title mb-4'>
                decentralised exchange  
            </div>
            <Grid container className = "x-grid2">
                <Grid item xs = {12} sm = {12} md = {12}>
                    <Grid container>
                        <Grid item xs = {12} sm = {12} md = {4} lg={4}>
                            {token1==="Matic (MATIC)"?<FTMCard />:<ATARICard />}
                        </Grid>
                        <Grid item xs = {12} sm = {12} md = {4} lg={4} style={{alignSelf:'center'}}>
                            <div style={{marginLeft:5, alignSelf:'center', textAlign:'center'}}>
                                <img src={image3} alt="" style={{width:100}} />
                            </div>
                        </Grid>
                        <Grid item xs = {12} sm = {12} md = {4} lg={4}>
                            {token1!=="Matic (MATIC)"?<FTMCard />:<ATARICard />}
                        </Grid>

                    </Grid>
                    <div style={{textAlign:"center", marginBottom:80}}>
                        <img src={image7} alt="" style={{width:'100%'}} />
                        <Grid container>
                            <Grid item xs = {12} sm = {12} md = {4} lg={4}>
                                <span style={{color:'white', fontSize:15, textAlign:'right'}}>Pool liquidity</span>
                            </Grid>
                            <Grid item xs = {12} sm = {12} md = {4} lg={4} style={{alignSelf:'center'}}>
                                <span style={{color:'white', fontSize:15, textAlign:'right'}}>MATIC {parseFloat(Number(reserve1).toFixed(5))}</span>
                            </Grid>
                            <Grid item xs = {12} sm = {12} md = {4} lg={4}>
                            <span style={{color:'white', fontSize:15, textAlign:'right'}}>ATRI {reserve0}</span>
                            </Grid>
                        </Grid>
                    </div>
                    {/* toggle*/}
                    <div className = "toggle-buttons" style={{marginBottom:40}}>
                        <button className = "swap" onClick = {handleToggleSwap}> Swap</button>
                        <button className = "liquidity" onClick = {handleToggleLiquidity}>Liquidity</button>
                    </div>
                    {/* swap ,liquidity */}
                    {toggleValue===0?
                        <BuyCard2 changeToken = {changeToken} refreshData = {getBalances}/>:
                        <LiquidityCard2  refreshData = {getBalances}/>
                    }
                </Grid>
            </Grid>
        </div>
    )
}

export default Dex;