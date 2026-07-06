# Deployment Guide — MMMUT Hostel Exchange Portal

This guide provides step-by-step instructions to deploy your backend to **Render** and your frontend to **Vercel**.

---

## 1. Prepare for Deployment

Before deploying, make sure you have:
1. A **GitHub** account.
2. A **MongoDB Atlas** database connection string (URI).
3. A **Firebase Web App** config.
4. The Firebase service account key JSON content.

---

## 2. Deploy Backend (Node.js + Express) on Render

Since the `serviceAccountKey.json` file is ignored by Git for security, we pass its contents as an environment variable (`FIREBASE_SERVICE_ACCOUNT`) on Render.

### Step-by-Step Backend Deployment:
1. Push your code repository (containing both `backend` and `frontend` folders) to a **private GitHub repository**.
2. Sign in to **[Render](https://render.com/)**.
3. Click **New** → **Web Service**.
4. Connect your GitHub repository.
5. Configure the web service:
   - **Name**: `hostel-exchange-backend`
   - **Root Directory**: `backend`
   - **Language**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free` (or any tier)
6. Scroll down and click **Advanced** → **Add Environment Variable**:
   - **`MONGO_URI`**: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/hostel-exchange?retryWrites=true&w=majority` *(Your real MongoDB Atlas connection string)*
   - **`PORT`**: `10000` *(Render dynamically assigns this, but setting it is a good fallback)*
   - **`FIREBASE_SERVICE_ACCOUNT`**: Open your local `backend/serviceAccountKey.json` file, copy the **entire JSON text**, and paste it here as a single-line string.
7. Click **Create Web Service**.
8. Once built and running, copy your service's URL (e.g. `https://hostel-exchange-backend.onrender.com`).

---

## 3. Deploy Frontend (Vite + React) on Vercel

Vercel will build and host your static React assets.

### Step-by-Step Frontend Deployment:
1. Sign in to **[Vercel](https://vercel.com/)**.
2. Click **Add New** → **Project**.
3. Select the same GitHub repository from list.
4. Configure the project:
5. **Root Directory**: Select `frontend`.
6. Under **Build & Development Settings**, verify the defaults:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
7. Expand **Environment Variables** and add:
   - **`VITE_API_URL`**: `https://your-backend-url.onrender.com/api` *(Paste the URL of your Render backend service, followed by `/api`)*
8. Click **Deploy**.
9. Once Vercel completes the build, it will assign you a live domain (e.g. `https://hostel-exchange.vercel.app`).

---

## 4. Final Configurations

### 1. Update Authorized Domains in Firebase
To allow users to log in on your newly deployed frontend:
1. Go to the **[Firebase Console](https://console.firebase.google.com)**.
2. Navigate to your project → **Authentication** → **Settings** (tab).
3. Under **Authorized domains**, click **Add domain**.
4. Paste your Vercel deployment domain (e.g. `hostel-exchange.vercel.app`, without `https://`).
5. Click **Add**.

---

🎉 **Done!** Your fullstack application is now successfully hosted live in production.
