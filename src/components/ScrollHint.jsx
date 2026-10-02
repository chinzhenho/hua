import { motion } from 'framer-motion'

// A thin line that quietly draws downward — "keep going".
export default function ScrollHint({ className = '', delay = 0 }) {
  return (
    <motion.div
      className={`flex justify-center pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, delay }}
      aria-hidden="true"
    >
      <div className="h-10 w-px bg-[#C98B8F]/60 scroll-hint" />
    </motion.div>
  )
}
