import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Search, FileText, Calendar, User, Building, Hash, XCircle } from 'lucide-react';

export default function DocumentSearch() {
  const { contract } = useWeb3();
  const [searchHash, setSearchHash] = useState('');
  const [documentDetails, setDocumentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setDocumentDetails(null);
    setLoading(true);

    try {
      if (!contract) {
        throw new Error('لطفاً کیف پول خود را متصل کنید');
      }

      if (!searchHash) {
        throw new Error('لطفاً هش سند را وارد کنید');
      }

      // Clean up hash input - add '0x' if not present
      const formattedHash = searchHash.startsWith('0x') ? searchHash : `0x${searchHash}`;

      console.log('Searching for document:', formattedHash);
      const details = await contract.getDocumentDetails(formattedHash);
      console.log('Document details:', details);

      // Format the details
      setDocumentDetails({
        owner: details[0],
        timestamp: new Date(Number(details[1]) * 1000),
        registrantName: details[2],
        organization: details[3],
        identifier: details[4],
        isGasless: details[5]
      });
    } catch (err) {
      console.error('Search error:', err);
      if (err.message.includes('Document not found')) {
        setError('سند مورد نظر یافت نشد');
      } else if (err.message.includes('invalid hex')) {
        setError('فرمت هش نامعتبر است');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchHash('');
    setDocumentDetails(null);
    setError('');
  };

  return (
    <div className="form-container">
      <h2>جستجوی سند</h2>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="search-input-container">
          <input
            type="text"
            value={searchHash}
            onChange={(e) => setSearchHash(e.target.value)}
            placeholder="هش سند را وارد کنید"
            className="search-input"
            dir="ltr"
          />
          {searchHash && (
            <button
              type="button"
              onClick={clearSearch}
              className="clear-button"
              title="پاک کردن"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full mt-4"
          disabled={loading || !searchHash}
        >
          {loading ? (
            <div className="loading-spinner" />
          ) : (
            <>
              <Search className="w-5 h-5" />
              جستجو
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <XCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {documentDetails && (
        <div className="document-details-container">
          <h3 className="text-lg font-bold mb-4 text-primary-700">
            <FileText className="inline-block ml-2" />
            مشخصات سند
          </h3>

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

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="detail-item">
              <span className="label">آدرس مالک:</span>
              <span className="value font-mono text-sm" dir="ltr">
                {documentDetails.owner}
              </span>
            </div>
            <div className="detail-item mt-2">
              <span className="label">نوع تراکنش:</span>
              <span className="value">
                {documentDetails.isGasless ? 'بدون گس' : 'معمولی'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}