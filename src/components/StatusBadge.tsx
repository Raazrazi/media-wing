interface StatusBadgeProps {
  status:
    | "Pending"
    | "Approved"
    | "Rejected"
    | "Completed"
    | "On Hold";
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const styles = {
    Pending:
      "bg-yellow-100 text-yellow-800 border-yellow-200",

    Approved:
      "bg-green-100 text-green-800 border-green-200",

    Rejected:
      "bg-red-100 text-red-800 border-red-200",

    Completed:
      "bg-blue-100 text-blue-800 border-blue-200",

    "On Hold":
      "bg-purple-100 text-purple-800 border-purple-200",
  };

  return (
    <span
      className={`
        px-3
        py-1
        rounded-full
        text-xs
        font-semibold
        border
        ${styles[status] || styles.Pending}
      `}
    >
      {status}
    </span>
  );
}