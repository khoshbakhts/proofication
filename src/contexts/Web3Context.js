import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DocumentAuditABI from '../abi/DocumentAudit.json';

const Web3Context = createContext({});

export function Web3Provider({ children }) {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const contractAddress = '0x3E89Dd0dA31f82bd59A8d75a91298287CF096177'; // Replace with your deployed contract address

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError('');

      if (!window.ethereum) {
        throw new Error('لطفا افزونه متامسک را نصب کنید');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      
      const contract = new ethers.Contract(
        contractAddress,
        DocumentAuditABI,
        signer
      );

      setAccount(accounts[0]);
      setProvider(provider);
      setContract(contract);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setProvider(null);
    setContract(null);
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        contract,
        isConnecting,
        error,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}