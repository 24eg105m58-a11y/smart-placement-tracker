import { Link } from "react-router-dom";

const capabilities = [
  {
    title: "Student Portal",
    color: "from-blue-50 to-white",
    accent: "text-blue-700",
    icon: "🎓",
    points: [
      "Build and upload resumes",
      "Apply for active placement drives",
      "Track interview progress in real time",
      "Receive instant updates and notifications",
    ],
  },
  {
    title: "TPO Dashboard",
    color: "from-emerald-50 to-white",
    accent: "text-emerald-700",
    icon: "🏢",
    points: [
      "Manage student databases",
      "Schedule and coordinate drives",
      "Broadcast alerts and placement metrics",
      "Generate performance reports",
    ],
  },
  {
    title: "Core Analytics",
    color: "from-violet-50 to-white",
    accent: "text-violet-700",
    icon: "📊",
    points: [
      "ATS resume structure verification",
      "Eligibility mapping for students",
      "Smart job opening recommendations",
      "Student skill gap assessment",
    ],
  },
];

// const stats = [
//   { value: "10K+", label: "Students" },
//   { value: "500+", label: "Recruiters" },
//   { value: "1K+", label: "Placement Drives" },
//   { value: "90%", label: "Placement Success" },
// ];

const Home = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_35%),linear-gradient(180deg,#f8fbff_0%,#ffffff_60%)] text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-16 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-cyan-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-6 sm:py-8 lg:px-8">
          <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/60 bg-white/70 px-5 py-4 shadow-[0_20px_60px_-20px_rgba(59,130,246,0.22)] backdrop-blur-xl animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                ✦
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.18em] text-blue-600 uppercase">
                  Smart Placement Tracker
                </p>
                <p className="text-xs text-slate-500">
                  Career Canopy style campus placement suite
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="#capabilities"
                className="hidden sm:inline-flex px-4 py-2 text-sm text-slate-600 hover:text-blue-700 transition-colors"
              >
                Features
              </a>
              <Link
                to="/login"
                className="inline-flex items-center rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-12">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 animate-fade-in-left">
              Smart Training & Placement Tracker
            </span>

            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.03] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl animate-fade-in-up animation-delay-100">
              Build a brighter placement journey.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 animate-fade-in-up animation-delay-200">
              A streamlined platform for students, recruiters, and placement
              officers to manage applications, schedule drives, track interview
              progress, and bring every placement workflow into one calm, modern
              dashboard.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 animate-fade-in-up animation-delay-300">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Get Started <span>→</span>
              </Link>
              <a
                href="#capabilities"
                className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-white px-6 py-3.5 text-sm font-semibold text-blue-700 transition-all hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Explore Features
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-4 text-sm text-slate-500 animate-fade-in-up animation-delay-400">
              {[
                "Live job tracking",
                "Role-based dashboards",
                "Application analytics",
                "Interview scheduling",
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in-right">
            <div className="absolute -left-6 top-10 h-20 w-20 rounded-full bg-violet-200/50 blur-2xl animate-float-soft" />
            <div className="absolute -right-8 top-1/3 h-24 w-24 rounded-full bg-blue-200/60 blur-2xl animate-float-soft animation-delay-300" />

            <div className="relative mx-auto max-w-[640px] rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.28)] backdrop-blur-xl">
              <div className="rounded-[1.4rem] border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Placement Dashboard
                    </p>
                    <p className="text-xs text-slate-500">
                      Overview for students and recruiters
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-medium text-slate-500">
                      Live
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["Total Students", "2,450", "+12.5%"],
                    ["Active Drives", "24", "+8.2%"],
                    ["Applications", "1,230", "+15.3%"],
                    ["Placed", "320", "+10.1%"],
                  ].map(([label, value, delta]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {label}
                      </p>
                      <p className="mt-3 text-2xl font-black text-slate-900">
                        {value}
                      </p>
                      <p className="mt-2 text-xs font-semibold text-emerald-600">
                        {delta}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">
                        Placement Overview
                      </p>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        This Year
                      </span>
                    </div>
                    <div className="flex h-48 items-end gap-3 rounded-xl bg-[linear-gradient(180deg,rgba(59,130,246,0.05),rgba(59,130,246,0.0))] p-3">
                      {[30, 42, 38, 58, 56, 70].map((height, index) => (
                        <div key={index} className="flex-1">
                          <div
                            className="mx-auto w-full max-w-[34px] rounded-t-2xl bg-gradient-to-t from-blue-600 to-indigo-500 shadow-lg shadow-blue-200 transition-all duration-700 hover:-translate-y-1"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">
                      Recent Drives
                    </p>
                    <div className="mt-4 space-y-3">
                      {[
                        ["TCS Digital", "May 24, 2026"],
                        ["Infosys", "May 30, 2026"],
                        ["Wipro", "Jun 05, 2026"],
                      ].map(([name, date]) => (
                        <div
                          key={name}
                          className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {name}
                            </p>
                            <p className="text-xs text-slate-500">
                              Engineering
                            </p>
                          </div>
                          <p className="text-xs font-medium text-slate-500">
                            {date}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="capabilities"
        className="mx-auto max-w-7xl px-6 py-8 lg:px-8"
      >
        <div className="text-center animate-fade-in-up">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-blue-600">
            Platform Capabilities
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Powerful tools for every role
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {capabilities.map((card, index) => (
            <div
              key={card.title}
              className={`rounded-[1.75rem] border border-slate-200 bg-gradient-to-b ${card.color} p-6 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_-28px_rgba(59,130,246,0.28)] animate-fade-in-up animation-delay-${(index + 1) * 100}`}
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm ${card.accent}`}
              >
                {card.icon}
              </div>
              <h3 className={`mt-5 text-2xl font-bold ${card.accent}`}>
                {card.title}
              </h3>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                {card.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-500/70" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 h-28 rounded-2xl border border-white/70 bg-white/70 shadow-inner" />
            </div>
          ))}
        </div>
      </section>

      {/* <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="grid gap-4 rounded-[2rem] border border-blue-100 bg-white p-6 shadow-[0_16px_60px_-28px_rgba(59,130,246,0.25)] sm:grid-cols-4">
          {stats.map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center gap-4 ${index < stats.length - 1 ? "sm:border-r sm:border-slate-100 sm:pr-4" : ""} animate-fade-in-up animation-delay-${(index + 1) * 100}`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 text-xl">
                {index === 0
                  ? "👥"
                  : index === 1
                    ? "🏢"
                    : index === 2
                      ? "💼"
                      : "📈"}
              </div>
              <div>
                <p className="text-2xl font-black text-slate-950">
                  {item.value}
                </p>
                <p className="text-sm text-slate-500">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 pb-16">
        <div className="grid gap-6 overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#eaf2ff_0%,#f8fbff_48%,#ffffff_100%)] p-8 shadow-[0_16px_60px_-28px_rgba(15,23,42,0.22)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-fade-in-left">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-blue-600">
              Building better careers, together.
            </p>
            <h3 className="mt-4 max-w-2xl text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
              One platform for placement teams, students, and recruiters.
            </h3>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Smart Placement Tracker helps campuses simplify placements,
              enhance transparency, and unlock opportunities for every student
              with a crisp, easy-to-use experience.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition-all hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="relative min-h-[220px] animate-fade-in-right">
            <div className="absolute inset-x-8 bottom-2 h-24 rounded-full bg-blue-300/20 blur-3xl" />
            <div className="absolute left-1/2 top-0 h-16 w-16 -translate-x-1/2 rounded-full bg-white/70 shadow-lg shadow-blue-100" />
            <div className="absolute left-10 top-10 h-12 w-12 rounded-2xl bg-emerald-100 shadow-sm" />
            <div className="absolute right-12 top-10 h-12 w-12 rounded-2xl bg-violet-100 shadow-sm" />
            <div className="absolute bottom-0 left-0 right-0 mx-auto h-[170px] max-w-[360px] rounded-[1.75rem] border border-white/70 bg-white/90 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.25)]">
              <div className="absolute inset-x-8 bottom-0 h-20 rounded-t-[2rem] bg-[linear-gradient(180deg,#d8ebff_0%,#b7d7ff_100%)]" />
              <div className="absolute bottom-6 left-10 h-20 w-20 rounded-t-2xl bg-slate-200" />
              <div className="absolute bottom-6 left-32 h-28 w-16 rounded-t-2xl bg-slate-300" />
              <div className="absolute bottom-6 left-56 h-22 w-12 rounded-t-2xl bg-slate-300" />
              <div className="absolute bottom-6 right-10 h-24 w-24 rounded-t-[2rem] bg-slate-200" />
              <div className="absolute bottom-6 left-1/2 h-32 w-20 -translate-x-1/2 rounded-t-[2rem] bg-slate-100 shadow-inner" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
