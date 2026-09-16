function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <div className="mb-4 text-3xl">
        {icon}
      </div>

      <h3 className="mb-2 text-xl font-semibold text-slate-900">
        {title}
      </h3>

      <p className="leading-7 text-slate-600">
        {description}
      </p>

    </div>
  );
}

export default FeatureCard;