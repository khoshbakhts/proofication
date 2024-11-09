import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';

export default function Header() {
  const { account, connectWallet, disconnectWallet, isConnecting, error } = useWeb3();

  return (
    <header className="header">
      <div className="header-content">
        <h1>سیستم ثبت اسناد</h1>
        
        <div className="wallet-connection">
          {account ? (
            <div className="account-info">
              <span className="account-address">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
              <button
                className="btn btn-secondary"
                onClick={disconnectWallet}
              >
                قطع اتصال
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={connectWallet}
              disabled={isConnecting}
            >
              {isConnecting ? 'در حال اتصال...' : 'اتصال کیف پول'}
            </button>
          )}
        </div>
      </div>
      {error && <p className="error">{error}</p>}
    </header>
  );
}