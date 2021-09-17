import {Provider} from 'react-redux';
import store from "./store";
import Routes from './router';
import {UseWalletProvider } from 'use-wallet'
import React, { useState, useEffect } from 'react'
import logoImg from './assets/img/logo.png';
import './assets/style/bootstrap.min.css';
import './App.css';
import LoadingScreen from "react-loading-screen"
import {useApplicationContext} from './contexts'

function App() {
    const {chainId} = useApplicationContext();
    //console.log("context ",chainId)
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      setTimeout(() => setLoading(false), 4000)
    }, [])

  return (
    <LoadingScreen
    loading={loading}
    bgColor='#4d0000'
    spinnerColor='#9ee5f8'
    textColor='#ffffff'
    logoSrc={logoImg}
    text='Loading Screen'
    > 
        <UseWalletProvider
          chainId={chainId}   
          connectors={{
            // This is how connectors get configured
            portis: { dAppId: 'my-dapp-id-123-xyz' },
          }}
        > 
        <Provider store={store}>
              <Routes /> 
        </Provider>
        </UseWalletProvider>
    </LoadingScreen>
  );
}

export default App;
