import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const appleEase = [0.25, 1, 0.5, 1] as const;
const smoothEase = [0.4, 0, 0.2, 1] as const;  // Gentle Apple-style easing

const windowsOnboardingTexts = [
  "Hi",
  "A new chapter for our union begins here",
  "Assembling the gallery and official bulletin",
  "Keep this tab open—the collective vision is loading",
  "Step inside and explore our world"
];

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing...");
  const [phase, setPhase] = useState<"loading" | "welcome" | "onboarding" | "logoReveal">("loading");
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  const navigate = useNavigate();

  // If the user has already seen the splash, skip straight to home
  useEffect(() => {
    try {
      if (localStorage.getItem("union_seen_splash") === "true") {
        navigate("/home", { replace: true });
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [navigate]);

  // Ref to play the final sequence video smoothly
  const finalVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function loadApplicationData() {
      try {
        setProgress(15);
        setStatusText("Connecting to server...");
        await new Promise((resolve) => setTimeout(resolve, 600));

        setProgress(45);
        setStatusText("Authenticating session...");
        await new Promise((resolve) => setTimeout(resolve, 800));

        setProgress(80);
        setStatusText("Loading your preferences...");
        await new Promise((resolve) => setTimeout(resolve, 500));

        setProgress(100);
        setStatusText("Finalizing setup...");

        setTimeout(() => {
          setPhase("welcome");
        }, 800);
      } catch (error) {
        console.error("Application failed to boot:", error);
        setStatusText("Connection failed. Retrying...");
      }
    }

    loadApplicationData();
  }, [navigate]);

  useEffect(() => {
    if (phase !== "onboarding") return;

    if (onboardingIndex < windowsOnboardingTexts.length) {
      let delay = 2500;
      if (onboardingIndex === 0) delay = 3500;  // "Hi" - first message, longer display
      if (onboardingIndex === 1) delay = 3200;  // "A new chapter..." - second message, longer display

      const timer = setTimeout(() => {
        setOnboardingIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      setPhase("logoReveal");
    }
  }, [phase, onboardingIndex]);

  useEffect(() => {
    if (phase !== "logoReveal") return;

    // Trigger video playback immediately when Phase 4 mounts
    if (finalVideoRef.current) {
      finalVideoRef.current.play().catch((err) => console.log("Video playback paused:", err));
    }

    const timer = setTimeout(() => {
      try {
        localStorage.setItem("union_seen_splash", "true");
      } catch (e) {
        // ignore storage errors
      }
      navigate("/home");
    }, 10500); // 10.5 seconds for elegant, unhurried Apple-style transition

    return () => clearTimeout(timer);
  }, [phase, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">

      {/* Dynamic Background Windows-styled Backlight Glow */}
      <AnimatePresence>
        {(phase === "onboarding" || phase === "logoReveal") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.08),transparent_60%)] pointer-events-none"
            style={{ animation: "pulse 8s ease-in-out infinite" }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* PHASE 1: LOADING */}
        {phase === "loading" && (
          <motion.div
            key="loading-container"
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full"
          >
            <div className="relative mx-auto mb-12 flex h-56 w-56 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 via-sky-400/10 to-blue-500/10 blur-3xl" />
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-slate-950/95 border border-slate-800 shadow-[0_0_120px_rgba(56,189,248,0.18)]">
                <div className="absolute inset-0 rounded-full border border-slate-700/90" />
                <div className="absolute inset-6 rounded-full border-4 border-cyan-500/20" />
                <div className="relative flex h-28 w-28 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-cyan-400/50 border-t-transparent animate-spin" />
                  <div className="absolute inset-5 rounded-full bg-slate-950/90 border border-slate-800" />
                  <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_20px_rgba(56,189,248,0.35)]" />
                </div>
              </div>
            </div>

            <div className="w-full max-w-sm">
              <div className="h-2 overflow-hidden rounded-full bg-slate-800 border border-slate-700">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-400 via-cyan-300 to-amber-300 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut", duration: 0.3 }}
                />
              </div>
              <div className="mt-3 flex justify-between text-xs text-slate-400 uppercase tracking-widest px-1">
                <span>{statusText}</span>
                <span>{progress}%</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* PHASE 2: WELCOME POPUP (Apple Style Scale Burst Exit) */}
        {phase === "welcome" && (
          <motion.div
            key="welcome-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: appleEase }}
            className="w-full max-w-5xl rounded-[2rem] border border-white/10 bg-slate-950/85 p-8 shadow-[0_30px_120px_rgba(15,23,42,0.65)] backdrop-blur-xl z-20"
          >
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">

              {/* Left text block fades and drops down out of frame */}
              <motion.div
                className="space-y-6 text-white"
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.7, ease: smoothEase }}
              >
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Welcome</p>
                <h1 className="text-5xl font-black tracking-tight">Welcome to DISA Portal</h1>
                <p className="max-w-xl text-slate-400 text-base leading-8">
                  You are now signed in to the Union Media & Results Portal. Your dashboard will let you submit requests, explore gallery content, and track live competition standings.
                </p>
                <div className="space-y-4 sm:flex sm:items-center sm:gap-4 sm:space-y-0">
                  <button
                    type="button"
                    onClick={() => setPhase("onboarding")}
                    className="inline-flex items-center justify-center rounded-3xl bg-cyan-500 px-8 py-4 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 cursor-pointer"
                  >
                    Continue to Portal
                  </button>
                </div>
              </motion.div>

              {/* Right container expands exponentially into the background screen view */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  scale: 16,
                  opacity: 0,
                  transition: { duration: 0.8, ease: smoothEase }
                }}
                transition={{ duration: 0.7, ease: appleEase }}
                className="relative mx-auto flex h-72 w-72 items-center justify-center rounded-[2rem] bg-white/5 border border-white/10 shadow-[0_0_80px_rgba(56,189,248,0.12)]"
              >
                <motion.img
                  src="/logo.png"
                  alt="DISA Logo"
                  className="h-40 w-40 rounded-[1.5rem] border border-slate-700 bg-slate-950 p-5"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 to-blue-500/10 blur-2xl" />
              </motion.div>

            </div>
          </motion.div>
        )}

        {/* PHASE 3: WINDOWS ONBOARDING TEXT MESSAGES */}
        {phase === "onboarding" && onboardingIndex < windowsOnboardingTexts.length && (
          <motion.div
            key="onboarding-text-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="flex flex-col items-center justify-center text-center max-w-2xl px-6 z-10 select-none"
          >
            <motion.h2
              // Animate the text specifically when it changes strings
              key={onboardingIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 1.4, ease: smoothEase }}
              className="text-3xl md:text-4xl font-light tracking-wide text-slate-100 font-sans leading-relaxed drop-shadow-sm"
            >
              {windowsOnboardingTexts[onboardingIndex]}
            </motion.h2>
          </motion.div>
        )}
        {/* PHASE 4: FINAL FULL-SCREEN BORDERLESS VIDEO INTEGRATION */}
        {phase === "logoReveal" && (
          <motion.div
            key="final-logo-reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, ease: smoothEase }}
            // Expanded to full screen viewport coverage with all backgrounds, overlays, and ambient glowing backlights completely removed
            className="absolute inset-0 w-full h-full flex items-center justify-center z-10 bg-black overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.8, ease: smoothEase }}
              // Completely strip outer borders, box-shadows, masks, and padding frameworks
              className="w-full h-full flex items-center justify-center border-none outline-none shadow-none bg-transparent p-0 m-0"
            >
              <div className="absolute inset-0 bg-black flex items-center justify-center">
                <video
                  autoPlay
                  muted
                  playsInline
                  className="w-[550px] h-auto object-contain"
                >
                  <source src="/0612.webm" type="video/webm" />
                </video>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}   