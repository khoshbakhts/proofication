import React from 'react';
import { Download } from 'lucide-react';
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
    try {
      // Create PDF
      const doc = new jsPDF();
      
      // Generate QR codes
      const txQR = await generateQRCode(txHash);
      const docQR = await generateQRCode(documentHash);
      
      // Add header background
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 210, 40, 'F');
      
      // Add title
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text('Document Registration Certificate', 105, 25, { align: 'center' });
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      
      // Document details section
      doc.setFillColor(248, 250, 252);
      doc.rect(20, 50, 170, 80, 'F');
      
      doc.setFontSize(16);
      doc.setTextColor(37, 99, 235);
      doc.text('Document Details', 30, 60);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      let yPos = 75;
      
      const docDetails = [
        `File Name: ${fileName}`,
        `Registrant: ${registrantName}`,
        `Organization: ${organization}`,
        `Identifier: ${identifier}`
      ];
      
      docDetails.forEach(detail => {
        doc.text(detail, 30, yPos);
        yPos += 10;
      });
      
      // Add document hash with smaller font
      doc.setFontSize(10);
      const hashLines = doc.splitTextToSize(`Document Hash: ${documentHash}`, 150);
      hashLines.forEach(line => {
        doc.text(line, 30, yPos);
        yPos += 5;
      });
      
      // Transaction details section
      yPos += 15;
      doc.setFillColor(248, 250, 252);
      doc.rect(20, yPos - 10, 170, 60, 'F');
      
      doc.setFontSize(16);
      doc.setTextColor(37, 99, 235);
      doc.text('Transaction Details', 30, yPos);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      yPos += 15;
      
      // Add transaction hash with smaller font
      doc.setFontSize(10);
      const txLines = doc.splitTextToSize(`Transaction Hash: ${txHash}`, 150);
      txLines.forEach(line => {
        doc.text(line, 30, yPos);
        yPos += 5;
      });
      
      // Add other transaction details
      doc.setFontSize(12);
      yPos += 10;
      doc.text(`Registration Date: ${new Date(timestamp * 1000).toLocaleString()}`, 30, yPos);
      yPos += 10;
      doc.text(`Transaction Type: ${isGasless ? 'Gasless' : 'Regular'}`, 30, yPos);
      
      // Add QR codes
      if (txQR && docQR) {
        // Document QR
        doc.addImage(docQR, 'PNG', 150, 60, 30, 30);
        doc.setFontSize(10);
        doc.text('Document QR', 165, 95, { align: 'center' });
        
        // Transaction QR
        doc.addImage(txQR, 'PNG', 150, 140, 30, 30);
        doc.text('Transaction QR', 165, 175, { align: 'center' });
      }
      
      // Add verification box
      yPos += 30;
      doc.setFillColor(248, 250, 252);
      doc.rect(20, yPos - 10, 170, 70, 'F');
      
      doc.setFontSize(16);
      doc.setTextColor(37, 99, 235);
      doc.text('Verification Guide', 30, yPos);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      yPos += 15;
      
      const instructions = [
        'To verify this document:',
        '1. Visit blockchain-explorer.com',
        '2. Enter the Document Hash in the search field',
        '3. Compare the displayed details with this certificate'
      ];
      
      instructions.forEach(instruction => {
        doc.text(instruction, 30, yPos);
        yPos += 10;
      });
      
      // Add footer
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text('This certificate is automatically generated and requires no signature', 105, 280, { align: 'center' });
      
      // Save the PDF
      doc.save('document-registration-certificate.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
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
          
          <button
            onClick={generatePDF}
            className="download-button"
          >
            <Download size={20} />
            دانلود گواهی PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionSuccess;