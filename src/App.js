import React from 'react';
import { Web3Provider } from './contexts/Web3Context';
import Header from './components/Header';
import RegisterDocument from './components/RegisterDocument';

export default function App() {
  return (
    <Web3Provider>
      <div className="container">
        <Header />
        <main>
          <RegisterDocument />
        </main>
      </div>
    </Web3Provider>
  );
}