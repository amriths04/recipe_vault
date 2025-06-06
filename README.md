# 🍽️ RecipeVault

**RecipeVault** is a full-stack mobile application that helps you manage and explore recipes smartly — allowing custom servings, dietary preferences, automatic shopping lists, and one-tap grocery ordering.

Built using:

- 📱 **Frontend**: React Native (Expo)
- 🌐 **Backend**: Node.js, Express.js
- 🧠 **Database**: MongoDB

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/amriths04/recipe_vault.git
```
---

## ⚙️ Environment Setup

All environment configuration is done **inside the `server/` directory**.

### Steps:

```bash
cd server
cp .env.example .env
```

Edit `.env` and fill in required variables like:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
```

---

## 📦 Installing Dependencies

### 🧑‍🍳 Frontend Setup (React Native + Expo)

1. Go to the frontend directory:

```bash
cd RecipeVault
cd frontend
```

2. Install all dependencies:

```bash
npm install
```

3. Run the app using Expo:

```bash
npx expo start
```

You can scan the QR code using the **Expo Go** app on your mobile device or run it on an emulator.

> 💡 Make sure you have Node.js and Expo CLI installed globally (`npm install -g expo-cli`).

---

### 🔧 Backend Setup (Express + MongoDB)

1. Navigate to the backend:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Start the backend server:

```bash
npm run dev
```

This will launch the backend on the port you specified in your `.env` file (default usually `http://localhost:5000`).

---

## 🖼️ Screenshots

![alt text](<RecipeVault/frontend/assets/Screenshot (263).png>)
![alt text](<RecipeVault/frontend/assets/Screenshot (264).png>)
![alt text](RecipeVault/frontend/assets/BillPDF.png)

---

## 📁 Project Structure

```
RecipeVault/
├──RecipeVault
   |---frontend/      # React Native app using Expo
├── server/           # Express backend with MongoDB
├── README.md
```
---

## ✅ Requirements

- Node.js ≥ 16.x
- npm
- Expo CLI SDK52
- MongoDB Atlas or local instance
- Android/iOS device or emulator (for testing)

---

## 🤝 Contributions

Contributions are welcome!  
Feel free to fork the repo and submit pull requests for improvements, new features, or bug fixes.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

Thanks to the open-source community and tools that made this project possible — including React Native, Express, and MongoDB.
