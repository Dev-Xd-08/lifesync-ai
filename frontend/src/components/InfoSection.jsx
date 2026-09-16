function InfoSection({
  tag,
  title,
  description,
  points = [],
  reverse = false,
  badgeIcon = "✨",
  cardTitle,
  cardSubtitle,
  cardContent,
}) {
  return (
    <section className="border-t border-slate-100 bg-slate-50/50 px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div
          className={`flex flex-col items-center gap-12 lg:flex-row lg:gap-16 ${
            reverse ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Left / Text Side */}
          <div className="flex-1 text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700 shadow-sm">
              <span>{badgeIcon}</span> {tag}
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              {description}
            </p>

            <ul className="mt-8 space-y-3.5">
              {points.map((point, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-700">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    ✓
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right / Visual Card Side */}
          <div className="w-full flex-1">
            <div className="relative mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl lg:max-w-none">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-semibold text-slate-900">{cardTitle}</h4>
                  <p className="text-xs text-slate-500">{cardSubtitle}</p>
                </div>
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
              </div>

              <div className="rounded-xl bg-slate-50 p-4 font-mono text-sm text-slate-700">
                {cardContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InfoSection;