import { motion } from 'framer-motion'

const MotionDiv = motion.div as any

export function AnimatedBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <MotionDiv
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[-10%] left-[-5%] w-[50vw] max-w-[600px] h-[50vw] max-h-[600px] rounded-full bg-ntc-300/20 blur-[80px] will-change-transform"
        style={{ backfaceVisibility: 'hidden' }}
      />
      <MotionDiv
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-[20%] right-[-10%] w-[40vw] max-w-[500px] h-[40vw] max-h-[500px] rounded-full bg-sky-300/20 blur-[80px] will-change-transform"
        style={{ backfaceVisibility: 'hidden' }}
      />
      <MotionDiv
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
        className="absolute bottom-[-10%] left-[20%] w-[45vw] max-w-[550px] h-[45vw] max-h-[550px] rounded-full bg-indigo-300/15 blur-[80px] will-change-transform"
        style={{ backfaceVisibility: 'hidden' }}
      />
    </div>
  )
}
