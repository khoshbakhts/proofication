import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';

export default function Header() {
  const { account, connectWallet } = useWeb3();

  return (
    <div className="header">
      <div className="header-content">
        <h1>سامانه ثبت اسناد بلاکچین</h1>
        {account ? (
          <div className="wallet-info">
            <span>کیف پول متصل:</span>
            <span className="wallet-address">{account}</span>
          </div>
        ) : (
          <button onClick={connectWallet} className="btn btn-primary">
            اتصال کیف پول
          </button>
        )}
      </div>
    </div>
  );
}