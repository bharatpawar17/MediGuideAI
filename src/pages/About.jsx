import { motion } from 'framer-motion';
import { Activity, Shield, Cpu, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-cyan-400">About the Project</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Revolutionizing Preliminary Healthcare with AI
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            MediGuide AI was built with a vision to make preliminary healthcare guidance accessible, fast, and accurate using the latest advancements in Artificial Intelligence and modern web technologies.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {[
              {
                name: 'AI-Powered Analysis',
                description: 'Leveraging NLP and machine learning to analyze symptoms and provide instant, accurate guidance.',
                icon: Cpu,
              },
              {
                name: 'Data Privacy',
                description: 'We prioritize your privacy. All medical data and reports are processed securely and never stored without consent.',
                icon: Shield,
              },
              {
                name: 'Accessible to All',
                description: 'Designed to be intuitive and easy to use for everyone, providing health insights at your fingertips.',
                icon: Users,
              },
              {
                name: 'Continuous Learning',
                description: 'Our AI models are constantly updated with the latest medical research to ensure up-to-date recommendations.',
                icon: Activity,
              },
            ].map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <feature.icon className="h-6 w-6 text-cyan-400" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        
        <div className="mt-24 glass-card p-10 text-center max-w-4xl mx-auto border-cyan-500/20 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-500/5 to-blue-500/5 pointer-events-none"></div>
           <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Important Disclaimer</h3>
           <p className="text-slate-300 relative z-10 max-w-2xl mx-auto">
             MediGuide AI is designed for informational and preliminary guidance purposes only. It is <strong className="text-cyan-400">not a replacement for professional medical advice, diagnosis, or treatment.</strong> Always consult with a qualified healthcare provider for any medical concerns.
           </p>
        </div>
      </div>
    </div>
  );
};

export default About;
