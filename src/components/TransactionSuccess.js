import React from 'react';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { IRANSansNormal } from '../assets/IRANSans-normal';

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

  const generatePDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        direction: 'rtl'
      });
      
      doc.addFileToVFS('IRANSansWeb.ttf', IRANSansNormal.normal);
      doc.addFont('IRANSansWeb.ttf', 'IRANSans', 'normal');
      doc.setFont('IRANSans');

      // Header
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('گواهی ثبت سند در بلاکچین', 105, 25, { align: 'center' });

      // Document Details Section
      let yPos = 60;
      const rightMargin = 190;
      const leftMargin = 20;

      // Reset text color
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      
      // Background for document details
      doc.setFillColor(248, 250, 252);
      doc.rect(15, yPos - 10, 180, 100, 'F');
      
      // Section title
      doc.setFontSize(16);
      doc.setTextColor(37, 99, 235);
      doc.text('مشخصات سند', rightMargin, yPos, { align: 'right' });
      
      // Table setup
      yPos += 10;
      const tableData = [
        ['نام فایل', fileName],
        ['نام ثبت‌کننده', registrantName],
        ['سازمان', organization],
        ['شناسه', identifier],
        ['تاریخ ثبت', new Date(timestamp * 1000).toLocaleString('fa-IR')],
        ['نوع تراکنش', isGasless ? 'بدون گس' : 'معمولی']
      ];

      // Table style
      const colWidth = 85;
      const rowHeight = 12;
      const tableX = 20;
      let tableY = yPos;

      // Draw table
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);

      tableData.forEach((row, i) => {
        // Alternating row backgrounds
        if (i % 2 === 0) {
          doc.setFillColor(240, 245, 250); // Light blue
        } else {
          doc.setFillColor(255, 255, 255); // White
        }
        doc.rect(tableX, tableY, colWidth * 2, rowHeight, 'F');

        // Draw text
        doc.text(row[1], tableX + 5, tableY + rowHeight - 4); // Value (right column)
        doc.setFont('IRANSans', 'normal');
        doc.text(row[0], tableX + colWidth * 2 - 5, tableY + rowHeight - 4, { align: 'right' }); // Label (left column)

        tableY += rowHeight;
      });

      // Rest of the document (Hash Information)
      yPos = tableY + 20;
      doc.setFillColor(248, 250, 252);
      doc.rect(15, yPos - 10, 180, 50, 'F');

      doc.setFontSize(16);
      doc.setTextColor(37, 99, 235);
      doc.text('اطلاعات بلاکچین', rightMargin, yPos, { align: 'right' });

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('courier', 'normal');
      yPos += 15;

      doc.text('Document Hash: ' + documentHash, leftMargin, yPos);
      doc.text('Transaction Hash: ' + txHash, leftMargin, yPos + 10);

      // Verification Guide
      yPos += 40;
      doc.setFont('IRANSans');
      doc.setFillColor(248, 250, 252);
      doc.rect(15, yPos - 10, 180, 50, 'F');

      doc.setFontSize(16);
      doc.setTextColor(37, 99, 235);
      doc.text('راهنمای استعلام', rightMargin, yPos, { align: 'right' });

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      yPos += 15;

      // Verification steps without numbers
      const verifySteps = [
        'به بخش جستجوی سند در سامانه مراجعه کنید',
        'هش سند را وارد کنید',
        'اطلاعات نمایش داده شده را با این گواهی تطبیق دهید'
      ];

      verifySteps.forEach(step => {
        doc.text(step, rightMargin, yPos, { align: 'right' });
        yPos += 10;
      });

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text('این گواهی به صورت خودکار صادر شده و نیاز به مهر و امضا ندارد', 105, 280, { align: 'center' });

      doc.save('document-registration-certificate.pdf');

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('خطا در ایجاد فایل PDF. لطفاً دوباره تلاش کنید.');
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