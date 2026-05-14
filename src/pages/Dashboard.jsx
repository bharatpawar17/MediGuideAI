import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Activity, HeartPulse, FileText, Stethoscope, AlertTriangle, 
  Mic, Camera, TrendingUp, Clock, ArrowRight, Shield, Zap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import HealthRiskGauge from '../components/HealthRiskGauge';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

const healthTrend = [
  { name: 'Mon', score: 78, heart: 72 },
  { name: 'Tue', score: 82, heart: 68 },
  { name: 'Wed', score: 80, heart: 75 },
  { name: 'Thu', score: 85, heart: 70 },
  { name: 'Fri', score: 88, heart: 65 },
  { name: 'Sat', score: 92, heart: 62 },
  { name: 'Sun', score: 95, heart: 60 },
];

const vitalStats = [
  { label: 'Heart Rate', value: '72', unit: 'bpm', icon: HeartPulse, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', trend: '-3%' },
  { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', trend: 'Normal' },
  { label: 'Blood Sugar', value: '95', unit: 'mg/dL', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', trend: '+2%' },
  { label: 'SpO2 Level', value: '98', unit: '%', icon: Zap, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', trend: 'Optimal' },
];

const quickActions = [
  { name: 'Symptom Check', icon: Stethoscope, path: '/symptom-analyzer', color: 'from-cyan-500 to-blue-600', desc: 'AI-powered analysis' },
  { name: 'Voice Diagnostic', icon: Mic, path: '/voice-diagnostic', color: 'from-purple-500 to-indigo-600', desc: 'Speak your symptoms' },
  { name: 'AR Body Scan', icon: Camera, path: '/ar-locator', color: 'from-emerald-500 to-teal-600', desc: 'Point & detect' },
  { name: 'Report OCR', icon: FileText, path: '/report-analyzer', color: 'from-orange-500 to-red-600', desc: 'Scan lab reports' },
];

const recentActivity = [
  { title: 'Blood Test Report Analyzed', time: '2 hours ago', type: 'report', icon: FileText, color: 'text-blue-400' },
  { title: 'Headache symptom checked', time: '5 hours ago', type: 'symptom', icon: Stethoscope, color: 'text-cyan-400' },
  { title: 'Voice diagnostic session', time: '1 day ago', type: 'voice', icon: Mic, color: 'text-purple-400' },
  { title: 'Risk assessment completed', time: '2 days ago', type: 'risk', icon: HeartPulse, color: 'text-rose-400' },
  { title: 'Emergency check: Clear', time: '3 days ago', type: 'emergency', icon: Shield, color: 'text-green-400' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const Dashboard = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Welcome back, <span className="text-gradient">User</span> 👋
            </h1>
            <p className="text-slate-400">Here's your health overview for today. All vitals are looking good.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-green-400 font-medium">System Active</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Vital Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {vitalStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className={`glass-card p-5 group hover:${stat.border} transition-all duration-300`}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.border} border`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.bg} ${stat.color}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-xs text-slate-500">{stat.unit}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Health Risk Gauge */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Health Risk Score</h2>
            <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">Updated today</span>
          </div>
          <HealthRiskGauge score={28} size={180} strokeWidth={14} />
          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { label: 'Cardiac', value: '12%', color: 'text-green-400' },
              { label: 'Diabetes', value: '8%', color: 'text-green-400' },
              { label: 'Stress', value: '22%', color: 'text-yellow-400' },
            ].map(item => (
              <div key={item.label} className="text-center p-2 bg-slate-800/50 rounded-xl">
                <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Health Trend Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Health Score Trends</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-cyan-400 rounded-full" />
                <span className="text-xs text-slate-400">Health Score</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-rose-400 rounded-full" />
                <span className="text-xs text-slate-400">Heart Rate</span>
              </div>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHeart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb7185" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={12} />
                <YAxis stroke="#475569" fontSize={12} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155', 
                    borderRadius: '12px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  }}
                  itemStyle={{ color: '#e2e8f0', fontSize: '13px' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHealth)" />
                <Area type="monotone" dataKey="heart" stroke="#fb7185" strokeWidth={2} fillOpacity={1} fill="url(#colorHeart)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link key={action.name} to={action.path}>
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass-card p-5 group cursor-pointer hover:border-slate-600/80 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">{action.name}</h3>
                <p className="text-xs text-slate-400">{action.desc}</p>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 mt-3 transition-all group-hover:translate-x-1" />
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Timeline */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <Link to="/privacy-history" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-4 group"
              >
                <div className="relative">
                  <div className={`p-2 rounded-lg bg-slate-800/80 border border-slate-700/50 group-hover:border-slate-600 transition-colors`}>
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  {i < recentActivity.length - 1 && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-6 bg-slate-700/50" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{activity.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Health Insights */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6">AI Health Insights</h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <h4 className="text-sm font-semibold text-green-400">Excellent Trend</h4>
              </div>
              <p className="text-sm text-slate-300">Your health score has improved by <span className="text-green-400 font-semibold">12%</span> over the past week. Keep up the healthy lifestyle!</p>
            </div>
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                <h4 className="text-sm font-semibold text-amber-400">Stress Levels</h4>
              </div>
              <p className="text-sm text-slate-300">Your stress indicators are slightly elevated. Consider <span className="text-amber-400 font-semibold">meditation or light exercise</span> today.</p>
            </div>
            <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                <h4 className="text-sm font-semibold text-cyan-400">Hydration Reminder</h4>
              </div>
              <p className="text-sm text-slate-300">Based on your activity, aim for at least <span className="text-cyan-400 font-semibold">8 glasses of water</span> today to stay properly hydrated.</p>
            </div>
          </div>
        </motion.div>
      </div>

      <MedicalDisclaimer compact />
    </motion.div>
  );
};

export default Dashboard;
