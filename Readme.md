# 🚀 MERN DevBoost - The Ultimate MERN Stack Scaffolder

![version](https://img.shields.io/badge/version-1.0.1-blue)
![platform](https://img.shields.io/badge/platform-VS%20Code-blue)
![status](https://img.shields.io/badge/status-active-brightgreen)
![license](https://img.shields.io/badge/license-MIT-green)

**MERN DevBoost** is a powerful developer productivity extension for VS Code. Stop wasting 40 minutes setting up folders, installing packages, and writing boilerplate code. 

With MERN DevBoost, you can scaffold a **Complete MERN (MongoDB, Express, React, Node.js) Project** and **Generate Full CRUD APIs** in just seconds! ⚡

---

## ✨ Why MERN DevBoost?

* 🕒 **Save Hours of Setup:** Go from zero to a fully running full-stack app in 2 minutes.
* 🏗️ **Industry-Standard Architecture:** Clean MVC (Model-View-Controller) backend structure.
* 🔐 **Pre-Built Authentication:** JWT & bcrypt login/register logic already written for you.
* ⚡ **Lightning Fast Frontend:** React powered by Vite, pre-configured with React Router and Axios.
* 📖 **Smart Interactive Guide:** Automatically opens a beautiful Markdown guide (`DEVBOOST_GUIDE.md`) to help you start your servers and test APIs immediately.

---

## 🪄 The 2 Magic Commands

Press `Ctrl + Shift + P` (Windows/Linux) or `Cmd + Shift + P` (Mac) to open the Command Palette and type **MERN**.

### 1️⃣ `MERN: Generate MERN Folder Structure`
Run this in an empty folder to create your entire project ecosystem.
**What you get instantly:**
* **Backend:** Express, Mongoose, dotenv, cors, jsonwebtoken setup.
* **Frontend:** Vite + React, react-router-dom, axios.
* **Auth Ready:** `User` Model, `authController.js`, and `authRoutes.js` pre-written.
* **Database:** `db.js` file with MongoDB connection string ready in `.env`.

### 2️⃣ `MERN: Generate API Resource (CRUD)` 🔥 *(NEW)*
Never write boring boilerplate again! Run this command inside your project and type a resource name (e.g., `Product`, `Post`, `Task`).
**What it does in 1 second:**
* Generates `models/Product.js` (Mongoose Schema)
* Generates `controllers/productController.js` (Create, Read, Update, Delete logic with try-catch blocks)
* Generates `routes/productRoutes.js` (Express Router endpoints)

---

## 📁 What Does the Generated Structure Look Like?

📆 your-project-name/
├── 📂 backend/
│   ├── 📂 controllers/  (authController.js)
│   ├── 📂 db/           (db.js)
│   ├── 📂 middleware/   (auth.js)
│   ├── 📂 models/       (User.js)
│   ├── 📂 routes/       (auth.js)
│   ├── 📄 app.js        (Express app setup)
│   ├── 📄 server.js     (Server entry point)
│   └── 📄 .env          (MongoDB URI & JWT Secret)
│
└── 📂 frontend/
    ├── 📂 src/
    │   ├── 📂 components/
    │   ├── 📂 pages/    (Home, Login, Register)
    │   ├── 📂 services/ (api.js - Axios config)
    │   ├── 📄 App.jsx   (React Router config)
    │   └── 📄 main.jsx
    └── 📄 .env          (Vite API URL)

---

## 🎨 What about Tailwind CSS?
We believe in keeping the UI clean so you can choose your own styling tools. However, if you love **Tailwind CSS**, our auto-generated `DEVBOOST_GUIDE.md` includes 3 simple copy-paste steps to integrate it flawlessly into your Vite frontend!

---

## ⚙️ Installation

### 🔗 From VS Code Marketplace (Recommended)
1. Open the **Extensions** tab in VS Code.
2. Search for: `MERN DevBoost`
3. Click **Install**.

### 📦 From VSIX File (Offline)
1. Download `.vsix` from [GitHub Releases](https://github.com/Farhan043/mern-devboost).
2. In VS Code: Extensions Panel → `...` → `Install from VSIX`.

---

## 👨‍💻 Contributing

We welcome contributions! Have a crazy new feature idea?
1. Fork this repository.
2. Create a branch: `git checkout -b feature/YourFeature`
3. Commit your changes.
4. Push and open a Pull Request.

---

## 🙌 Author & Credits

Built with ❤️ by [@habibcodes](https://github.com/Farhan043).  
If this extension saved your time, please leave a **Star ⭐️** on [GitHub](https://github.com/Farhan043/mern-devboost) and a review on the VS Code Marketplace!

---

## 📘 License
Licensed under the [MIT License](LICENSE).