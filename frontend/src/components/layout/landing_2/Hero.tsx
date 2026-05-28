"use client";
import { motion } from 'framer-motion'
import {
  ArrowRightIcon,
  SignalIcon,
  ShieldCheckIcon,
  GraduationCapIcon,
  BuildingIcon,
} from 'lucide-react'
export function Hero() {
  const MotionDiv = motion.div as any
  const MotionH1 = motion.h1 as any
  const MotionP = motion.p as any
  const MotionA = motion.a as any

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }
  return (
    <section
      id="home"
      className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden min-h-screen flex items-center bg-[#1d4ed8]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#1d4ed8] via-[#1e40af] to-[#172554]" />

      <div className="absolute inset-0">
        <img
          src="/landing_2/Hero.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1d4ed8]/55 via-[#1e40af]/65 to-[#172554]/80" />
      </div>

      {/* Animated glows */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-[#3b82f6]/30 rounded-full blur-[80px] transform-gpu" />
      <div className="absolute bottom-0 -right-20 w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-[100px] transform-gpu" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <MotionDiv
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <MotionDiv
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-semibold mb-6 border border-white/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#bfdbfe]"></span>
              </span>
              OJT & Internship Portal · HR Department
            </MotionDiv>

            <MotionH1
              variants={itemVariants}
              className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6"
            >
              Start Your Internship Journey in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bfdbfe] to-sky-200">
                Public Service
              </span>
            </MotionH1>

            <MotionP
              variants={itemVariants}
              className="text-lg lg:text-xl text-[#dbeafe] mb-10 leading-relaxed max-w-xl"
            >
              Discover meaningful opportunities at the National
              Telecommunications Commission. Inquire first about our programs,
              requirements, and processes — no pressure to apply right away.
            </MotionP>

            <MotionDiv
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#1d4ed8] px-8 py-4 rounded-xl font-semibold hover:bg-[#eff6ff] hover:shadow-2xl hover:shadow-white/20 transition-all active:scale-95 text-lg"
              >
                Send an Inquiry
                <ArrowRightIcon className="w-5 h-5" />
              </a>
              <a
                href="#process"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/30 backdrop-blur-md px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all active:scale-95 text-lg"
              >
                Learn About the Process
              </a>
            </MotionDiv>
          </MotionDiv>

          <div className="relative hidden lg:block h-[560px]">
            <MotionDiv
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.8,
                delay: 0.3,
              }}
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl shadow-ntc-950/60 border border-white/15"
            >
              <img
                src="/landing_2/Hero_2.png"
                alt="Professionals collaborating in a modern government office"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#172554]/60 via-transparent to-transparent" />
            </MotionDiv>

            <div className="absolute top-[8%] -right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 z-30 shadow-2xl shadow-ntc-950/40 border border-white/40 transform-gpu">
              <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
                <SignalIcon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-slate-800">
                Telecom Tech
              </span>
            </div>

            <div className="absolute bottom-[12%] -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 z-30 shadow-2xl shadow-ntc-950/40 border border-white/40 transform-gpu">
              <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                <GraduationCapIcon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-slate-800">
                Student Learning
              </span>
            </div>

            <div className="absolute top-[42%] -left-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 z-30 shadow-2xl shadow-ntc-950/40 border border-white/40 transform-gpu">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-slate-800">
                Public Service
              </span>
            </div>

            <div className="absolute bottom-[40%] -right-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 z-30 shadow-2xl shadow-ntc-950/40 border border-white/40 transform-gpu">
              <div className="bg-[#dbeafe] p-2 rounded-lg text-[#1d4ed8]">
                <BuildingIcon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-slate-800">
                Gov Agency
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
