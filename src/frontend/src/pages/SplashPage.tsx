import { useNavigate } from "@tanstack/react-router";
import { Waves } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

export function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({ to: "/auth" });
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-navy">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <img
              src="/assets/generated/ocean-hair-logo-transparent.dim_200x200.png"
              alt="Ocean Hair Logo"
              className="w-28 h-28 object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center"
        >
          <h1 className="font-display text-4xl font-bold text-white tracking-widest">
            OCEAN HAIR
          </h1>
          <p className="text-gold-light text-sm mt-2 tracking-wide font-light">
            Connecting Hair Vendors &amp; Manufacturers
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex gap-1.5 mt-4"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-gold/60"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      <div className="absolute bottom-8 text-white/30 text-xs">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          caffeine.ai
        </a>
      </div>
    </div>
  );
}
