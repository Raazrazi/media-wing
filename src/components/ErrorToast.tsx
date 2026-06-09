import { useEffect } from "react";

interface ErrorToastProps {
  message: string;
  onClose: () => void;
  durationMs?: number;
}

export default function ErrorToast({ message, onClose, durationMs = 5000 }: ErrorToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [onClose, durationMs]);

  return (
    <div
      role="alert"
      className="fixed top-4 right-4 bg-rose-100 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in"
    >
      <svg
        className="w-5 h-5 text-rose-600"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.75a.75.75 0 001.5 0V10a.75.75 0 00-1.5 0v3.25zm.75-6a1 1 0 110-2 1 1 0 010 2z"
          clipRule="evenodd"
        />
      </svg>
      <span className="flex-1 text-sm font-medium">{message}</span>
    </div>
  );
}
