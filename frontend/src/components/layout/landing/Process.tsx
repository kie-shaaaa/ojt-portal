"use client";
import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  FileTextIcon,
  UserCheckIcon,
  UsersIcon,
  CheckCircleIcon,
  SparklesIcon,
} from 'lucide-react'

type Step = {
  title: string
  description: string
  icon: ReactNode
}

const MotionDiv = motion.div as any
const MotionPath = motion.path as any

const steps: Step[] = [
  {
    title: 'Submit Application',
    description:
      'Fill out the online application form and upload your medical certificate, proof of enrollment, CV/resume, and 1x1 picture.',
    icon: <FileTextIcon className="w-6 h-6" />,
  },
  {
    title: 'Evaluation',
    description:
      'We review your profile to match you with the right division.',
    icon: <UserCheckIcon className="w-6 h-6" />,
  },
  {
    title: 'Interview',
    description:
      'A brief, friendly conversation to align expectations and goals.',
    icon: <UsersIcon className="w-6 h-6" />,
  },
  {
    title: 'Confirmation',
    description:
      'Receive your official acceptance, schedule, and starting date.',
    icon: <CheckCircleIcon className="w-6 h-6" />,
  },
  {
    title: 'Orientation',
    description:
      'Meet your team, learn the ropes, and begin your internship journey.',
    icon: <SparklesIcon className="w-6 h-6" />,
  },
]

export function Process() {
  const containerRef = useRef<any>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 40%'],
  })
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section
      id="process"
      ref={containerRef}
      className="py-20 lg:py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eff6ff] text-[#1d4ed8] text-sm font-semibold mb-4 border border-[#dbeafe] animate-[fadeUp_0.6s_ease-out_both]">
            Your Roadmap
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight animate-[fadeUp_0.6s_ease-out_0.1s_both]">
            A Simple Path from{' '}
            <span className="text-[#1d4ed8]">Inquiry to Internship</span>
          </h2>
          <p className="text-lg text-slate-600 animate-[fadeUp_0.6s_ease-out_0.2s_both]">
            Five clear steps. Take it at your own pace — we'll be here at every
            turn.
          </p>
        </div>

        <div className="hidden lg:block relative">
          <RoadmapDesktop steps={steps} pathLength={pathLength} />
        </div>

        <div className="lg:hidden">
          <RoadmapMobile steps={steps} />
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes growLine {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </section>
  )
}

function RoadmapDesktop({
  steps,
  pathLength,
}: {
  steps: Step[]
  pathLength: any
}) {
  const stepPositions = [
    { x: 150, y: 200, side: 'below' as const },
    { x: 500, y: 320, side: 'above' as const },
    { x: 850, y: 220, side: 'below' as const },
    { x: 500, y: 560, side: 'below' as const },
    { x: 1010, y: 680, side: 'above' as const },
  ]

  const pathD = buildSmoothPath(stepPositions)

  return (
    <div className="relative w-full" style={{ aspectRatio: '1200/900' }}>
      <svg
        viewBox="0 0 1200 900"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient
            id="roadmapGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>

        <path
          d={pathD}
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="3"
          strokeDasharray="8 8"
          strokeLinecap="round"
        />

        <MotionPath
          d={pathD}
          fill="none"
          stroke="url(#roadmapGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          style={{ pathLength }}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {steps.map((step, i) => {
        const pos = stepPositions[i]
        const xPercent = (pos.x / 1200) * 100
        const yPercent = (pos.y / 900) * 100

        return (
          <RoadmapNode
            key={i}
            step={step}
            index={i}
            xPercent={xPercent}
            yPercent={yPercent}
            side={pos.side}
          />
        )
      })}
    </div>
  )
}

function RoadmapNode({
  step,
  index,
  xPercent,
  yPercent,
  side,
}: {
  step: Step
  index: number
  xPercent: number
  yPercent: number
  side: 'above' | 'below'
}) {
  return (
    <MotionDiv
      className="absolute"
      style={{
        left: `${xPercent}%`,
        top: `${yPercent}%`,
        transform: 'translate(-50%, -50%)',
        animationDelay: `${index * 0.1}s`,
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative group">
        <div className="absolute -inset-3 rounded-full bg-[#60a5fa]/30 blur-md opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="w-20 h-20 rounded-full bg-white border-4 border-slate-200 shadow-xl shadow-ntc-200/40 flex items-center justify-center relative z-10 text-[#1d4ed8] transition-transform duration-300 group-hover:scale-105 group-hover:border-[#bfdbfe]">
          {step.icon}
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center text-xs font-bold border-2 border-white">
            {index + 1}
          </div>
        </div>
      </div>

      <div
        className={`absolute left-1/2 -translate-x-1/2 w-72 ${side === 'below' ? 'top-full mt-5' : 'bottom-full mb-5'}`}
      >
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/60 border border-slate-100 text-center">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {step.title}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    </MotionDiv>
  )
}

function RoadmapMobile({ steps }: { steps: Step[] }) {
  return (
    <div className="relative pl-8 space-y-10">
      <div className="absolute top-4 bottom-4 left-[2.25rem] w-[3px] bg-slate-200 rounded-full -translate-x-1/2 overflow-hidden">
        <MotionDiv
          initial={{ height: 0 }}
          whileInView={{ height: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
          className="w-full h-full bg-gradient-to-b from-[#1d4ed8] via-[#3b82f6] to-sky-400 rounded-full will-change-transform"
          style={{ backfaceVisibility: 'hidden' }}
        />
      </div>

      {steps.map((step, i) => (
        <MotionDiv
          key={i}
          className="relative pl-10"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-white border-4 border-[#dbeafe] shadow-md flex items-center justify-center text-[#1d4ed8] -translate-x-1/2 z-10">
            {step.icon}
          </div>
          <div className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm">
            <div className="text-xs font-bold text-[#2563eb] uppercase tracking-wider mb-1">
              Step {i + 1}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {step.title}
            </h3>
            <p className="text-base text-slate-600 leading-relaxed">
              {step.description}
            </p>
          </div>
        </MotionDiv>
      ))}
    </div>
  )
}

function buildSmoothPath(
  points: {
    x: number
    y: number
  }[],
) {
  if (points.length < 2) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const midX = (p0.x + p1.x) / 2
    d += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`
  }
  return d
}

      
