# 🌱 EcoImpact

**EcoImpact** is a community-focused platform combining:

1. **Community Carbon Challenge Platform** – log eco-friendly actions, join team challenges, and track CO₂ savings  
2. **TrashTagger** – map, claim, and clean local waste sites with before/after records

Built with **React + Vite (frontend)** and **Node.js, Express, MongoDB (backend)**.

---

## 🚀 Features

- ✅ Log eco-friendly actions with CO₂ savings  
- ✅ Create and join teams to compete on leaderboards  
- ✅ Upload and map trash posts with images and location data  
- ✅ Claim and mark trash cleaned  
- ✅ Local image storage with Multer  
- ✅ Modular backend with clean data models and routes  

---

## 🛠 Tech Stack

| **Tech**         | **Usage**                  |
|------------------|----------------------------|
| **Frontend**     | React + Vite (planned)     |
| **Backend**      | Node.js, Express           |
| **Database**     | MongoDB with Mongoose      |
| **Dev Tools**    | Nodemon, Postman, MongoDB Compass |

---

## 💻 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/ghostxdx4/EcoImpact.git
cd EcoImpact/backend 



2. Install dependencies
npm install

3. Ensure MongoDB is running
On Garuda Linux (Arch-based):

sudo systemctl start mongodb
Optionally enable at boot:

sudo systemctl enable mongodb

4. Start the backend server
npm start
The backend runs at: http://localhost:5000

📝 Development Notes
This backend runs locally only, no JWT authentication implemented.
Images are stored in the uploads/ directory.
Ensure MongoDB is connected on mongodb://127.0.0.1:27017/ecoplatform.
Use Postman to test API endpoints module by module.
The frontend will consume these REST APIs for a unified EcoImpact platform.

✨ License
This project is for academic and community learning purposes. Feel free to fork and extend with attribution.
