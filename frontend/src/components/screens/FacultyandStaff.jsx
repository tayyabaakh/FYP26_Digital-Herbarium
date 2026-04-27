
import React from 'react';
import { Link } from 'react-router-dom';

const FacultyPage = () => {
  const staffMembers = [
    { name: "Dr. Roohi Bano", role: "Director", image: "" },
    { name: "Dr. Shaukat Ali", role: "Senior Taxonomist", image: "" },
    { name: "Dr. Muneeba Khan", role: "Taxonomist", image: "" },
    { name: "Noman Islam", role: "CCT", image: "" },
    { name: "Muhammad Imran", role: "Lab Assistant", image: "" },
    { name: "Muhammad Faizan", role: "Messenger", image: "" },
  ];

  return (
    <div className="bg-background-dark font-display text-slate-100 min-h-screen">
      {/* Custom Styles for Glassmorphism & Hero */}
      <style dangerouslySetInnerHTML={{ __html: `
        .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .hero-gradient {
            background: linear-gradient(0deg, rgba(16, 34, 19, 1) 0%, rgba(16, 34, 19, 0.4) 100%);
        }
      `}} />

      {/* Hero Section */}
      <section className="relative h-[400px] flex items-end px-6 lg:px-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 hero-gradient z-10"></div>
          <img 
            alt="Herbarium Background" 
            className="w-full h-full object-cover scale-105" 
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2560&q=80" 
          />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-12 bg-primary"></div>
            <span className="text-primary font-bold tracking-[0.3em] text-xs uppercase">Karachi University</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
            Faculty <span className="opacity-40">& Staff</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-xl text-lg leading-relaxed">
            Meet the dedicated professionals preserving the rich botanical heritage of the Karachi University Herbarium.
          </p>
        </div>
      </section>

      {/* Faculty Grid Section */}
      <section className="px-6 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {staffMembers.map((member, index) => (
              <div 
                key={index} 
                className="glass-card rounded-2xl p-5 group transition-all duration-500 hover:-translate-y-2 hover:border-primary/30"
              >
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-6 bg-white/5">
                    {/* Grayscale to Color hover effect */}
                    <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent opacity-60"></div>
                </div>
                
                <div className="text-center">
                    <p className="text-primary text-[10px] font-black tracking-[0.2em] uppercase mb-1">
                        {member.role}
                    </p>
                    <h3 className="text-white text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                        {member.name}
                    </h3>
                    <div className="w-0 group-hover:w-12 h-[2px] bg-primary mx-auto mt-4 transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="px-6 lg:px-20 py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Get in Touch</h3>
                <p className="text-white/50 text-lg">
                    For research collaborations, specimen loans, or general inquiries, please contact our administration office.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-5">
                    <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">mail</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Email</p>
                        <p className="text-white font-bold">cpc@uok.edu.pk</p>
                    </div>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-5">
                    <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">call</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Phone</p>
                        <p className="text-white font-bold">ext: 2557</p>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default FacultyPage;
