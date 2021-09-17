import React from 'react';
import { useWallet, UseWalletProvider } from 'use-wallet'
import {useState, useEffect} from "react"
import {Grid} from '@material-ui/core';
import image4 from '../../assets/img/4.png';
import image5 from '../../assets/img/5.png';

function SwapForm (props) {
    
    const {token,  amount, handleAmount} = props;

    const [styledAmount, setStyledAmount] = useState(0)

    useEffect(()=>{
        if(amount !==0)
            setStyledAmount(parseFloat(Number(amount).toFixed(8)));
        else 
            setStyledAmount(amount);

    },[amount])

    return (
        <div className = "swapForm">
           
            <Grid container>
                <Grid item xs = {12} sm = {12} md = {4} style={{border:'1px solid gray', padding:10}}>
                    <span className = "x-font3 mr-3">{token}</span>
                </Grid>
                <Grid item xs = {12} sm = {12} md = {6} style={{border:'1px solid gray', padding:10}}>
                    <input type="number"  step = {0.1} className = "x-stakeCard-input" value={styledAmount} onChange = {handleAmount} />
                </Grid>
                <Grid item xs = {12} sm = {12} md = {2} style={{border:'1px solid gray', padding:10, justifyContent:'center', textAlign:'center'}}>
                    <img src={token==="AtariCoin"||token ==="Atari Token (ATRI)" ? image4 : image5} alt = "Coin" style={{height:"20px"}} />
                </Grid>
            </Grid>
            <span style={{color:'white', marginLeft:10}} >
                
            </span>
        </div>
    )
}

export default SwapForm;