import React from 'react';

const Home = () => {
  return (
    <div className="bg-white">
      {/* --- HERO SECTION --- */}
      <section className="relative h-[500px] bg-black text-white flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Background Image (Mocking the Lysimachia arvensis image) */}
        <div className="absolute inset-0 opacity-60">
          <img 
            src="https://images.unsplash.com/photo-1501004318641-729e8e3986ff?auto=format&fit=crop&q=80&w=1600" 
            alt="Botanical background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-light mb-4">
            Welcome to Plants of the World Online
          </h1>
          <p className="text-lg md:text-xl font-light mb-8">
            Browse 1,442,000 global plant names, 530,400 detailed descriptions, and 497,200 images
          </p>
          
          {/* Search Bar */}
          <div className="relative w-full max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full py-4 px-6 rounded-full text-black text-lg focus:outline-none focus:ring-2 focus:ring-kewTeal shadow-xl"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-kewTeal">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Featured Credit (Bottom Right) */}
        <div className="absolute bottom-4 right-8 text-right text-xs text-gray-300 hidden md:block">
          <p className="italic">Featured: Lysimachia arvensis</p>
          <p>Image from Stuppy & Kesseler</p>
          <p>© Papadakis Publisher</p>
        </div>
      </section>

      {/* --- FEATURED PLANTS SECTION --- */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-4">
          <h2 className="text-3xl font-light text-gray-800">Featured plants</h2>
          <a href="#" className="text-kewTeal font-semibold hover:underline text-sm">View all plants</a>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <PlantCard 
            image="https://images.unsplash.com/photo-1599023344847-d1a741c449a2?auto=format&fit=crop&q=80&w=800"
            title="Basella alba L."
            description="The native range of this species is Tropical Asia. It is a climbing subshrub and grows primarily in the wet tropical biome. It is used as animal food and a medicine, has environmental uses and social uses and for food."
          />
          <PlantCard 
            image="https://images.unsplash.com/photo-1508313880080-c4bef0730395?auto=format&fit=crop&q=80&w=800"
            title="Delonix regia (Bojer ex Hook.) Raf."
            description="The native range of this species is N. & W. Madagascar. It is a tree and grows primarily in the seasonally dry tropical biome. It is used as animal food, a poison, a medicine and invertebrate food, has environmental uses and for fuel and food."
          />
          <PlantCard 
            image="https://images.unsplash.com/photo-1463123081488-789f998ac9c4?auto=format&fit=crop&q=80&w=800"
            title="Digitalis purpurea L."
            description="The native range of this species is W. & SW. Europe to N. Morocco. It is a biennial or perennial and grows primarily in the temperate biome. It is used as a poison and a medicine, has environmental uses and for food."
          />
        </div>
      </section>
    </div>
  );
};

// Internal component for the Plant Cards
const PlantCard = ({ image, title, description }) => (
  <div className="flex flex-col group cursor-pointer">
    <div className="overflow-hidden mb-4 h-52">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    </div>
    <span className="text-xs font-bold text-kewTeal uppercase tracking-widest mb-2">Species</span>
    <h3 className="text-xl font-serif font-semibold text-gray-900 mb-3 group-hover:text-kewTeal transition-colors">
      {title}
    </h3>
    <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
      {description}
    </p>
  </div>
);

export default Home;