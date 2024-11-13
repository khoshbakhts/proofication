import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import Header from './components/Header';
import RegisterDocument from './components/RegisterDocument';
import DocumentSearch from './components/DocumentSearch';
import DocumentHistory from './components/DocumentHistory';
import './styles/style.css';

export default function App() {
  return (
    <BrowserRouter>
      <Web3Provider>
        <div className="min-h-screen bg-gray-100" dir="rtl">
          <Header />
          <main className="container mx-auto py-8">
            <Routes>
              <Route path="/" element={<Navigate to="/register" replace />} />
              <Route path="/register" element={<RegisterDocument />} />
              <Route path="/search" element={<DocumentSearch />} />
              <Route path="/history" element={<DocumentHistory />} />
            </Routes>
          </main>
        </div>
      </Web3Provider>
    </BrowserRouter>
  );
}