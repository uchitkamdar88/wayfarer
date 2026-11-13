import React from 'react';
import { ShieldCheck, HeartHandshake, Compass, UtensilsCrossed, CloudSnow, Coins } from 'lucide-react';

export const WhyWayfarer: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Zero Commercial Kickbacks',
      desc: 'We earn zero commission from hotels, airlines, or local cab unions. Our recommendations are driven purely by geographical logic and verified quality.',
    },
    {
      icon: UtensilsCrossed,
      title: 'Authentic Pure Vegetarian & Jain Focus',
      desc: 'Never generic salad filler. We curate dedicated pure-vegetarian institutions and regional dining recommendations that fit the destination and your dietary requirements.',
    },
    {
      icon: CloudSnow,
      title: 'Season-Specific Intelligence',
      desc: 'Whether it is April’s short-lived tulip bloom, autumn’s crimson Chinar groves, or winter snow-chain rules on the Tangmarg ascent, our engine knows the mountain rhythms.',
    },
    {
      icon: Coins,
      title: 'Transparent Budget Derivations',
      desc: 'Every estimated rupee is transparently accounted for: hotel room counts, union taxi permits, Gondola passes, and contingency buffers you can modify directly.',
    },
    {
      icon: Compass,
      title: 'Sensible Geographical Flow',
      desc: 'We eliminate unrealistic routing and grueling backtracking. Stops follow coherent regional routes with indicative transfer distances and climate-aware sequencing.',
    },
    {
      icon: HeartHandshake,
      title: 'Complete Client-Side Privacy',
      desc: 'No account signups, no logins, no tracking cookies, and zero external transmission of your holiday plans. Everything stays in your browser memory.',
    },
  ];

  return (
    <section id="why-wayfarer" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-champagne-600">
            OUR PHILOSOPHY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-950 mt-2">
            Why plan your journey with WAYFARER?
          </h2>
          <p className="text-sm text-stone-600 mt-3 font-sans leading-relaxed">
            Most travel sites are designed to push sponsored hotel listings and affiliate links. WAYFARER is designed to build the trip you actually want to take.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-ivory-100 border border-stone-250 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-start text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-champagne-100 border border-champagne-300 flex items-center justify-center text-champagne-800 mb-6 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-ink-900 mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
