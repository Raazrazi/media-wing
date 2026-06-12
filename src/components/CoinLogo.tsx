import { motion } from "framer-motion";

export default function CoinLogo() {
  return (
    <motion.img
      src="/disa-logo.png"
      alt="DISA"
      className="w-48 h-48 object-contain"
      animate={{
        rotateY: 360,
      }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        transformStyle: "preserve-3d",
        filter:
          "drop-shadow(0 0 25px rgba(154,216,192,.4))",
      }}
    />
  );
}