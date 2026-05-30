import PageHeader from "../ui/PageHeader";
import StatusBadge from "../ui/StatusBadge";
import { studentDashboardData } from "@tempData";

const Interviews = () => {
  const { interviews } = studentDashboardData;

  return (
    <div>
      <PageHeader title="Interview Schedule" subtitle="Track your upcoming and completed interview rounds" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {interviews.map((interview, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{interview.company}</h3>
                <p className="text-sm text-gray-500 mt-1">{interview.round}</p>
              </div>
              <StatusBadge status={interview.status} />
            </div>
            <div className="mt-4 flex gap-4 text-sm text-gray-600">
              <span>📅 {interview.date}</span>
              <span>🕐 {interview.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Interviews;
