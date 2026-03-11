# Streamlit Cloud Deployment Guide

## Quick Deploy

### 1. Backend (Render/Railway/Render)
Deploy the backend first:
```bash
cd backend
npm install
```
Configure environment variables:
- `MONGODB_URI`
- `MYSQL_HOST`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `JWT_SECRET`

### 2. Frontend (Streamlit Cloud)
1. Push to GitHub
2. Go to https://share.streamlit.io
3. Connect your repository
4. Set:
   - **Main file path**: `frontend/app.py`
   - **Python version**: 3.11
5. Add secrets:
   - `API_BASE_URL`: Your backend URL

### 3. Architecture
```
┌─────────────────┐      ┌──────────────────┐
│  Streamlit Cloud│ ───► │  Backend API     │
│   (Frontend)    │      │   (Node.js)     │
└─────────────────┘      └────────┬────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
              ┌──────────┐  ┌──────────┐  ┌──────────┐
              │ MongoDB  │  │  MySQL   │  │ CoinGecko│
              └──────────┘  └──────────┘  └──────────┘
```

## Environment Variables

### Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/swiss_crypto_ramp
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=swiss_crypto_ramp
JWT_SECRET=your-secret-key
CRYPTO_API_URL=https://api.coingecko.com/api/v3
```

### Frontend (Streamlit Secrets)
```toml
[secrets]
API_BASE_URL = "https://your-backend.onrender.com/api"
```
