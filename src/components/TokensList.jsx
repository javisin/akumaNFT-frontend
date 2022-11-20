import React, { useEffect, useState } from 'react';
import { ethers, utils } from 'ethers';
import akumaTokens from '../tokens.json';
import MintNftButton from './MintNftButton';
import { contractAddress } from '../constants';
import contract from '../contracts/AkumaNFT.json';

const { abi } = contract;

function TokensList({ currentAccount }) {
  const [tokens, setTokens] = useState([]);
  const [color, setColor] = useState('all');

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

  useEffect(() => {
    getNfts();
  }, []);

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

  const handleColorChange = (event) => {
    const { value } = event.target;
    setColor(value);
  };

  return (
    <>
      <select name="color" value={color} onChange={handleColorChange}>
        <option value="red">Red</option>
        <option value="black">Black</option>
      </select>
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
    </>
  );
}

export default TokensList;
