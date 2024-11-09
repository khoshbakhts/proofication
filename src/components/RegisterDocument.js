import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import FileUpload from './FileUpload';

export default function RegisterDocument() {
  const { contract, account } = useWeb3();
  const [formData, setFormData] = useState({
    registrantName: '',
    organization: '',
    identifier: '',
    documentHash: '',
    fileName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleHashGenerated = (hash, fileName) => {
    setFormData(prev => ({
      ...prev,
      documentHash: hash,
      fileName
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const tx = await contract.registerDocument(
        formData.documentHash,
        formData.registrantName,
        formData.organization,
        formData.identifier
      );
      await tx.wait();
      setSuccess('سند با موفقیت ثبت شد');
      setFormData({
        registrantName: '',
        organization: '',
        identifier: '',
        documentHash: '',
        fileName: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!account) {
    return (
      <div className="card">
        <p className="connect-prompt">لطفا ابتدا کیف پول خود را متصل کنید</p>
      </div>
    );
  }

  return (
    <div className="card register-document">
      <h2>ثبت سند جدید</h2>
      
      <FileUpload onHashGenerated={handleHashGenerated} />
      
      {formData.documentHash && (
        <div className="file-info">
          <p>نام فایل: {formData.fileName}</p>
          <p>هش فایل: {formData.documentHash}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="registrantName">نام ثبت کننده:</label>
          <input
            type="text"
            id="registrantName"
            name="registrantName"
            value={formData.registrantName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="organization">سازمان:</label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="identifier">شناسه:</label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            value={formData.identifier}
            onChange={handleInputChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!formData.documentHash || isSubmitting}
        >
          {isSubmitting ? 'در حال ثبت...' : 'ثبت سند'}
        </button>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
}