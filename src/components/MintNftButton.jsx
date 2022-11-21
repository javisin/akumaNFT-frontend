import React from 'react';
import '../scss/button.scss';

function MintNftButton({ onClick, isMinted }) {
  return (
    <button disabled={isMinted} type="button" onClick={onClick} className="cta-button btn-dark">
      {isMinted ? 'Minted' : 'Mint NFT'}
    </button>
  );
}

export default MintNftButton;
