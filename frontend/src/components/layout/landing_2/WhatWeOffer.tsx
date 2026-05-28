"use client";
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RadioTowerIcon,
  ScaleIcon,
  ShieldCheckIcon,
  UsersIcon,
  GlobeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TargetIcon,
  EyeIcon,
  FileSignatureIcon,
} from 'lucide-react'

const MotionDiv = motion.div as any

export function WhatWeOffer() {
  const [activeTab, setActiveTab] = useState<'mission' | 'vision' | 'mandate'>(
    'mission',
  )
  const carouselRef = useRef<HTMLDivElement>(null)
  const tabs = {
    mission: {
      icon: <TargetIcon className="w-5 h-5" />,
      title: 'Our Mission',
      body: 'To regulate and supervise the provision of public telecommunications services in the Philippines — ensuring quality, affordability, and accessibility for every Filipino while promoting fair competition and consumer welfare.',
    },
    vision: {
      icon: <EyeIcon className="w-5 h-5" />,
      title: 'Our Vision',
      body: 'A world-class regulator that empowers the Filipino people through inclusive, reliable, and innovative telecommunications and broadcast services — connecting communities and driving national progress.',
    },
    mandate: {
      icon: <FileSignatureIcon className="w-5 h-5" />,
      title: 'Our Mandate',
      body: 'Established by Executive Order No. 546, the NTC is the sole body that exercises jurisdiction over the supervision, adjudication, and control of all telecommunications services and broadcast networks throughout the country.',
    },
  }
  const functions = [
    {
      icon: <RadioTowerIcon className="w-6 h-6" />,
      title: 'Frequency Management',
      description:
        'Allocates and regulates the radio frequency spectrum used by telecom operators, broadcasters, and other licensed entities.',
      accent: 'from-[#2563eb] to-[#1e40af]',
    },
    {
      icon: <ScaleIcon className="w-6 h-6" />,
      title: 'Regulation & Adjudication',
      description:
        'Issues licenses, sets quality standards, and resolves disputes between operators, consumers, and stakeholders.',
      accent: 'from-sky-500 to-[#2563eb]',
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: 'Consumer Protection',
      description:
        'Safeguards subscriber rights and ensures fair pricing, billing transparency, and reliable service delivery.',
      accent: 'from-emerald-500 to-teal-600',
    },
    {
      icon: <UsersIcon className="w-6 h-6" />,
      title: 'Public Service',
      description:
        'Bridges government and citizens by ensuring telecom services are accessible, especially in underserved areas.',
      accent: 'from-indigo-500 to-purple-600',
    },
    {
      icon: <GlobeIcon className="w-6 h-6" />,
      title: 'Global Coordination',
      description:
        'Represents the Philippines in international telecom bodies like the ITU and ASEAN regulatory forums.',
      accent: 'from-rose-500 to-red-600',
    },
  ]
  const scroll = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return
    const amount = carouselRef.current.offsetWidth * 0.8
    carouselRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }
  return (
    <section
      id="opportunities"
      className="py-24 bg-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* ====== ABOUT / WHAT IS NTC ====== */}
        <div
          id="about"
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24"
        >
          <MotionDiv
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-ntc-900/20">
              <img
                src="/landing_2/WhatWeOffer2.png"
                alt="What we offer"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#172554]/70 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/40">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-extrabold text-[#1d4ed8]">
                      45+
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Years of Service
                    </div>
                  </div>
                  <div className="border-x border-slate-200">
                    <div className="text-2xl font-extrabold text-[#1d4ed8]">
                      15
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Regional Offices
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-[#1d4ed8]">
                      1M+
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Filipinos Served
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <MotionDiv
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 bg-[#1d4ed8] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 will-change-transform transform-gpu"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <RadioTowerIcon className="w-5 h-5" />
              <span className="font-semibold text-sm">Est. 1979</span>
            </MotionDiv>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eff6ff] text-[#1d4ed8] text-sm font-semibold mb-5 border border-[#dbeafe]">
              About the Agency
            </div>

              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
              What is the <span className="text-[#1d4ed8]">NTC?</span>
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              The{' '}
              <strong className="text-slate-900">
                National Telecommunications Commission
              </strong>{' '}
              is the primary government agency tasked with regulating,
              supervising, and adjudicating all telecommunications and broadcast
              services in the Philippines — keeping the nation connected,
              informed, and protected.
            </p>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2 flex gap-1 mb-6">
              {(Object.keys(tabs) as Array<keyof typeof tabs>).map((key) => {
                const isActive = activeTab === key
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-white text-[#1d4ed8] shadow-md shadow-ntc-100' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {tabs[key].icon}
                    <span className="hidden sm:inline">
                      {tabs[key].title.replace('Our ', '')}
                    </span>
                  </button>
                )
              })}
            </div>

            <AnimatePresence mode="wait">
              <MotionDiv
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-gradient-to-br from-[#eff6ff] to-white border border-[#dbeafe] rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-[#1d4ed8] mb-2">
                  {tabs[activeTab].title}
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {tabs[activeTab].body}
                </p>
              </MotionDiv>
            </AnimatePresence>
          </MotionDiv>
        </div>

        {/* ====== KEY FUNCTIONS CAROUSEL ====== */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eff6ff] text-[#1d4ed8] text-sm font-semibold mb-4 border border-[#dbeafe]">
              Key Functions
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
              What we do for the Philippines
            </h2>
          </MotionDiv>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              aria-label="Previous"
              className="w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-[#1d4ed8] hover:text-white hover:border-[#1d4ed8] transition-all active:scale-95"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Next"
              className="w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-[#1d4ed8] hover:text-white hover:border-[#1d4ed8] transition-all active:scale-95"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative -mx-6 px-6">
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {functions.map((fn, i) => (
              <MotionDiv
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="snap-start shrink-0 w-[300px] md:w-[340px] bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 hover:border-slate-200 transition-all duration-300 group relative overflow-hidden hover:-translate-y-1 will-change-transform transform-gpu"
              >
                <div
                  className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${fn.accent} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                <div
                  className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${fn.accent} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {fn.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
                  {fn.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {fn.description}
                </p>
              </MotionDiv>
            ))}
            <div className="shrink-0 w-2" />
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes float {
          0%, 100% { transform: translateY(-6px); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </section>
  )
}
