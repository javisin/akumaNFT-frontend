import React, { useEffect, useState } from 'react';
import '../scss/navbar.scss';
import { ethers, utils } from 'ethers';
import contract from '../contracts/AkumaNFT.json';
import { contractAddress, ownerAddress } from '../constants';

const { abi } = contract;

function AccountInfo({ currentAccount }) {
  const [contractBalance, setContractBalance] = useState('0');

  useEffect(() => {
    const checkContractBalance = async () => {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const balance = await provider.getBalance(contractAddress);
      setContractBalance(utils.formatEther(balance.toString()));
    };
    checkContractBalance();
  }, []);

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

  return (
    <div>
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
    </div>
  );
}

export default AccountInfo;
