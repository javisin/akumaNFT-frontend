import React, { useEffect, useState } from 'react';
import './scss/App.scss';
import { ethers, utils } from 'ethers';
import contract from './contracts/AkumaNFT.json';
import akumaTokens from './tokens.json';
import MintNftButton from './components/MintNftButton';
import Navbar from './components/Navbar';

const contractAddress = '0x334F14DA0f3168ff91fa20980856BdF67acF7807';
const ownerAddress = '0x92ba252219f8e5988ca2403985d6ebb261304ccc';
const { abi } = contract;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contractBalance, setContractBalance] = useState('0');
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const checkContractBalance = async () => {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const balance = await provider.getBalance(contractAddress);
      setContractBalance(utils.formatEther(balance.toString()));
    };
    checkContractBalance();
  }, []);

  const checkTokenIsMinted = async (tokenId) => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(contractAddress, abi, signer);
    try {
      await nftContract.tokenURI(tokenId);
      return true;
    } catch (err) {
      return false;
    }
  };

  const getNfts = async () => {
    try {
      const list = [];
      for (const token of akumaTokens) {
        const response = await fetch(token.uri);
        const tokenData = await response.json();
        const isMinted = await checkTokenIsMinted(token.id);
        list.push({
          uri: token.uri,
          id: token.id,
          isMinted,
          ...tokenData,
        });
      }
      setTokens([...list]);
    } catch (err) {
      console.log(err);
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log(`account: ${accounts[0]}`);
      setCurrentAccount(accounts[0]);
      await getNfts();
    } catch (err) {
      console.log(err);
    }
  };

  const withdraw = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);
        await nftContract.withdraw();
      }
    } catch (err) {
      console.log(`err: ${err}`);
    }
  };

  const mintNftHandler = async (id, uri) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);
        await nftContract.mintToken(currentAccount, id, uri, { value: utils.parseEther('0.01') });
      }
    } catch (error) {
      console.log(`err: ${error}`);
    }
  };

  const connectWalletButton = () => (
    <button type="button" onClick={connectWalletHandler} className="btn btn-dark p-2 ">
      Connect Wallet
    </button>
  );

  const convertURL = (url) => url.replace('ipfs://', 'https://ipfs.io/ipfs/');

  useEffect(() => {
    const checkWalletIsConnected = async () => {
      const { ethereum } = window;
      if (!ethereum) {
        console.log('Install metamask');
      }
    };
    checkWalletIsConnected();
  }, []);

  return (
    <>
      <Navbar />
      <div className="main-app">
        <div>
          {currentAccount ? `Address:${currentAccount}` : connectWalletButton()}
        </div>

        {currentAccount === ownerAddress && (
        <div className="my-4">
          <h5>
            Contract balance:
            {' '}
            {contractBalance}
          </h5>
          <button type="button" className="btn btn-dark m-0" onClick={withdraw}>
            Withdraw contract balance
          </button>
        </div>
        )}

        <div className="row">
          {tokens.map((token) => (
            <div className="card col-4" key={token?.image}>
              <div className="card-body">
                <h5 className="card-title">{token?.name}</h5>
              </div>
              <img className="mx-auto" width="75%" src={token ? convertURL(token.image) : '/'} alt="" />
              <div className="card-body">
                <MintNftButton
                  isMinted={token.isMinted}
                  onClick={() => mintNftHandler(token.id, token.uri)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>

  );
}

export default App;
