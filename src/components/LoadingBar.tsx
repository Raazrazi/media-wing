import { motion } from "framer-motion";

export default function LoadingBar() {
  return (
    <motion.div
      className="h-2 rounded-full bg-[#E2AC2C]"
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{
        duration: 5,
        ease: "linear",
      }}
    />
  );
}
<motion.div
  className="h-2 rounded-full bg-[#E2AC2C]"
  initial={{ width: 0 }}
  animate={{ width: "100%" }}
  transition={{
    duration: 5,
    ease: "linear",
  }}
/>