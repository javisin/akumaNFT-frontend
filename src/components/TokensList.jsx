import React, { useEffect, useState } from 'react';
import { ethers, utils } from 'ethers';
import akumaTokens from '../tokens.json';
import MintNftButton from './MintNftButton';
import { contractAddress } from '../constants';
import contract from '../contracts/AkumaNFT.json';

const { abi } = contract;

function TokensList({ currentAccount }) {
  const [tokens, setTokens] = useState([]);
  const [color, setColor] = useState('All');
  const [type, setType] = useState('All');

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
      const list = await Promise.all(akumaTokens.map(async (token) => {
        const response = await fetch(token.uri);
        const tokenData = await response.json();
        const isMinted = await checkTokenIsMinted(token.id);
        return {
          uri: token.uri,
          id: token.id,
          isMinted,
          ...tokenData,
        };
      }));
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

  const handleColorChange = (event) => {
    const { value } = event.target;
    setColor(value);
  };

  const handleTypeChange = (event) => {
    const { value } = event.target;
    setType(value);
  };

  const filteredTokens = tokens.filter((token) => {
    const colorAttribute = token.attributes.find((attribute) => attribute.trait_type === 'Color');
    const typeAttribute = token.attributes.find((attribute) => attribute.trait_type === 'Type');
    return (colorAttribute.value === color || color === 'All')
      && (typeAttribute.value === type || type === 'All');
  });

  return (
    <>
      <div className="row my-3">
        <label className="col-6 col-sm-3" htmlFor="color">
          Color
          <select className="d-block w-100" id="color" name="color" value={color} onChange={handleColorChange}>
            <option value="All">All</option>
            <option value="Yellow">Yellow</option>
            <option value="Black">Black</option>
          </select>
        </label>

        <label className="col-6 col-sm-3" htmlFor="type">
          Type
          <select className="d-block w-100" id="type" name="type" value={type} onChange={handleTypeChange}>
            <option value="All">All</option>
            <option value="Cap">Cap</option>
            <option value="T-Shirt">T-Shirt</option>
            <option value="Jumper">Jumper</option>
          </select>
        </label>
      </div>

      <div className="row">
        {filteredTokens.map((token) => (
          <div className="card col-12 col-sm-6 col-lg-4" key={token?.image}>
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
