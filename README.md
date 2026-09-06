# ScholarBridge India — TEZHACK 2026
### Problem Statement: WEB02 (Scholarship Eligibility Portal) + Twist Challenge: WEB-004(2) ("SAVE FOR LATER")

ScholarBridge is a high-performance, production-ready web platform that solves the chronic confusion surrounding lengthy scholarship notifications. It matches student profiles against recorded criteria using a **deterministic, transparent rule engine** (zero hidden scores) and features a complete **In-Portal ATS Application Pipeline**, **Reusable Document Locker**, **SOP/LOR Studio**, and a fully persistent **"Save for Later"** bookmarking system.

---

## 🏆 Hackathon Challenge Card Verification: "SAVE FOR LATER" [WEB-004(2)]

> **Card Requirement:** *"Allow a user to save or bookmark important records and view the saved list."*  
> **How it will be checked:** *"Save two records, remove one and reload the saved list."*

### Step-by-Step Judging Verification:
1. **Discovery & Tagging:** Go to the **Discovery & Matcher** tab (`/dashboard`). Click the bookmark icon on any two scholarships (e.g., *Ishan Uday Special Scholarship* and *Assam Pragyan Bharti*). A confirmation badge appears, and the top navbar bookmark counter updates to `2`.
2. **View Saved List:** Navigate to **Saved Scholarships** (`/my-scholarships` or click the navbar bookmark icon). Both records will appear side-by-side with deadline alerts and quick rule checkers.
3. **Remove One:** Click the red **Remove / Trash** button on one of the cards. The item is immediately removed from view.
4. **Reload Test:** Press **F5** (or click the **"Reload Page (Test Persistence)"** button). **Result:** Only the remaining record persists in `localStorage`!

---

## 🌟 Complete Feature Matrix

### 1. Advanced Search and Smart Multi-Criteria Filtering
- **Multi-Criteria Filter Bar:** Filter dynamically by:
  - **Academic Level:** School, Undergraduate, Postgraduate, Doctoral, Diploma
  - **Field of Study:** Engineering, Medical, Computer Science, Sciences, Commerce, Arts & Humanities, Law
  - **Domicile & Region:** Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura, Maharashtra, Delhi, Pan-India
  - **Gender:** All, Female (Women in STEM Schemes like *AICTE Pragati*), Male
  - **Social Quotas:** General, OBC, SC, ST, EWS, Minority
  - **Award Type:** Full-Ride, Tuition Waiver, Living Stipend, Merit Award, One-Time Grant
- **Deadline-Based Sorting:** Sort by upcoming closing deadlines (closing within 15 days highlighted in red), highest funding amounts, or best-matched rules.

### 2. Deterministic Rule-Based Eligibility Engine (Zero Black-Box)
- Every condition is evaluated visibly and explainably:
  - Minimum GPA / Percentage threshold
  - Family annual income ceiling (₹)
  - Domicile state requirement
  - Degree major qualification
  - Category and gender criteria
  - CAPF / Defence ward requirements
- **Three Transparent Statuses:**
  - 🟢 **Eligible:** Meets 100% of recorded rules.
  - 🟡 **Possibly Eligible:** Near boundary (e.g. within 0.2 GPA) or profile details pending.
  - 🔴 **Not Eligible:** Clear explanation of which criteria disqualified the profile.
- **Rule Inspector Modal:** Click *"Check Rules"* on any card to view a line-by-line comparison of your profile values versus required values.
- **Official Source Links:** Direct external links to original government notices (*scholarships.gov.in*, *ugc.ac.in*, *aicte-india.org*).

### 3. Multilingual Support (English, Hindi, Assamese)
- Real-time language switcher in the navigation bar:
  - **English (`EN`)**
  - **Hindi (`हिन्दी`)**
  - **Assamese (`অসমীয়া`)**

### 4. Integrated Application Management System (ATS)
- **Direct In-Portal Application:** Apply directly on the website without broken external redirects.
- **Visual Application Pipeline:** Real-time tracking through stages:
  - `Draft` ➔ `Submitted` ➔ `Under Review` ➔ `Shortlisted` ➔ `Awarded` / `Rejected`
- **Reviewer Feedback:** Displays committee evaluation remarks and rubric scores (Merit, Need, SOP).

### 5. Reusable Document Locker
- Secure central repository for standard verified student documents:
  - Income Certificate (Circle Officer / Revenue)
  - Permanent Resident Certificate (PRC Assam / Home State)
  - 10th & 12th Board Marksheets / University Transcripts
  - Caste / Category Certificate
  - Government ID Proof (Aadhaar)
  - Academic Resume / CV
- Attach stored credentials to any application with 1 click.

### 6. SOP Studio & LOR Request Manager
- **SOP Studio:** Draft, format, and save Statements of Purpose with real-time word counting.
- **LOR Tracker:** Send official recommendation invitations to faculty members with status tracking (`Pending` / `Received`) and reminder nudges.

### 7. Scholarship Provider & Administrator Portal (`/admin`)
- **Listing Management:** Create, configure eligibility thresholds, edit, and delete scholarship opportunities.
- **Applicant Evaluation Queue:** Inspect applicant dossiers, evaluate SOPs, and transition application statuses.
- **Analytics & Demographics:** Visual reporting on total applicants, funding allocation, and regional distribution.

### 8. Resources, Playbooks & FAQ Helpdesk (`/resources`)
- Comprehensive guides on writing winning SOPs, acing scholarship panels, and securing strong faculty endorsements.
- Searchable FAQ knowledge base and support ticketing modal.

---

## 🚀 Quick Start Instructions

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Local Development Server
```bash
npm run dev
```
Open your browser and navigate to: `http://localhost:3000` (or the port displayed in your terminal).

### 3. Build for Production
```bash
npm run build
```

---

## 🛠️ Complete Backend Setup (`scholarship-backend`)

The backend is built with **Node.js, Express, Prisma ORM, and Google Drive API Integration** with seamless automatic local fallback.

### Backend Setup Steps:
```bash
cd scholarship-backend
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run seed
npm start
```
The backend server runs on `http://localhost:5000` with the following endpoints:
- `GET /api/v1/status` — API health check and Google Drive service status
- `POST /api/v1/auth/register` & `POST /api/v1/auth/login` — JWT authentication
- `GET /api/v1/scholarships` & `POST /api/v1/scholarships` — Full CRUD for scholarships
- `GET /api/v1/applications` & `POST /api/v1/applications` — Student ATS pipeline & admin reviews
- `POST /api/v1/users/documents/upload` — Google Drive streaming upload with local fallback

---

## 👤 Quick 1-Click Demo Personas

On the Login page (`/login`), click any of the 1-click personas to test immediately:
1. **Priyanka Sarma (Student - Assam):** Domiciled in Assam, B.Tech CSE, GPA 3.8, Income ₹2.5L. Matches *AICTE Pragati* and *NEC Assam*.
2. **Ananya Devi (Female Scholar in STEM):** B.Tech Engineering, GPA 3.7, Income ₹2.4L, OBC. Matches *AICTE Pragati for Girls*.
3. **Platform Administrator:** Direct access to `/admin` to evaluate dossiers and publish schemes (`admin@scholarbridge.in`).

---

## 🐙 GitHub-Readiness Checklist
- [x] Comprehensive `.gitignore` protecting build artifacts and environment secrets while preserving core datasets.
- [x] Pre-configured `.github/workflows/ci.yml` for automated GitHub Actions lint, typecheck, and build on push.
- [x] Zero hardcoded absolute paths — compatible with macOS, Linux, and Windows.
- [x] Out-of-the-box local database with Prisma and SQLite.

