import React, { useEffect, useState } from 'react';
import './scss/App.scss';
import { ethers } from 'ethers';
import contract from './contracts/AkumaNFT.json';
import akumaTokens from './tokens.json';
import MintNftButton from './components/MintNftButton';
import Navbar from './components/Navbar';

const contractAddress = '0x639da6491C4c47254876AFcb9e88d15A61B39f2e';
const { abi } = contract;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [tokens, setTokens] = useState([]);

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

  const mintNftHandler = async (id, uri) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);
        await nftContract.mintToken(currentAccount, id, uri, { value: 10 });
      }
    } catch (err) {
      console.log(`eyy ${err}`);
    }
  };

  // const getNftsHandler = async () => {
  //   try {
  //     const { ethereum } = window;
  //
  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const nftContract = new ethers.Contract(contractAddress, abi, signer);
  //       const supply = await nftContract.totalSupply();
  //       console.log(supply);
  //       const tokens = [];
  //       for (let i = 1; i <= supply; i++) {
  //         const tokenURI = await nftContract.tokenURI(i);
  //         console.log(tokenURI);
  //         await fetch(tokenURI).then(async (response) => {
  //           tokens.push(await response.json());
  //         });
  //       }
  //       setTokens([...tokens]);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const connectWalletButton = () => (
    <button type="button" onClick={connectWalletHandler} className="cta-button btn-dark">
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
        <div className="row">
          {tokens.map((token) => (
            <div className="col-4" key={token?.image}>
              <h4>{token?.name}</h4>
              <img width="100%" src={token ? convertURL(token.image) : '/'} alt="" />
              <MintNftButton
                isMinted={token.isMinted}
                onClick={() => mintNftHandler(token.id, token.uri)}
              />
            </div>
          ))}
        </div>

        {/* {tests.map(test => { */}
        {/*    return ( */}
        {/*        <div> */}
        {/*            <h4>{test.name}</h4> */}
        {/*            <div>{mintNftButton()}</div> */}
        {/*        </div> */}
        {/*    )})} */}

      </div>
    </>

  );
}

export default App;
