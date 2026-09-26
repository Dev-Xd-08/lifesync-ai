function FeatureCard({ icon: Icon, title, description, badge }) {
  return (
    <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">

      <div className="mb-5 flex items-center justify-between">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-900 transition group-hover:bg-slate-900 group-hover:text-white">

          {typeof Icon === "string" ? (
            <span className="text-2xl">{Icon}</span>
          ) : (
            <Icon className="h-6 w-6" />
          )}

        </div>

        {badge && (
          <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
            {badge}
          </span>
        )}

      </div>

      <h3 className="mb-2 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-slate-600">
        {description}
      </p>

    </div>
  );
}

export default FeatureCard;