import React from 'react';
import { Download, FilePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

const TransactionSuccess = ({ 
  txHash, 
  documentHash, 
  fileName,
  registrantName,
  organization,
  identifier,
  timestamp,
  isGasless 
}) => {
  const navigate = useNavigate();
  
  const generateQRCode = async (text) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(text);
      return qrDataUrl;
    } catch (err) {
      console.error('Error generating QR code:', err);
      return null;
    }
  };

  const generatePDF = async () => {
    // ... (existing PDF generation code)
  };

  return (
    <div className="success-container">
      <div className="success-content">
        <div className="success-header">
          <h2>سند با موفقیت ثبت شد!</h2>
        </div>

        <div className="success-details">
          <div className="document-details">
            <h3>مشخصات سند</h3>
            <div className="details-content">
              <p>نام فایل: {fileName}</p>
              <p className="hash">هش سند: {documentHash}</p>
              <p>نام ثبت کننده: {registrantName}</p>
              <p>سازمان: {organization}</p>
              <p>شناسه: {identifier}</p>
            </div>
          </div>
          
          <div className="transaction-details">
            <h3>جزئیات تراکنش</h3>
            <div className="details-content">
              <p className="hash">هش تراکنش: {txHash}</p>
              <p>زمان ثبت: {new Date(timestamp * 1000).toLocaleString('fa-IR')}</p>
              <p>نوع تراکنش: {isGasless ? 'بدون گس' : 'معمولی'}</p>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <button
              onClick={generatePDF}
              className="download-button flex-1"
            >
              <Download size={20} />
              دانلود گواهی PDF
            </button>

            <button
              onClick={() => navigate('/register')}
              className="btn btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <FilePlus size={20} />
              ثبت سند جدید
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSuccess;