import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';
import TransactionSuccess from './TransactionSuccess';
import { FileText, AlertCircle, Calendar, User, Building, Hash } from 'lucide-react';
import '../styles/style.css';

export default function RegisterDocument() {
  const { account, contract, connectWallet, gaslessEnabled } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    documentHash: '',
    registrantName: '',
    organization: '',
    identifier: ''
  });
  const [file, setFile] = useState(null);
  const [fileHash, setFileHash] = useState('');
  const [transactionData, setTransactionData] = useState(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [documentDetails, setDocumentDetails] = useState(null);
  const [error, setError] = useState('');
  const [checkingDocument, setCheckingDocument] = useState(false);

  const checkDocumentRegistration = async (hash) => {
    try {
      setCheckingDocument(true);
      setError('');
      setAlreadyRegistered(false);
      setDocumentDetails(null);

      if (!contract) {
        throw new Error('لطفاً کیف پول خود را متصل کنید');
      }

      const isRegistered = await contract.isDocumentRegistered(hash);
      console.log('Document registration status:', isRegistered);

      if (isRegistered) {
        const details = await contract.getDocumentDetails(hash);
        console.log('Document details:', details);

        setAlreadyRegistered(true);
        setDocumentDetails({
          owner: details[0],
          timestamp: new Date(Number(details[1]) * 1000),
          registrantName: details[2],
          organization: details[3],
          identifier: details[4],
          isGasless: details[5]
        });
      }
    } catch (err) {
      console.error('Error checking document:', err);
      setError(err.message);
    } finally {
      setCheckingDocument(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      try {
        const buffer = await file.arrayBuffer();
        const hash = ethers.keccak256(new Uint8Array(buffer));
        setFileHash(hash);
        setFormData(prev => ({
          ...prev,
          documentHash: hash
        }));
        
        // Check if document is already registered
        await checkDocumentRegistration(hash);
      } catch (error) {
        console.error('Error processing file:', error);
        setError('خطا در پردازش فایل');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFile(file);
      try {
        const buffer = await file.arrayBuffer();
        const hash = ethers.keccak256(new Uint8Array(buffer));
        setFileHash(hash);
        setFormData(prev => ({
          ...prev,
          documentHash: hash
        }));
        
        // Check if document is already registered
        await checkDocumentRegistration(hash);
      } catch (error) {
        console.error('Error processing file:', error);
        setError('خطا در پردازش فایل');
      }
    }
  };

  const registerWithGas = async (e) => {
    e.preventDefault();
    setConnectionStatus('');
    setLoading(true);

    try {
      console.log('Starting registration process...');
      
      if (!account) {
        console.log('No account detected, attempting to connect wallet...');
        await connectWallet();
        return; // Return here to let the useEffect trigger contract initialization
      }

      const contractToUse = localContract || contract;
      
      if (!contractToUse) {
        console.log('No contract instance available');
        throw new Error('قرارداد هوشمند در دسترس نیست. لطفاً اتصال شبکه را بررسی کنید');
      }

      console.log('Using contract at address:', contractAddress);
      console.log('Registering document with parameters:', {
        documentHash: formData.documentHash,
        registrantName: formData.registrantName,
        organization: formData.organization,
        identifier: formData.identifier
      });

      const tx = await contractToUse.registerDocumentWithGas(
        formData.documentHash,
        formData.registrantName,
        formData.organization,
        formData.identifier
      );

      console.log('Transaction submitted:', tx);
      setConnectionStatus('در حال پردازش تراکنش...');

      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);
      
      setTransactionData({
        txHash: receipt.hash,
        documentHash: formData.documentHash,
        fileName: file.name,
        registrantName: formData.registrantName,
        organization: formData.organization,
        identifier: formData.identifier,
        timestamp: Math.floor(Date.now() / 1000),
        isGasless: false
      });
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'خطا در ثبت سند: ';
      
      if (error.message.includes('user rejected')) {
        errorMessage += 'تراکنش توسط کاربر لغو شد';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage += 'موجودی ناکافی';
      } else {
        errorMessage += error.message;
      }
      
      setConnectionStatus(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const registerGasless = async (e) => {
    e.preventDefault();
    setConnectionStatus('');
    setLoading(true);

    try {
      if (!account) {
        await connectWallet();
        return;
      }

      const contractToUse = localContract || contract;
      
      if (!contractToUse) {
        throw new Error('قرارداد هوشمند در دسترس نیست. لطفاً اتصال شبکه را بررسی کنید');
      }

      const tx = await contractToUse.registerDocumentGasless(
        formData.documentHash,
        formData.registrantName,
        formData.organization,
        formData.identifier
      );

      setConnectionStatus('در حال پردازش تراکنش...');
      const receipt = await tx.wait();
      
      setTransactionData({
        txHash: receipt.hash,
        documentHash: formData.documentHash,
        fileName: file.name,
        registrantName: formData.registrantName,
        organization: formData.organization,
        identifier: formData.identifier,
        timestamp: Math.floor(Date.now() / 1000),
        isGasless: true
      });
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'خطا در ثبت سند: ';
      
      if (error.message.includes('user rejected')) {
        errorMessage += 'تراکنش توسط کاربر لغو شد';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage += 'موجودی ناکافی';
      } else {
        errorMessage += error.message;
      }
      
      setConnectionStatus(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show success view if transaction is complete
  if (transactionData) {
    return <TransactionSuccess {...transactionData} />;
  }

  return (
    <div className="form-container">
      <h2>ثبت سند جدید</h2>
      
      {error && (
        <div className="error-message">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
      
      <div 
        className="file-upload" 
        onClick={() => document.getElementById('file-input').click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          id="file-input"
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        {checkingDocument ? (
          <div className="checking-document">
            <div className="loading-spinner"></div>
            <p>در حال بررسی وضعیت سند...</p>
          </div>
        ) : file ? (
          <div className="file-info">
            <p>نام فایل: {file.name}</p>
            <p>سایز: {(file.size / 1024).toFixed(2)} KB</p>
            <p>هش فایل:</p>
            <p className="file-hash">{fileHash}</p>
          </div>
        ) : (
          <div className="upload-message">
            <FileText className="w-12 h-12 text-primary-500 mb-2" />
            <p>برای آپلود فایل کلیک کنید یا فایل را اینجا رها کنید</p>
          </div>
        )}
      </div>

      {alreadyRegistered && documentDetails && (
        <div className="document-registered-warning">
          <div className="warning-header">
            <AlertCircle className="w-6 h-6 text-yellow-500" />
            <h3>این سند قبلاً ثبت شده است</h3>
          </div>
          
          <div className="document-details">
            <div className="details-grid">
              <div className="detail-item">
                <User className="w-5 h-5" />
                <div>
                  <span className="label">ثبت‌کننده:</span>
                  <span className="value">{documentDetails.registrantName}</span>
                </div>
              </div>

              <div className="detail-item">
                <Building className="w-5 h-5" />
                <div>
                  <span className="label">سازمان:</span>
                  <span className="value">{documentDetails.organization}</span>
                </div>
              </div>

              <div className="detail-item">
                <Hash className="w-5 h-5" />
                <div>
                  <span className="label">شناسه:</span>
                  <span className="value">{documentDetails.identifier}</span>
                </div>
              </div>

              <div className="detail-item">
                <Calendar className="w-5 h-5" />
                <div>
                  <span className="label">تاریخ ثبت:</span>
                  <span className="value" dir="ltr">
                    {documentDetails.timestamp.toLocaleString('fa-IR')}
                  </span>
                </div>
              </div>
            </div>

            <div className="owner-details">
              <span className="label">آدرس مالک:</span>
              <span className="value font-mono text-sm" dir="ltr">
                {documentDetails.owner}
              </span>
            </div>
          </div>
        </div>
      )}

      {fileHash && !alreadyRegistered && (
        <form>
          {/* Your existing form fields */}
        </form>
      )}
    </div>
  );
}