import React, { useEffect, useState } from 'react';
import './scss/App.scss';
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
        console.log('Install metamask');
      }
    };
    checkWalletIsConnected();
  }, []);

  const connectWalletHandler = async () => {
    const { ethereum } = window;
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log(`account: ${accounts[0]}`);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="main-app">
        <AccountInfo currentAccount={currentAccount} />
        <div>
          {currentAccount
            ? (
              <span className="text-truncate d-inline-block w-100">
                Address:
                {currentAccount}
              </span>
            )
            : (
              <button type="button" onClick={connectWalletHandler} className="btn btn-dark p-2 ">
                Connect Wallet
              </button>
            )}
        </div>
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
