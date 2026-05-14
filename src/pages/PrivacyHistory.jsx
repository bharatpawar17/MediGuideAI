import { motion } from 'framer-motion';
import { 
  Shield, Lock, Eye, Trash2, Clock, FileText, 
  Stethoscope, Mic, HeartPulse, Camera, AlertTriangle,
  CheckCircle, ShieldCheck, Database, Fingerprint
} from 'lucide-react';

const historyItems = [
  {
    id: 1,
    title: 'Blood Test Report Analyzed',
    type: 'OCR Report',
    icon: FileText,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    date: 'May 14, 2026 — 3:30 PM',
    summary: 'Blood test analyzed. Total cholesterol slightly elevated (215 mg/dL).',
    status: 'Completed'
  },
  {
    id: 2,
    title: 'Headache & Fatigue Check',
    type: 'Symptom Analysis',
    icon: Stethoscope,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    date: 'May 14, 2026 — 10:15 AM',
    summary: 'Diagnosed as possible Tension Headache. Mild severity. Rest recommended.',
    status: 'Completed'
  },
  {
    id: 3,
    title: 'Voice Diagnostic Session',
    type: 'Voice Input',
    icon: Mic,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    date: 'May 13, 2026 — 5:45 PM',
    summary: 'Described cold and sore throat symptoms. URI detected with 82% confidence.',
    status: 'Completed'
  },
  {
    id: 4,
    title: 'AR Body Scan — Left Knee',
    type: 'AR Locator',
    icon: Camera,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    date: 'May 12, 2026 — 2:00 PM',
    summary: 'Left knee region flagged. Possible overuse injury. RICE protocol recommended.',
    status: 'Completed'
  },
  {
    id: 5,
    title: 'Risk Assessment Report',
    type: 'Risk Prediction',
    icon: HeartPulse,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    date: 'May 11, 2026 — 11:30 AM',
    summary: 'Overall risk score: 28/100 (Low). Cardiovascular 12%, Diabetes 8%, Stress 22%.',
    status: 'Completed'
  },
  {
    id: 6,
    title: 'Emergency Check — Clear',
    type: 'Emergency',
    icon: AlertTriangle,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    date: 'May 10, 2026 — 9:00 AM',
    summary: 'No critical symptoms detected. All clear.',
    status: 'Clear'
  },
];

const privacyFeatures = [
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'All data transmitted between your device and our servers is encrypted using TLS 1.3 with AES-256 encryption.'
  },
  {
    icon: Database,
    title: 'No Permanent Storage',
    description: 'Your medical data, reports, and voice recordings are processed in-memory and never stored on our servers permanently.'
  },
  {
    icon: Eye,
    title: 'No Third-Party Sharing',
    description: 'We never share, sell, or transfer your health data to any third party. Your privacy is non-negotiable.'
  },
  {
    icon: Fingerprint,
    title: 'Local Processing',
    description: 'Whenever possible, AI analysis is performed directly on your device. Camera and voice data never leave your browser.'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

const PrivacyHistory = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-4 border border-emerald-500/20">
          <Shield className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Privacy & History</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          View your analysis timeline and learn how we protect your data. Your privacy is our top priority.
        </p>
      </motion.div>

      {/* Privacy First Section */}
      <motion.div variants={itemVariants} className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Privacy First</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {privacyFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="glass-card p-5 group hover:border-emerald-500/30 transition-all duration-300"
              whileHover={{ y: -3 }}
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Compliance badges */}
        <motion.div variants={itemVariants} className="mt-6 flex items-center justify-center flex-wrap gap-3">
          {['HIPAA Aware', 'GDPR Compliant', 'SOC 2 Type II', 'ISO 27001'].map((badge) => (
            <div key={badge} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/60 border border-slate-700/50 rounded-full">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-slate-300 font-medium">{badge}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Analysis Timeline */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Analysis Timeline</h2>
          </div>
          <button className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full transition-colors hover:bg-red-500/20">
            <Trash2 className="w-3 h-3" />
            Clear History
          </button>
        </div>

        <div className="space-y-4">
          {historyItems.map((item, i) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="glass-card p-5 hover:border-slate-600/60 transition-all duration-200 group"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-2.5 rounded-xl ${item.bg} border border-slate-700/30 shrink-0`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-medium ${item.color}`}>{item.type}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-slate-500">{item.date}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      item.status === 'Clear' 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">{item.summary}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Data processing notice */}
      <motion.div variants={itemVariants} className="mt-10 glass-card p-6 text-center border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 pointer-events-none" />
        <div className="relative z-10">
          <Lock className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Your Data, Your Control</h3>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            All analysis history shown above is stored <strong className="text-emerald-400">locally on your device only</strong>. 
            We do not maintain server-side copies of your health data. 
            You can clear your history at any time. 
            MediGuide AI processes data securely and discards it after each session.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PrivacyHistory;
