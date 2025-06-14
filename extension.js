
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "mernDevboost.generateStructure",
    function () {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage(
          "Please open a folder before generating structure."
        );
        return;
      }

      const rootPath = workspaceFolders[0].uri.fsPath;

      const backendStructure = {
        config: "config.js",
        controllers: "controller.js",
        db: "db.js",
        middleware: "middleware.js",
        models: "model.js",
        routes: "route.js",
        services: "service.js",
        utils: "utils.js",
      };

      const frontendStructure = {
        src: ["App.jsx", "main.jsx", "index.css"],
        components: ["Navbar.jsx"],
        pages: ["Login.jsx", "Register.jsx", "Home.jsx"],
        services: ["api.js"],
      };


            // ✅ Create backend folders + files with boilerplate code
      Object.entries(backendStructure).forEach(([folder, file]) => {
        const folderPath = path.join(rootPath, "backend", folder);
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }

        const filePath = path.join(folderPath, file);
        if (!fs.existsSync(filePath)) {
          let content = "";
          switch (file) {
            case "config.js":
              content = `const dotenv = require('dotenv');\ndotenv.config();`;
              break;

            case "db.js":
              content = `const mongoose = require('mongoose');\n\nconst connectDB = async () => {\n  try {\n    const conn = await mongoose.connect(process.env.MONGO_URI, {\n      useNewUrlParser: true,\n      useUnifiedTopology: true\n    });\n    console.log(\"MongoDB Connected:\", conn.connection.host);\n  } catch (error) {\n    console.error(\"MongoDB connection error:\", error.message);\n    process.exit(1);\n  }\n};\n\nmodule.exports = connectDB;`;
              break;

          case "controller.js":
  content = `const User = require('../models/model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ _id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token'); // clear token cookie if using cookie-based auth
  res.json({ message: 'Logged out successfully' });
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};`;
  break;


            case "model.js":
              content = `const mongoose = require('mongoose');\n\nconst UserSchema = new mongoose.Schema({\n  name: { type: String, required: true, trim: true },\n  email: { type: String, required: true, unique: true, lowercase: true },\n  password: { type: String, required: true }\n}, { timestamps: true });\n\nmodule.exports = mongoose.model('User', UserSchema);`;
              break;

            case "route.js":
              content = `const express = require('express');\nconst router = express.Router();\nconst { register, login, logout, profile } = require('../controllers/controller');\nconst auth = require('../middleware/middleware');\n\nrouter.post('/register', register);\nrouter.post('/login', login);\nrouter.get('/logout', logout);\nrouter.get('/profile', auth, profile);\n\nmodule.exports = router;`;
              break;

            case "middleware.js":
              content = `const jwt = require('jsonwebtoken');\n\nmodule.exports = (req, res, next) => {\n  const token = req.header('Authorization')?.replace('Bearer ', '');\n  if (!token) return res.status(401).json({ message: 'No token provided' });\n\n  try {\n    const decoded = jwt.verify(token, process.env.JWT_SECRET);\n    req.user = decoded;\n    next();\n  } catch (err) {\n    res.status(401).json({ message: 'Invalid token' });\n  }\n};`;
              break;

            case "service.js":
              content = `exports.sendWelcomeEmail = (email) => {\n  console.log(\`Sending welcome email to \${email}\`);\n};\n\nexports.logActivity = (activity) => {\n  console.log(\`Activity Log: \${activity}\`);\n};`;
              break;

            case "utils.js":
              content = `const jwt = require('jsonwebtoken');\n\nexports.generateToken = (userId) => {\n  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });\n};`;
              break;

            default:
              content = `// ${file} for ${folder}`;
          }

          fs.writeFileSync(filePath, content);
        }
      });

      const serverFile = path.join(rootPath, "backend", "server.js");
      if (!fs.existsSync(serverFile)) {
        const content = `
const app = require('./app');
const connectDB = require('./db/db');
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
  });
});
        `;
        fs.writeFileSync(serverFile, content.trim());
      }

      const appFile = path.join(rootPath, "backend", "app.js");
      if (!fs.existsSync(appFile)) {
        const content = `
const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/route');

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

module.exports = app;
        `;
        fs.writeFileSync(appFile, content.trim());
      }

      const envPath = path.join(rootPath, "backend", ".env");
      if (!fs.existsSync(envPath)) {
        fs.writeFileSync(envPath, `PORT=5000
MONGO_URI=mongodb://localhost:27017/devboost
JWT_SECRET=supersecret123`);
      }

      const backendPkg = path.join(rootPath, "backend", "package.json");
      const backendTerminal = vscode.window.createTerminal("Backend Setup");
      backendTerminal.show();
      backendTerminal.sendText(`cd "${path.join(rootPath, "backend")}"`);
      backendTerminal.sendText("npm init -y");
      backendTerminal.sendText("npm install express mongoose cors dotenv jsonwebtoken bcryptjs");

      setTimeout(() => {
        if (fs.existsSync(backendPkg)) {
          const pkg = JSON.parse(fs.readFileSync(backendPkg, "utf8"));
          pkg.scripts = { start: "node server.js" };
          fs.writeFileSync(backendPkg, JSON.stringify(pkg, null, 2));
        }
      }, 5000);

     // ✅ FRONTEND SETUP
const frontendPath = path.join(rootPath, "frontend");
if (!fs.existsSync(frontendPath)) fs.mkdirSync(frontendPath, { recursive: true });

const feTerminal = vscode.window.createTerminal("Frontend Vite Setup");
feTerminal.show();
feTerminal.sendText(`cd "${frontendPath}"`);
feTerminal.sendText("npx create-vite@latest . --template react --yes");

const pkgPath = path.join(frontendPath, "package.json");

const checkPkgJson = setInterval(() => {
  if (fs.existsSync(pkgPath)) {
    clearInterval(checkPkgJson);

    const frontendSrcPath = path.join(frontendPath, "src");
    const files = {
      'main.jsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      'App.jsx': `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;`,
      'index.css': `/* Add your custom CSS or Tailwind directives after installation */`,
      'components/Navbar.jsx': `import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav>
    <Link to='/'>Home</Link>
    <Link to='/login'>Login</Link>
    <Link to='/register'>Register</Link>
  </nav>
);

export default Navbar;`,
      'pages/Login.jsx': `import React from 'react';

const Login = () => (
  <div>
    <h2>Login</h2>
    <form>
      <input type='email' placeholder='Email' />
      <input type='password' placeholder='Password' />
      <button>Login</button>
    </form>
  </div>
);

export default Login;`,
      'pages/Register.jsx': `import React from 'react';

const Register = () => (
  <div>
    <h2>Register</h2>
    <form>
      <input type='text' placeholder='Name' />
      <input type='email' placeholder='Email' />
      <input type='password' placeholder='Password' />
      <button>Register</button>
    </form>
  </div>
);

export default Register;`,
      'pages/Home.jsx': `import React from 'react';

const Home = () => (
  <div>
    <h2>Welcome to MERN Frontend</h2>
    <p>This is the Home Page.</p>
  </div>
);

export default Home;`,
      'services/api.js': `import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerUser = (data) => API.post('/auth/register', data);
export const getProfile = (token) => API.get('/auth/profile', {
  headers: { Authorization: \`Bearer \${token}\` },
});`
    };

    Object.entries(files).forEach(([relativePath, content]) => {
      const fullPath = path.join(frontendSrcPath, relativePath);
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(fullPath, content.trim());
    });

    feTerminal.sendText("npm install");
    feTerminal.sendText("npm install react-router-dom axios");

    // ✅ Create .env file in frontend
const frontendEnvPath = path.join(frontendPath, ".env");
if (!fs.existsSync(frontendEnvPath)) {
  fs.writeFileSync(frontendEnvPath, `VITE_API_URL=http://localhost:5000/api`);
}

    vscode.window.showInformationMessage("✅ Full MERN folder structure created (Tailwind excluded).");
  }
}, 3000);

    }
  );

  context.subscriptions.push(disposable);
}


function deactivate() {}

module.exports = {
  activate,
  deactivate
};
