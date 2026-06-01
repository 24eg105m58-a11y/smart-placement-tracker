const StatCard = ({ title, value, icon, trend, color = "stone" }) => {
  const colors = {
    stone: "from-stone-700 to-stone-900",
    emerald: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
    slate: "from-slate-500 to-slate-700",
    zinc: "from-zinc-600 to-zinc-800",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 hover-lift transition-smooth">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
          <p className="text-xs text-stone-600 mt-2 font-medium">{trend}</p>
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
