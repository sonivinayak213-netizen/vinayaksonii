export function Card({ title, subtitle, children }) {
  return (
    <div className="bg-card rounded-xl p-4 shadow border border-slate-700/40">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-slate-200 font-semibold">{title}</div>
          {subtitle && <div className="text-sm text-slate-400">{subtitle}</div>}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
