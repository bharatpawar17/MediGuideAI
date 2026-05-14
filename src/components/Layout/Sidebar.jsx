import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Stethoscope, 
  FileText, 
  HeartPulse, 
  AlertTriangle, 
  Pill, 
  UserPlus,
  Activity,
  Mic,
  Camera,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Symptom Analyzer', icon: Stethoscope, path: '/symptom-analyzer' },
    { name: 'Voice Diagnostic', icon: Mic, path: '/voice-diagnostic', badge: 'AI' },
    { name: 'AR Body Locator', icon: Camera, path: '/ar-locator', badge: 'AR' },
    { name: 'Report OCR', icon: FileText, path: '/report-analyzer' },
    { name: 'Risk Prediction', icon: HeartPulse, path: '/risk-prediction' },
    { name: 'Emergency', icon: AlertTriangle, path: '/emergency-detection', color: 'text-red-400' },
    { name: 'Medicine Checker', icon: Pill, path: '/medicine-checker' },
    { name: 'Specialists', icon: UserPlus, path: '/specialist-recommendation' },
    { name: 'Privacy & History', icon: Shield, path: '/privacy-history' },
  ];

  const NavContent = () => (
    <>
      <div className="h-20 flex items-center px-6 border-b border-white/10 shrink-0">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-1.5 rounded-lg shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">MediGuide <span className="text-cyan-400">AI</span></span>
        </Link>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className="block relative"
                onClick={() => setMobileOpen(false)}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 to-blue-500/5 rounded-xl border border-cyan-500/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                <div className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}>
                  <Icon className={`h-[18px] w-[18px] ${item.color || ''} ${isActive ? 'text-cyan-400' : ''}`} />
                  <span className="font-medium text-sm">{item.name}</span>
                  {item.badge && (
                    <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      isActive 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : 'bg-slate-700/50 text-slate-500'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10 shrink-0">
        <div className="glass-card p-4 text-center rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <p className="text-sm text-slate-300 font-medium">MediGuide AI v1.0</p>
            <p className="text-[10px] text-slate-500 mt-1 mb-2">Powered by Advanced AI</p>
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] text-green-400 font-medium">System Online</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 fixed h-full glass border-r border-white/10 z-40">
        <NavContent />
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 glass rounded-xl"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-64 glass border-r border-white/10 z-50 flex flex-col md:hidden"
            >
              <NavContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
