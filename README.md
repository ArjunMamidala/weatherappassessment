# Weather App – AI Engineer Intern Technical Assessment

**Author:** Arjun Mamidala  

This project is a full-stack weather application built as part of an **AI Engineer Intern – AI/ML/GenAI Application Technical Assessment**.  
It allows users to enter locations in multiple formats, retrieve real-time weather data and forecasts via APIs, and persist user queries with full CRUD functionality using a database.

---

## 🚀 Features

### Core Functionality (Tech Assessment 1)
- Input locations using:
  - City / Town
  - Zip / Postal Code
  - GPS Coordinates
  - Landmarks
- Retrieve **real-time weather data** using external APIs
- Show weather details:
  - Temperature
  - Conditions
  - Humidity
  - Wind speed
- 5-day weather forecast
- Fetch weather based on **current location**
- Weather icons for visualization

### Advanced Functionality (Tech Assessment 2)
- Database-backed persistence (SQL/NoSQL)
- Full **CRUD operations**:
  - **Create:** store location + date range weather queries with validation
  - **Read:** view all stored weather data
  - **Update:** modify records safely
  - **Delete:** remove records
- Robust input validation & error handling
- Designed for extensibility with additional API integrations (optional)

---

## 🧰 Tech Stack
*(Adjust if needed based on your actual stack)*

- **Backend:** Node.js (Express)
- **Database:** MongoDB / SQLite
- **Frontend:** React
- **APIs:** OpenWeatherMap, Google Maps (optional)
- **Other:** RESTful API, JSON data exchange

---

## ⚙️ Installation & Setup

```bash
1. Clone the repository
git clone https://github.com/YOUR_USERNAME/weather-app-ai-intern-assessment.git
cd weather-app-ai-intern-assessment
2. Install backend dependencies
cd backend
npm install
3. Install frontend dependencies
cd ../frontend
npm install
4. Environmental Variables
Create a .env file in the backend folder with your API keys:
WEATHER_API_KEY=your_api_key_here
MAPS_API_KEY=your_api_key_here
PORT=5000
5. Start backend server
cd backend
nodemon
6. Start frontend dev server:
cd frontend
npm start

Open browser at the port shown
