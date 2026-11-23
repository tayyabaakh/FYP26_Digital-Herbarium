import React, { useState, useEffect } from "react";

// Carousel images
const carouselImages = [
  {
    src: "https://karuniherb.pk/wp-content/uploads/2026/01/IMG_20250424_155111-1024x771.jpg",
    alt: "Forest and botanical biodiversity",
  },
  {
    src: "https://karuniherb.pk/wp-content/uploads/2026/01/IMG_2397-1024x683.jpg",
    alt: "Botanical research",
  },
  {
    src: "https://karuniherb.pk/wp-content/uploads/2026/01/IMG_20250424_155452-1024x771.jpg",
    alt: "Plants and natural biodiversity",
  },
   {
    src: "https://karuniherb.pk/wp-content/uploads/2026/01/IMG_20250424_155852-1024x771.jpg",
    alt: "Plants and natural biodiversity",
  },
];

const AboutPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatically change image every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Manual slide selection
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const aimsAndScope = [
    {
      title: "Aims",
      icon: "target",
      items: [
        "Preserve Botanical Heritage",
        "Enhance Global Accessibility",
        "Standardize Data And Documentation",
        "Promote Education and Capacity Building",
        "Support Conservation and Policy Efforts",
      ],
    },
    {
      title: "Scope",
      icon: "visibility",
      items: [
        "Database Development",
        "National And International Linkage",
        "Training And Capacity Development",
        "Strengthening Virtual Research Capabilities",
      ],
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Muhammad Qaiser",
      role: "Executive Lead",
      initials: "MQ",
    },
    {
      name: "Dr. Roohi Bano",
      role: "Director",
      initials: "RB",
    },
    {
      name: "Dr. Sayed Shaiq Ali",
      role: "Lead Researcher",
      initials: "SA",
    },
    {
      name: "Dr. Muhammad Zafar",
      role: "Database Manager",
      initials: "MZ",
    },
    {
      name: "Ms. Samina Ishaq",
      role: "Taxonomist",
      initials: "SI",
    },
    {
      name: "Mr. Shakeel Ahmed",
      role: "IT Specialist",
      initials: "SA",
    },
    {
      name: "Dr. Uzma Abbas",
      role: "Curation Lead",
      initials: "UA",
    },
    {
      name: "Ms. Hina Iqbal",
      role: "Research Fellow",
      initials: "HI",
    },
  ];

  return (
    <div className="bg-[#F8F9FA] text-[#1B3022] font-display min-h-screen">

      {/* ==========================================
          GLOBAL STYLES & FONTS
      ========================================== */}

      <link
        href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet"
      />

      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <main className="max-w-[1280px] mx-auto px-6 py-15">

        {/* ==========================================
            BREADCRUMB & HEADER SECTION
        ========================================== */}

        <div className="text-xs text-gray-500 mb-4 flex items-center gap-2">
          <span>Home</span>
          <span>/</span>
          <span className="text-[#1B3022] font-medium">About</span>
        </div>
        {/* ==========================================
            HERBARY/HERBARIUM HERO SECTION
        ========================================== */}

        <section className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-sm mb-16">

          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* ==========================================
                AUTOMATIC IMAGE CAROUSEL
            ========================================== */}

            <div className="w-full lg:w-1/2 relative">

              {/* Carousel Outer Container */}
              <div className="aspect-square lg:aspect-[16/11] rounded-2xl overflow-hidden bg-gray-100 shadow-md relative">

                {/* Carousel Inner Container */}
                <div className="relative w-full h-full overflow-hidden">

                  {/* Sliding Images */}
                  <div
                    className="flex h-full transition-transform duration-1000 ease-in-out"
                    style={{
                      transform: `translateX(-${currentSlide * 100}%)`,
                    }}
                  >
                    {carouselImages.map((image, index) => (
                      <div
                        key={index}
                        className="w-full h-full shrink-0"
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                      </div>
                    ))}
                  </div>

                  {/* ==========================================
                      CAROUSEL INDICATORS
                  ========================================== */}

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">

                    {carouselImages.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={
                          currentSlide === index ? "true" : undefined
                        }
                        className={`
                          h-1.5 rounded-full
                          transition-all duration-300
                          cursor-pointer
                          ${
                            currentSlide === index
                              ? "w-6 bg-white"
                              : "w-1.5 bg-white/50 hover:bg-white/80"
                          }
                        `}
                      />
                    ))}

                  </div>

                  {/* Slide Counter */}
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                    {String(currentSlide + 1).padStart(2, "0")}
                    {" / "}
                    {String(carouselImages.length).padStart(2, "0")}
                  </div>

                </div>
              </div>
            </div>

            {/* ==========================================
                HERO TEXT
            ========================================== */}

            <div className="flex flex-col gap-4 lg:w-1/2">

              <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">
                Welcome to the Portal
              </span>

              <h3 className="text-3xl md:text-5xl font-black text-[#1B3022] tracking-tight leading-tight">
                About Karachi University Herbarium
                <br />
                
              </h3>

              <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-2">
                The Karachi University Herbarium (KUH) at the
                Centre for Plant Conservation serves as a valuable
                repository of plant specimens, playing a vital
                role in research, education, and conservation.
                <br /><br />
                In line with modern practices and to ensure the
                long-term preservation and accessibility of these
                specimens, it has become essential to digitize
                our herbarium collections.
              </p>

            </div>

          </div>
        </section>

        {/* ==========================================
            AIMS & SCOPE SECTION
        ========================================== */}

        <section className="mb-16">

          {/* Section Heading */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B3022] tracking-tight">
              Aims & Scope
            </h2>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {aimsAndScope.map((item) => (

              <div
                key={item.title}
                className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col"
              >

                {/* Icon & Title Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-emerald-800 bg-emerald-50 w-10 h-10 flex items-center justify-center rounded-xl">
                    <span className="material-symbols-outlined text-xl">
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1B3022]">
                    {item.title}
                  </h3>
                </div>

                {/* Divider Line */}
                <div className="w-full h-[1px] bg-gray-100 mb-6"></div>

                {/* List */}
                <ul className="flex flex-col gap-3.5 text-gray-600 text-sm">

                  {item.items.map((listItem, index) => (

                    <li
                      key={index}
                      className="flex items-center gap-3"
                    >
                      <span className="material-symbols-outlined text-emerald-700 text-base">
                        check
                      </span>
                      <span>{listItem}</span>
                    </li>

                  ))}

                </ul>

              </div>

            ))}

          </div>
        </section>

        {/* ==========================================
            DIGITIZATION TEAM SECTION
        ========================================== */}

        <section className="mb-20">

          {/* Section Heading */}
          <div className="mb-8 flex justify-between items-end border-b border-gray-200 pb-6">

            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1B3022] tracking-tight">
                Digitization Team
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                The minds behind the Digital Herbarium
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">
                groups
              </span>
            </div>

          </div>

          {/* ==========================================
              TEAM MEMBERS GRID
          ========================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {teamMembers.map((member) => (

              <div
                key={member.name}
                className="bg-white flex flex-col items-center text-center p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow"
              >

                {/* Initials Badge Circle */}
                <div className="size-20 mb-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-lg tracking-wider">
                  {member.initials}
                </div>

                {/* Member Name */}
                <h4 className="font-bold text-[#1B3022] text-base leading-tight">
                  {member.name}
                </h4>

                {/* Member Role */}
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mt-1.5">
                  {member.role}
                </p>

              </div>

            ))}

          </div>
        </section>

      </main>

  

    </div>
  );
};

export default AboutPage;