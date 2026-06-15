interface Section {
  heading: string;
  body: string;
  version?: string;
  date?: string;
}

interface StaticPageProps {
  title: string;
  subtitle: string;
  sections: Section[];
  lastUpdated?: string;
}

export default function StaticPage({ title, subtitle, sections, lastUpdated }: StaticPageProps) {
  return (
    <section className="relative bg-background min-h-screen py-16 lg:py-24 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.2] dark:opacity-[0.1]"
        style={{
          backgroundImage: "radial-gradient(circle, #BFDBFE 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute -top-20 -left-20 w-[500px] h-[400px] rounded-full bg-blue-100/50 dark:bg-blue-900/10 blur-[100px] pointer-events-none dark:hidden" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-blue-50/60 dark:bg-blue-900/10 blur-[80px] pointer-events-none dark:hidden" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-3">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground">{subtitle}</p>
            {lastUpdated && (
              <p className="text-sm text-muted-foreground/60 mt-4">{lastUpdated}</p>
            )}
          </div>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={i}>
                {section.version && section.date && (
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      {section.version}
                    </span>
                    <span className="text-xs text-muted-foreground">{section.date}</span>
                  </div>
                )}
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  {section.heading}
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
