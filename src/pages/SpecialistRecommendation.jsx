import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Star, MapPin, Calendar, Clock } from 'lucide-react';

const categories = [
  'Cardiologist', 'Neurologist', 'Dermatologist', 'General Physician', 
  'Orthopedic', 'Pediatrician', 'Psychiatrist'
];

const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Jenkins',
    specialty: 'Cardiologist',
    experience: '15 Years Exp',
    rating: 4.9,
    reviews: 128,
    location: 'City Heart Hospital, NY',
    availability: 'Available Today',
    image: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    experience: '12 Years Exp',
    rating: 4.8,
    reviews: 95,
    location: 'NeuroCare Center, NY',
    availability: 'Next Avail: Tomorrow',
    image: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: 3,
    name: 'Dr. Emily Watson',
    specialty: 'Dermatologist',
    experience: '8 Years Exp',
    rating: 4.7,
    reviews: 210,
    location: 'Skin Clear Clinic, NY',
    availability: 'Available Today',
    image: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 4,
    name: 'Dr. Robert Fox',
    specialty: 'General Physician',
    experience: '20 Years Exp',
    rating: 4.9,
    reviews: 450,
    location: 'Central Medical Hub, NY',
    availability: 'Available Today',
    image: 'https://i.pravatar.cc/150?img=8'
  }
];

const SpecialistRecommendation = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredDoctors = selectedCategory === 'All' 
    ? doctors 
    : doctors.filter(d => d.specialty === selectedCategory);

  return (
    <div>
      <div className="mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl mb-4">
          <UserPlus className="w-8 h-8 text-purple-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Specialist Recommendation</h1>
        <p className="text-slate-400">Find and connect with top-rated medical specialists near you.</p>
      </div>

      <div className="flex overflow-x-auto pb-4 mb-8 hide-scrollbar gap-3">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-colors border ${
            selectedCategory === 'All'
              ? 'bg-purple-500 border-purple-500 text-white'
              : 'glass text-slate-300 hover:text-white border-white/10'
          }`}
        >
          All Specialists
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-colors border ${
              selectedCategory === cat
                ? 'bg-purple-500 border-purple-500 text-white'
                : 'glass text-slate-300 hover:text-white border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDoctors.map((doc, idx) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card overflow-hidden group hover:border-purple-500/50 transition-colors"
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/20" />
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{doc.name}</h3>
                  <p className="text-purple-400 text-sm font-medium mb-1">{doc.specialty}</p>
                  <p className="text-slate-400 text-xs">{doc.experience}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-5 border-y border-white/5 py-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-sm font-semibold">{doc.rating}</span>
                  <span className="text-slate-500 text-xs">({doc.reviews})</span>
                </div>
                <div className="w-px h-4 bg-white/10"></div>
                <div className="flex items-center gap-1 text-slate-300 text-sm">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span className="truncate">{doc.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2.5 py-1.5 rounded-lg border border-emerald-400/20">
                  <Clock className="w-3.5 h-3.5" />
                  {doc.availability}
                </div>
                <button className="bg-white/10 hover:bg-purple-500 text-white p-2 rounded-xl transition-colors border border-white/10 hover:border-purple-500">
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="px-6 py-3 bg-white/5 border-t border-white/5 text-center group-hover:bg-purple-500/10 transition-colors">
              <button className="text-sm font-semibold text-purple-400 group-hover:text-purple-300">
                View Profile & Book
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SpecialistRecommendation;
