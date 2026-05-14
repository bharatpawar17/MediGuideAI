import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, HeartPulse, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

const RiskPrediction = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    bloodPressure: '',
    sugarLevel: '',
    habits: 'none'
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateRisk = (e) => {
    e.preventDefault();
    
    const age = parseInt(formData.age) || 0;
    const weight = parseFloat(formData.weight) || 0;
    const height = parseFloat(formData.height) || 0;
    const sugar = parseFloat(formData.sugarLevel) || 0;
    const habits = formData.habits;

    // ---- Calculate BMI ----
    let bmi = 0;
    if (height > 0) {
      bmi = weight / ((height / 100) ** 2);
    }

    // ---- Calculate risk score from multiple factors ----
    let score = 10; // base
    const insights = [];
    const prevention = [];

    // Age factor (0-25 pts)
    if (age >= 65) {
      score += 25;
      insights.push(`Age ${age} places you in a higher-risk demographic group.`);
      prevention.push('Schedule comprehensive health check-ups every 6 months.');
    } else if (age >= 50) {
      score += 18;
      insights.push(`Age ${age} indicates moderate age-related risk factors.`);
      prevention.push('Annual health screenings are recommended at your age.');
    } else if (age >= 40) {
      score += 10;
      insights.push(`Age ${age} — proactive monitoring is advisable.`);
    } else if (age >= 30) {
      score += 5;
      insights.push(`Age ${age} — low age-related risk. Focus on prevention.`);
    } else {
      insights.push(`Age ${age} — minimal age-related risk.`);
    }

    // BMI factor (0-20 pts)
    if (bmi > 0) {
      if (bmi >= 35) {
        score += 20;
        insights.push(`BMI ${bmi.toFixed(1)} (Obese Class II+) — significantly increases cardiovascular and metabolic risks.`);
        prevention.push('Consult a nutritionist for a structured weight management program.');
      } else if (bmi >= 30) {
        score += 15;
        insights.push(`BMI ${bmi.toFixed(1)} (Obese) — elevated risk for diabetes, heart disease, and joint problems.`);
        prevention.push('Aim to lose 5-10% of body weight through diet and exercise.');
      } else if (bmi >= 25) {
        score += 8;
        insights.push(`BMI ${bmi.toFixed(1)} (Overweight) — slightly above ideal range.`);
        prevention.push('Engage in 150 minutes of moderate exercise per week.');
      } else if (bmi >= 18.5) {
        insights.push(`BMI ${bmi.toFixed(1)} (Normal) — within healthy range.`);
      } else {
        score += 5;
        insights.push(`BMI ${bmi.toFixed(1)} (Underweight) — may indicate nutritional deficiency.`);
        prevention.push('Consult a dietitian to ensure adequate caloric and nutrient intake.');
      }
    }

    // Blood pressure factor (0-20 pts)
    let systolic = 0, diastolic = 0;
    try {
      const parts = formData.bloodPressure.split('/');
      systolic = parseInt(parts[0]) || 0;
      diastolic = parseInt(parts[1]) || 0;
    } catch {}

    if (systolic > 0) {
      if (systolic >= 160 || diastolic >= 100) {
        score += 20;
        insights.push(`Blood pressure ${formData.bloodPressure} — Stage 2 Hypertension. Immediate medical attention needed.`);
        prevention.push('Limit sodium to < 1500mg/day and consult a cardiologist.');
      } else if (systolic >= 140 || diastolic >= 90) {
        score += 15;
        insights.push(`Blood pressure ${formData.bloodPressure} — Stage 1 Hypertension detected.`);
        prevention.push('Reduce salt intake, manage stress, and monitor BP daily.');
      } else if (systolic >= 120 || diastolic >= 80) {
        score += 5;
        insights.push(`Blood pressure ${formData.bloodPressure} — Elevated, pre-hypertension range.`);
        prevention.push('Maintain a heart-healthy diet (DASH diet recommended).');
      } else {
        insights.push(`Blood pressure ${formData.bloodPressure} — within normal range.`);
      }
    }

    // Sugar factor (0-20 pts)
    if (sugar > 0) {
      if (sugar >= 200) {
        score += 20;
        insights.push(`Fasting sugar ${sugar} mg/dL — Critical. Indicates possible uncontrolled diabetes.`);
        prevention.push('Seek immediate endocrinologist consultation for glucose management.');
      } else if (sugar >= 126) {
        score += 15;
        insights.push(`Fasting sugar ${sugar} mg/dL — Diabetic range. HbA1C test recommended.`);
        prevention.push('Begin monitoring blood glucose daily; reduce refined sugar intake.');
      } else if (sugar >= 100) {
        score += 8;
        insights.push(`Fasting sugar ${sugar} mg/dL — Pre-diabetic range.`);
        prevention.push('Reduce refined carbohydrate and sugar intake; increase fiber consumption.');
      } else {
        insights.push(`Fasting sugar ${sugar} mg/dL — within normal range.`);
      }
    }

    // Lifestyle habits factor (0-15 pts)
    if (habits === 'both') {
      score += 15;
      insights.push('Smoking + frequent alcohol use significantly compounds health risks.');
      prevention.push('Strongly consider smoking cessation programs and limiting alcohol to < 2 drinks/day.');
    } else if (habits === 'smoking') {
      score += 12;
      insights.push('Smoking increases risk of cardiovascular disease, COPD, and cancer.');
      prevention.push('Seek a smoking cessation program — even reducing by 50% helps significantly.');
    } else if (habits === 'alcohol') {
      score += 8;
      insights.push('Frequent alcohol use increases liver disease and cardiovascular risk.');
      prevention.push('Limit alcohol intake to moderate levels (≤1 drink/day for women, ≤2 for men).');
    } else {
      insights.push('No harmful lifestyle habits reported — excellent foundation for health.');
    }

    // Cap score at 100
    score = Math.min(score, 100);

    // Add universal prevention tips
    prevention.push('Maintain consistent sleep of 7-9 hours per night.');
    prevention.push('Stay hydrated — aim for 2-3 liters of water daily.');

    // Determine risk level
    let level;
    if (score <= 20) level = 'Low';
    else if (score <= 40) level = 'Mild';
    else if (score <= 60) level = 'Moderate';
    else if (score <= 80) level = 'Moderate High';
    else level = 'Critical';

    // Generate chart data based on actual factors
    const cardiovascularRisk = Math.min(100, Math.max(5,
      (systolic >= 140 ? 35 : systolic >= 120 ? 20 : 10) +
      (habits === 'smoking' || habits === 'both' ? 15 : 0) +
      (bmi >= 30 ? 10 : 0) +
      (age >= 50 ? 10 : 0)
    ));
    const diabetesRisk = Math.min(100, Math.max(5,
      (sugar >= 126 ? 40 : sugar >= 100 ? 20 : 5) +
      (bmi >= 30 ? 15 : bmi >= 25 ? 8 : 0) +
      (age >= 45 ? 10 : 0)
    ));
    const otherRisk = Math.max(5, 100 - cardiovascularRisk - diabetesRisk);

    setResult({
      score,
      level,
      insights,
      prevention,
      chartData: [
        { name: 'Cardiovascular Risk', value: cardiovascularRisk },
        { name: 'Diabetes Risk', value: diabetesRisk },
        { name: 'Stress/Other', value: otherRisk },
      ]
    });
  };

  const COLORS = ['#06b6d4', '#3b82f6', '#1e293b'];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-4">
          <HeartPulse className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Health Risk Prediction</h1>
        <p className="text-slate-400">Enter your vitals to predict potential health risks and get prevention tips.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Patient Vitals</h2>
          <form onSubmit={calculateRisk} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Age</label>
                <input required type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Weight (kg)</label>
                <input required type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Height (cm)</label>
                <input required type="number" name="height" value={formData.height} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Blood Pressure</label>
                <input required type="text" placeholder="120/80" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:border-indigo-500 outline-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-1">Fasting Sugar Level (mg/dL)</label>
              <input required type="number" name="sugarLevel" value={formData.sugarLevel} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:border-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Lifestyle Habits</label>
              <select name="habits" value={formData.habits} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:border-indigo-500 outline-none">
                <option value="none">None</option>
                <option value="smoking">Smoking</option>
                <option value="alcohol">Frequent Alcohol</option>
                <option value="both">Both</option>
              </select>
            </div>

            <button type="submit" className="w-full mt-4 glass-button bg-gradient-to-r from-indigo-500 to-blue-600 shadow-[0_0_15px_rgba(99,102,241,0.5)] py-3 rounded-xl font-semibold">
              Generate Risk Report
            </button>
          </form>
        </div>

        {result ? (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="glass-card p-6 border-indigo-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Overall Risk Score</h3>
                <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-semibold">{result.level}</span>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-bold text-white">{result.score}</span>
                <span className="text-slate-400 mb-1">/ 100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full" style={{ width: `${result.score}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4">
                <h4 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4" /> Probabilities
                </h4>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={result.chartData} innerRadius={30} outerRadius={50} paddingAngle={5} dataKey="value">
                        {result.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="glass-card p-4">
                <h4 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Key Insights
                </h4>
                <ul className="text-xs text-slate-300 space-y-2">
                  {result.insights.map((insight, i) => (
                    <li key={i} className="flex gap-2"><span className="text-indigo-400">•</span>{insight}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="glass-card p-6 border-green-500/20 bg-green-500/5">
              <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Prevention Suggestions
              </h4>
              <ul className="text-sm text-slate-300 space-y-2">
                {result.prevention.map((prev, i) => (
                  <li key={i} className="flex gap-2"><span className="text-green-500">✓</span>{prev}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : (
          <div className="glass-card p-6 flex items-center justify-center text-center opacity-50">
            <div>
              <Activity className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300">Awaiting Vitals</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">Fill out the form and generate the report to see your health risk prediction.</p>
            </div>
          </div>
        )}
      </div>

      <MedicalDisclaimer compact />
    </div>
  );
};

export default RiskPrediction;
