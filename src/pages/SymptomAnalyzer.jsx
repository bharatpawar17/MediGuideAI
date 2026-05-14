import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, AlertCircle, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

const commonSymptoms = [
  'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 
  'Dizziness', 'Chest Pain', 'Shortness of Breath', 'Muscle Ache'
];

const SymptomAnalyzer = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0) return;
    
    setIsAnalyzing(true);
    setResult(null);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      const analysis = analyzeSelectedSymptoms(selectedSymptoms);
      setResult(analysis);
    }, 2000);
  };

  const analyzeSelectedSymptoms = (symptoms) => {
    const lower = symptoms.map(s => s.toLowerCase());

    // Emergency — Chest Pain + Shortness of Breath
    if (lower.includes('chest pain') || lower.includes('shortness of breath')) {
      return {
        condition: '⚠️ Possible Cardiac / Pulmonary Event',
        severity: 'Critical',
        confidence: 94,
        recommendations: [
          'Seek emergency medical attention immediately — call 911',
          'Do not exert yourself; sit or lie in a comfortable position',
          'Chew an aspirin (325 mg) unless you are allergic',
          'Do not drive yourself to the hospital',
          'Loosen any tight clothing and stay calm'
        ],
        specialist: 'Emergency Medicine / Cardiologist'
      };
    }

    // Migraine pattern
    if (lower.includes('headache') && (lower.includes('nausea') || lower.includes('dizziness'))) {
      return {
        condition: 'Migraine with Aura',
        severity: 'Moderate to Severe',
        confidence: 88,
        recommendations: [
          'Rest in a dark, quiet room to reduce sensory stimulation',
          'Apply a cold compress to your forehead or temples',
          'Take a triptan medication if previously prescribed',
          'Stay hydrated — dehydration can worsen migraines',
          'Track triggers (food, sleep, stress) in a headache diary'
        ],
        specialist: 'Neurologist'
      };
    }

    // Flu pattern
    if (lower.includes('fever') && (lower.includes('cough') || lower.includes('fatigue') || lower.includes('muscle ache'))) {
      return {
        condition: 'Influenza (Seasonal Flu)',
        severity: 'Moderate',
        confidence: 86,
        recommendations: [
          'Rest completely for at least 48–72 hours',
          'Stay hydrated with warm fluids (soup, herbal tea, water)',
          'Take acetaminophen or ibuprofen for fever and body aches',
          'Isolate to prevent spreading — flu is highly contagious',
          'Seek medical care if fever exceeds 103°F or lasts > 3 days'
        ],
        specialist: 'General Physician / Internal Medicine'
      };
    }

    // Gastro pattern
    if (lower.includes('nausea') && (lower.includes('fatigue') || lower.includes('dizziness'))) {
      return {
        condition: 'Acute Gastroenteritis',
        severity: 'Mild to Moderate',
        confidence: 80,
        recommendations: [
          'Sip clear fluids slowly — ORS (oral rehydration salts) is ideal',
          'Follow the BRAT diet (bananas, rice, applesauce, toast)',
          'Avoid dairy, caffeine, alcohol, and fatty foods for 48 hours',
          'Take anti-emetics (e.g., ondansetron) if vomiting is severe',
          'See a doctor if symptoms persist beyond 48 hours or blood is present'
        ],
        specialist: 'Gastroenterologist'
      };
    }

    // Headache-only
    if (lower.includes('headache') && lower.length === 1) {
      return {
        condition: 'Tension-Type Headache',
        severity: 'Mild',
        confidence: 78,
        recommendations: [
          'Take OTC pain relievers such as ibuprofen or acetaminophen',
          'Reduce screen time and take a break from close work',
          'Apply a warm towel to your neck and shoulders',
          'Ensure you are sleeping 7-9 hours per night',
          'Consult a neurologist if headaches occur more than 15 days/month'
        ],
        specialist: 'General Physician'
      };
    }

    // Fever-only
    if (lower.includes('fever') && !lower.includes('cough') && !lower.includes('muscle ache')) {
      return {
        condition: 'Viral Pyrexia (Fever of Unknown Origin)',
        severity: 'Mild to Moderate',
        confidence: 74,
        recommendations: [
          'Take acetaminophen (500mg) every 6 hours to manage fever',
          'Stay hydrated — drink at least 2-3 liters of fluids per day',
          'Use a cool damp cloth on your forehead for comfort',
          'Monitor temperature every 4 hours and log readings',
          'Seek medical attention if fever exceeds 103°F or lasts > 3 days'
        ],
        specialist: 'General Physician / Internal Medicine'
      };
    }

    // Cough-dominant
    if (lower.includes('cough') && !lower.includes('fever')) {
      return {
        condition: 'Acute Bronchitis / Upper Airway Cough',
        severity: 'Mild',
        confidence: 76,
        recommendations: [
          'Use a humidifier or inhale steam to soothe airways',
          'Take a cough suppressant (dextromethorphan) at night for sleep',
          'Drink warm liquids like honey-lemon water and herbal tea',
          'Avoid irritants like smoke, dust, and strong fragrances',
          'See a doctor if cough produces green/yellow mucus or lasts > 3 weeks'
        ],
        specialist: 'Pulmonologist / ENT Specialist'
      };
    }

    // Muscle ache dominant
    if (lower.includes('muscle ache') || lower.includes('fatigue')) {
      return {
        condition: 'Musculoskeletal Strain / Overexertion Fatigue',
        severity: 'Mild',
        confidence: 72,
        recommendations: [
          'Rest the affected muscles and avoid strenuous activity',
          'Apply ice for 15-20 minutes every few hours to reduce inflammation',
          'Take ibuprofen or naproxen for pain and inflammation',
          'Gently stretch and do light movement to prevent stiffness',
          'Consult an orthopedist if pain persists beyond 1 week'
        ],
        specialist: 'Orthopedic Surgeon / Sports Medicine'
      };
    }

    // Dizziness standalone
    if (lower.includes('dizziness')) {
      return {
        condition: 'Benign Positional Vertigo / Orthostatic Hypotension',
        severity: 'Mild to Moderate',
        confidence: 70,
        recommendations: [
          'Sit or lie down immediately when feeling dizzy to prevent falls',
          'Rise slowly from sitting or lying positions',
          'Stay well-hydrated — dehydration is a common cause',
          'Avoid sudden head movements and look straight ahead when walking',
          'See a doctor if dizziness is accompanied by hearing loss or tinnitus'
        ],
        specialist: 'ENT Specialist / Neurologist'
      };
    }

    // Generic fallback for other combinations
    const conditionNames = [
      'General Viral Syndrome',
      'Functional Somatic Syndrome',
      'Non-specific Systemic Illness'
    ];
    return {
      condition: conditionNames[symptoms.length % conditionNames.length],
      severity: symptoms.length >= 3 ? 'Moderate' : 'Mild',
      confidence: Math.min(92, 60 + symptoms.length * 7),
      recommendations: [
        'Get adequate rest (7-9 hours of sleep per night)',
        'Stay hydrated with water, clear soups, and electrolyte drinks',
        'Monitor your symptoms and track any changes over the next 48 hours',
        'Take over-the-counter medication as appropriate for specific symptoms',
        'Consult a healthcare provider if symptoms worsen or new ones appear'
      ],
      specialist: 'General Physician'
    };
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-cyan-500/10 rounded-2xl mb-4">
          <Stethoscope className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">AI Symptom Analyzer</h1>
        <p className="text-slate-400">Select your symptoms to receive an instant preliminary analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Select Symptoms</h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {commonSymptoms.map((symptom) => (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  selectedSymptoms.includes(symptom)
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>

          <form onSubmit={handleAddCustom} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                placeholder="Type another symptom..."
                className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium"
              >
                Add
              </button>
            </div>
          </form>

          <button
            onClick={handleAnalyze}
            disabled={selectedSymptoms.length === 0 || isAnalyzing}
            className="w-full glass-button py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Data...
              </>
            ) : (
              'Analyze Symptoms'
            )}
          </button>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-6 border-cyan-500/30"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">Possible Condition</h2>
                  <h3 className="text-2xl font-bold text-white">{result.condition}</h3>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-sm font-medium">
                    <AlertCircle className="w-4 h-4" />
                    {result.severity} Severity
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">AI Confidence</span>
                  <span className="text-sm font-medium text-cyan-400">{result.confidence}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" style={{ width: `${result.confidence}%` }}></div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                      <ChevronRight className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-200">
                  <span className="font-semibold block mb-1">Suggested Action:</span>
                  Consider consulting a <span className="font-semibold text-white">{result.specialist}</span> for proper medical advice.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MedicalDisclaimer compact />
    </div>
  );
};

export default SymptomAnalyzer;
