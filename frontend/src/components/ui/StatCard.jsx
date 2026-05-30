const StatCard = ({ title, value, icon, trend, color = "blue" }) => {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    indigo: "from-indigo-500 to-indigo-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 mt-2 font-medium">{trend}</p>
          )}
        </div>
        {icon && (
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white text-lg shrink-0`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
