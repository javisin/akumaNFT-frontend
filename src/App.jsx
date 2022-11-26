import React, { useEffect, useState } from 'react';
import './scss/App.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import TokensList from './components/TokensList';
import AccountInfo from './components/AccountInfo';

// TODO
// set price ~200$
// set max supply?
// design
// logo

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    const checkWalletIsConnected = async () => {
      const { ethereum } = window;
      if (!ethereum) {
        toast.info('Install metamask');
      }
    };
    checkWalletIsConnected();
  }, []);

  const connectWalletHandler = async () => {
    const { ethereum } = window;
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (err) {
      toast.error('Error connecting the wallet');
    }
  };

  return (
    <>
      <Navbar handleConnectWallet={connectWalletHandler} currentAccount={currentAccount} />
      <ToastContainer />
      <div className="main-app">
        <AccountInfo currentAccount={currentAccount} />
        {currentAccount
          && (
            <TokensList
              currentAccount={currentAccount}
            />
          )}
      </div>
    </>

  );
}

export default App;
