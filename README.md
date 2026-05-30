# Customer Support Ticketing CRM (ApexSupport)

Welcome to the **ApexSupport CRM** ticketing portal workspace. This monorepo contains both the Node.js/Express API backend and the Vite/React/Tailwind CSS frontend client.

---

## Getting Started

To launch the fullstack application, you need to start **both** the backend and the frontend development servers.

### Method 1: Concurrent Startup (Recommended)

You can run both servers simultaneously using a single command from this root directory:

1. **Install all dependencies** for both the backend and frontend:
   ```bash
   npm run install:all
   ```

2. **Boot both development servers** concurrently:
   ```bash
   npm run dev
   ```

The console will boot:
- The **Backend API** at `http://localhost:5000`
- The **Frontend Dashboard** at `http://localhost:5173`

---

### Method 2: Manual Startup (Separate Terminals)

If you prefer to run them in separate shell sessions:

#### 1. Start the Backend API
Navigate to the `/backend` folder and run:
```bash
cd backend
npm install
npm run dev
```

#### 2. Start the Frontend Client
Open a new terminal window, navigate to the `/frontend` folder and run:
```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Make sure the following variables match (or are set to default values):

- **Backend** (`backend/.env`):
  `CLIENT_URL=http://localhost:5173` (to permit frontend CORS calls)
- **Frontend** (`frontend/.env`):
  `VITE_API_URL=http://localhost:5000/api` (to direct API requests to the backend)
