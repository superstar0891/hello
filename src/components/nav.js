import React, {useEffect, useState} from 'react';
import logoImg from '../assets/img/logo.png';
import metamaskimg from '../assets/img/metamask.png';
import { useWallet, UseWalletProvider } from 'use-wallet'
import {ethers} from "ethers"
import {useApplicationContext} from '../contexts';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

function Nav(){
    const wallet = useWallet();
    
    const {chainId,updateChainId} = useApplicationContext();
    const [chainError, setChainError] = useState(false);
    const [MMConnected, setMMConnected] = useState(false);
    const [chainName,setChainName] = useState("ETHEREUM");

    var styledAddress =wallet.account? wallet.account.slice(0,4)+".."+wallet.account.slice(-4):"";

    const handleConnect =async ()=>{
      //console.log(wallet.status,chainId)
      if(wallet.status!=="connected"){
        wallet.connect();
      } 
    }
    
    useEffect (()=>{
      if(wallet.status==="error"){
        alert("Plase change chain to right chain")
      }
      if(wallet.status === "connected"){
        setMMConnected(true);
      }
    },[wallet.status])

    async function checkConnection(){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if(accounts.length!==0){
          //chainId
          const { chainId } = await provider.getNetwork();
          var chainError = updateChainId(chainId);
          setChainError(chainError);

          //mm connection
          setMMConnected(true);
          wallet.connect();
      }
    }

    useEffect (()=>{
      if(window.ethereum !==undefined)
        checkConnection();
    },[chainId]);


    useEffect (()=>{
      async function getChainId(){
        //console.log("wallet.status",wallet.status);
        if(wallet.status==="connected"||wallet.status==="connecting"){
          if(window.ethereum !==undefined){
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const { chainId } = await provider.getNetwork();
          var chainError = updateChainId(chainId);
          setChainError(chainError);
        }
        }
        else if(wallet.status==="disconnected"||wallet.status==="error"){
          setMMConnected(false);
        }
      }
      getChainId();
    },[wallet.status])

    useEffect (()=>{
      if(window.ethereum !==undefined&&MMConnected === true)
        window.ethereum.on('chainChanged', (chainId) => {
          var chainError;
          //console.log("chainError",chainError,chainId)
          var chainError = updateChainId(chainId);
          //console.log("chainError",chainError,chainId)
          setChainError(chainError);
        });
    },[MMConnected])

    // chain IDs
    useEffect (()=>{
      if(chainId ===1) setChainName("ETHEREUM");
      else if(chainId ===56) setChainName("BSC");
      else if(chainId ===137) setChainName("MATIC");
      else if(chainId ===250) setChainName("FANTOM");
    },[chainId])

    const options = [
      { value: 1, label: "ETHEREUM" },
      { value: 56, label: "BSC" },
      { value: 137, label: "MATIC" },
      { value: 250, label: "FANTOM" }
    ];

    const handleChainChange = (e) => {
      //console.log(e);
      
      if(MMConnected===false)
        {
          updateChainId(e.value)
        }
    }

    return(
      <div className = "x-navContainer">
        <img src = {logoImg} alt = "logo" width = "100px" height = "40px"/>
        <div className = "x-nav-buttons">
        <Dropdown options={options} onChange={handleChainChange} value={chainName} placeholder="Select an option" disabled={MMConnected}/>;
        <button className = "x-nav-connect" onClick={handleConnect} >
          <img src={metamaskimg} alt ="icon" width = "25px" height = "25px" className = "x-image-center" />
          <span style = {{marginLeft:"10px"}}> {wallet.status === 'connected' ?styledAddress:"CONNECT"}</span>
        </ button>
        </div>
        </div>
    )
}

export default Nav;