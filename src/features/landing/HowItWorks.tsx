import React from 'react';
import { Calendar, Sliders, Map, FileDown } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: Calendar,
      title: 'Define Your Travel Window',
      description:
        'Select your destination and dates. The engine immediately reads seasonal weather models, snowfall likelihood, and temperature windows.',
    },
    {
      step: '02',
      icon: Sliders,
      title: 'Personalize Pace & Diet',
      description:
        'Specify group size, hotel standards, preferred pace (relaxed or packed), and food preferences (Pure Vegetarian, Jain, Vegan, or Standard).',
    },
    {
      step: '03',
      icon: Map,
      title: 'Geographical Clustering',
      description:
        'Attractions are logically grouped by region (Srinagar, Gulmarg, Pahalgam, Sonamarg) to avoid impractical backtracking and road exhaustion.',
    },
    {
      step: '04',
      icon: FileDown,
      title: 'Interactive Companion & PDF',
      description:
        'Tweak stops using the local travel assistant, review transparent budget formulas, and export a luxury multi-page A4 itinerary document.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-ivory-200/60 border-y border-stone-250">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-champagne-600">
            HOW WAYFARER WORKS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-950 mt-2">
            Thoughtful planning, step by step.
          </h2>
          <p className="text-sm text-stone-600 mt-3 font-sans leading-relaxed">
            We replace scattered travel blogs and fragmented bookmarks with a cohesive, geographically sound travel blueprint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white p-8 rounded-2xl border border-stone-250 shadow-soft hover:shadow-elevated transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-3xl font-bold text-champagne-500 group-hover:scale-105 transition-transform">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-champagne-50 border border-champagne-200 flex items-center justify-center text-champagne-700">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-ink-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

