# 🏥 MediGuide AI — Intelligent Healthcare Assistant

A futuristic, premium AI-powered healthcare web application built with React, FastAPI, and modern web technologies.

> ⚠️ **DISCLAIMER:** MediGuide AI is for informational and demonstration purposes only. It is **not a substitute for professional medical advice, diagnosis, or treatment.**

## 🚀 Features

### 🤖 AI-Powered Diagnostics
- **Symptom Analyzer** — Select or type symptoms for instant AI analysis
- **Voice Diagnostic** — Speak symptoms naturally with real-time waveform visualization and TTS feedback
- **AR Body Locator** — Webcam-based skeletal overlay using MediaPipe Pose; click body parts to log symptom locations
- **OCR Report Scanner** — Upload lab reports for AI-powered text extraction and abnormal value highlighting

### 📊 Health Intelligence
- **Health Risk Gauge** — Animated SVG gauge with color-coded risk levels (Low → Critical)
- **Risk Prediction Engine** — Multi-factor scoring based on age, BMI, blood pressure, sugar levels, and lifestyle
- **Health Trend Charts** — Interactive Recharts visualizations tracking health score over time

### 🚨 Emergency Detection
- **Auto-detection** via text, voice, or symptom selection
- **Keywords monitored:** chest pain, difficulty breathing, unconsciousness, etc.
- **Full-screen pulsating red overlay** with immediate action instructions
- **One-tap emergency call (911)**

### 🔒 Privacy & History
- **Timeline view** of all past analyses
- **Privacy First** section with encryption, no-storage, and local processing policies
- **Compliance badges:** HIPAA Aware, GDPR Compliant, SOC 2, ISO 27001

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS 3, Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| AR/Pose | MediaPipe Pose (with simulated fallback) |
| Voice | Web Speech API (STT + TTS) |
| Waveform | Canvas API |
| OCR | Tesseract.js |
| Backend | FastAPI (Python) |
| Design | Glassmorphism, Dark Theme |

## 📁 Project Structure

```
avinya/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── MainLayout.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── ARBodyLocator.jsx
│   │   │   ├── HealthRiskGauge.jsx
│   │   │   ├── MedicalDisclaimer.jsx
│   │   │   └── VoiceWaveform.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SymptomAnalyzer.jsx
│   │   │   ├── VoiceDiagnostic.jsx
│   │   │   ├── ARLocatorPage.jsx
│   │   │   ├── ReportAnalyzer.jsx
│   │   │   ├── RiskPrediction.jsx
│   │   │   ├── EmergencyDetection.jsx
│   │   │   ├── MedicineChecker.jsx
│   │   │   ├── SpecialistRecommendation.jsx
│   │   │   ├── PrivacyHistory.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── About.jsx
│   │   │   └── Contact.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── backend/                # FastAPI backend
│   ├── main.py
│   └── requirements.txt
├── assets/                 # Mock data & resources
│   └── mock-data.json
└── README.md
```

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#020617` / `#0f172a` | Deep Navy/Slate base |
| Medical Blue | `#3b82f6` | Primary accent |
| Cyan | `#06b6d4` | Interactive elements |
| Neon Green | `#22c55e` | Status/success indicators |
| Critical Red | `#ef4444` | Emergency alerts |
| Glass Card | `bg-slate-800/40 backdrop-blur-md` | Glassmorphism panels |

## ⚡ Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## 🎯 Hackathon Demo Guide

1. **Landing Page** → Click "Launch Dashboard"
2. **Dashboard** → View Health Risk Gauge, vitals, and trends
3. **Symptom Analyzer** → Select "Chest Pain" to trigger emergency detection
4. **Voice Diagnostic** → Click "Start Speaking" and say "I have a headache and fever"
5. **AR Body Locator** → Enable camera, click on body parts
6. **Report Analyzer** → Upload any image/PDF to see mock OCR analysis
7. **Emergency Detection** → Type "chest pain" or select critical symptoms
8. **Privacy & History** → View timeline and privacy commitments

Use `assets/mock-data.json` for pre-built symptom presets and vital configurations.

## 📜 License

MIT License — Built for educational and hackathon demonstration purposes.
