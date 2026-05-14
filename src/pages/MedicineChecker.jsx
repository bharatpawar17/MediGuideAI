import { useState } from 'react';
import { Search, Pill, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

const MedicineChecker = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResult(null);

    // Mock search
    setTimeout(() => {
      setIsSearching(false);
      setResult({
        name: query.charAt(0).toUpperCase() + query.slice(1),
        genericName: 'Paracetamol / Acetaminophen',
        category: 'Analgesic & Antipyretic',
        usage: 'Used to treat mild to moderate pain (from headaches, menstrual periods, toothaches, backaches, osteoarthritis, or cold/flu aches and pains) and to reduce fever.',
        dosage: 'Typical adult dose is 500mg - 1000mg every 4-6 hours. Max 4000mg per day.',
        sideEffects: ['Nausea', 'Stomach pain', 'Loss of appetite', 'Rash'],
        warnings: 'Do not use with other medications containing acetaminophen. Overdose can cause severe liver damage.',
        pregnancy: 'Generally considered safe during pregnancy when used as directed, but consult your doctor first.'
      });
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-4">
          <Pill className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Medicine Information Checker</h1>
        <p className="text-slate-400">Search for any medication to check its usage, side effects, and warnings.</p>
      </div>

      <div className="mb-8 relative max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-32 py-4 bg-slate-900/80 border border-slate-700 rounded-full text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-lg"
            placeholder="Search e.g. Paracetamol, Amoxicillin..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-semibold transition-colors disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden"
          >
            <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{result.name}</h2>
                  <p className="text-emerald-400 text-sm font-medium">{result.genericName}</p>
                </div>
                <span className="px-3 py-1 bg-white/10 text-white text-xs font-semibold rounded-full border border-white/20">
                  {result.category}
                </span>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-400" /> Usage
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                    {result.usage}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-emerald-400" /> Typical Dosage
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                    {result.dosage}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400" /> Common Side Effects
                  </h3>
                  <div className="bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/10">
                    <ul className="grid grid-cols-2 gap-2">
                      {result.sideEffects.map((effect, i) => (
                        <li key={i} className="text-sm text-yellow-200/80 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50"></span>
                          {effect}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400" /> Critical Warnings
                  </h3>
                  <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                    <p className="text-sm text-red-200 leading-relaxed">
                      {result.warnings}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MedicalDisclaimer compact />
    </div>
  );
};

export default MedicineChecker;
