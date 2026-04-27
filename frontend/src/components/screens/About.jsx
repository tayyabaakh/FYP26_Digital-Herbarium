
import React from 'react';

const AboutPage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-white overflow-x-hidden min-h-screen">
      {/* 1. Global Styles & Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{
        __html: `
        .hero-bg-blur {
          background-image: url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80);
          background-size: cover;
          background-position: center;
          filter: blur(60px) brightness(0.5);
          position: fixed;
          inset: 0;
          z-index: -1;
        }
        .glass-card {
          backdrop-filter: blur(20px) brightness(1.1);
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px border rgba(255, 255, 255, 0.1);
        }
        .text-reveal {
          background: url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80);
          background-size: cover;
          background-position: center;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: brightness(1.2) contrast(1.1);
        }
      `}} />

      {/* Persistent Blurred Background */}
      <div className="hero-bg-blur"></div>

     
      <main className="relative z-10">
        {/* --- Hero Section --- */}
        <section className="px-6 md:px-20 py-16 md:py-24 max-w-[1400px] mx-auto">
          <div className="flex flex-col gap-12 lg:flex-row items-center">
            {/* Visual Panel mimicking the Home Page style */}
            <div className="w-full lg:w-1/2 relative group">
              <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full scale-75 opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="aspect-square lg:aspect-[6/5] rounded-3xl overflow-hidden glass-card border border-white/20 shadow-2xl relative z-10 p-4">
                <img 
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000" 
                  alt="Botanical Research" 
                  className="w-full h-full object-cover rounded-2xl brightness-75 grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>

            <div className="flex flex-col gap-8 lg:w-1/2">
              <div className="flex flex-col gap-4">
                <span className="text-white/50 font-black tracking-[0.4em] text-xs uppercase">Welcome to the Portal</span>
                <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
                  DATA PORTAL <br />
                  <span className="text-reveal backdrop-filter">OF KUH</span>
                </h1>
                <p className="text-white/60 text-lg leading-relaxed max-w-xl">
                The Karachi University Herbarium (KUH) at the Centre for Plant Conservation serves as a valuable repository of plant specimens, playing a vital role in research, education, and conservation. In line with modern practices and to ensure the long-term preservation and accessibility of these specimens, it has become essential to digitize our herbarium collections.
                </p>
              </div>
              <div className="flex gap-4">
                <button className="bg-white text-black rounded-full px-10 py-4 font-black text-xs tracking-widest uppercase hover:scale-105 transition-transform">
                  Explore Collection
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- Aims & Scope Section --- */}
        <section className="py-20 px-6 md:px-20 relative overflow-hidden">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col gap-4 mb-16 text-center">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase">Aims & Scope</h2>
              <div className="w-24 h-1 bg-white/20 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'Aims', icon: 'target',items: [
      'Preserve Botanical Heritage', 
      'Enhance Global Accessibility', 
      'Standardize Data And Documentation',
      'Promote Education and Capacity Building',
      'Support Conservation and Policy Efforts'

    ] },
                { title: 'Scope', icon: 'visibility', items: [
      'Database Development', 
      'National And International Linkage', 
      'Training And Capacity Development',
      'Strengthening Virtual Research Capabilities'
    ] }
              ].map((item) => (
                <div key={item.title} className="glass-card p-10 rounded-3xl border border-white/10 hover:border-white/30 transition-all group">
                  <div className="text-white bg-white/10 w-16 h-16 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 uppercase tracking-wider">{item.title}</h3>
                  <ul className="list-[square] text-white/50 leading-relaxed">
                    {item.items.map((item, index) => (
                      <li key={index} className="mb-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Team Section --- */}
        <section className="py-24 px-6 md:px-20">
          <div className="max-w-[1200px] mx-auto">
            <div className="mb-16 flex justify-between items-end border-b border-white/10 pb-6">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter">Digitization Team</h2>
                <p className="text-white/40 mt-2 font-medium">The minds behind the Digital Herbarium</p>
              </div>
              <span className="material-symbols-outlined text-white/20 text-5xl">groups</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: 'Dr. Muhammad Qaiser', role: 'Executive Lead' },
                { name: 'Dr. Roohi Bano', role: 'Director' },
                { name: 'Dr. Sayed Shaiq Ali', role: 'Lead Researcher' },
                { name: 'Dr. Muhammad Zafar', role: 'Database Manager' },
                { name: 'Ms. Samina Ishaq', role: 'Taxonomist' },
                { name: 'Mr. Shakeel Ahmed', role: 'IT Specialist' },
                { name: 'Dr. Uzma Abbas', role: 'Curation Lead' },
                { name: 'Ms. Hina Iqbal', role: 'Research Fellow' }
              ].map((member) => (
                <div key={member.name} className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-white/5 transition-colors group">
                  <div className="size-32 mb-6 rounded-full glass-card border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-white/40 transition-all p-1">
                    <div className="w-full h-full bg-white/5 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-white/20">person</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg leading-tight group-hover:text-white transition-colors">{member.name}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-black mt-2">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
 
    </div>
  );
};

export default AboutPage;
