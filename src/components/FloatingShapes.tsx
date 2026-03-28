import { motion } from "framer-motion";

export default function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large rotating hexagon */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-full h-full border border-primary/10 rounded-[40%]" />
      </motion.div>

      {/* Medium counter-rotating shape */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px]"
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-full h-full border border-primary/8 rounded-[30%]" />
      </motion.div>

      {/* Small pulsing shape */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px]"
        animate={{ rotate: 180, scale: [1, 1.05, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-full h-full border border-primary/6 rounded-[35%]" />
      </motion.div>

      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-primary/5 rounded-full blur-[120px]" />

      {/* Floating dots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            top: `${20 + i * 12}%`,
            left: `${15 + i * 13}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}
