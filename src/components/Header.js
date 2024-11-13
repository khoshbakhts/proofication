import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Search, History } from 'lucide-react';

export default function Header() {
  const { account, connectWallet } = useWeb3();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: 'ثبت سند',
      icon: <FileText className="w-4 h-4" />,
      path: '/register'
    },
    {
      label: 'جستجوی سند',
      icon: <Search className="w-4 h-4" />,
      path: '/search'
    },
    {
      label: 'تاریخچه',
      icon: <History className="w-4 h-4" />,
      path: '/history'
    }
  ];

  return (
    <>
      <div className="header">
        <div className="header-content">
          <div className="header-right">
            <h1 onClick={() => navigate('/')}>سامانه ثبت اسناد بنیاد مستضعفان</h1>
            <nav className="desktop-nav">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {account ? (
            <div className="wallet-info">
              <span>کیف پول متصل:</span>
              <span className="wallet-address">
                {`${account.slice(0, 6)}...${account.slice(-4)}`}
              </span>
            </div>
          ) : (
            <button onClick={connectWallet} className="btn btn-primary">
              اتصال کیف پول
            </button>
          )}
        </div>
      </div>

      <nav className="mobile-nav">
        <div className="mobile-nav-content">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}