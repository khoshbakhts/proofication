const fs = require("fs");
const path = require("path");

// Base directory for the project
const baseDir = path.join(__dirname, "proofication");

// Define the file structure
const fileStructure = {
  "public": {
    "index.html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n<title>React App</title>\n</head>\n<body>\n<div id=\"root\"></div>\n</body>\n</html>",
    "favicon.ico": "" // placeholder for favicon.ico
  },
  "src": {
    "abi": {
      "DocumentAudit.json": "{}" // placeholder JSON for ABI
    },
    "components": {
      "Header.js": "import React from 'react';\n\nexport default function Header() {\n return <header><h1>My DApp</h1></header>;\n}",
      "RegisterDocument.js": "import React from 'react';\n\nexport default function RegisterDocument() {\n return <div>Register Document Component</div>;\n}",
      "DocumentDetails.js": "import React from 'react';\n\nexport default function DocumentDetails() {\n return <div>Document Details Component</div>;\n}"
    },
    "contexts": {
      "Web3Context.js": "import React, { createContext, useContext } from 'react';\n\nconst Web3Context = createContext(null);\n\nexport function Web3Provider({ children }) {\n return <Web3Context.Provider value={{}}>{children}</Web3Context.Provider>;\n}\n\nexport function useWeb3() {\n return useContext(Web3Context);\n}"
    },
    "hooks": {
      "useContract.js": "import { useWeb3 } from '../contexts/Web3Context';\n\nexport default function useContract() {\n const { provider } = useWeb3();\n return {};\n}"
    },
    "utils": {
      "constants.js": "export const CONTRACT_ADDRESS = '';\nexport const NETWORK_ID = '';"
    },
    "App.js": "import React from 'react';\nimport Header from './components/Header';\nimport RegisterDocument from './components/RegisterDocument';\nimport DocumentDetails from './components/DocumentDetails';\n\nexport default function App() {\n return (\n <div>\n <Header />\n <RegisterDocument />\n <DocumentDetails />\n </div>\n );\n}",
    "index.js": "import React from 'react';\nimport ReactDOM from 'react-dom';\nimport App from './App';\nimport './styles.css';\n\nReactDOM.render(<App />, document.getElementById('root'));",
    "styles.css": "body { font-family: Arial, sans-serif; }\n.App { padding: 20px; }"
  },
  ".env": "REACT_APP_CONTRACT_ADDRESS=''\nREACT_APP_NETWORK_ID=''",
  "package.json": JSON.stringify({
    name: "my-smart-contract-app",
    version: "1.0.0",
    main: "index.js",
    scripts: {
      start: "react-scripts start",
      build: "react-scripts build",
      test: "react-scripts test",
      eject: "react-scripts eject"
    },
    dependencies: {},
    devDependencies: {}
  }, null, 2),
  "README.md": "# My Smart Contract App\n\nThis is a React frontend for interacting with a blockchain-based smart contract."
};

// Function to create directories and files recursively
function createStructure(base, structure) {
  Object.keys(structure).forEach(key => {
    const filePath = path.join(base, key);
    const value = structure[key];

    if (typeof value === "object") {
      // If the value is an object, create a directory and recurse
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      createStructure(filePath, value);
    } else {
      // If the value is a string, create a file with content
      fs.writeFileSync(filePath, value, "utf8");
    }
  });
}

// Create base directory if it doesn't exist
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

// Create the file structure
createStructure(baseDir, fileStructure);

console.log("Project structure created successfully!");
