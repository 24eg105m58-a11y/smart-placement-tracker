import PageHeader from "./ui/PageHeader";
import { studentDashboardData } from "@tempData";

const Notifications = () => {
  const { notifications } = studentDashboardData;

  return (
    <div>
      <PageHeader title="Notifications" subtitle="Stay updated on drives, interviews, and selections" />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 sm:p-5 flex gap-4 ${n.read ? "" : "bg-blue-50/50"}`}
          >
            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.read ? "bg-gray-300" : "bg-blue-600"}`} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{n.title}</p>
              <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
              <p className="text-xs text-gray-400 mt-2">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
