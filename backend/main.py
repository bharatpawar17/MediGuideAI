from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random

app = FastAPI(
    title="MediGuide AI API",
    description="Backend API for the MediGuide AI Healthcare Assistant",
    version="1.0.0"
)

# Setup CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Models ====================

class SymptomRequest(BaseModel):
    symptoms: List[str]
    source: Optional[str] = "text"  # text, voice, ar

class RiskRequest(BaseModel):
    age: int
    weight: float
    height: float
    bloodPressure: str
    sugarLevel: float
    habits: str

class VoiceAnalysisRequest(BaseModel):
    transcript: str

class ARRegionRequest(BaseModel):
    regions: List[str]
    coordinates: Optional[List[dict]] = None

class OCRRequest(BaseModel):
    extractedText: str


# ==================== Symptom Conditions Database ====================

SYMPTOM_CONDITIONS = {
    frozenset(["headache", "fever"]): {
        "condition": "Viral Infection",
        "severity": "Moderate",
        "confidence": 85,
        "recommendations": [
            "Rest and hydrate with at least 8-10 glasses of water daily",
            "Take acetaminophen or ibuprofen for fever and pain relief",
            "Monitor temperature — seek care if fever exceeds 103°F (39.4°C)",
            "Consult a doctor if symptoms persist beyond 3 days"
        ],
        "specialist": "General Physician"
    },
    frozenset(["cough", "fever", "fatigue"]): {
        "condition": "Upper Respiratory Tract Infection",
        "severity": "Moderate",
        "confidence": 82,
        "recommendations": [
            "Get plenty of rest and sleep",
            "Use a humidifier or inhale steam for congestion relief",
            "Stay hydrated — warm fluids like soup and tea are beneficial",
            "Take OTC cough suppressants if cough disrupts sleep",
            "Visit a healthcare provider if symptoms worsen after 5 days"
        ],
        "specialist": "General Physician / Pulmonologist"
    },
    frozenset(["chest pain"]): {
        "condition": "⚠️ EMERGENCY — Possible Cardiac Event",
        "severity": "CRITICAL",
        "confidence": 95,
        "recommendations": [
            "CALL 911 IMMEDIATELY",
            "Do not drive yourself to the hospital",
            "Chew an aspirin if not allergic",
            "Sit upright and try to stay calm",
            "Do not ignore even mild chest pain"
        ],
        "specialist": "Emergency Medicine / Cardiologist",
        "emergency": True
    },
}

DEFAULT_CONDITION = {
    "condition": "General Discomfort",
    "severity": "Mild",
    "confidence": 72,
    "recommendations": [
        "Rest and monitor your symptoms for the next 24-48 hours",
        "Stay hydrated and maintain a balanced diet",
        "Over-the-counter pain relief may help if discomfort persists",
        "Consult a healthcare provider if symptoms worsen or new symptoms appear"
    ],
    "specialist": "General Physician"
}


# ==================== Endpoints ====================

@app.get("/")
def read_root():
    return {
        "message": "Welcome to MediGuide AI API",
        "version": "1.0.0",
        "status": "online",
        "endpoints": [
            "/api/analyze-symptoms",
            "/api/analyze-voice",
            "/api/analyze-ar-regions",
            "/api/analyze-report",
            "/api/predict-risk",
            "/api/medicine/{query}"
        ]
    }


@app.post("/api/analyze-symptoms")
def analyze_symptoms(request: SymptomRequest):
    """Analyze symptoms and return possible conditions"""
    symptoms_lower = [s.lower() for s in request.symptoms]
    symptoms_set = frozenset(symptoms_lower)

    # Check for emergency keywords
    emergency_keywords = ["chest pain", "difficulty breathing", "unconsciousness", "severe bleeding"]
    is_emergency = any(kw in " ".join(symptoms_lower) for kw in emergency_keywords)

    if is_emergency:
        return {
            "emergency": True,
            "condition": "⚠️ EMERGENCY DETECTED",
            "severity": "CRITICAL",
            "confidence": 98,
            "recommendations": [
                "CALL 911 / EMERGENCY SERVICES IMMEDIATELY",
                "Do not drive yourself — wait for emergency responders",
                "If experiencing chest pain, chew an aspirin (unless allergic)",
                "Stay calm and in a comfortable position",
                "Unlock your door for emergency responders if alone"
            ],
            "specialist": "Emergency Medicine"
        }

    # Find best matching condition
    best_match = None
    best_overlap = 0

    for condition_symptoms, condition_data in SYMPTOM_CONDITIONS.items():
        overlap = len(symptoms_set & condition_symptoms)
        if overlap > best_overlap:
            best_overlap = overlap
            best_match = condition_data

    result = best_match if best_match else DEFAULT_CONDITION

    return {
        "condition": result["condition"],
        "severity": result["severity"],
        "confidence": result["confidence"],
        "recommendations": result["recommendations"],
        "specialist": result["specialist"],
        "source": request.source,
        "symptomsAnalyzed": request.symptoms,
        "emergency": result.get("emergency", False)
    }


@app.post("/api/analyze-voice")
def analyze_voice(request: VoiceAnalysisRequest):
    """Analyze voice transcript for symptoms"""
    transcript = request.transcript.lower()

    # Extract symptoms from transcript
    known_symptoms = [
        "headache", "fever", "cough", "cold", "sore throat", "runny nose",
        "fatigue", "nausea", "dizziness", "body ache", "pain", "weakness",
        "congestion", "sneezing", "chills", "vomiting", "chest pain",
        "difficulty breathing", "shortness of breath"
    ]

    detected = [s for s in known_symptoms if s in transcript]

    # Check emergency
    emergency_keywords = ["chest pain", "difficulty breathing", "can't breathe", "heart attack", "unconscious"]
    is_emergency = any(kw in transcript for kw in emergency_keywords)

    if is_emergency:
        return {
            "emergency": True,
            "detectedSymptoms": detected,
            "condition": "⚠️ EMERGENCY — Seek Immediate Care",
            "severity": "CRITICAL",
            "confidence": 95,
            "recommendations": ["CALL 911 IMMEDIATELY"],
            "specialist": "Emergency Medicine"
        }

    return {
        "emergency": False,
        "detectedSymptoms": detected or ["general discomfort"],
        "condition": "Upper Respiratory Infection" if any(s in detected for s in ["cough", "cold", "sore throat"]) else "General Consultation Recommended",
        "severity": "Mild to Moderate",
        "confidence": 78 + random.randint(0, 15),
        "recommendations": [
            "Rest and ensure adequate hydration",
            "Take over-the-counter medication for symptom relief",
            "Monitor symptoms over the next 48-72 hours",
            "Consult a physician if no improvement"
        ],
        "specialist": "General Physician",
        "followUp": "3-5 days if no improvement"
    }


@app.post("/api/analyze-ar-regions")
def analyze_ar_regions(request: ARRegionRequest):
    """Analyze body regions selected via AR locator"""
    regions = [r.lower() for r in request.regions]

    condition_map = {
        "chest": ("Musculoskeletal Chest Strain", "Moderate", "Cardiologist"),
        "head": ("Tension Headache / Cervicogenic Pain", "Mild to Moderate", "Neurologist"),
        "knee": ("Possible Knee Strain / Overuse Injury", "Mild", "Orthopedic Surgeon"),
        "shoulder": ("Shoulder Tension / Rotator Cuff Strain", "Mild", "Orthopedic Surgeon"),
        "abdomen": ("Abdominal Discomfort", "Moderate", "Gastroenterologist"),
    }

    condition = "Localized Discomfort"
    severity = "Mild"
    specialist = "General Physician"

    for region in regions:
        for key, (cond, sev, spec) in condition_map.items():
            if key in region:
                condition = cond
                severity = sev
                specialist = spec
                break

    return {
        "condition": condition,
        "severity": severity,
        "confidence": min(95, 60 + len(regions) * 12),
        "affectedAreas": request.regions,
        "recommendations": [
            "Monitor the affected area for changes",
            "Apply RICE protocol if applicable (Rest, Ice, Compression, Elevation)",
            "Over-the-counter anti-inflammatory medication may help",
            "Consult a specialist if symptoms persist beyond 72 hours"
        ],
        "specialist": specialist
    }


@app.post("/api/analyze-report")
def analyze_report():
    """Mock OCR report analysis (in production, would use Tesseract/OCR)"""
    return {
        "summary": "Complete Blood Count (CBC) analysis shows mostly normal parameters. Total Cholesterol is mildly elevated. LDL Cholesterol is borderline high. Hemoglobin A1C is within normal limits.",
        "parameters": [
            {"name": "Hemoglobin", "value": "14.2 g/dL", "status": "normal", "range": "13.8 - 17.2 g/dL", "explanation": "Normal oxygen-carrying capacity."},
            {"name": "WBC", "value": "7,200 /μL", "status": "normal", "range": "4,500 - 11,000 /μL", "explanation": "No active infection detected."},
            {"name": "Fasting Sugar", "value": "95 mg/dL", "status": "normal", "range": "70 - 100 mg/dL", "explanation": "No signs of diabetes."},
            {"name": "Total Cholesterol", "value": "215 mg/dL", "status": "high", "range": "< 200 mg/dL", "explanation": "Slightly elevated. Reduce saturated fats."},
            {"name": "LDL Cholesterol", "value": "138 mg/dL", "status": "high", "range": "< 130 mg/dL", "explanation": "Borderline high. Lifestyle modifications recommended."},
            {"name": "HDL Cholesterol", "value": "52 mg/dL", "status": "normal", "range": "> 40 mg/dL", "explanation": "Acceptable level. Aim for > 60 mg/dL."},
            {"name": "HbA1C", "value": "5.4%", "status": "normal", "range": "< 5.7%", "explanation": "Good glucose control over 3 months."},
            {"name": "Blood Pressure", "value": "120/80 mmHg", "status": "normal", "range": "< 120/80 mmHg", "explanation": "Upper end of normal. Monitor regularly."},
        ]
    }


@app.post("/api/predict-risk")
def predict_risk(request: RiskRequest):
    """Calculate health risk based on vitals"""
    # Simple risk calculation logic
    score = 20  # base score

    # Age factor
    if request.age > 60:
        score += 25
    elif request.age > 45:
        score += 15
    elif request.age > 30:
        score += 5

    # BMI factor
    if request.height > 0:
        bmi = request.weight / ((request.height / 100) ** 2)
        if bmi > 30:
            score += 20
        elif bmi > 25:
            score += 10

    # Sugar factor
    if request.sugarLevel > 126:
        score += 20
    elif request.sugarLevel > 100:
        score += 10

    # Blood pressure factor
    try:
        systolic = int(request.bloodPressure.split("/")[0])
        if systolic > 140:
            score += 15
        elif systolic > 120:
            score += 5
    except (ValueError, IndexError):
        pass

    # Habits factor
    if request.habits == "both":
        score += 15
    elif request.habits in ["smoking", "alcohol"]:
        score += 10

    score = min(score, 100)

    # Determine risk level
    if score <= 25:
        level = "Low"
    elif score <= 50:
        level = "Moderate"
    elif score <= 75:
        level = "Moderate High"
    else:
        level = "Critical"

    return {
        "score": score,
        "level": level,
        "insights": [
            f"BMI calculated from vitals.",
            f"Blood pressure assessment completed.",
            f"Fasting sugar level evaluated.",
            f"Lifestyle habits factored into score."
        ],
        "prevention": [
            "Engage in 30 minutes of cardiovascular exercise daily.",
            "Reduce sodium and saturated fat intake.",
            "Monitor blood sugar and blood pressure weekly.",
            "Maintain consistent sleep schedule (7-9 hours).",
            "Consider regular health check-ups every 6 months."
        ],
        "chartData": [
            {"name": "Cardiovascular Risk", "value": max(10, score - 20)},
            {"name": "Diabetes Risk", "value": max(5, score - 30)},
            {"name": "Stress/Other", "value": max(5, 100 - score)},
        ]
    }


@app.get("/api/medicine/{query}")
def get_medicine_info(query: str):
    """Get medicine information"""
    medicines = {
        "paracetamol": {
            "name": "Paracetamol",
            "genericName": "Acetaminophen",
            "category": "Analgesic & Antipyretic",
            "usage": "Treats mild to moderate pain and reduces fever.",
            "dosage": "500mg - 1000mg every 4-6 hours. Max 4000mg/day.",
            "sideEffects": ["Nausea", "Stomach pain", "Loss of appetite", "Rash"],
            "warnings": "Do not combine with other acetaminophen products. Overdose causes severe liver damage.",
            "pregnancy": "Generally safe when directed. Consult doctor first."
        },
        "ibuprofen": {
            "name": "Ibuprofen",
            "genericName": "Ibuprofen",
            "category": "NSAID (Anti-inflammatory)",
            "usage": "Reduces fever, pain, and inflammation.",
            "dosage": "200-400mg every 4-6 hours. Max 1200mg/day (OTC).",
            "sideEffects": ["Stomach upset", "Dizziness", "Headache", "Heartburn"],
            "warnings": "Avoid if history of stomach ulcers. May increase cardiovascular risk with long-term use.",
            "pregnancy": "Avoid in third trimester. Consult doctor."
        }
    }

    key = query.lower().strip()
    if key in medicines:
        return medicines[key]

    return {
        "name": query.capitalize(),
        "genericName": "Information not available",
        "category": "General Medication",
        "usage": f"Please consult a pharmacist or doctor for specific information about {query}.",
        "dosage": "Follow prescribed dosage or package instructions.",
        "sideEffects": ["Consult product label"],
        "warnings": "Always consult a healthcare provider before starting any medication.",
        "pregnancy": "Consult your doctor before use during pregnancy."
    }


@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
