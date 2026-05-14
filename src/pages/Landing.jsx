import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Activity, Brain, Mic, Camera, FileText, HeartPulse, ArrowRight } from 'lucide-react';

const features = [
  { 
    name: 'AI Symptom Analyzer', 
    description: 'AI-driven symptom checker with text or voice input for instant preliminary guidance.',
    icon: Activity,
    color: 'from-cyan-500 to-blue-600'
  },
  { 
    name: 'Voice Diagnostic', 
    description: 'Speak your symptoms naturally. Real-time waveform visualization with AI-powered TTS feedback.',
    icon: Mic,
    color: 'from-purple-500 to-indigo-600'
  },
  { 
    name: 'AR Body Locator', 
    description: 'Use your webcam with skeletal overlay. Point to body parts to log symptom locations.',
    icon: Camera,
    color: 'from-emerald-500 to-teal-600'
  },
  { 
    name: 'OCR Report Scanner', 
    description: 'Upload lab reports. AI extracts text, highlights abnormals, and explains findings.',
    icon: FileText,
    color: 'from-orange-500 to-red-500'
  },
  { 
    name: 'Health Risk Engine', 
    description: 'Multi-factor risk scoring with animated gauge visualization and prevention tips.',
    icon: HeartPulse,
    color: 'from-rose-500 to-pink-600'
  },
  { 
    name: 'Privacy First', 
    description: 'Data processed locally when possible. No permanent storage. Full HIPAA awareness.',
    icon: Shield,
    color: 'from-green-500 to-emerald-600'
  },
];

const stats = [
  { value: '99.2%', label: 'Uptime' },
  { value: '<200ms', label: 'Response Time' },
  { value: '50K+', label: 'Analyses Run' },
  { value: 'AES-256', label: 'Encryption' },
];

const Landing = () => {
  return (
    <div className="relative isolate pt-14 overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-cyan-500 to-blue-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>
      <div className="absolute inset-x-0 top-[calc(100%-30rem)] -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-purple-500 to-indigo-600 opacity-10 sm:left-[calc(50%+20rem)] sm:w-[72.1875rem]"></div>
      </div>

      {/* Hero Section */}
      <div className="py-20 sm:py-32 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Status badge */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="text-xs text-cyan-400 font-semibold tracking-wide uppercase">AI-Powered Healthcare Platform</span>
                </div>
              </div>

              <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl mb-6 leading-[1.1]">
                Your Intelligent{' '}
                <span className="text-gradient block sm:inline">Healthcare</span>{' '}
                <span className="text-gradient">Assistant</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
                Advanced AI-powered diagnostics at your fingertips. Analyze symptoms by voice or text, 
                scan medical reports with OCR, locate pain with AR body mapping, and receive instant health risk assessments.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-4 flex-wrap">
                <Link to="/dashboard" className="glass-button px-8 py-4 rounded-full text-base font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group">
                  Launch Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/about" className="text-sm font-semibold leading-6 text-white hover:text-cyan-400 transition-colors px-6 py-4">
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 glass-card py-6 px-8 max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-3">Integrated AI Features</h2>
              <p className="text-2xl font-bold text-white">Everything you need for preliminary health guidance</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="glass-card p-8 hover:-translate-y-2 transition-all duration-300 group cursor-default"
                >
                  <div className={`bg-gradient-to-br ${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}>
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{feature.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-20 text-center"
          >
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <Shield className="w-4 h-4 text-amber-400" />
              <p className="text-xs text-amber-300">
                <span className="font-semibold">Important:</span> MediGuide AI is not a substitute for professional medical advice.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
