const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process"); 

function writeIfNotExists(filePath, content) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content);
    }
  } catch (err) {
    console.error("writeIfNotExists error:", err);
  }
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

// Function to generate the interactive, aesthetic, text-based guide
async function createAndOpenGuide(projectRoot, projectName) {
  const guideContent = `# 🚀 MERN DevBoost: Mission Control

> **Welcome to your new workspace!** 🎉 
> Your MERN stack is fully scaffolded, structured, and ready for action. No more boring setups. Let's get straight to the fun part: Coding!

---

## 🛠️ Step 1: Ignite the Servers

You have two main folders: \`frontend\` and \`backend\`. You will need **two separate terminals** to run them.

**Terminal 1: Backend**
\`\`\`bash
cd backend
npm run dev
\`\`\`
*(Runs the Express server on http://localhost:5000)*

**Terminal 2: Frontend**
\`\`\`bash
cd frontend
npm run dev
\`\`\`
*(Runs your fast Vite React app)*

---

## 🗄️ Step 2: Database Connection

By default, your app is looking for a **Local MongoDB** instance. You can see this in your \`backend/.env\` file:
> \`MONGO_URI=mongodb://localhost:27017/${projectName}\`

*(If you use MongoDB Atlas, just replace this URI with your Cloud Connection String.)*

---

## 🪄 Step 3: The Magic Command (Auto-CRUD)

Why write Models and Controllers manually? Let DevBoost do the heavy lifting!

1. Open VS Code Command Palette (\`Ctrl + Shift + P\` or \`Cmd + Shift + P\`).
2. Search and run: **\`MERN: Generate API Resource (CRUD)\`**
3. Type a resource name, for example: **\`product\`** and hit Enter.

*Boom! 💥 It will automatically create \`Product.js\` (Model), \`productController.js\`, and \`productRoutes.js\` with complete try-catch logic.*

---

## 🔌 Step 4: Link Your New Route in \`app.js\`

Once you generate a resource (like \`product\`), you must tell your Express app to use it. 
Open **\`backend/app.js\`** and add these two lines:

\`\`\`javascript
// 1. Import your new route (Add this near the top)
const productRoutes = require('./routes/productRoutes');

// 2. Use the route (Add this below your other app.use statements)
app.use('/api/products', productRoutes);
\`\`\`

---

## 🎨 Step 5: Want Tailwind CSS? (Optional)

We kept the UI clean so you can choose your tools. If you love **Tailwind CSS**, just run these in your \`frontend\` terminal:

\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

Then, open \`tailwind.config.js\` and update the content:
\`\`\`javascript
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
]
\`\`\`

Finally, paste this at the very top of your \`src/index.css\`:
\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;
\`\`\`

---
*Built with ❤️ by MERN DevBoost. Happy Hacking!*
`;

  const guidePath = path.join(projectRoot, "DEVBOOST_GUIDE.md");
  fs.writeFileSync(guidePath, guideContent);

  // VS Code command to open the file in Markdown Preview mode
  const uri = vscode.Uri.file(guidePath);
  await vscode.commands.executeCommand("markdown.showPreview", uri);
}

// ✅ ACTIVATE FUNCTION STARTS HERE
function activate(context) {

  // ==========================================
  // COMMAND 1: GENERATE FOLDER STRUCTURE
  // ==========================================
  let disposable = vscode.commands.registerCommand(
    "mernDevboost.generateStructure",
    async function () {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("Please open a folder in VS Code before generating structure.");
        return;
      }

      const projectName = await vscode.window.showInputBox({
        prompt: "Enter project name (folder will be created inside current workspace)",
        placeHolder: "my-mern-app",
        validateInput: (v) => {
          if (!v || !v.trim()) return "Project name cannot be empty";
          if (v.match(/[\\/:*?"<>|]/)) return "Project name contains invalid characters";
          return null;
        },
      });
      if (!projectName) {
        vscode.window.showInformationMessage("Project generation cancelled.");
        return;
      }

      const workspaceRoot = workspaceFolders[0].uri.fsPath;
      const projectRoot = path.join(workspaceRoot, projectName);

      try {
        ensureDir(projectRoot);

        // --- BACKEND ---
        const backendPath = path.join(projectRoot, "backend");
        ensureDir(backendPath);

        writeIfNotExists(
          path.join(backendPath, "package.json"),
          JSON.stringify({
            name: `${projectName}-backend`,
            version: "1.0.0",
            main: "server.js",
            scripts: { start: "node server.js", dev: "nodemon server.js" }
          }, null, 2)
        );

        writeIfNotExists(
          path.join(backendPath, ".env"),
          `PORT=5000
MONGO_URI=mongodb://localhost:27017/${projectName}
JWT_SECRET=changeme`
        );

        ensureDir(path.join(backendPath, "controllers"));
        ensureDir(path.join(backendPath, "models"));
        ensureDir(path.join(backendPath, "routes"));
        ensureDir(path.join(backendPath, "middleware"));
        ensureDir(path.join(backendPath, "db"));

        writeIfNotExists(
          path.join(backendPath, "server.js"),
          `const app = require('./app');
const connectDB = require('./db/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(\`Backend running on http://localhost:\${PORT}\`));
}).catch(err => {
  console.error('DB connection error', err);
  process.exit(1);
});`
        );

        writeIfNotExists(
          path.join(backendPath, "app.js"),
          `const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.json({ msg: 'DevBoost Backend' }));

module.exports = app;`
        );

        writeIfNotExists(
          path.join(backendPath, "db", "db.js"),
          `const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not set');
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('MongoDB connected');
};

module.exports = connectDB;`
        );

        writeIfNotExists(
          path.join(backendPath, "models", "User.js"),
          `const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);`
        );

        writeIfNotExists(
          path.join(backendPath, "controllers", "authController.js"),
          `const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already used' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET || 'changeme', { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};`
        );

        writeIfNotExists(
          path.join(backendPath, "routes", "auth.js"),
          `const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;`
        );

        writeIfNotExists(
          path.join(backendPath, "middleware", "auth.js"),
          `const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const token = (req.header('Authorization') || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};`
        );

        const backendTerminal = vscode.window.createTerminal("DevBoost Backend");
        backendTerminal.show(true);
        backendTerminal.sendText(`cd "${backendPath}"`);
        backendTerminal.sendText("npm init -y");
        backendTerminal.sendText("npm install express mongoose cors dotenv jsonwebtoken bcryptjs");
        backendTerminal.sendText("npm install -D nodemon");

        // --- FRONTEND ---
        const frontendPath = path.join(projectRoot, "frontend");
        ensureDir(frontendPath);

        const feTerminal = vscode.window.createTerminal("DevBoost Frontend");
        feTerminal.show(true);
        feTerminal.sendText(`cd "${frontendPath}"`);
        feTerminal.sendText(`npm create vite@latest "." -- --template react`);

        ensureDir(path.join(frontendPath, "src"));
        ensureDir(path.join(frontendPath, "src", "components"));
        ensureDir(path.join(frontendPath, "src", "pages"));
        ensureDir(path.join(frontendPath, "src", "services"));

        // Write basic frontend files
        writeIfNotExists(path.join(frontendPath, "index.html"), `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" /><title>${projectName} - DevBoost</title></head><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>`);
        writeIfNotExists(path.join(frontendPath, "src", "main.jsx"), `import React from 'react';import { createRoot } from 'react-dom/client';import App from './App.jsx';import './index.css';createRoot(document.getElementById('root')).render(<App />);`);

        // Install main deps
        feTerminal.sendText("npm install");
        feTerminal.sendText("npm install react-router-dom axios");

        // ✅ 1. CREATE AND OPEN GUIDE
        await createAndOpenGuide(projectRoot, projectName);

        // ✅ 2. FUNNY MUSICAL NOTIFICATION
        vscode.window.showInformationMessage(
          `🎶 TUDUM! 🎶 Folder Structure is READY, Boss! 🚀 Read the guide to run your next Magic Command!`, 
          "Let's Go!"
        );

      } catch (err) {
        console.error("Generator error:", err);
        vscode.window.showErrorMessage("Something went wrong. See developer console for details.");
      }
    }
  );

  context.subscriptions.push(disposable);

  // ==========================================
  // COMMAND 2: NAYA FEATURE - CRUD RESOURCE GENERATOR
  // ==========================================
  let resourceDisposable = vscode.commands.registerCommand(
    "mernDevboost.generateResource",
    async function () {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("Please open your project folder first.");
        return;
      }

      const rootPath = workspaceFolders[0].uri.fsPath;
      let backendPath = path.join(rootPath, "backend");

      if (!fs.existsSync(backendPath)) {
          if (path.basename(rootPath) === 'backend') {
              backendPath = rootPath;
          } else {
              vscode.window.showErrorMessage("Backend folder not found! Please run inside a MERN project root.");
              return;
          }
      }

      const resourceName = await vscode.window.showInputBox({
        prompt: "Enter Resource Name (e.g., product, post, task)",
        placeHolder: "product",
      });

      if (!resourceName || !resourceName.trim()) return;

      const lowerName = resourceName.trim().toLowerCase();
      const capitalName = lowerName.charAt(0).toUpperCase() + lowerName.slice(1);

      try {
        // Generate files (Existing CRUD logic)
        const modelContent = `const mongoose = require('mongoose');

const ${capitalName}Schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  // Add more fields here
}, { timestamps: true });

module.exports = mongoose.model('${capitalName}', ${capitalName}Schema);`;
        writeIfNotExists(path.join(backendPath, "models", `${capitalName}.js`), modelContent);

        const controllerContent = `const ${capitalName} = require('../models/${capitalName}');

// Create
exports.create${capitalName} = async (req, res) => {
  try {
    const new${capitalName} = await ${capitalName}.create(req.body);
    res.status(201).json(new${capitalName});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All
exports.getAll${capitalName}s = async (req, res) => {
  try {
    const ${lowerName}s = await ${capitalName}.find();
    res.status(200).json(${lowerName}s);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get One
exports.get${capitalName}ById = async (req, res) => {
  try {
    const ${lowerName} = await ${capitalName}.findById(req.params.id);
    if (!${lowerName}) return res.status(404).json({ message: '${capitalName} not found' });
    res.status(200).json(${lowerName});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
exports.update${capitalName} = async (req, res) => {
  try {
    const updated${capitalName} = await ${capitalName}.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated${capitalName}) return res.status(404).json({ message: '${capitalName} not found' });
    res.status(200).json(updated${capitalName});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
exports.delete${capitalName} = async (req, res) => {
  try {
    const deleted${capitalName} = await ${capitalName}.findByIdAndDelete(req.params.id);
    if (!deleted${capitalName}) return res.status(404).json({ message: '${capitalName} not found' });
    res.status(200).json({ message: '${capitalName} deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};`;
        writeIfNotExists(path.join(backendPath, "controllers", `${lowerName}Controller.js`), controllerContent);

        const routeContent = `const express = require('express');
const router = express.Router();
const { 
  create${capitalName}, 
  getAll${capitalName}s, 
  get${capitalName}ById, 
  update${capitalName}, 
  delete${capitalName} 
} = require('../controllers/${lowerName}Controller');

router.post('/', create${capitalName});
router.get('/', getAll${capitalName}s);
router.get('/:id', get${capitalName}ById);
router.put('/:id', update${capitalName});
router.delete('/:id', delete${capitalName});

module.exports = router;`;
        writeIfNotExists(path.join(backendPath, "routes", `${lowerName}Routes.js`), routeContent);

        vscode.window.showInformationMessage(`✅ ${capitalName} Model, Controller, and Routes generated successfully! Don't forget to import the route in your app.js.`);
        
      } catch (err) {
        console.error("Resource Generator error:", err);
        vscode.window.showErrorMessage("Failed to generate resource.");
      }
    }
  );

  context.subscriptions.push(resourceDisposable);

} // ✅ ACTIVATE FUNCTION ENDS HERE

function deactivate() {}

module.exports = { activate, deactivate };