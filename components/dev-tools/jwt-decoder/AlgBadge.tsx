export default function AlgBadge({ alg }: { alg?: string }) {
  if (!alg) return null;
  const isNone = alg.toLowerCase() === "none";
  const isHS = alg.startsWith("HS");
  const isRS = alg.startsWith("RS") || alg.startsWith("PS");
  const isES = alg.startsWith("ES");

  const color = isNone ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
    : isHS ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800"
      : isRS || isES ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
        : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800";

  const desc = isNone ? "⚠ Unsigned!"
    : isHS ? "HMAC shared secret"
      : isRS ? "RSA signature"
        : isES ? "ECDSA signature"
          : "Algorithm";

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${color}`
    }>
      <code>{alg} </code>
      < span className="font-normal opacity-75" >— {desc} </span>
    </div>
  );
}