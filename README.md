# ⚡ Real-Time Backend API with JWT, WebRTC, and Socket.IO

A real-time backend API built with **Express.js**, secured with **JWT authentication**, and powered by **MongoDB**, **WebRTC**, and **Socket.IO** to support live, secure, and interactive communication between users and the server.

---

## 🔧 Tech Stack

| Layer         | Tool / Tech              |
|---------------|--------------------------|
| Language      | JavaScript (Node.js)     |
| Framework     | Express.js               |
| Auth          | JSON Web Tokens (JWT)    |
| Realtime      | WebRTC + Socket.IO       |
| Database      | MongoDB (Mongoose)       |
| Data Format   | JSON                     |

---

## 🔐 Authentication Flow

- ✅ Login via email & password
- ✅ JWT is issued and verified on every protected route
- ✅ Logout handled client-side by deleting token
- ✅ No token = no access, period

---

## 🧠 Core Features

- 🚀 RESTful API built on Express
- 🔐 JWT-based route protection
- 🗃️ MongoDB schemas via Mongoose
- 📡 WebRTC integration for real-time peer-to-peer connections
- 🔊 Live updates via Socket.IO (chat, signals, status)
- 🧼 Clean folder structure for scalability & maintainability

---

## 📁 Folder Structure
├── controllers/ # Business logic
├── models/ # MongoDB schemas
├── routes/ # API endpoints
├── middleware/ # JWT auth verification
├── config/ # MongoDB + env setup
├── socket/ # Socket.IO server
├── webrtc/ # WebRTC signaling logic
├── app.js # Main entry file
└── .env # Environment variables

yaml
Copy code

---

## 📡 Realtime Layer

### WebRTC
- Direct peer-to-peer communication
- Used for real-time media or data sharing

### Socket.IO
- Real-time event broadcasting
- WebRTC signaling (offer/answer/ICE)

---

## 🧪 Installation

```bash
git clone https://github.com/priyanjha18/backend-realtime-api.git
cd backend-realtime-api
npm install
⚙️ Environment Variables
Create a .env file in the root directory with:

env
Copy code
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
Be sure to add .env to your .gitignore

🚀 Start the Server
bash
Copy code
npm start
🔒 Security Best Practices
CSRF is irrelevant in token-based APIs — focus on:

CORS configuration

Token expiration

Proper input validation

Do not store JWTs in localStorage on frontend (use HttpOnly cookies or secure tokens)

🛠️ Future Enhancements
Redis integration for socket session caching

Rate limiting & brute-force protection

WebRTC multi-peer support

Push notification system

Swagger/Postman API docs

👤 Author
Made for scale and speed by Priyan Jha

📄 License
This project is licensed under the MIT License

yaml
Copy code

---


