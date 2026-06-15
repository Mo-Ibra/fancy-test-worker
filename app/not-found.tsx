import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.2] dark:opacity-[0.1]"
        style={{
          backgroundImage: "radial-gradient(circle, #BFDBFE 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-red-500/10 dark:bg-red-500/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10 text-center px-6">
        <h1 className="text-[10rem] sm:text-[14rem] lg:text-[18rem] font-bold text-red-500/15 dark:text-red-500/10 leading-none select-none tracking-tight">
          404
        </h1>

        <div className="-mt-8 sm:-mt-12 lg:-mt-16">
          <p className="text-lg sm:text-xl text-muted-foreground font-medium mb-8">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>

          <Link
            href="/en"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
