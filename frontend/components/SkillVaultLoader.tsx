import { motion } from "framer-motion";

interface SkillVaultLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

const SkillVaultLoader = ({
  message = "Loading...",
  size = "md",
  fullScreen = false,
}: SkillVaultLoaderProps) => {
  const sizes = {
    sm: { ring: 40, dot: 6, text: "text-xs" },
    md: { ring: 64, dot: 8, text: "text-sm" },
    lg: { ring: 96, dot: 10, text: "text-base" },
  };

  const s = sizes[size];

  const container = fullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-radial-void"
    : "flex flex-col items-center justify-center py-12";

  return (
    <div className={container}>
      {/* Orbital ring animation */}
      <div className="relative" style={{ width: s.ring, height: s.ring }}>
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "2px solid hsl(var(--primary) / 0.15)",
            boxShadow: "0 0 30px hsl(var(--primary) / 0.1)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Primary spinning arc */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "2px solid transparent",
            borderTopColor: "hsl(var(--primary))",
            borderRightColor: "hsl(var(--primary) / 0.4)",
            filter: "drop-shadow(0 0 6px hsl(var(--primary) / 0.6))",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />

        {/* Secondary spinning arc (opposite direction) */}
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: 6,
            border: "2px solid transparent",
            borderBottomColor: "hsl(var(--secondary))",
            borderLeftColor: "hsl(var(--secondary) / 0.3)",
            filter: "drop-shadow(0 0 6px hsl(var(--secondary) / 0.5))",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        />

        {/* Center pulsing core */}
        <motion.div
          className="absolute rounded-full bg-primary"
          style={{
            width: s.dot,
            height: s.dot,
            top: "50%",
            left: "50%",
            marginTop: -s.dot / 2,
            marginLeft: -s.dot / 2,
            boxShadow:
              "0 0 12px hsl(var(--primary) / 0.8), 0 0 24px hsl(var(--primary) / 0.4)",
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Orbiting dots */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background:
                i === 0
                  ? "hsl(var(--primary))"
                  : i === 1
                  ? "hsl(var(--secondary))"
                  : "hsl(var(--primary) / 0.6)",
              top: "50%",
              left: "50%",
              marginTop: -2,
              marginLeft: -2,
              boxShadow: `0 0 8px ${
                i === 0
                  ? "hsl(var(--primary) / 0.8)"
                  : i === 1
                  ? "hsl(var(--secondary) / 0.8)"
                  : "hsl(var(--primary) / 0.5)"
              }`,
            }}
            animate={{
              x: [
                Math.cos((i * 2 * Math.PI) / 3) * (s.ring / 2 - 4),
                Math.cos((i * 2 * Math.PI) / 3 + Math.PI) * (s.ring / 2 - 4),
                Math.cos((i * 2 * Math.PI) / 3 + 2 * Math.PI) *
                  (s.ring / 2 - 4),
              ],
              y: [
                Math.sin((i * 2 * Math.PI) / 3) * (s.ring / 2 - 4),
                Math.sin((i * 2 * Math.PI) / 3 + Math.PI) * (s.ring / 2 - 4),
                Math.sin((i * 2 * Math.PI) / 3 + 2 * Math.PI) *
                  (s.ring / 2 - 4),
              ],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Brand text */}
      {message && (
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className={`${s.text} text-muted-foreground font-medium`}>
            {message}
          </p>
          <motion.div
            className="flex justify-center gap-1 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary/60"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SkillVaultLoader;
