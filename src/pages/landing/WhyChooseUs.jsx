import React from 'react';
import { CheckCircle, Package, Rocket, Star } from 'lucide-react';

function WhyChooseUs() {
  const features = [
    { title: 'Authentic Products', desc: '100% verified authenticity guarantee', icon: <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" /> },
    { title: 'Secure Packaging', desc: 'Premium protection for your treasures', icon: <Package className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" /> },
    { title: 'Fast Shipping', desc: 'Express delivery worldwide', icon: <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" /> },
    { title: 'Rare Finds Weekly', desc: 'New exclusive items every week', icon: <Star className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" /> },
  ];

  return (
    <section className="bg-gradient-to-r from-slate-900 via-purple-900/30 to-slate-900 py-12 sm:py-20 px-4 sm:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 sm:mb-4">
            Why Collectors{' '}
            <span className="text-transparent bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text">
              Love Us
            </span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-lg">
            Setting the standard for collectible excellence
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-cyan-500/50 rounded-2xl p-4 sm:p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 transform hover:-translate-y-2 flex flex-col items-center text-center"
            >
              <div className="mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-125">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
