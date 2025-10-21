"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// === Constants ===
const PRICE_INR = 99;
const PAYMENT_LINK = 'https://razorpay.me/@mohammadshafeeurrahaman'; // 

// === COMPONENTS ===

function SessionCard({ session, bookedSlots, onSessionClick }) {
  return (
    <div
      className="slot-container bg-gray-800/80 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      data-aos="fade-up"
      data-aos-delay={session.id * 100}
    >
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-4 text-white">{session.label}</h3>
        <p className="text-lg mb-6 text-gold-300 font-medium">{session.time}</p>
        <div className="relative">
          <button
            id={`slot${session.id}`}
            onClick={() => !bookedSlots[session.id] && onSessionClick(session.time)}
            disabled={bookedSlots[session.id]}
            aria-disabled={bookedSlots[session.id]}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
              bookedSlots[session.id]
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-700 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-500 transform hover:scale-105'
            }`}
          >
            {bookedSlots[session.id] ? 'Booked' : 'Reserve This Slot'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ isOpen, onClose, formData, setFormData, handlePay, formErrors }) {
  if (!isOpen) return null;

  return (
    <div
      id="paymentModal"
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-gray-900 border border-gold-400 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative"
        data-aos="zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
          background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.2), transparent 70%)',
        }}></div>

        <div className="flex justify-between items-center mb-6">
          <h3 id="modal-title" className="text-2xl font-bold text-white font-freight">Secure Your Session</h3>
          <button
            onClick={onClose}
            aria-label="Close payment modal"
            className="text-gray-400 hover:text-white transition"
          >
            <i data-feather="x" className="w-6 h-6"></i>
          </button>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="fullName" className="block text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
            {formErrors.fullName && (
              <p className="text-red-400 text-sm mt-1" role="alert">{formErrors.fullName}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
            {formErrors.email && (
              <p className="text-red-400 text-sm mt-1" role="alert">{formErrors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-gray-300 mb-2">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
            {formErrors.phone && (
              <p className="text-red-400 text-sm mt-1" role="alert">{formErrors.phone}</p>
            )}
          </div>
          <div>
            <label htmlFor="session" className="block text-gray-300 mb-2">Select Session</label>
            <select
              id="session"
              name="session"
              value={formData.session}
              onChange={(e) => setFormData({ ...formData, session: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              <option>6:00 PM - 7:00 PM</option>
              <option>7:20 PM - 8:20 PM</option>
              <option>8:40 PM - 9:40 PM</option>
            </select>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={handlePay}
              className="w-full bg-gradient-to-r from-gold-300 to-yellow-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-glow hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <i data-feather="credit-card" className="w-5 h-5"></i>
              Pay ₹{PRICE_INR} Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CoachingPage() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    session: '6:00 PM - 7:00 PM',
  });
  const [bookedSlots, setBookedSlots] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const paymentSectionRef = useRef(null);

  const openPaymentModal = () => setIsPaymentModalOpen(true);
  const closePaymentModal = () => setIsPaymentModalOpen(false);

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone)) errors.phone = 'Must be 10 digits';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePay = () => {
    if (!validateForm()) return;
    const slotNumber = formData.session.startsWith('6:00') ? 1 : 
                      formData.session.startsWith('7:20') ? 2 : 3;
    setBookedSlots(prev => ({ ...prev, [slotNumber]: true }));
    closePaymentModal();
    window.open(PAYMENT_LINK, '_blank', 'noopener,noreferrer');
  };

  const scrollToPayment = (sessionTime) => {
    setFormData(prev => ({ ...prev, session: sessionTime }));
    paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    import('aos').then(AOS => AOS.init({ duration: 1000, once: true }));
    import('feather-icons').then(feather => feather.replace());
    document.documentElement.classList.add('dark');
    const handleScroll = () => setShowStickyCTA(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative py-40 bg-gradient-to-br from-indigo-950 via-gray-950 to-black text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <circle cx="200" cy="200" r="120" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.3" />
            <circle cx="200" cy="200" r="80" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.6" />
          </svg>
        </div>
        <div className="container mx-auto px-6 relative z-10" data-aos="fade-up">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 font-freight text-white drop-shadow-lg">
            Purpose-Driven Coaching
          </h1>
          <p className="text-2xl md:text-3xl max-w-3xl mx-auto mb-10 text-white leading-relaxed drop-shadow-md">
            Discover your Definite Major Purpose. Transform fear into action. Build a life you’re proud to leave as your legacy.
          </p>
          <Link
            href="#payment"
            className="inline-block bg-gradient-to-r from-gold-300 to-yellow-500 text-white py-4 px-10 rounded-full font-bold text-lg shadow-glow hover:shadow-2xl transform hover:scale-110 transition-all duration-300 tracking-wide"
          >
            Begin Your Journey
          </Link>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 bg-black/50">
        <div className="container mx-auto px-6" data-aos="fade-up">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/3">
              <div className="relative">
                <Image
                  src="/images/portfolio-headshot.png"
                  alt="Mohammad Shafee Ur Rahaman"
                  width={300}
                  height={300}
                  className="rounded-full object-cover border-4 border-gold-300 shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-yellow-400 to-gold-500 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                  <i data-feather="award" className="text-white w-8 h-8"></i>
                </div>
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-5xl font-bold mb-8 text-white font-freight">Clarity Through Coaching</h2>
              <p className="text-xl text-gray-200 mb-6 leading-relaxed">
                I believe every person carries a <strong>Definite Major Purpose (DMP)</strong>—work they’d do even if unpaid, a legacy they’re meant to leave. My role isn’t to give answers, but to help you uncover yours.
              </p>
              <p className="text-xl text-gray-200 leading-relaxed">
                Using proven frameworks in goal-setting, fear-facing, and mindset development, I guide you from confusion to confident action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Framework */}
      <section className="py-24 bg-gray-950">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold mb-16 text-center text-white font-freight" data-aos="fade-up">
            My Coaching Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Discover Your DMP", desc: "Clarify your passion, values, and legacy through guided reflection." },
              { step: "2", title: "Set Aligned Goals", desc: "Create SMART goals rooted in your purpose—not external pressure." },
              { step: "3", title: "Face Limiting Fears", desc: "Identify and move through fear using structured, compassionate inquiry." },
              { step: "4", title: "Take Committed Action", desc: "Build accountability, track progress, and celebrate micro-wins." },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-gray-800/70 p-8 rounded-2xl border border-gray-700 hover:border-gold-400/50 transition-all duration-300 text-center"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="text-4xl font-bold text-gold-300 mb-4">{s.step}</div>
                <h3 className="text-2xl font-bold mb-3 text-white">{s.title}</h3>
                <p className="text-gray-300 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-24 bg-black/40">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold mb-16 text-center text-white font-freight" data-aos="fade-up">
            Areas I Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: "briefcase", title: "Career Transitions", desc: "Navigate job changes, burnout, or purposeless work with clarity." },
              { icon: "heart", title: "Confidence & Self-Belief", desc: "Silence your inner critic and build unshakable self-worth." },
              { icon: "users", title: "Relationship Clarity", desc: "Set boundaries, improve communication, and honor your needs." },
              { icon: "target", title: "Goal Achievement", desc: "Turn dreams into actionable plans with accountability." },
              { icon: "zap", title: "Overcoming Fear", desc: "Move through fear of failure, success, or judgment." },
              { icon: "book", title: "Life Reorganization", desc: "For empty-nesters, retirees, or those seeking renewed direction." },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-gray-800/70 p-8 rounded-2xl border border-gray-700 hover:border-gold-400/50 transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <i data-feather={s.icon} className="text-gold-300 w-10 h-10 mb-5"></i>
                <h3 className="text-2xl font-bold mb-4 text-white">{s.title}</h3>
                <p className="text-gray-300 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div ref={() => import('feather-icons').then(f => f.replace())} style={{ display: 'none' }} />
      </section>

      {/* Sessions */}
      <section className="py-24 bg-gray-950">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold mb-16 text-center text-white font-freight" data-aos="fade-up">
            Choose Your Session
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1, 2, 3].map(id => {
              const sessions = {
                1: { time: '6:00 PM - 7:00 PM', label: 'Evening Focus' },
                2: { time: '7:20 PM - 8:20 PM', label: 'Prime Time' },
                3: { time: '8:40 PM - 9:40 PM', label: 'Night Reflection' },
              };
              return (
                <SessionCard
                  key={id}
                  session={{ id, ...sessions[id] }}
                  bookedSlots={bookedSlots}
                  onSessionClick={scrollToPayment}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-24 bg-black/50">
        <div className="container mx-auto px-6" data-aos="fade-up">
          <h2 className="text-5xl font-bold mb-8 text-center text-white font-freight">Real Transformation</h2>
          <p className="text-2xl text-gray-300 text-center mb-16 max-w-4xl mx-auto">
            Coaching is the mirror that helps you see your own strength.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { num: '92%', label: 'gained clarity on their DMP' },
              { num: '88%', label: 'took bold action within 2 weeks' },
              { num: '81%', label: 'reduced self-doubt significantly' },
              { num: '100%', label: 'felt deeply seen and heard' },
            ].map((stat, i) => (
              <div key={i} className="bg-gradient-to-br from-green-900/40 to-transparent p-7 rounded-2xl border border-green-500/30 text-center hover:border-green-400/50 transition">
                <div className="text-5xl font-extrabold text-gold-200 mb-2">{stat.num}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-10 border border-gray-700 max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold text-white mb-6">Client Insights</h3>
            <div className="space-y-4 text-gray-300">
              <p><span className="text-gold-300">💬</span> “I finally understood what I’m here to do.”</p>
              <p><span className="text-gold-300">💬</span> “Fear no longer runs my decisions.”</p>
              <p className="text-sm text-gray-400 mt-6">* Identities protected. Real feedback from coaching sessions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment */}
      <section id="payment" ref={paymentSectionRef} className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-950"></div>
        <div className="absolute inset-0 opacity-15">
          <div className="w-full h-full bg-gradient-radial from-gold-300/30 via-transparent to-transparent"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10" data-aos="zoom-in">
          <h2 className="text-5xl font-bold mb-6 text-center text-white font-freight">Invest in Your Purpose</h2>
          <p className="text-2xl text-gray-300 text-center mb-12 max-w-2xl mx-auto leading-relaxed">
            One session can shift your trajectory. This is more than coaching—it’s a commitment to your highest self.
          </p>
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-gray-800/70 p-6 rounded-2xl border border-gray-700 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <i data-feather="info" className="w-5 h-5 text-gold-300"></i>
                How to Book
              </h3>
              <ul className="list-disc list-inside text-gray-300 text-sm space-y-2">
                <li>Select your time slot below.</li>
                <li>Complete payment of ₹99 via Razorpay.</li>
                <li><strong>Include your slot number (1, 2, or 3) in the payment note.</strong></li>
                <li>You’ll receive a confirmation and session link within 24 hours.</li>
              </ul>
            </div>
          </div>
          <div className="max-w-md mx-auto">
            <div className="relative bg-gradient-to-br from-yellow-600 via-yellow-700 to-yellow-800 text-white rounded-3xl shadow-2xl border-2 border-gold-400 overflow-hidden hover:scale-[1.02] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              <div className="p-10 relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-3xl font-bold font-freight">One-on-One Coaching</h3>
                    <p className="text-yellow-100">60 Minutes • Virtual • Confidential</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-6xl font-black">₹99</span>
                    <span className="block text-sm line-through text-yellow-200">₹199</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8 text-yellow-100">
                  <li className="flex items-center gap-3"><i data-feather="check-circle" className="w-6 h-6 text-green-100"></i> Active listening & powerful questioning</li>
                  <li className="flex items-center gap-3"><i data-feather="check-circle" className="w-6 h-6 text-green-100"></i> DMP & goal alignment</li>
                  <li className="flex items-center gap-3"><i data-feather="check-circle" className="w-6 h-6 text-green-100"></i> Fear-facing & mindset tools</li>
                </ul>
                <button
                  onClick={openPaymentModal}
                  className="w-full bg-black/40 backdrop-blur-md hover:bg-black/50 text-yellow-50 py-5 px-6 rounded-2xl font-bold text-lg shadow-glow transform transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <i data-feather="calendar" className="w-6 h-6"></i>
                  Reserve My Session
                </button>
                <p className="text-center text-yellow-200 text-sm mt-4">⏳ Limited introductory spots</p>
                <p className="text-center text-yellow-100 text-sm mt-2 font-medium">
                  <i data-feather="alert-circle" className="w-4 h-4 inline-block mr-1"></i>
                  Include slot number in Razorpay note
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky CTA */}
        <div
          className={`fixed bottom-5 right-5 z-50 transition-all duration-500 transform ${
            showStickyCTA ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={openPaymentModal}
            className="bg-gradient-to-r from-gold-300 to-yellow-500 text-white py-4 px-8 rounded-full font-bold shadow-glow hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center gap-2 text-lg"
            style={{ boxShadow: '0 0 30px rgba(212, 175, 55, 0.8)' }}
          >
            <i data-feather="star" className="w-5 h-5"></i>
            Book Now
          </button>
        </div>
      </section>

      {/* Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        formData={formData}
        setFormData={setFormData}
        handlePay={handlePay}
        formErrors={formErrors}
      />

      {/* Global Styles */}
      <style jsx>{`
        .bg-gray-950 { background-color: #0a0a0a; }
        .bg-black\\/50 { background-color: rgba(0,0,0,0.5); }
        .text-gold-300 { color: #D4AF37; }
        .border-gold-400 { border-color: #C7A008; }
        .font-freight { font-family: 'Freight', serif; }
        .shadow-glow { box-shadow: 0 0 30px rgba(212, 175, 55, 0.7); }
        .bg-gradient-radial { background: radial-gradient(circle at center, #D4AF37, transparent 70%); }
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 3s infinite linear;
        }
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        .drop-shadow-lg { text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6); }
      `}</style>
    </div>
  );
}