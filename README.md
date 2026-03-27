# 🌍 MigrantHealth Connect  
### Advanced Surveillance & Monitoring System

MigrantHealth Connect is a full-stack **health surveillance platform** designed to monitor, analyze, and manage the health of migrant populations in real-time.

It enables **ASHA workers, health administrators, and epidemiologists** to track disease patterns, identify hotspots, and ensure timely interventions using powerful visual analytics.

---

## 🚀 Project Vision

Migrant populations often lack consistent healthcare tracking. This platform provides a **centralized, secure, and real-time system** to:

- 👩‍⚕️ Register & update migrant health records (ASHA Workers)
- 📊 Monitor district & state-level trends (Administrators)
- 🚨 Detect disease hotspots ("Red Zones") (Epidemiologists)

---

## 🛠 Tech Stack

### 🎨 Frontend (Visual Analytics Engine)

- **React.js (v18)** – High-performance SPA
- **Tailwind CSS** – Modern, responsive UI
- **Recharts** – Data visualization (Bar, Pie charts)
- **React Leaflet** – Interactive maps (OpenStreetMap)
- **Lucide-React & React-Icons** – Clean UI icons

---

### ⚙️ Backend (Data Processing Engine)

- **Node.js & Express** – Scalable server
- **Firebase Admin SDK** – Secure database access
- **Multer** – File & image uploads

---

### ☁️ Cloud Infrastructure

- **Firestore (NoSQL)** – Real-time database
- **Firebase Storage** – Medical reports & images

---

## 📊 Core Features

### 1️⃣ Smart Analytics Dashboard

- 🔄 **Real-time KPI Updates**
  - Total Migrants
  - Active Cases
  - Recovered
  - Hotspots

- 📍 **Drill-Down Analytics**
  - District → City-level insights

- 🥧 **Dynamic Pie Charts**
  - Disease distribution (Asthma, Diabetes, TB, etc.)

---

### 2️⃣ Live Hotspot Alerts

- 🚨 Automatic risk grouping by location
- 🔴 **Red Zone** → ≥ 2 active cases  
- 🟠 **Orange Zone** → 1 active case  
- 🗺 Interactive map visualization

---

### 3️⃣ Search & Update System

- 🔍 Search using **phoneNumber (Primary Key)**
- ⚡ Real-time updates via PATCH API
- 📝 Update:
  - Health status
  - Clinical notes
  - Chronic conditions

---

### 4️⃣ Standardized Patient Profiles

Each migrant profile includes:

- 🧑 Personal details
- ❤️ Health status (Critical / Observation / Recovered)
- 🧬 Chronic diseases
- 🔗 Interoperable schema (Team 2 compatible)

---

## 🗄 Data Architecture (Schema)

| Field              | Description                         | Type   |
|-------------------|-------------------------------------|--------|
| fullName          | Legal name                          | String |
| phoneNumber       | Unique Identifier (Primary Key)     | String |
| age               | Age                                 | String |
| gender            | Male / Female / Other               | String |
| district          | Current district                    | String |
| city              | Current city/town                   | String |
| migrantType       | Incoming / Returnee                 | String |
| chronicDiseases   | Comma-separated conditions          | String |
| health_profile    | Contains overall_status             | Object |
| registeredAt      | ISO timestamp                       | String |

---

## ⚙️ Installation & Setup

### ✅ Prerequisites

- Node.js (v16+)
- Firebase Project (Firestore + Storage enabled)
- `serviceAccountKey.json` from Firebase Console

---

### 🔧 Backend Setup

```bash
cd migrant-health-backend
npm install
