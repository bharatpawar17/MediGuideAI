import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, PhoneCall, MapPin, Activity, Mic, MicOff, Type, Shield, Heart } from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

const criticalSymptomsList = [
  'Chest Pain', 'Difficulty Breathing', 'Sudden Numbness', 
  'Severe Bleeding', 'Loss of Consciousness', 'Sudden Confusion',
  'Slurred Speech', 'Severe Abdominal Pain'
];

const EMERGENCY_TEXT_KEYWORDS = [
  'chest pain', 'difficulty breathing', 'unconscious', 'can\'t breathe',
  'heart attack', 'stroke', 'severe bleeding', 'seizure', 'choking',
  'not breathing', 'loss of consciousness'
];

const EmergencyDetection = () => {
  const [selected, setSelected] = useState([]);
  const [isEmergency, setIsEmergency] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const recognitionRef = useRef(null);

  const toggleSymptom = (symptom) => {
    const updated = selected.includes(symptom) 
      ? selected.filter(s => s !== symptom)
      : [...selected, symptom];
    
    setSelected(updated);
    if (updated.length > 0) {
      setIsEmergency(true);
    } else {
      setIsEmergency(false);
    }
  };

  // Text input emergency detection
  const handleTextSubmit = (e) => {
    e.preventDefault();
    const lower = textInput.toLowerCase();
    const detected = EMERGENCY_TEXT_KEYWORDS.some(kw => lower.includes(kw));
    if (detected) {
      setIsEmergency(true);
    }
  };

  // Voice emergency detection
  const toggleVoice = async () => {
    if (voiceActive) {
      recognitionRef.current?.stop();
      setVoiceActive(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + ' ';
      }
      setVoiceTranscript(transcript);
      
      const lower = transcript.toLowerCase();
      if (EMERGENCY_TEXT_KEYWORDS.some(kw => lower.includes(kw))) {
        setIsEmergency(true);
        recognition.stop();
        setVoiceActive(false);
      }
    };

    recognition.onerror = () => setVoiceActive(false);
    recognition.onend = () => setVoiceActive(false);

    recognition.start();
    recognitionRef.current = recognition;
    setVoiceActive(true);
  };

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Full-screen pulsating overlay when emergency is active */}
      <AnimatePresence>
        {isEmergency && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 pointer-events-none emergency-overlay"
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8 text-center">
        <div className={`inline-flex items-center justify-center p-3 rounded-2xl mb-4 border ${
          isEmergency 
            ? 'bg-red-500/20 border-red-500/40 animate-emergency-pulse' 
            : 'bg-red-500/10 border-red-500/20'
        }`}>
          <AlertTriangle className={`w-8 h-8 text-red-500 ${isEmergency ? 'animate-bounce' : ''}`} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Emergency Detection</h1>
        <p className="text-slate-400">Select symptoms, type, or speak — if a critical condition is detected, emergency protocols activate instantly.</p>
      </div>

      {/* Input Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Text Input */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Type className="w-4 h-4 text-red-400" />
            Text Input
          </h3>
          <form onSubmit={handleTextSubmit} className="flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Describe your symptoms..."
              className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-red-500/50"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium transition-colors"
            >
              Check
            </button>
          </form>
        </div>

        {/* Voice Input */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Mic className="w-4 h-4 text-red-400" />
            Voice Input
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleVoice}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                voiceActive 
                  ? 'bg-red-500/20 border border-red-500 text-red-400 animate-pulse'
                  : 'bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-red-500/50'
              }`}
            >
              {voiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {voiceActive ? 'Stop Listening' : 'Start Listening'}
            </button>
            {voiceTranscript && (
              <p className="text-xs text-slate-400 flex-1 truncate">{voiceTranscript}</p>
            )}
          </div>
        </div>
      </div>

      {/* Critical Symptoms Grid */}
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Select Critical Symptoms</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        {criticalSymptomsList.map((symptom) => (
          <button
            key={symptom}
            onClick={() => toggleSymptom(symptom)}
            className={`p-4 rounded-xl flex items-center justify-between transition-all border ${
              selected.includes(symptom)
                ? 'bg-red-500/20 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                : 'glass-card text-slate-300 hover:border-red-500/50'
            }`}
          >
            <span className="font-medium">{symptom}</span>
            {selected.includes(symptom) && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Activity className="w-5 h-5 text-red-400 animate-pulse" />
              </motion.div>
            )}
          </button>
        ))}
      </div>

      {/* Emergency Alert Panel */}
      <AnimatePresence>
        {isEmergency && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_80px_rgba(220,38,38,0.5)] border border-red-400/60 z-50"
          >
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-red-500 rounded-full blur-3xl opacity-40 -mr-16 -mt-16 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-400 rounded-full blur-3xl opacity-30 -ml-10 -mb-10 animate-pulse-slow" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent)] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 text-white">
                <div className="p-2 bg-white/10 rounded-xl animate-emergency-pulse">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wide">
                    ⚠️ Seek Emergency Care
                  </h2>
                  <p className="text-red-200 text-sm">Critical condition indicators detected</p>
                </div>
              </div>
              
              <p className="text-red-100 text-lg mb-8 leading-relaxed">
                Based on the symptoms you've indicated, this could be a <strong className="text-white">life-threatening medical emergency</strong>. 
                Do not wait — call emergency services or go to the nearest emergency room immediately.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <a href="tel:911" className="bg-white text-red-600 hover:bg-red-50 font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-lg">
                  <PhoneCall className="w-6 h-6" />
                  Call Emergency (911)
                </a>
                <button className="bg-red-800/80 text-white hover:bg-red-800 font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-3 transition-colors border border-red-500/50 backdrop-blur-sm">
                  <MapPin className="w-6 h-6" />
                  Find Nearest Hospital
                </button>
              </div>

              <div className="bg-red-800/40 backdrop-blur-sm rounded-2xl p-5 border border-red-500/30">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-700/50 rounded-xl shrink-0">
                    <Heart className="w-6 h-6 text-red-200" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-2 text-lg">Immediate Actions While Waiting:</h4>
                    <ul className="text-red-100 space-y-2">
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-red-200 mt-1 shrink-0" />
                        <span>Stay calm and sit or lie down in a comfortable position.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-red-200 mt-1 shrink-0" />
                        <span>If alone, unlock your front door for emergency responders.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-red-200 mt-1 shrink-0" />
                        <span>Do not drive yourself to the hospital.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-red-200 mt-1 shrink-0" />
                        <span>If experiencing chest pain, chew an aspirin (unless allergic).</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setIsEmergency(false); setSelected([]); }}
                className="w-full mt-4 text-sm text-red-200/60 hover:text-red-200 transition-colors text-center py-2"
              >
                I'm safe — Dismiss alert
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MedicalDisclaimer compact />
    </div>
  );
};

export default EmergencyDetection;
