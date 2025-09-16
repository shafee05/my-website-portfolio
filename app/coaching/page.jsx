"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from "../lib/supabaseClient";
import dynamic from 'next/dynamic';

// Dynamically import without SSR
const CoachingPage = dynamic(() => import('./CoachingPage'), { ssr: false });

export default function Page() {
  return <CoachingPage />;
}

// === Constants ===
const PRICE_INR = 99;
const PRICE_IN_PAISE = PRICE_INR * 100;
const BOOKING_DURATION_MS = 86_400_000; // 24 hours

/**
 * Save booking to Supabase
 */
const saveBooking = async (formData) => {
  const bookedUntil = new Date(Date.now() + BOOKING_DURATION_MS).toISOString();

  const { data, error } = await supabase.from("bookings").insert([
    {
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      slot_time: formData.session,
      booked_until: bookedUntil,
    },
  ]);

  if (error) {
    console.error("❌ Supabase insert error:", error.message);
    return false;
  }

  console.log("✅ Booking saved:", data);
  return true;
};

/**
 * Fetch only currently active bookings
 */
const fetchBookedSlots = async (setBookedSlots) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("slot_time, booked_until");

  if (error) {
    console.error("❌ Error fetching bookings:", error);
    return;
  }

  const slotsFromDB = {};
  const now = new Date();

  data.forEach((record) => {
    if (record.booked_until && new Date(record.booked_until) > now) {
      let slotNumber;
      if (record.slot_time.startsWith('6:00')) slotNumber = 1;
      else if (record.slot_time.startsWith('7:20')) slotNumber = 2;
      else if (record.slot_time.startsWith('8:40')) slotNumber = 3;

      if (slotNumber) {
        slotsFromDB[slotNumber] = true;
      }
    }
  });

  setBookedSlots(slotsFromDB);
};

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
        {/* Gold Border Glow */}
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
              className="w-full bg-gradient-to-r from-gold-300 to-yellow-500 text-gray-900 py-4 px-6 rounded-xl font-bold text-lg shadow-glow hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
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

  // Lazy load Razorpay
  const loadAndInitRazorpay = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve();

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.id = 'razorpay-script';
      script.async = true;

      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Razorpay SDK failed to load'));

      document.body.appendChild(script);
    });
  };

  const openPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

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

  const handlePay = async () => {
    if (!validateForm()) return;

    try {
      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)
        throw new Error('Razorpay key missing');

      await loadAndInitRazorpay();

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slot: formData.session.startsWith('6:00') ? 1 : formData.session.startsWith('7:20') ? 2 : 3,
          amount: PRICE_IN_PAISE,
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      if (!response.ok) throw new Error('API failed');
      const { orderId } = await response.json();

      const slotNumber = formData.session.startsWith('6:00') ? 1 : formData.session.startsWith('7:20') ? 2 : 3;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: PRICE_IN_PAISE,
        currency: 'INR',
        name: 'Mohammad Shafee Life Coaching',
        description: `Life Coaching • ${formData.session}`,
        order_id: orderId,
        handler: async () => {
          const success = await saveBooking(formData);
          if (success) {
            setBookedSlots(prev => ({ ...prev, [slotNumber]: true }));
            closePaymentModal();
            alert('🎉 Success! Your session is confirmed for 24 hours.');
          } else {
            alert('⚠️ Booking saved but failed to confirm. Contact support.');
          }
        },
        prefill: { name: formData.fullName, email: formData.email, contact: formData.phone },
        theme: { color: '#D4AF37' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (res) => alert('❌ Failed: ' + res.error.description));
      rzp.open();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  useEffect(() => {
    import('aos').then(AOS => AOS.init({ duration: 1000, once: true }));
    import('feather-icons').then(feather => feather.replace());
    document.documentElement.classList.add('dark');

    const handleScroll = () => setShowStickyCTA(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);

    fetchBookedSlots(setBookedSlots);

    // Real-time updates
    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookings' },
        () => fetchBookedSlots(setBookedSlots)
      )
      .subscribe();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Hero Section - Now Fully Visible */}
      <section className="relative py-40 bg-gradient-to-br from-indigo-950 via-gray-950 to-black text-center overflow-hidden">
        {/* Subtle overlay for better contrast */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Decorative SVG Background */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <circle cx="200" cy="200" r="120" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.3" />
            <circle cx="200" cy="200" r="80" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.6" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10" data-aos="fade-up">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 font-freight text-white drop-shadow-2xl leading-tight">
            Life Coach
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-3xl max-w-3xl mx-auto mb-10 text-white/95 leading-relaxed drop-shadow-lg">
            Transform your life with personalized guidance from Mohammad Shafee Ur Rahaman
          </p>

          {/* Primary Button */}
          <Link
      href="#payment"
      className="inline-block bg-gradient-to-r from-gold-300 to-yellow-500 text-white py-4 px-10 rounded-full font-bold text-lg shadow-glow hover:shadow-2xl transform hover:scale-110 transition-all duration-300 tracking-wide"
    >
      Book Your Session
    </Link>
        </div>
      </section>

      {/* About */}
      <section className="py-24 bg-black/50">
        <div className="container mx-auto px-6" data-aos="fade-up">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/3">
              <div className="relative">
                <Image
                  src="/images/portfolio-headshot.png"
                  alt="Mohammad Shafee"
                  width={300}
                  height={300}
                  className="rounded-full object-cover border-4 border-gold-300 shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-gold-300 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                  <i data-feather="award" className="text-gray-900 w-8 h-8"></i>
                </div>
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-5xl font-bold mb-8 text-white font-freight">Purposeful Growth</h2>
              <p className="text-xl text-gray-200 mb-6 leading-relaxed">
                Every person has a story waiting to unfold. As a dedicated life coach, I help you uncover clarity, build confidence, and navigate challenges with calm strength.
              </p>
              <p className="text-xl text-gray-200 leading-relaxed">
                My approach blends empathy, structure, and real-world tools to guide you toward lasting personal transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-gray-950">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold mb-16 text-center text-white font-freight" data-aos="fade-up">
            What I Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: "target", title: "Life Skills", desc: "Build resilience, discipline, and emotional intelligence." },
              { icon: "briefcase", title: "Career Clarity", desc: "Align your work with purpose and long-term vision." },
              { icon: "heart", title: "Emotional Balance", desc: "Heal inner noise and find peace in uncertainty." },
              { icon: "trending-up", title: "Growth Mindset", desc: "Transform setbacks into stepping stones." },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-gray-800/70 p-8 rounded-2xl border border-gray-700 hover:border-gold-400/50 transition-all duration-300 transform hover:-translate-y-2"
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
      <section className="py-24 bg-black/40">
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
                  onSessionClick={(time) => {
                    setFormData(p => ({ ...p, session: time }));
                    openPaymentModal();
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-24 bg-gray-950">
        <div className="container mx-auto px-6" data-aos="fade-up">
          <h2 className="text-5xl font-bold mb-8 text-center text-white font-freight">Real Impact</h2>
          <p className="text-2xl text-gray-300 text-center mb-16 max-w-4xl mx-auto">
            Coaching isn’t magic — it’s conversation that leads to change.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { num: '92%', label: 'found mental clarity' },
              { num: '85%', label: 'made bold decisions' },
              { num: '78%', label: 'reduced anxiety' },
              { num: '100%', label: 'felt deeply heard' },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-green-900/40 to-transparent p-7 rounded-2xl border border-green-500/30 text-center hover:border-green-400/50 transition"
              >
                <div className="text-5xl font-extrabold text-gold-200 mb-2">{stat.num}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-gray-800/60 rounded-2xl p-10 border border-gray-700 max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold text-white mb-6">Small Shifts, Big Changes</h3>
            <div className="space-y-4 text-gray-300">
              <p><span className="text-gold-300">💬</span> “I finally made the career move I feared for years.”</p>
              <p><span className="text-gold-300">💬</span> “For the first time, I feel peace about my future.”</p>
              <p className="text-sm text-gray-400 mt-6">
                * Feedback from real clients. Identities protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-black/50">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold mb-16 text-center text-white font-freight" data-aos="fade-up">
            Voices of Change
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { q: "Sessions gave me clarity in chaos.", a: "A Journey Begins" },
              { q: "Practical tools changed how I think.", a: "Mind Transformed" },
              { q: "Progress in 3 sessions > months alone.", a: "Breakthrough Achieved" },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-gray-800/70 p-8 rounded-2xl border border-gray-700"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} data-feather="star" className="text-yellow-400 w-5 h-5 mr-1"></i>
                  ))}
                </div>
                <p className="text-gray-200 italic mb-4">"{t.q}"</p>
                <p className="text-gold-300 font-medium">— {t.a}</p>
              </div>
            ))}
          </div>
        </div>
        <div ref={() => import('feather-icons').then(f => f.replace())} style={{ display: 'none' }} />
      </section>

      {/* Payment */}
      <section id="payment" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-950"></div>
        <div className="absolute inset-0 opacity-15">
          <div className="w-full h-full bg-gradient-radial from-gold-300/30 via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10" data-aos="zoom-in">
          <h2 className="text-5xl font-bold mb-6 text-center text-white font-freight">Invest in Yourself</h2>
          <p className="text-2xl text-gray-300 text-center mb-16 max-w-2xl mx-auto leading-relaxed">
            One hour today can change your tomorrow. This isn’t just a session — it’s a step forward.
          </p>

          <div className="max-w-md mx-auto">
            <div className="relative bg-gradient-to-br from-yellow-600 via-yellow-700 to-yellow-800 text-white rounded-3xl shadow-2xl border-2 border-gold-400 overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              <div className="p-10 relative z-10">

                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-3xl font-bold font-freight">One-on-One Coaching</h3>
                    <p className="text-yellow-100">60 Minutes • Virtual</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-6xl font-black">₹99</span>
                    <span className="block text-sm line-through text-yellow-200">₹199</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 text-yellow-100">
                  <li className="flex items-center gap-3">
                    <i data-feather="check-circle" className="w-6 h-6 text-green-100"></i>
                    Personalized attention
                  </li>
                  <li className="flex items-center gap-3">
                    <i data-feather="check-circle" className="w-6 h-6 text-green-100"></i>
                    Clarity on goals & emotions
                  </li>
                  <li className="flex items-center gap-3">
                    <i data-feather="check-circle" className="w-6 h-6 text-green-100"></i>
                    Tools for lasting growth
                  </li>
                </ul>

                <button
                  onClick={openPaymentModal}
                  className="w-full bg-black/40 backdrop-blur-md hover:bg-black/50 text-yellow-50 py-5 px-6 rounded-2xl font-bold text-lg shadow-glow transform transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <i data-feather="calendar" className="w-6 h-6"></i>
                  Reserve My Spot
                </button>

                <p className="text-center text-yellow-200 text-sm mt-4">
                  ⏳ Only 25 spots at this price
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
            style={{
              boxShadow: '0 0 30px rgba(212, 175, 55, 0.8)',
              fontWeight: 'bold',
            }}
          >

            <i data-feather="star" className="w-5 h-5"></i>
            Book Now
          </button>
        </div>
      </section>

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
        .drop-shadow-2xl {
          text-shadow: 0 25px 25px rgba(0, 0, 0, 0.5);
        }
        .drop-shadow-lg {
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
        }
        .bg-clip-text { background-clip: text; }
        .from-white { --tw-gradient-from: #FFFFFF; }
        .via-gold-100 { --tw-gradient-via: #fffbeb; }
        .to-yellow-200 { --tw-gradient-to: #fde68a; }
      `}</style>
    </div>
  );
}