import { AlertTriangle } from 'lucide-react';

const MedicalDisclaimer = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="disclaimer-bar rounded-xl px-4 py-3 flex items-center gap-3 mt-6">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="text-xs text-amber-200/80">
          <span className="font-semibold text-amber-300">Disclaimer:</span> This tool is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.
        </p>
      </div>
    );
  }

  return (
    <div className="disclaimer-bar rounded-2xl p-5 flex items-start gap-4 mt-8">
      <div className="p-2 bg-amber-500/20 rounded-xl shrink-0">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-amber-300 mb-1">Medical Disclaimer</h4>
        <p className="text-sm text-amber-200/70 leading-relaxed">
          MediGuide AI is designed for informational and preliminary guidance purposes only. It is <strong className="text-amber-200">not a substitute for professional medical advice, diagnosis, or treatment.</strong> Always seek the advice of your physician or other qualified health provider with any questions regarding a medical condition.
        </p>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;
