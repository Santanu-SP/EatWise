# 🥗 EatWise - Indian Healthy Recipe Personalization App

EatWise is a professional, high-performance Progressive Web Application (PWA) designed to promote healthy eating habits. It encourages users to enjoy authentic Indian dishes but prepared using modern, healthy, low-oil, or zero-oil techniques.

🌐 **Live URL:** [https://eatwise.pages.dev](https://eatwise.pages.dev)

---

## ✨ Core Features

*   **🇮🇳 100% Authentic Indian Recipes:** Includes a curated library of 25 popular Indian recipes (from breakfast options like Aloo Paratha to snacks like Samosas and mains like Biryani) customized specifically for Indian kitchens.
*   **⚠️ High-Calorie Warnings:** Indulgent or deep-fried dishes display warnings showing their estimated traditional calorie impact, recommending healthy alternatives instead.
*   **🌱 Low-Oil & Zero-Oil Alternatives:** Every recipe includes step-by-step instructions for a healthy version, comparing traditional calories to the healthy option.
*   **🎥 Hindi YouTube Tutorials:** Handpicked, high-quality recipe videos (with Hindi audio) demonstrating the low-oil/zero-oil techniques.
*   **🗣️ Bilingual (English & Hindi) Support:** Multi-language side-by-side view for ingredients and preparation steps.
*   **⚡ PWA & Offline Support:** Installable on Android & iOS homescreens. Fully responsive layout optimized for mobile screens.
*   **🔑 Hybrid Authentication:** Firebase Auth & Firestore database integration with seamless automatic fallback to local storage for quick testing.

---

## 🛠️ Tech Stack

*   **Frontend:** React (Vite), Tailwind CSS, Lucide Icons, Vite-PWA.
*   **Database & Authentication:** Firebase (Auth & Firestore) / LocalStorage hybrid fallback.
*   **Hosting:** Cloudflare Pages (Frontend).

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Santanu-SP/EatWise.git
    cd EatWise
    ```

2.  **Install Root & Client dependencies:**
    ```bash
    npm run build
    ```

3.  **Run Locally (Dev mode):**
    ```bash
    npm run dev
    ```
    This will start the local Vite development server, running by default at `http://localhost:5173`. It runs automatically in **offline fallback mode** using local storage.

---

## ☁️ Deployment

### Frontend (Cloudflare Pages)
1. Link your GitHub account to [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Create a new Pages Project from Git and choose `EatWise`.
3. Set the following Build parameters:
    *   **Root directory:** `client`
    *   **Build command:** `npm run build`
    *   **Build output directory:** `dist`
4. Click deploy. 

### Database Setup (Firebase)
1. Register a new Web App in your [Firebase Console](https://console.firebase.google.com/).
2. Turn on **Email/Password Provider** in Authentication.
3. Turn on **Firestore Database** in production or test mode.
4. Replace the credentials in `client/src/firebase.js` with your Web App config keys.