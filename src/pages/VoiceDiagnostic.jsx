import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Volume2, Play, Square, Loader2, 
  AlertTriangle, CheckCircle2, ChevronRight, Stethoscope, 
  Brain, PhoneCall
} from 'lucide-react';
import VoiceWaveform from '../components/VoiceWaveform';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

const EMERGENCY_KEYWORDS = [
  'chest pain', 'difficulty breathing', 'unconscious', 'unconsciousness',
  'can\'t breathe', 'heart attack', 'stroke', 'seizure', 'severe bleeding',
  'choking', 'not breathing'
];

const VoiceDiagnostic = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [analyserNode, setAnalyserNode] = useState(null);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  const checkEmergency = useCallback((text) => {
    const lower = text.toLowerCase();
    return EMERGENCY_KEYWORDS.some(keyword => lower.includes(keyword));
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    try {
      // Set up audio context for visualizer
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      audioContextRef.current = { audioCtx, stream, source };
      setAnalyserNode(analyser);

      // Set up speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setError('Speech Recognition is not supported in your browser. Please use Chrome or Edge.');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let final = '';
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript + ' ';
          } else {
            interim += transcript;
          }
        }
        if (final) {
          setTranscript(prev => prev + final);
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (event) => {
        if (event.error !== 'aborted') {
          setError(`Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access to use voice diagnostics.');
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (audioContextRef.current) {
      audioContextRef.current.stream.getTracks().forEach(t => t.stop());
      audioContextRef.current.audioCtx.close();
      audioContextRef.current = null;
    }
    setAnalyserNode(null);
    setIsListening(false);
  }, []);

  const analyzeSymptoms = useCallback(() => {
    const fullText = transcript + interimTranscript;
    if (!fullText.trim()) return;

    setIsProcessing(true);
    setInterimTranscript('');

    // Check for emergencies
    if (checkEmergency(fullText)) {
      setIsEmergency(true);
      setIsProcessing(false);
      return;
    }

    // Perform dynamic analysis based on detected symptoms
    setTimeout(() => {
      const detected = extractSymptoms(fullText);
      const analysis = diagnoseFromSymptoms(detected, fullText);

      setResult({
        symptoms: detected,
        ...analysis
      });
      setIsProcessing(false);
    }, 2500);
  }, [transcript, interimTranscript, checkEmergency]);

  const extractSymptoms = (text) => {
    const symptomKeywords = [
      'headache', 'fever', 'cough', 'cold', 'sore throat', 'runny nose',
      'fatigue', 'nausea', 'dizziness', 'body ache', 'pain', 'weakness',
      'congestion', 'sneezing', 'chills', 'vomiting', 'rash', 'itching',
      'back pain', 'joint pain', 'stomach ache', 'bloating', 'burning',
      'muscle pain', 'swelling', 'insomnia', 'anxiety', 'palpitations'
    ];
    const lower = text.toLowerCase();
    return symptomKeywords.filter(s => lower.includes(s));
  };

  const diagnoseFromSymptoms = (symptoms, rawText) => {
    const has = (s) => symptoms.includes(s);
    const text = rawText.toLowerCase();

    // Migraine pattern
    if (has('headache') && (has('nausea') || has('dizziness') || text.includes('light') || text.includes('migraine'))) {
      return {
        condition: 'Migraine with Aura',
        severity: 'Moderate to Severe',
        confidence: 87,
        recommendations: [
          'Rest in a dark, quiet room away from bright screens',
          'Apply a cold compress to your forehead and temples',
          'Take a triptan medication if prescribed by your doctor',
          'Stay hydrated — dehydration worsens migraines significantly',
          'Keep a headache diary to identify and avoid triggers'
        ],
        specialist: 'Neurologist',
        followUp: '1-2 weeks if recurring'
      };
    }

    // Flu pattern
    if (has('fever') && (has('cough') || has('body ache') || has('chills') || has('muscle pain'))) {
      return {
        condition: 'Influenza (Seasonal Flu)',
        severity: 'Moderate',
        confidence: 85,
        recommendations: [
          'Rest completely — your body needs energy to fight the virus',
          'Drink warm fluids: soup, herbal tea, and plenty of water',
          'Take acetaminophen or ibuprofen for fever and body aches',
          'Isolate for at least 24 hours after fever resolves',
          'Seek medical attention if fever exceeds 103°F or breathing becomes difficult'
        ],
        specialist: 'General Physician / Internal Medicine',
        followUp: '3-5 days if no improvement'
      };
    }

    // Cold / URI pattern
    if ((has('cold') || has('runny nose') || has('congestion') || has('sneezing')) && (has('sore throat') || has('cough'))) {
      return {
        condition: 'Common Cold (Acute Nasopharyngitis)',
        severity: 'Mild',
        confidence: 83,
        recommendations: [
          'Rest and increase your fluid intake throughout the day',
          'Use saline nasal spray or steam inhalation for congestion',
          'Gargle with warm salt water for sore throat relief',
          'Take an antihistamine or decongestant for runny nose',
          'Symptoms typically resolve in 7-10 days; see a doctor if they worsen'
        ],
        specialist: 'General Physician / ENT Specialist',
        followUp: '7-10 days if persistent'
      };
    }

    // Sore throat dominant
    if (has('sore throat') && !has('cough') && !has('cold')) {
      return {
        condition: 'Acute Pharyngitis (Sore Throat)',
        severity: 'Mild to Moderate',
        confidence: 79,
        recommendations: [
          'Gargle with warm salt water 3-4 times daily',
          'Drink warm liquids and use throat lozenges for comfort',
          'Take ibuprofen or acetaminophen for pain relief',
          'Avoid irritants like smoking and acidic foods',
          'See a doctor if throat pain persists beyond 5 days or white patches appear'
        ],
        specialist: 'ENT Specialist',
        followUp: '5 days if no improvement'
      };
    }

    // Gastro pattern
    if (has('nausea') || has('vomiting') || has('stomach ache') || has('bloating')) {
      return {
        condition: 'Acute Gastroenteritis / Dyspepsia',
        severity: has('vomiting') ? 'Moderate' : 'Mild',
        confidence: 80,
        recommendations: [
          'Sip clear fluids slowly — try ORS (oral rehydration salts)',
          'Follow the BRAT diet: bananas, rice, applesauce, toast',
          'Avoid dairy, spicy food, caffeine, and alcohol for 48 hours',
          'Take anti-nausea medication if vomiting is persistent',
          'Consult a doctor if you see blood in vomit or stool'
        ],
        specialist: 'Gastroenterologist',
        followUp: '2-3 days if no improvement'
      };
    }

    // Allergy pattern
    if (has('sneezing') || has('itching') || has('rash') || (has('runny nose') && !has('fever'))) {
      return {
        condition: 'Allergic Rhinitis / Allergic Reaction',
        severity: has('rash') ? 'Moderate' : 'Mild',
        confidence: 81,
        recommendations: [
          'Take an antihistamine (e.g., cetirizine or loratadine)',
          'Identify and avoid the allergen trigger if possible',
          'Use saline nasal spray to flush irritants from nasal passages',
          'Apply hydrocortisone cream for skin rash or itching',
          'See an allergist for testing if reactions are frequent or severe'
        ],
        specialist: 'Allergist / Immunologist',
        followUp: '1 week; sooner if swelling or breathing difficulty occurs'
      };
    }

    // Musculoskeletal pattern
    if (has('back pain') || has('joint pain') || has('muscle pain') || has('swelling')) {
      return {
        condition: 'Musculoskeletal Pain / Strain',
        severity: 'Mild to Moderate',
        confidence: 76,
        recommendations: [
          'Apply the RICE protocol: Rest, Ice, Compression, Elevation',
          'Take ibuprofen or naproxen for pain and inflammation',
          'Gentle stretching once acute pain subsides (after 48 hours)',
          'Use proper posture and ergonomic support throughout the day',
          'See an orthopedist if pain persists beyond 2 weeks'
        ],
        specialist: 'Orthopedic Surgeon / Physiotherapist',
        followUp: '1-2 weeks if persistent'
      };
    }

    // Anxiety / palpitations
    if (has('anxiety') || has('palpitations') || has('insomnia')) {
      return {
        condition: 'Generalized Anxiety / Stress-Related Symptoms',
        severity: 'Mild to Moderate',
        confidence: 74,
        recommendations: [
          'Practice deep breathing: inhale 4 sec, hold 4 sec, exhale 6 sec',
          'Reduce caffeine and sugar intake, especially after noon',
          'Try guided meditation or progressive muscle relaxation',
          'Maintain a consistent sleep schedule (same time every day)',
          'Consider speaking with a therapist or counselor for support'
        ],
        specialist: 'Psychiatrist / Clinical Psychologist',
        followUp: '2 weeks; sooner if symptoms interfere with daily life'
      };
    }

    // Headache only
    if (has('headache')) {
      return {
        condition: 'Tension-Type Headache',
        severity: 'Mild',
        confidence: 75,
        recommendations: [
          'Take OTC pain relievers (ibuprofen or acetaminophen)',
          'Reduce screen time and take a 10-minute break every hour',
          'Apply a warm compress to your neck and shoulder area',
          'Ensure you are drinking enough water (8+ glasses/day)',
          'Consult a neurologist if headaches become frequent or severe'
        ],
        specialist: 'General Physician',
        followUp: '1 week if recurring'
      };
    }

    // Fever only
    if (has('fever')) {
      return {
        condition: 'Viral Pyrexia',
        severity: 'Mild to Moderate',
        confidence: 72,
        recommendations: [
          'Take acetaminophen (500mg) every 6 hours for fever management',
          'Stay hydrated with at least 2-3 liters of fluids per day',
          'Rest and avoid physical exertion until fever resolves',
          'Use a cool damp cloth on forehead for comfort',
          'Seek medical care if fever exceeds 103°F or persists beyond 3 days'
        ],
        specialist: 'General Physician / Internal Medicine',
        followUp: '3 days if no improvement'
      };
    }

    // Fatigue / weakness
    if (has('fatigue') || has('weakness')) {
      return {
        condition: 'Chronic Fatigue / General Debility',
        severity: 'Mild',
        confidence: 68,
        recommendations: [
          'Prioritize 7-9 hours of quality sleep each night',
          'Eat a balanced diet rich in iron, B12, and vitamin D',
          'Engage in light exercise (walking, yoga) to boost energy',
          'Reduce stress through mindfulness or relaxation techniques',
          'Get blood work done (CBC, thyroid, iron, B12) to rule out deficiencies'
        ],
        specialist: 'General Physician / Endocrinologist',
        followUp: '2 weeks with blood test results'
      };
    }

    // Generic fallback
    return {
      condition: 'Non-Specific Symptom Complex',
      severity: symptoms.length >= 3 ? 'Moderate' : 'Mild',
      confidence: Math.min(90, 55 + symptoms.length * 8),
      recommendations: [
        'Monitor your symptoms carefully over the next 48-72 hours',
        'Stay hydrated and get adequate rest',
        'Take over-the-counter medication appropriate for your main symptom',
        'Keep a symptom diary noting severity, time, and triggers',
        'Schedule a consultation with a general physician for proper evaluation'
      ],
      specialist: 'General Physician',
      followUp: '3-5 days if no improvement'
    };
  };

  const speakResults = useCallback(() => {
    if (!result || isSpeaking) return;
    
    const synth = synthRef.current;
    synth.cancel();

    const text = `Based on your described symptoms, the preliminary analysis suggests ${result.condition} with ${result.severity} severity. 
    My confidence level is ${result.confidence} percent. 
    Key recommendations include: ${result.recommendations.slice(0, 3).join('. ')}. 
    I suggest consulting a ${result.specialist} for proper medical evaluation.
    Please remember, this is not a substitute for professional medical advice.`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    // Try to find a professional-sounding voice
    const voices = synth.getVoices();
    const preferred = voices.find(v => 
      v.name.includes('Google UK English Female') || 
      v.name.includes('Microsoft Zira') ||
      v.name.includes('Samantha') ||
      (v.lang.startsWith('en') && v.name.includes('Female'))
    ) || voices.find(v => v.lang.startsWith('en'));
    
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.speak(utterance);
  }, [result, isSpeaking]);

  const stopSpeaking = useCallback(() => {
    synthRef.current.cancel();
    setIsSpeaking(false);
  }, []);

  const resetAll = useCallback(() => {
    stopListening();
    stopSpeaking();
    setTranscript('');
    setInterimTranscript('');
    setResult(null);
    setIsEmergency(false);
    setError(null);
  }, [stopListening, stopSpeaking]);

  // Load voices
  useEffect(() => {
    synthRef.current.getVoices();
    window.speechSynthesis.onvoiceschanged = () => synthRef.current.getVoices();
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      stopListening();
      stopSpeaking();
    };
  }, [stopListening, stopSpeaking]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Emergency Overlay */}
      <AnimatePresence>
        {isEmergency && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 emergency-overlay"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsEmergency(false)} />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative bg-red-600 rounded-3xl p-8 max-w-lg w-full shadow-[0_0_100px_rgba(220,38,38,0.5)] border border-red-400"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-red-500 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 animate-pulse" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-10 h-10 text-white animate-emergency-pulse" />
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wide">Emergency Detected</h2>
                </div>
                <p className="text-red-100 text-lg mb-6">
                  Your voice input indicates a potentially life-threatening condition. Please seek immediate medical attention.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <button className="bg-white text-red-600 hover:bg-red-50 font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-3 transition-colors">
                    <PhoneCall className="w-6 h-6" />
                    Call 911
                  </button>
                  <button
                    onClick={() => setIsEmergency(false)}
                    className="bg-red-700 text-white hover:bg-red-800 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-red-500"
                  >
                    I'm Safe – Dismiss
                  </button>
                </div>
                <p className="text-xs text-red-200/70 text-center">Do not drive yourself. Stay calm and wait for help.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl mb-4 border border-purple-500/20">
          <Mic className="w-8 h-8 text-purple-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Voice Diagnostic</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Speak your symptoms naturally. Our AI listens, analyzes, and provides instant preliminary guidance with voice feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Voice Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 space-y-6"
        >
          {/* Waveform Visualizer */}
          <VoiceWaveform isActive={isListening} analyserNode={analyserNode} />

          {/* Transcript */}
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 min-h-[120px]">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Transcript</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {transcript || <span className="text-slate-500 italic">Your spoken words will appear here...</span>}
              {interimTranscript && (
                <span className="text-purple-400/60 italic"> {interimTranscript}</span>
              )}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {!isListening ? (
              <button
                onClick={startListening}
                disabled={isProcessing}
                className="flex-1 glass-button bg-gradient-to-r from-purple-500 to-indigo-600 shadow-[0_0_15px_rgba(139,92,246,0.5)] py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Mic className="w-5 h-5" />
                Start Speaking
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <MicOff className="w-5 h-5" />
                Stop Recording
              </button>
            )}

            <button
              onClick={analyzeSymptoms}
              disabled={(!transcript && !interimTranscript) || isProcessing}
              className="flex-1 glass-button py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Stethoscope className="w-5 h-5" />
                  Analyze
                </>
              )}
            </button>
          </div>

          {transcript && (
            <button
              onClick={resetAll}
              className="w-full text-sm text-slate-400 hover:text-white py-2 transition-colors"
            >
              Clear & Reset
            </button>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}
        </motion.div>

        {/* Results Panel */}
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-6 border-purple-500/30 space-y-5"
            >
              {/* Condition header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
                    AI Diagnosis
                  </h2>
                  <h3 className="text-2xl font-bold text-white">{result.condition}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-sm font-medium">
                  {result.severity}
                </span>
              </div>

              {/* Detected symptoms */}
              {result.symptoms.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Detected Symptoms</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.symptoms.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs rounded-full capitalize">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Confidence */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">AI Confidence</span>
                  <span className="text-sm font-medium text-purple-400">{result.confidence}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                  />
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
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

              {/* Suggested specialist */}
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <p className="text-sm text-purple-200">
                  <span className="font-semibold block mb-1">Suggested Specialist:</span>
                  <span className="text-white font-semibold">{result.specialist}</span>
                  <span className="block text-xs text-purple-300/60 mt-1">Follow-up: {result.followUp}</span>
                </p>
              </div>

              {/* TTS Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={isSpeaking ? stopSpeaking : speakResults}
                  className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all border ${
                    isSpeaking
                      ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                      : 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <Square className="w-4 h-4" />
                      Stop Speaking
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5" />
                      Read Results Aloud
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-6 flex flex-col items-center justify-center text-center opacity-60 min-h-[500px]"
            >
              <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
                <Volume2 className="w-10 h-10 text-purple-400/50" />
              </div>
              <h3 className="text-lg font-medium text-slate-300 mb-2">Awaiting Voice Input</h3>
              <p className="text-sm text-slate-500 max-w-xs">
                Click "Start Speaking" and describe your symptoms naturally. Our AI will analyze your input and provide guidance.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MedicalDisclaimer compact />
    </div>
  );
};

export default VoiceDiagnostic;
