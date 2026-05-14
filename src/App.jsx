import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import MainLayout from './components/Layout/MainLayout';
import DashboardLayout from './components/Layout/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import SymptomAnalyzer from './pages/SymptomAnalyzer';
import VoiceDiagnostic from './pages/VoiceDiagnostic';
import ARLocatorPage from './pages/ARLocatorPage';
import ReportAnalyzer from './pages/ReportAnalyzer';
import RiskPrediction from './pages/RiskPrediction';
import EmergencyDetection from './pages/EmergencyDetection';
import MedicineChecker from './pages/MedicineChecker';
import SpecialistRecommendation from './pages/SpecialistRecommendation';
import PrivacyHistory from './pages/PrivacyHistory';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes with Top Navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Dashboard Routes with Sidebar */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/symptom-analyzer" element={<SymptomAnalyzer />} />
          <Route path="/voice-diagnostic" element={<VoiceDiagnostic />} />
          <Route path="/ar-locator" element={<ARLocatorPage />} />
          <Route path="/report-analyzer" element={<ReportAnalyzer />} />
          <Route path="/risk-prediction" element={<RiskPrediction />} />
          <Route path="/emergency-detection" element={<EmergencyDetection />} />
          <Route path="/medicine-checker" element={<MedicineChecker />} />
          <Route path="/specialist-recommendation" element={<SpecialistRecommendation />} />
          <Route path="/privacy-history" element={<PrivacyHistory />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
