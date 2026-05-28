"use client";
import { motion } from 'framer-motion'
import {
  SendIcon,
  SearchIcon,
} from 'lucide-react'
export function FinalCTA() {
  const MotionDiv = motion.div as any
  const MotionA = motion.a as any

  return (
    <section
      id="track"
      className="relative py-20 lg:py-25 overflow-hidden bg-slate-950"
    >
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=2000&q=80"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-18"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#172554] via-slate-950/95 to-[#1e3a8a]/92" />
      </div>

      {/* Animated glow blobs - optimized for performance */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#2563eb]/40 rounded-full blur-[90px] -translate-x-1/2 transform-gpu" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-sky-500/30 rounded-full blur-[100px] translate-x-1/2 transform-gpu" />

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <MotionDiv
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: '-80px',
          }}
          transition={{
            duration: 0.7,
          }}
          className="relative rounded-3xl overflow-hidden border border-white/15 bg-white/[0.05] backdrop-blur-md shadow-2xl shadow-ntc-950/50 will-change-transform transform-gpu"
        >
          <div className="h-1.5 bg-gradient-to-r from-[#3b82f6] via-sky-400 to-[#2563eb]" />

          <div className="px-8 md:px-16 py-14 md:py-20 text-center">
              <MotionDiv
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.15,
              }}
            >
            </MotionDiv>

              <MotionDiv
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.3,
              }}
              className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-[1.05] tracking-tight"
            >
              Take the first step toward{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93c5fd] to-sky-300">
                public service
              </span>
              .
            </MotionDiv>

            <MotionDiv
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.3,
              }}
              className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Submit your application to begin your internship journey at the
              National Telecommunications Commission — or track an application
              you've already sent in.
            </MotionDiv>

            <MotionDiv
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.4,
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
            >
              <MotionA
                href="/apply"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#1e40af] px-8 py-4 rounded-xl font-bold hover:bg-[#eff6ff] hover:shadow-2xl hover:shadow-white/20 transition-all active:scale-95 text-lg"
              >
                <SendIcon className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                Submit Application
              </MotionA>
              <MotionA
                href="/track"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 text-white border border-white/25 backdrop-blur-md px-8 py-4 rounded-xl font-semibold hover:bg-white/15 hover:border-white/40 transition-all active:scale-95 text-lg"
              >
                <SearchIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
                Track Application
              </MotionA>
            </MotionDiv>

            <MotionDiv
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.5,
              }}
            >
            </MotionDiv>
          </div>
        </MotionDiv>
      </div>
    </section>
  )
}
function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-slate-100">
      <span className="text-[#bfdbfe]">{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  )
}
