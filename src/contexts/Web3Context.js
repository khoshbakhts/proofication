import React, { createContext, useContext } from 'react';

const Web3Context = createContext(null);

export function Web3Provider({ children }) {
 return <Web3Context.Provider value={{}}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
 return useContext(Web3Context);
}