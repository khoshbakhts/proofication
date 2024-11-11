import React from 'react';
import { Web3Provider } from './contexts/Web3Context';
import Header from './components/Header';
import RegisterDocument from './components/RegisterDocument';
import './styles/style.css';

export default function App() {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-gray-100" dir="rtl">
        <Header />
        <main className="container mx-auto py-8">
          <RegisterDocument />
        </main>
      </div>
    </Web3Provider>
  );
}