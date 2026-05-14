import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, File, Loader2, AlertTriangle, CheckCircle2, 
  X, Scan, Eye, TrendingDown, TrendingUp, Minus
} from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

// Mock OCR results for different scenarios
const MOCK_RESULTS = {
  default: {
    summary: "The Complete Blood Count (CBC) report shows mostly normal parameters. However, Total Cholesterol is mildly elevated above the desirable range, and LDL Cholesterol is borderline high. Hemoglobin A1C is within normal limits indicating good glucose control over the past 3 months.",
    parameters: [
      { name: "Hemoglobin", value: "14.2 g/dL", status: "normal", range: "13.8 - 17.2 g/dL", explanation: "Hemoglobin level is within the normal range, indicating healthy oxygen-carrying capacity in your blood." },
      { name: "White Blood Cells", value: "7,200 /μL", status: "normal", range: "4,500 - 11,000 /μL", explanation: "WBC count is normal, suggesting no active infection or immune system abnormality." },
      { name: "Platelet Count", value: "245,000 /μL", status: "normal", range: "150,000 - 400,000 /μL", explanation: "Platelet count is within normal range, indicating normal blood clotting ability." },
      { name: "Fasting Blood Sugar", value: "95 mg/dL", status: "normal", range: "70 - 100 mg/dL", explanation: "Fasting glucose is within normal limits, indicating no signs of diabetes at this time." },
      { name: "Total Cholesterol", value: "215 mg/dL", status: "high", range: "< 200 mg/dL", explanation: "Total cholesterol is slightly elevated. Consider dietary modifications — reduce saturated fats, increase fiber intake, and add regular exercise." },
      { name: "LDL Cholesterol", value: "138 mg/dL", status: "high", range: "< 130 mg/dL", explanation: "LDL ('bad' cholesterol) is borderline high. This increases cardiovascular risk. Lifestyle changes and possibly statin therapy may be recommended." },
      { name: "HDL Cholesterol", value: "52 mg/dL", status: "normal", range: "> 40 mg/dL", explanation: "HDL ('good' cholesterol) is at an acceptable level. Aim for > 60 mg/dL for optimal cardiovascular protection." },
      { name: "Hemoglobin A1C", value: "5.4%", status: "normal", range: "< 5.7%", explanation: "HbA1C is normal, reflecting good average blood sugar control over the past 2-3 months." },
      { name: "Blood Pressure", value: "120/80 mmHg", status: "normal", range: "< 120/80 mmHg", explanation: "Blood pressure is at the upper end of normal. Monitor regularly and maintain a low-sodium diet." },
      { name: "TSH", value: "2.8 mIU/L", status: "normal", range: "0.4 - 4.0 mIU/L", explanation: "Thyroid function is normal. No thyroid disorders detected." },
    ]
  }
};

const ReportAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) processFile(droppedFile);
  }, []);

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) processFile(selectedFile);
  };

  const processFile = (f) => {
    setFile(f);
    setResult(null);
    if (f.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsProcessing(true);
    setOcrProgress(0);
    setResult(null);

    // Simulate OCR processing with progress
    // In production, you'd use Tesseract.js:
    // import Tesseract from 'tesseract.js';
    // const result = await Tesseract.recognize(file, 'eng', { logger: m => setOcrProgress(m.progress * 100) });
    
    const progressInterval = setInterval(() => {
      setOcrProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(progressInterval);
      setOcrProgress(100);
      
      setTimeout(() => {
        setIsProcessing(false);
        setResult(MOCK_RESULTS.default);
      }, 500);
    }, 3000);
  };

  const getStatusIcon = (status) => {
    if (status === 'normal') return <CheckCircle2 className="w-5 h-5 text-green-400" />;
    if (status === 'high') return <TrendingUp className="w-5 h-5 text-red-400" />;
    if (status === 'low') return <TrendingDown className="w-5 h-5 text-amber-400" />;
    return <Minus className="w-5 h-5 text-slate-400" />;
  };

  const getStatusBadge = (status) => {
    const styles = {
      normal: 'bg-green-500/10 text-green-400 border-green-500/20',
      high: 'bg-red-500/10 text-red-400 border-red-500/20',
      low: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    };
    return styles[status] || styles.normal;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-4 border border-blue-500/20">
          <Scan className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">OCR Medical Report Analyzer</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Upload your lab reports (PDF/Image). Our AI extracts text using OCR, highlights abnormal values, and explains them in simple terms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`glass-card p-8 border-2 border-dashed flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[300px] ${
              isDragging ? 'border-cyan-400 bg-cyan-400/5 scale-[1.02]' : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            {file ? (
              <div className="flex flex-col items-center w-full">
                {previewUrl && (
                  <div className="relative w-full max-w-[300px] mb-4">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full rounded-xl border border-slate-700/50 shadow-lg"
                    />
                    <div className="absolute top-2 right-2 p-1 bg-black/60 rounded-lg backdrop-blur-sm">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                {!previewUrl && (
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                    <File className="w-8 h-8 text-blue-400" />
                  </div>
                )}
                <p className="text-white font-medium mb-1">{file.name}</p>
                <p className="text-xs text-slate-400 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button
                  onClick={() => { setFile(null); setPreviewUrl(null); setResult(null); }}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Remove File
                </button>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700/50">
                  <Upload className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Drag & Drop your report</h3>
                <p className="text-sm text-slate-400 mb-6">Supports PDF, JPG, PNG (Max 10MB)</p>
                <label className="glass-button px-6 py-2.5 rounded-full cursor-pointer text-sm font-semibold">
                  Browse Files
                  <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileInput} />
                </label>
              </>
            )}
          </div>

          {/* Progress bar */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span className="text-sm text-white font-medium">
                    {ocrProgress < 50 ? 'Extracting text via OCR...' : ocrProgress < 90 ? 'Analyzing parameters...' : 'Generating report...'}
                  </span>
                </div>
                <span className="text-xs text-cyan-400 font-mono">{Math.round(ocrProgress)}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                  style={{ width: `${ocrProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!file || isProcessing}
            className="w-full glass-button py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Report...
              </>
            ) : (
              <>
                <Scan className="w-5 h-5" />
                Analyze Report
              </>
            )}
          </button>
        </motion.div>

        {/* Results Panel */}
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* AI Summary */}
              <div className="glass-card p-5 border-cyan-500/30">
                <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Scan className="w-4 h-4" /> AI Summary
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">{result.summary}</p>
              </div>

              {/* Parameters */}
              <div className="glass-card p-5 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    Extracted Parameters
                  </h3>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="flex items-center gap-1 text-green-400"><CheckCircle2 className="w-3 h-3" /> Normal</span>
                    <span className="flex items-center gap-1 text-red-400"><AlertTriangle className="w-3 h-3" /> Abnormal</span>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {result.parameters.map((param, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`p-4 rounded-xl border transition-all ${
                        param.status === 'normal' 
                          ? 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600/80' 
                          : 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(param.status)}
                          <span className="text-sm font-semibold text-white">{param.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-white">{param.value}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(param.status)}`}>
                            {param.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] text-slate-500">Reference: {param.range}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed bg-white/[0.02] p-2.5 rounded-lg">
                        💡 {param.explanation}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-6 flex flex-col items-center justify-center text-center opacity-50 min-h-[500px]"
            >
              <FileText className="w-16 h-16 text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">No results yet</h3>
              <p className="text-sm text-slate-500 max-w-xs">
                Upload a medical report and run analysis to see extracted parameters with AI explanations here.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MedicalDisclaimer compact />
    </div>
  );
};

export default ReportAnalyzer;
