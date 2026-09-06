# ScholarBridge India - Backend API & Google Drive Integration

Backend service for **ScholarBridge India** built with Express.js, Prisma ORM, and Google Drive API for storing student profile photos, marksheets, and digital credentials.

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
cd scholarship-backend
npm install
```

### 2. Setup Database (SQLite by default - zero setup!)
```bash
npx prisma generate
npx prisma db push
```

### 3. Start the Server
```bash
npm run dev
```
The API will run at `http://localhost:5000`. Check health at `http://localhost:5000/api/v1/status`.

---

## ☁️ Google Cloud Service Account Setup (For Google Drive Storage)

Follow these 4 simple steps to connect your own Google Drive storage:

### Step 1: Create a Google Cloud Project
1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown at the top and select **"New Project"**.
3. Name it **"ScholarBridge"** and click **Create**.

### Step 2: Enable Google Drive API
1. In the search bar at the top, type **"Google Drive API"**.
2. Click on **Google Drive API** and click **"Enable"**.

### Step 3: Create Service Account & Download Key
1. Go to **APIs & Services > Credentials** in the left sidebar.
2. Click **"+ CREATE CREDENTIALS"** > **"Service account"**.
3. Name it `scholarbridge-drive` and click **Create and Continue**, then click **Done**.
4. In the Service Accounts list, click on the email of the service account you just created (e.g. `scholarbridge-drive@your-project.iam.gserviceaccount.com`).
5. Go to the **"KEYS"** tab at the top.
6. Click **"ADD KEY"** > **"Create new key"**.
7. Choose **JSON** and click **Create**.
8. A `.json` file will download to your computer.
9. **Rename that file to `google-credentials.json` and place it in the `scholarship-backend/` directory.**

### Step 4: Create a Drive Folder & Share with Service Account
1. Open [Google Drive](https://drive.google.com/).
2. Create a new folder (e.g., **"ScholarBridge Uploads"**).
3. Right-click the folder > **Share**.
4. Paste the Service Account's email address (`scholarbridge-drive@your-project.iam.gserviceaccount.com`).
5. Grant it **"Editor"** permission and click **Send** (uncheck "Notify people" if prompted).
6. Open the folder in your browser and look at the URL:
   ```
   https://drive.google.com/drive/folders/1aBcD_EFgHiJkLmNoPqRsTuVwXyZ
   ```
7. Copy the ID at the end (`1aBcD_EFgHiJkLmNoPqRsTuVwXyZ`) and set it in `scholarship-backend/.env`:
   ```env
   GOOGLE_DRIVE_FOLDER_ID="1aBcD_EFgHiJkLmNoPqRsTuVwXyZ"
   ```

---

## 🚀 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register student / admin |
| `POST` | `/api/v1/auth/login` | User login & JWT issuance |
| `GET` | `/api/v1/auth/me` | Get current user |
| `GET` | `/api/v1/users/profile` | Get full profile with documents |
| `PATCH` | `/api/v1/users/profile` | Update profile & upload picture (Multer -> Drive) |
| `POST` | `/api/v1/users/documents` | Upload document (Multer -> Drive) |
| `GET` | `/api/v1/scholarships` | Fetch all scholarships from DB |
| `POST` | `/api/v1/scholarships` | Publish new scholarship scheme |
| `GET` | `/api/v1/status` | Health check & Drive status |
