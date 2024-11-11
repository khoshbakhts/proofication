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
  const [gaslessEnabled, setGaslessEnabled] = useState(false);

  const contractAddress = '0x3E89Dd0dA31f82bd59A8d75a91298287CF096177'; // Replace with your contract address

  const initializeContract = async (signer) => {
    try {
      const contractInstance = new ethers.Contract(
        contractAddress,
        DocumentAuditABI,
        signer
      );
      setContract(contractInstance);
      return contractInstance;
    } catch (err) {
      console.error('Error initializing contract:', err);
      setError('Error initializing contract connection');
      return null;
    }
  };

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
      
      // Initialize contract with signer
      const contractInstance = await initializeContract(signer);
      if (!contractInstance) {
        throw new Error('خطا در اتصال به قرارداد هوشمند');
      }

      setAccount(accounts[0]);
      setProvider(provider);

      // Check if wallet was previously connected
      if (localStorage.getItem('walletConnected') === 'true') {
        setGaslessEnabled(localStorage.getItem('gaslessEnabled') === 'true');
      }
      
      localStorage.setItem('walletConnected', 'true');
      
      return contractInstance;
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message);
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setProvider(null);
    setContract(null);
    setGaslessEnabled(false);
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('gaslessEnabled');
  };

  // Auto connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (localStorage.getItem('walletConnected') === 'true') {
        await connectWallet();
      }
    };
    autoConnect();
  }, []);

  // Handle account changes
  useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
        if (provider) {
          const signer = await provider.getSigner();
          await initializeContract(signer);
        }
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [provider]);

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        contract,
        isConnecting,
        error,
        gaslessEnabled,
        setGaslessEnabled,
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