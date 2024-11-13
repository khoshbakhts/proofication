import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DocumentAuditABI from '../abi/DocumentAudit.json';

const Web3Context = createContext({});

// Expected network configuration
const EXPECTED_NETWORK = {
  chainId: '0x89', // Polygon Mainnet
  // chainId: '0x13881', // Mumbai Testnet
  // Add other network configurations as needed
};

export function Web3Provider({ children }) {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [gaslessEnabled, setGaslessEnabled] = useState(false);
  const [networkDetails, setNetworkDetails] = useState(null);

  const contractAddress = '0x3E89Dd0dA31f82bd59A8d75a91298287CF096177';

  const checkNetwork = async (provider) => {
    try {
      const network = await provider.getNetwork();
      console.log('Current network:', network);
      setNetworkDetails(network);
      
      const chainIdHex = `0x${network.chainId.toString(16)}`;
      console.log('Current chainId:', chainIdHex);
      console.log('Expected chainId:', EXPECTED_NETWORK.chainId);
      
      if (chainIdHex !== EXPECTED_NETWORK.chainId) {
        throw new Error('شبکه نادرست. لطفاً به شبکه Polygon متصل شوید');
      }
      
      return true;
    } catch (err) {
      console.error('Network check error:', err);
      setError(err.message);
      return false;
    }
  };

  const initializeContract = async (signer) => {
    console.log('Initializing contract with address:', contractAddress);
    console.log('ABI available:', !!DocumentAuditABI);
    
    try {
      if (!signer) {
        console.error('No signer available');
        throw new Error('امضاکننده در دسترس نیست');
      }

      // Verify the ABI contains the expected functions
      const expectedFunctions = ['registerDocumentWithGas', 'registerDocumentGasless'];
      const missingFunctions = expectedFunctions.filter(
        fn => !DocumentAuditABI.some(item => item.name === fn)
      );
      
      if (missingFunctions.length > 0) {
        console.error('Missing functions in ABI:', missingFunctions);
        throw new Error('قرارداد ABI نامعتبر است');
      }

      const contractInstance = new ethers.Contract(
        contractAddress,
        DocumentAuditABI,
        signer
      );

      console.log('Contract instance created');

      // Test contract connection
      try {
        // Try to call a view function to verify contract connection
        await contractInstance.owner();
        console.log('Contract connection verified');
      } catch (err) {
        console.error('Contract connection test failed:', err);
        throw new Error('خطا در اتصال به قرارداد');
      }

      setContract(contractInstance);
      return contractInstance;
    } catch (err) {
      console.error('Contract initialization error:', err);
      setError(err.message);
      setContract(null);
      return null;
    }
  };

  const connectWallet = async () => {
    console.log('Starting wallet connection process...');
    try {
      setIsConnecting(true);
      setError('');

      if (!window.ethereum) {
        throw new Error('لطفا افزونه متامسک را نصب کنید');
      }

      console.log('Creating Web3Provider...');
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Check network before proceeding
      const networkValid = await checkNetwork(provider);
      if (!networkValid) {
        throw new Error('لطفاً به شبکه صحیح متصل شوید');
      }

      console.log('Requesting accounts...');
      const accounts = await provider.send('eth_requestAccounts', []);
      console.log('Accounts received:', accounts);

      console.log('Getting signer...');
      const signer = await provider.getSigner();
      console.log('Signer address:', await signer.getAddress());

      // Initialize contract
      console.log('Initializing contract...');
      const contractInstance = await initializeContract(signer);
      if (!contractInstance) {
        throw new Error('قرارداد هوشمند در دسترس نیست');
      }

      setAccount(accounts[0]);
      setProvider(provider);

      if (localStorage.getItem('walletConnected') === 'true') {
        setGaslessEnabled(localStorage.getItem('gaslessEnabled') === 'true');
      }
      
      localStorage.setItem('walletConnected', 'true');
      console.log('Wallet connection complete');
      
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
    console.log('Disconnecting wallet...');
    setAccount('');
    setProvider(null);
    setContract(null);
    setGaslessEnabled(false);
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('gaslessEnabled');
  };

  // Auto connect if previously connected
  useEffect(() => {
    if (localStorage.getItem('walletConnected') === 'true') {
      console.log('Attempting auto-connect...');
      connectWallet();
    }
  }, []);

  // Handle account and chain changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts) => {
      console.log('Accounts changed:', accounts);
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

    const handleChainChanged = async (chainId) => {
      console.log('Chain changed:', chainId);
      if (provider) {
        const networkValid = await checkNetwork(provider);
        if (!networkValid) {
          disconnectWallet();
        }
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
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
        disconnectWallet,
        networkDetails
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}