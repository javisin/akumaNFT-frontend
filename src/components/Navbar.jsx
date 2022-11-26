import React from 'react';
import '../scss/navbar.scss';
import logo from '../assets/logo.png';

function Navbar({ handleConnectWallet, currentAccount }) {
  return (
    <nav className="navbar navbar-dark bg-black text-white">
      <div className="col-4" />
      <div className="col-4 text-center">
        <img className="navbar-brand mb-0 text-center" src={logo} width="150px" alt="Akuma Logo" />
      </div>
      <div className="col-4 text-end">
        {currentAccount
          ? (
            <button type="button" disabled onClick={handleConnectWallet} className="btn btn-dark mt-0 p-2 navbar-text text-end me-3 ">
              {currentAccount.slice(0, 8)}
              ...
            </button>
          )
          : (
            <button type="button" onClick={handleConnectWallet} className="btn btn-dark mt-0 p-2 navbar-text text-end me-3 ">
              Connect Wallet
            </button>
          )}
      </div>
    </nav>
  );
}

export default Navbar;
