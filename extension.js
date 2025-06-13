const fs = require('fs');
const path = require('path');
const vscode = require('vscode');

function activate(context) {
  let disposable = vscode.commands.registerCommand('mernDevboost.generateStructure', async () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders) {
      vscode.window.showErrorMessage('Please open a workspace folder first.');
      return;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;

    // ✅ Backend Folders and File Names
    const backendStructure = {
      'config': 'config.js',
      'controllers': 'controller.js',
      'models': 'model.js',
      'routes': 'route.js',
      'middleware': 'middleware.js',
      'utils': 'utils.js',
      'services': 'service.js'
    };

    // ✅ Frontend Folders
    const frontendFolders = [
      'frontend/public',
      'frontend/src',
      'frontend/src/components',
      'frontend/src/pages',
      'frontend/src/utils',
      'frontend/src/assets'
    ];

    // ✅ Create backend folders + files
    Object.entries(backendStructure).forEach(([folder, file]) => {
      const folderPath = path.join(rootPath, 'backend', folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const filePath = path.join(folderPath, file);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, `// ${file} for ${folder}`);
      }
    });

    // ✅ Create frontend folders
    frontendFolders.forEach(folder => {
      const folderPath = path.join(rootPath, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
    });

    // ✅ Create backend/server.js
    const serverFilePath = path.join(rootPath, 'backend', 'server.js');
    if (!fs.existsSync(serverFilePath)) {
      const serverCode = `
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
      `;
      fs.writeFileSync(serverFilePath, serverCode.trim());
    }

    // ✅ Create frontend/src/App.js
    const appJsPath = path.join(rootPath, 'frontend', 'src', 'App.js');
    if (!fs.existsSync(appJsPath)) {
      const appCode = `
import React from 'react';

function App() {
  return (
    <div>
      <h1>Welcome to MERN App</h1>
    </div>
  );
}

export default App;
      `;
      fs.writeFileSync(appJsPath, appCode.trim());
    }

    // ✅ Create frontend/src/index.js
    const indexJsPath = path.join(rootPath, 'frontend', 'src', 'index.js');
    if (!fs.existsSync(indexJsPath)) {
      const indexCode = `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
      `;
      fs.writeFileSync(indexJsPath, indexCode.trim());
    }

    vscode.window.showInformationMessage('✅ Full MERN folder + files created successfully!');
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
