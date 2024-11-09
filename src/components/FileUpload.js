import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ethers } from 'ethers';

export default function FileUpload({ onHashGenerated }) {
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateHash = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        resolve(hashHex);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setIsCalculating(true);
      try {
        const file = acceptedFiles[0];
        const hash = await calculateHash(file);
        onHashGenerated(hash, file.name);
      } catch (error) {
        console.error('Error calculating hash:', error);
      } finally {
        setIsCalculating(false);
      }
    }
  }, [onHashGenerated]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="file-upload-container"
    >
      <input {...getInputProps()} />
      <div className="file-upload-content">
        {isCalculating ? (
          <div className="calculating">
            <div className="spinner"></div>
            <p>در حال محاسبه هش فایل...</p>
          </div>
        ) : isDragActive ? (
          <p>فایل را اینجا رها کنید</p>
        ) : (
          <>
            <svg
              className="upload-icon"
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p>فایل خود را اینجا بکشید یا کلیک کنید</p>
          </>
        )}
      </div>
    </div>
  );
}

