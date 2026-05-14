import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, Trash2, Stethoscope, Loader2, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import ARBodyLocator from '../components/ARBodyLocator';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

const ARLocatorPage = () => {
  const [detectedRegions, setDetectedRegions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleRegionDetected = (regionData) => {
    setDetectedRegions(prev => {
      // Don't add duplicates
      if (prev.find(r => r.key === regionData.key)) return prev;
      return [...prev, { ...regionData, timestamp: new Date().toLocaleTimeString() }];
    });
  };

  const removeRegion = (key) => {
    setDetectedRegions(prev => prev.filter(r => r.key !== key));
  };

  const analyzeRegions = () => {
    if (detectedRegions.length === 0) return;
    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI analysis based on selected body regions
    setTimeout(() => {
      const regionNames = detectedRegions.map(r => r.region);
      
      let condition = 'General Discomfort';
      let severity = 'Mild';
      let recommendations = [];

      if (regionNames.includes('Chest')) {
        condition = 'Potential Musculoskeletal Chest Strain';
        severity = 'Moderate — Monitor Closely';
        recommendations = [
          'If pain is sharp or radiating, seek emergency care immediately',
          'Apply ice for 15-20 minutes to reduce inflammation',
          'Take OTC anti-inflammatory medication if appropriate',
          'Avoid strenuous upper body activity for 48 hours',
          'Schedule a follow-up with a cardiologist if pain persists'
        ];
      } else if (regionNames.includes('Head')) {
        condition = 'Tension Headache / Cervicogenic Pain';
        severity = 'Mild to Moderate';
        recommendations = [
          'Ensure adequate hydration and rest',
          'Apply gentle pressure to temples',
          'Take OTC pain relievers (ibuprofen/acetaminophen)',
          'Reduce screen time and take regular breaks',
          'Consider consulting a neurologist if recurring'
        ];
      } else if (regionNames.some(r => r.includes('Knee'))) {
        condition = 'Possible Knee Strain / Overuse Injury';
        severity = 'Mild';
        recommendations = [
          'Rest and elevate the affected leg',
          'Apply RICE protocol (Rest, Ice, Compression, Elevation)',
          'Avoid weight-bearing activities temporarily',
          'Gentle stretching and ROM exercises once pain subsides',
          'Consult an orthopedist if swelling persists'
        ];
      } else if (regionNames.some(r => r.includes('Shoulder'))) {
        condition = 'Shoulder Tension / Rotator Cuff Strain';
        severity = 'Mild';
        recommendations = [
          'Apply warm compress to the affected area',
          'Gentle shoulder stretches and mobility exercises',
          'Maintain good posture throughout the day',
          'Consider physiotherapy if persistent',
          'Avoid overhead lifting for 1-2 weeks'
        ];
      } else {
        condition = 'Localized Discomfort';
        severity = 'Mild';
        recommendations = [
          'Monitor the area for changes or worsening',
          'Apply appropriate first aid (ice/heat as needed)',
          'Maintain good posture and ergonomics',
          'Stay hydrated and ensure adequate rest',
          'Consult a physician if symptoms persist beyond 72 hours'
        ];
      }

      setResult({
        condition,
        severity,
        confidence: Math.min(95, 60 + detectedRegions.length * 10),
        affectedAreas: regionNames,
        recommendations,
        specialist: regionNames.includes('Chest') ? 'Cardiologist' 
          : regionNames.some(r => r.includes('Knee') || r.includes('Shoulder') || r.includes('Hip')) ? 'Orthopedic Surgeon'
          : regionNames.includes('Head') ? 'Neurologist'
          : 'General Physician'
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-4 border border-emerald-500/20">
          <Camera className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">AR Symptom Locator</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Use your camera to see a real-time skeletal overlay. Click on body parts to mark symptom locations for AI analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* AR Camera View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3"
        >
          <ARBodyLocator onRegionDetected={handleRegionDetected} />
        </motion.div>

        {/* Detected Regions Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Selected body parts */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                Marked Regions
              </h2>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20">
                {detectedRegions.length} selected
              </span>
            </div>

            {detectedRegions.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">No regions selected yet</p>
                <p className="text-xs text-slate-500 mt-1">Click on body parts in the AR view</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                <AnimatePresence>
                  {detectedRegions.map((region) => (
                    <motion.div
                      key={region.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        <div>
                          <p className="text-sm font-medium text-white">{region.region}</p>
                          <p className="text-[10px] text-slate-500">{region.timestamp}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeRegion(region.key)}
                        className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-400" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            <button
              onClick={analyzeRegions}
              disabled={detectedRegions.length === 0 || isAnalyzing}
              className="w-full mt-4 glass-button bg-gradient-to-r from-emerald-500 to-teal-600 shadow-[0_0_15px_rgba(16,185,129,0.4)] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Regions...
                </>
              ) : (
                <>
                  <Stethoscope className="w-5 h-5" />
                  Analyze Symptoms
                </>
              )}
            </button>
          </div>

          {/* Analysis Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-card p-5 border-emerald-500/30 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                      AR Analysis Result
                    </h3>
                    <h4 className="text-xl font-bold text-white">{result.condition}</h4>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                    {result.severity}
                  </span>
                </div>

                {/* Affected areas */}
                <div className="flex flex-wrap gap-1.5">
                  {result.affectedAreas.map((area, i) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 text-xs rounded-full border border-emerald-500/20">
                      {area}
                    </span>
                  ))}
                </div>

                {/* Confidence */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-400">Confidence</span>
                    <span className="text-xs font-medium text-emerald-400">{result.confidence}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 1 }}
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full"
                    />
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="text-xs font-semibold text-white flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Recommendations
                  </h4>
                  <ul className="space-y-1.5">
                    {result.recommendations.slice(0, 4).map((rec, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                        <ChevronRight className="w-3 h-3 text-slate-500 mt-0.5 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specialist */}
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <p className="text-xs text-emerald-200">
                    <span className="font-semibold">Suggested:</span>{' '}
                    <span className="text-white font-semibold">{result.specialist}</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <MedicalDisclaimer compact />
    </div>
  );
};

export default ARLocatorPage;
