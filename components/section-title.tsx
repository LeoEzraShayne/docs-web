export function SectionTitle({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.36em] text-amber-300">
        {kicker}
      </p>
      <h1 className="max-w-4xl text-4xl font-bold leading-tight text-slate-50 md:text-5xl">
        {title}
      </h1>
      <p className="max-w-3xl text-base leading-8 text-slate-400 md:text-lg">
        {body}
      </p>
    </div>
  );
}
