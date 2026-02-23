import { useState, useEffect } from 'react';
import { Sparkles, MapPin, Zap, Globe, Star, ArrowRight, Check } from 'lucide-react';

const FEATURES = [
  {
    icon: <Sparkles size={24} />,
    title: "AI-Powered Itineraries",
    desc: "Generate personalized day-by-day travel plans in seconds, tailored to your interests, budget, and travel style.",
  },
  {
    icon: <MapPin size={24} />,
    title: "Interactive Maps",
    desc: "Visualize your entire trip on an interactive map with all recommended places, hotels, and routes.",
  },
  {
    icon: <Zap size={24} />,
    title: "Real-Time Adaptation",
    desc: "Your plan adjusts dynamically to your preferences. Refine and regenerate with a single click.",
  },
  {
    icon: <Globe size={24} />,
    title: "190+ Countries",
    desc: "From Tokyo to Tuscany, our AI has deep knowledge of destinations worldwide.",
  },
];

const STATS = [
  { value: "2M+", label: "Trips Planned" },
  { value: "190+", label: "Countries" },
  { value: "4.9★", label: "Rating" },
  { value: "98%", label: "Satisfaction" },
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Frequent Traveler",
    text: "ThinkSpots AI planned our 3-week Japan trip in under 10 minutes. Every recommendation was spot-on.",
    avatar: "SC",
  },
  {
    name: "Marcus Reid",
    role: "Business Traveler",
    text: "I use it for every work trip. It understands I need efficient routes and great restaurants near venues.",
    avatar: "MR",
  },
  {
    name: "Priya Anand",
    role: "Family Vacationer",
    text: "Finally an AI that understood we were traveling with kids. It thought of everything, including rest stops!",
    avatar: "PA",
  },
];

const PLANS = [
  { name: "Free", price: "$0", features: ["3 itineraries/month", "Basic map view", "PDF export"], highlight: false },
  { name: "Pro", price: "$9", features: ["Unlimited itineraries", "Interactive maps", "Hotel recommendations", "Priority support"], highlight: true },
  { name: "Team", price: "$29", features: ["Everything in Pro", "5 team members", "Shared plans", "Advanced analytics"], highlight: false },
];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .navbar-custom {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          padding: 12px 40px;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.3s ease;
          background: ${scrolled ? 'rgba(255,255,255,0.97)' : 'transparent'};
          backdrop-filter: ${scrolled ? 'blur(10px)' : 'none'};
          box-shadow: ${scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none'};
        }
        .nav-link {
          font-size: 14px; font-weight: 500; text-decoration: none;
          color: ${scrolled ? '#555' : 'rgba(255,255,255,0.85)'};
          transition: color 0.2s;
        }
        .nav-link:hover { color: ${scrolled ? '#667eea' : '#fff'}; }

        .btn-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none; color: white; font-weight: 600;
          padding: 10px 24px; border-radius: 10px; cursor: pointer;
          text-decoration: none; font-size: 14px;
          transition: all 0.3s ease; display: inline-block;
        }
        .btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4); color: white;
        }
        .btn-white {
          background: white; border: none; color: #667eea; font-weight: 700;
          padding: 14px 36px; border-radius: 12px; cursor: pointer;
          text-decoration: none; font-size: 16px;
          transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .btn-outline-white {
          background: transparent; border: 2px solid white; color: white; font-weight: 600;
          padding: 14px 36px; border-radius: 12px; cursor: pointer;
          text-decoration: none; font-size: 16px;
          transition: all 0.3s ease; display: inline-block;
        }
        .btn-outline-white:hover { background: white; color: #667eea; }

        .hero-section {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex; align-items: center; justify-content: center;
          text-align: center; padding: 100px 24px 60px;
          position: relative; overflow: hidden;
        }
        .hero-section::before {
          content: ''; position: absolute;
          width: 600px; height: 600px; border-radius: 50%;
          background: rgba(255,255,255,0.05);
          right: -200px; top: -200px;
        }
        .hero-section::after {
          content: ''; position: absolute;
          width: 400px; height: 400px; border-radius: 50%;
          background: rgba(255,255,255,0.04);
          left: -100px; bottom: -100px;
        }

        .feature-card {
          background: white; border-radius: 16px; padding: 32px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          border: 1px solid rgba(102,126,234,0.1);
          transition: all 0.3s ease; height: 100%;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(102,126,234,0.15);
          border-color: rgba(102,126,234,0.3);
        }
        .icon-box {
          width: 56px; height: 56px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, rgba(102,126,234,0.12) 0%, rgba(118,75,162,0.12) 100%);
          color: #667eea; margin-bottom: 16px;
        }

        .testimonial-card {
          background: white; border-radius: 16px; padding: 28px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          border: 1px solid #f0f0f0;
          transition: all 0.3s ease; height: 100%;
        }
        .testimonial-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }

        .avatar {
          width: 44px; height: 44px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 13px; color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          flex-shrink: 0;
        }

        .plan-card {
          background: white; border-radius: 16px; padding: 32px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          border: 2px solid transparent;
          transition: all 0.3s ease; height: 100%;
          position: relative;
        }
        .plan-card:hover { transform: translateY(-4px); }
        .plan-card.highlight { border-color: #667eea; }
        .plan-badge {
          position: absolute; top: -13px; left: 50%; transform: translateX(-50%);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; font-size: 10px; font-weight: 700;
          padding: 4px 14px; border-radius: 20px;
          letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap;
        }
        .btn-plan-primary {
          width: 100%; padding: 12px; border-radius: 10px; border: none; cursor: pointer;
          font-weight: 600; font-size: 15px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;
          transition: all 0.3s; text-decoration: none; display: block; text-align: center;
        }
        .btn-plan-primary:hover { box-shadow: 0 6px 16px rgba(102,126,234,0.4); color: white; }
        .btn-plan-outline {
          width: 100%; padding: 12px; border-radius: 10px; border: 2px solid #dee2e6; cursor: pointer;
          font-weight: 600; font-size: 15px; background: transparent; color: #555;
          transition: all 0.3s; text-decoration: none; display: block; text-align: center;
        }
        .btn-plan-outline:hover { border-color: #667eea; color: #667eea; }

        .check-icon { color: #667eea; flex-shrink: 0; }
        .badge-pill {
          display: inline-block; padding: 5px 14px; border-radius: 20px;
          background: rgba(102,126,234,0.1); color: #667eea;
          font-size: 12px; font-weight: 600; margin-bottom: 12px;
        }
        section { scroll-margin-top: 80px; }
        .section-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        .section-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        @media (max-width: 768px) {
          .section-grid-2 { grid-template-columns: 1fr; }
          .section-grid-3 { grid-template-columns: 1fr; }
          .navbar-custom { padding: 12px 20px; }
          .hide-mobile { display: none !important; }
        }
        .stats-row {
          display: grid; grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(255,255,255,0.2); margin-top: 40px; padding-top: 32px;
          text-align: center;
        }
        .stats-row > div { border-right: 1px solid rgba(255,255,255,0.2); padding: 8px; }
        .stats-row > div:last-child { border-right: none; }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar-custom">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="p-2 rounded-3 gradient-bg" style={{ padding: 8, borderRadius: 10 }}>
            <Sparkles className="text-white" size={18} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: scrolled ? '#1a1a2e' : 'white' }}>ThinkSpots AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#features" className="nav-link hide-mobile">Features</a>
          <a href="#how" className="nav-link hide-mobile">How It Works</a>
          <a href="#pricing" className="nav-link hide-mobile">Pricing</a>
          <a href="/login" className="nav-link">Sign In</a>
          <a href="/register" className="btn-gradient">Get Started</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div style={{ maxWidth: 660, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '8px 18px', borderRadius: 30, fontSize: 13, fontWeight: 500, color: 'white', marginBottom: 24 }}>
            <Sparkles size={14} /> AI-Powered Travel Planning
          </div>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 24 }}>
            Your Perfect Trip,<br />Planned by AI
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', marginBottom: 40, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.7, fontWeight: 300 }}>
            Tell us where you want to go. ThinkSpots AI generates personalized itineraries with interactive maps in seconds.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/register" className="btn-white">Plan My Trip <ArrowRight size={16} /></a>
            <a href="#how" className="btn-outline-white">See How It Works</a>
          </div>
          <div className="stats-row">
            {STATS.map((s) => (
              <div key={s.label}>
                <div style={{ fontWeight: 800, fontSize: 26, color: 'white' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ background: '#f8f9ff', padding: '80px 40px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge-pill">Features</div>
            <h2 style={{ fontWeight: 800, fontSize: 36, marginBottom: 12 }}>Everything You Need to <span className="gradient-text">Travel Smarter</span></h2>
            <p style={{ color: '#6c757d', maxWidth: 480, margin: '0 auto' }}>From AI itineraries to real-time maps, we've got your journey covered end to end.</p>
          </div>
          <div className="section-grid-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="icon-box">{f.icon}</div>
                <h5 style={{ fontWeight: 700, marginBottom: 10 }}>{f.title}</h5>
                <p style={{ color: '#6c757d', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ background: 'white', padding: '80px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div className="badge-pill">Process</div>
          <h2 style={{ fontWeight: 800, fontSize: 36, marginBottom: 56 }}>Plan a Trip in <span className="gradient-text">3 Simple Steps</span></h2>
          <div className="section-grid-3">
            {[
              { num: '01', title: 'Enter Your Details', desc: 'Tell us your destination, dates, number of days, and travel interests.' },
              { num: '02', title: 'AI Builds Your Plan', desc: 'Our AI generates a full itinerary with daily activities, places, and tips.' },
              { num: '03', title: 'Explore the Map', desc: 'See all your spots on an interactive map. Save, export, or refine your plan.' },
            ].map((step) => (
              <div key={step.num}>
                <div className="gradient-bg" style={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'white', fontWeight: 800, fontSize: 20 }}>
                  {step.num}
                </div>
                <h5 style={{ fontWeight: 700, marginBottom: 10 }}>{step.title}</h5>
                <p style={{ color: '#6c757d', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ background: '#f8f9ff', padding: '80px 40px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge-pill">Reviews</div>
            <h2 style={{ fontWeight: 800, fontSize: 36 }}>Loved by <span className="gradient-text">Travelers Worldwide</span></h2>
          </div>
          <div className="section-grid-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#667eea" color="#667eea" />)}
                </div>
                <p style={{ color: '#555', lineHeight: 1.75, fontStyle: 'italic', marginBottom: 24 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar">{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: '#999', fontSize: 12 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ background: 'white', padding: '80px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge-pill">Pricing</div>
            <h2 style={{ fontWeight: 800, fontSize: 36, marginBottom: 8 }}>Simple, <span className="gradient-text">Transparent Pricing</span></h2>
            <p style={{ color: '#6c757d' }}>Start free. Upgrade when you're ready.</p>
          </div>
          <div className="section-grid-3">
            {PLANS.map((p) => (
              <div key={p.name} className={`plan-card ${p.highlight ? 'highlight' : ''}`}>
                {p.highlight && <div className="plan-badge">Most Popular</div>}
                <h5 style={{ fontWeight: 700, marginBottom: 4 }}>{p.name}</h5>
                <div style={{ marginBottom: 24 }}>
                  <span className="gradient-text" style={{ fontSize: 42, fontWeight: 800 }}>{p.price}</span>
                  <span style={{ color: '#999', fontSize: 14 }}>/mo</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                  {p.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Check size={15} className="check-icon" />
                      <span style={{ fontSize: 14, color: '#444' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="/register" className={p.highlight ? 'btn-plan-primary' : 'btn-plan-outline'}>Get Started</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-bg" style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div className="gradient-bg" style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Sparkles size={36} color="white" />
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 40, color: 'white', marginBottom: 16 }}>Ready to Plan Smarter?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, marginBottom: 40, fontWeight: 300 }}>
            Join 2 million travelers who use ThinkSpots AI to plan unforgettable trips.
          </p>
          <a href="/register" className="btn-white">
            Create Free Account <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#1a1a2e', padding: '28px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ padding: 8, borderRadius: 10, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Sparkles size={16} color="white" />
          </div>
          <span style={{ fontWeight: 700, color: 'white' }}>ThinkSpots AI</span>
        </div>
        <span style={{ fontSize: 13, color: '#666' }}>© 2025 ThinkSpots AI. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Contact'].map((l) => (
            <a key={l} href="#" style={{ color: '#666', fontSize: 13, textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </>
  );
}