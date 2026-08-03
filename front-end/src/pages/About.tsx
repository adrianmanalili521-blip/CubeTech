import { Link } from "react-router-dom";

export default function About() {
  // Mock data for company core values
  const values = [
    {
      title: "Cutting-Edge Innovation",
      desc: "We rigorously test and curate only the latest generation gear to keep you ahead of the digital curve.",
    },
    {
      title: "Customer-First Support",
      desc: "Our tech support squad operates around the clock to assist you with setups, specs, and order tracking.",
    },
    {
      title: "Sustainability Focus",
      desc: "From smart energy-saving monitors to eco-friendly packaging materials, we care deeply about our footprint.",
    },
  ];

  // Mock data for leadership team
  const team = [
    {
      name: "Alex Rivera",
      role: "CEO & Co-Founder",
      bio: "Former hardware architect passionate about making next-gen setups globally accessible.",
      initials: "AR",
    },
    {
      name: "Marcus Chen",
      role: "Head of Product",
      bio: "Tech enthusiast who ensures only elite, durable components make it to our store catalog.",
      initials: "MC",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section Banner */}
      <section className="relative bg-black text-white py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-900 px-3 py-1 rounded-md border border-gray-800">
            Welcome to CubeTech
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4">
            Powering Your Digital Ecosystem
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto font-light leading-relaxed">
            We are the ultimate hub for premium gaming rigs, flagship mobile hardware, and minimalist productivity tools.
          </p>
          <div className="mt-8">
            <Link
              to="/shop"
              className="inline-block bg-white text-black text-sm font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-all shadow-md active:scale-[0.98]"
            >
              Explore Our Gear
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Identity / Story Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
              Who We Are
            </h2>
            <p className="text-gray-600 mt-4 leading-relaxed">
              Founded in 2024, CubeTech began with a single mission: to cut through the noise of the consumer electronics market. We noticed how difficult it was for creators, developers, and gamers to find reliable components matched with honest storefront details.
            </p>
            <p className="text-gray-600 mt-3 leading-relaxed">
              Today, we provide a fine-tuned, specialized catalog ranging from high-refresh-rate ASUS monitors to ergonomic Red Dragon accessories. Every piece of equipment hosted on our grid is verified for raw performance metrics, longevity, and ultimate design synergy.
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 flex flex-col justify-center shadow-sm">
            <div className="text-4xl font-extrabold text-black">10K+</div>
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-1">Happy Builders Globally</div>
            
            <div className="text-4xl font-extrabold text-black mt-6">99.4%</div>
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-1">Hardware Reliability Rating</div>
          </div>
        </div>
      </section>

      {/* Core Values Section Layout */}
      <section className="bg-gray-50 border-t border-b border-gray-200/50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center tracking-tight">
            Our Pillars
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
            {values.map((val, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm">
                <div className="h-8 w-8 bg-black text-white rounded-lg flex items-center justify-center font-bold text-sm">
                  0{index + 1}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-4">{val.title}</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership / Team Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center tracking-tight">
          Behind the Cube
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12 max-w-2xl mx-auto">
          {team.map((member, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
              {/* Profile Avatar Placeholder Canvas */}
              <div className="h-16 w-16 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold tracking-wider text-lg shadow-inner">
                {member.initials}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-4">{member.name}</h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-0.5">{member.role}</p>
              <p className="text-sm text-gray-500 mt-3 max-w-xs leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
