// Apple-style easing curves and animation configurations
export const easings = {
  appleEase: [0.25, 1, 0.5, 1] as const,
  smoothEase: [0.4, 0, 0.2, 1] as const,
  gentle: [0.25, 0.46, 0.45, 0.94] as const,
  snappy: [0.175, 0.885, 0.32, 1.275] as const,
};

export const transitions = {
  smooth: { duration: 0.4, ease: easings.smoothEase },
  smoother: { duration: 0.6, ease: easings.smoothEase },
  smoothest: { duration: 0.8, ease: easings.smoothEase },
  default: { duration: 0.3, ease: "easeInOut" },
  gentle: { duration: 0.5, ease: easings.gentle },
};

export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: transitions.smoother,
};

export const fadeTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: transitions.smooth,
};

export const slideInTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: transitions.smoother,
};

export const scaleTransition = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: transitions.smooth,
};
