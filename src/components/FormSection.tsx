import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

export default function FormSection({
  title,
  children,
}: FormSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">

      <h2 className="text-xl font-semibold text-slate-800 mb-6">
        {title}
      </h2>

      {children}

    </div>
  );
}