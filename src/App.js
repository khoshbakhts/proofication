import React from 'react';
import { Web3Provider } from './contexts/Web3Context';
import Header from './components/Header';
import RegisterDocument from './components/RegisterDocument';
import GaslessSettings from './components/GaslessSettings';
import './styles/style.css';

export default function App() {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-gray-100" dir="rtl">
        <Header />
        <main className="container mx-auto py-8">
          <GaslessSettings />
          <RegisterDocument />
        </main>
      </div>
    </Web3Provider>
  );
}