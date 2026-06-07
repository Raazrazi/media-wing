import type { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
}

export default function DashboardCard({
  title,
  value,
  icon,
  color = "bg-blue-600",
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div
          className={`${color} text-white p-3 rounded-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}