const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 hover-lift transition-smooth ${className}`}>
    <h3 className="text-base font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

export default ChartCard;
