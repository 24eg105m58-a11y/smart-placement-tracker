import PageHeader from "../ui/PageHeader";
import StatusBadge from "../ui/StatusBadge";

const interviews = [
  { id: 1, candidate: "Rahul Sharma", drive: "SDE Internship", round: "Technical Interview", date: "2026-06-05", time: "10:00 AM", status: "Scheduled" },
  { id: 2, candidate: "Priya Patel", drive: "SDE Internship", round: "Coding Round", date: "2026-06-06", time: "2:00 PM", status: "Scheduled" },
  { id: 3, candidate: "Ananya Iyer", drive: "Engg Campus Drive", round: "HR Interview", date: "2026-05-28", time: "11:00 AM", status: "Completed" },
];

const RecruiterInterviews = () => {
  return (
    <div>
      <PageHeader
        title="Interviews"
        subtitle="Schedule and manage interview rounds"
        action={
          <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
            + Schedule Interview
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {interviews.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{item.candidate}</h3>
              <StatusBadge status={item.status} />
            </div>
            <p className="text-sm text-gray-500">{item.drive}</p>
            <p className="text-sm font-medium text-blue-600 mt-2">{item.round}</p>
            <div className="mt-4 flex gap-4 text-sm text-gray-600">
              <span>📅 {item.date}</span>
              <span>🕐 {item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterInterviews;
