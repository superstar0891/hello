import React from 'react';
import {Grid} from '@material-ui/core';
import {Link} from 'react-router-dom';
import FTMDex from '../components/fantom/dex';
import EtherDex from '../components/ether/dex';
import BSCDex from '../components/bsc/dex';
import MaticDex from '../components/matic/dex';
import Nav from '../components/nav';
import {useApplicationContext} from '../contexts'

function Home(){
    const {chainId} = useApplicationContext();
    //console.log(chainId);
    return(
        <div>
        <Nav />
        <Grid container >
            <Grid item xs = {12} sm = {1} md = {1}>
            </ Grid>
            <Grid item xs = {12} sm = {10} md = {10}>
                {chainId === 1?<EtherDex />:chainId === 56?<BSCDex />:chainId === 137?<MaticDex />:<FTMDex />}
            </Grid>
            <Grid item xs = {12} sm = {1} md = {1}>
            </ Grid>
        </Grid>
        </div>
    )
}

export default Home;