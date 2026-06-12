const statusStyles = {
  // Title-case (display) values
  Placed: "bg-green-100 text-green-700",
  Selected: "bg-green-100 text-green-700",
  Accepted: "bg-green-100 text-green-700",
  Active: "bg-green-100 text-green-700",
  Completed: "bg-green-100 text-green-700",
  Open: "bg-green-100 text-green-700",
  Scheduled: "bg-blue-100 text-blue-700",
  Shortlisted: "bg-blue-100 text-blue-700",
  Applied: "bg-sky-100 text-sky-700",
  Hold: "bg-amber-100 text-amber-700",
  "In Process": "bg-amber-100 text-amber-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Upcoming: "bg-purple-100 text-purple-700",
  Pending: "bg-yellow-100 text-yellow-700",
  "Not Placed": "bg-red-100 text-red-700",
  "Not Selected": "bg-red-100 text-red-700",
  Rejected: "bg-red-100 text-red-700",
  Closed: "bg-gray-100 text-gray-600",
  Expired: "bg-gray-100 text-gray-500",
  Inactive: "bg-gray-100 text-gray-600",
  // Uppercase raw DB values
  SELECTED: "bg-green-100 text-green-700",
  APPLIED: "bg-sky-100 text-sky-700",
  HOLD: "bg-amber-100 text-amber-700",
  REJECTED: "bg-red-100 text-red-700",
  OPEN: "bg-green-100 text-green-700",
  CLOSED: "bg-gray-100 text-gray-600",
  EXPIRED: "bg-gray-100 text-gray-500",
};

const STATUS_LABELS = {
  SELECTED: "Accepted",
};

const StatusBadge = ({ status }) => {
  const label = STATUS_LABELS[status] || status;
  const style = statusStyles[status] || "bg-gray-100 text-gray-700";

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
