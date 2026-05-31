const ChartLogo = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect x="4" y="28" width="8" height="16" rx="2" fill="#2563eb" />
    <rect x="16" y="20" width="8" height="24" rx="2" fill="#3b82f6" />
    <rect x="28" y="12" width="8" height="32" rx="2" fill="#1d4ed8" />
    <path d="M8 26 L22 14 L34 18 L42 8" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M36 8 H42 V14" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FeatureItem = ({ icon, title, description, color, delay = 0 }) => (
  <div
    className="flex gap-3 animate-fade-in-up opacity-0"
    style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
  >
    <div
      className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center transition-smooth hover:scale-110 ${
        color === "green" ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
      }`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm font-bold text-slate-800 leading-tight">{title}</p>
      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
    </div>
  </div>
);

const studentFeatures = [
  {
    title: "Track Placement Journey",
    description: "Stay updated on drives, shortlists and interview progress.",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: "Prepare Smarter",
    description: "Access resources, aptitude tests and interview tips.",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: "Profile & Skill Showcase",
    description: "Highlight skills, certifications and achievements.",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: "Stay Notified",
    description: "Get real-time updates and important announcements.",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
];

const recruiterFeatures = [
  {
    title: "Manage Drives Efficiently",
    description: "Create, schedule and manage placement drives seamlessly.",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Find the Right Talent",
    description: "Search, filter and shortlist candidates with ease.",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
    ),
  },
  {
    title: "Track Performance",
    description: "Evaluate candidates and track drive analytics.",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Centralized Dashboard",
    description: "Everything you need in one place for better hiring decisions.",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
];

const LoginPromoPanel = () => {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 bg-white overflow-hidden">
      {/* Background wave accents */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-80 -translate-y-1/3 translate-x-1/4 animate-float-soft" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-70 translate-y-1/3 -translate-x-1/4 animate-float-soft animation-delay-500" />

      <div className="relative z-10 flex flex-col justify-center px-10 xl:px-14 py-12 w-full max-w-2xl mx-auto">
        {/* Logo & brand */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in-left">
          <div className="animate-float-soft">
            <ChartLogo />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900 tracking-wide leading-none">SMART</p>
            <p className="text-xs font-semibold text-blue-500 tracking-[0.2em] mt-0.5">PLACEMENT TRACKER</p>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight animate-fade-in-up animation-delay-100">
          <span className="text-slate-900">Connecting Talent</span>
          <br />
          <span className="text-blue-600">with Opportunity</span>
        </h1>

        <div className="h-1 bg-blue-500 rounded-full mt-5 mb-3 animate-expand-width" />
        <p className="text-slate-600 font-medium text-base mb-10 animate-fade-in-up animation-delay-300">
          Track. Prepare. Place. Succeed.
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Students */}
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/80 to-white p-5 shadow-sm hover-lift animate-scale-in animation-delay-400">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-blue-600 tracking-wide">FOR STUDENTS</span>
            </div>
            <div className="space-y-4">
              {studentFeatures.map((f, i) => (
                <FeatureItem key={f.title} {...f} color="blue" delay={500 + i * 80} />
              ))}
            </div>
          </div>

          {/* Recruiters */}
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50/80 to-white p-5 shadow-sm hover-lift animate-scale-in animation-delay-500">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-emerald-600 tracking-wide">FOR RECRUITERS</span>
            </div>
            <div className="space-y-4">
              {recruiterFeatures.map((f, i) => (
                <FeatureItem key={f.title} {...f} color="green" delay={600 + i * 80} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPromoPanel;
