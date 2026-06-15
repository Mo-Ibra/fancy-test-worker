export default function Loading() {
  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.2] dark:opacity-[0.1]"
        style={{
          backgroundImage: "radial-gradient(circle, #BFDBFE 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10">
        <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    </div>
  );
}
