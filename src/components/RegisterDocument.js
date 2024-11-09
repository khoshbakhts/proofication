import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { keccak256 } from 'ethers';
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      try {
        const buffer = await file.arrayBuffer();
        const hash = keccak256(new Uint8Array(buffer));
        setFileHash(hash);
        setFormData({
          ...formData,
          documentHash: hash
        });
      } catch (error) {
        console.error('Error generating hash:', error);
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
        const hash = keccak256(new Uint8Array(buffer));
        setFileHash(hash);
        setFormData({
          ...formData,
          documentHash: hash
        });
      } catch (error) {
        console.error('Error generating hash:', error);
      }
    }
  };

  const registerWithGas = async (e) => {
    e.preventDefault();
    if (!account) {
      await connectWallet();
      return;
    }
    try {
      setLoading(true);
      const tx = await contract.registerDocumentWithGas(
        formData.documentHash,
        formData.registrantName,
        formData.organization,
        formData.identifier
      );
      await tx.wait();
      alert('سند با موفقیت ثبت شد!');
    } catch (error) {
      console.error('خطا در ثبت سند:', error);
      alert('خطا در ثبت سند. جزئیات را در کنسول ببینید.');
    } finally {
      setLoading(false);
    }
  };

  const registerGasless = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const tx = await contract.registerDocumentGasless(
        formData.documentHash,
        formData.registrantName,
        formData.organization,
        formData.identifier
      );
      await tx.wait();
      alert('سند با موفقیت و بدون گس ثبت شد!');
    } catch (error) {
      console.error('خطا در ثبت سند:', error);
      alert('خطا در ثبت سند. جزئیات را در کنسول ببینید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>ثبت سند جدید</h2>
      
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
        {file ? (
          <div className="file-info">
            <p>نام فایل: {file.name}</p>
            <p>سایز: {(file.size / 1024).toFixed(2)} KB</p>
            <p>هش فایل:</p>
            <p className="file-hash">{fileHash}</p>
          </div>
        ) : (
          <div className="upload-message">
            <p>برای آپلود فایل کلیک کنید یا فایل را اینجا رها کنید</p>
          </div>
        )}
      </div>

      {fileHash && (
        <form>
          <div className="form-group">
            <label>نام ثبت کننده</label>
            <input
              type="text"
              name="registrantName"
              value={formData.registrantName}
              onChange={handleChange}
              placeholder="نام و نام خانوادگی"
            />
          </div>

          <div className="form-group">
            <label>نام سازمان</label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="نام سازمان"
            />
          </div>

          <div className="form-group">
            <label>شناسه</label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="شناسه سند"
            />
          </div>

          <div className="button-group">
            <button
              className="btn btn-gasless"
              onClick={registerGasless}
              disabled={loading || !gaslessEnabled || !fileHash || !formData.registrantName || !formData.organization || !formData.identifier}
            >
              ثبت بدون گس
            </button>

            <button
              className={`btn ${account ? 'btn-primary' : 'btn-connect'}`}
              onClick={registerWithGas}
              disabled={loading || !fileHash || !formData.registrantName || !formData.organization || !formData.identifier}
            >
              {account ? 'ثبت با پرداخت گس' : 'اتصال کیف پول و ثبت'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}