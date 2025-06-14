# 🚀 MERN DevBoost - VS Code Extension

![version](https://img.shields.io/badge/version-0.0.1-blue)
![platform](https://img.shields.io/badge/platform-VS%20Code-blue)
![status](https://img.shields.io/badge/status-active-brightgreen)


**MERN DevBoost** is a developer productivity VS Code extension that scaffolds a complete MERN (MongoDB, Express, React, Node.js) project structure — backend and frontend — in one command.

Save hours of setup time and jump straight into coding!

---

## ✨ Features

* 📁 Auto-generates full **backend folder structure** with essential boilerplate files
* ⚙️ Creates production-ready `server.js` + Express + MongoDB setup
* ⚛️ Generates a **frontend React + Vite** structure using `create-vite`
* 🌐 Includes working routing (`react-router-dom`) and example pages
* 🧾 Automatically creates `.env` files for backend & frontend
* 🛠️ No Tailwind or styling tools included — user can install their own
* ↺ Safe for re-runs — only missing folders/files are created

---

## 📁 Folder Structure Generated

```
📆 project-root/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── .env
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   ├── components/
    │   ├── pages/
    │   └── services/
    └── .env
```

---

## ⚙️ Installation

### 🔗 From VS Code Marketplace (Recommended)

1. Open **Extensions** tab in VS Code
2. Search: `MERN DevBoost`
3. Click **Install**

### 📦 From VSIX File (Offline)

1. Download `.vsix` from [GitHub Releases](https://github.com/Farhan043/mern-devboost/releases)
2. In VS Code: Extensions Panel → `...` → `Install from VSIX`

---

## 🚀 How to Use

1. Open any empty folder in VS Code
2. Run the command:

   * Press `Ctrl + Shift + P` (Windows/Linux)
   * Press `Cmd + Shift + P` (macOS)
3. Search for: `MERN: Generate MERN Folder Structure`
4. Hit **Enter**
5. 🎉 Done! Full project structure will be scaffolded automatically

---

## 🧾 Notes

* Frontend uses **Vite + React**
* Tailwind or styling tools are **not pre-installed** — you can add them later
* `.env` file is generated both in backend and frontend with placeholder values
* You can run the command multiple times — it won't override existing files

---

## 🛠 Future Plans

* 🧠 Mongoose schema generator with prompts
* 📄 `README.md` generator inside scaffold
* 🧪 Built-in REST API test runner

---

## 🎮 Demo (Coming Soon)

> Want to contribute a GIF or walkthrough?
> Submit a PR or open an issue!

---

## 👨‍💻 Contributing

1. Fork this repository
2. Create a branch: `git checkout -b feature/YourFeature`
3. Commit your changes
4. Push and open a Pull Request ✅

---

## 🙌 Author & Credits

Created by [@habibcodes](https://github.com/Farhan043) 💻
Star it ⭐️ on GitHub: [mern-devboost](https://github.com/Farhan043/mern-devboost)

---

## 📩 Feedback / Support

Open an issue at 👉 [https://github.com/Farhan043/mern-devboost/issues](https://github.com/Farhan043/mern-devboost/issues)

---

## 📘 License

Licensed under the [MIT License](LICENSE)
