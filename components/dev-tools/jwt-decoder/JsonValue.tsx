export default function JsonValue({ value }: { value: unknown }): React.ReactElement {
  if (value === null) return <span className="text-muted-foreground/60" > null </span>;
  if (typeof value === "boolean") return <span className="text-purple-500 dark:text-purple-400" > {String(value)} </span>;
  if (typeof value === "number") return <span className="text-amber-500" > {String(value)} </span>;
  if (typeof value === "string") return <span className="text-emerald-600 dark:text-emerald-400" > "{value}" </span>;
  if (Array.isArray(value)) {
    return (
      <span>
        {"[ "}
        {
          value.map((v, i) => (
            <span key={i} >
              <JsonValue value={v} />
              {i < value.length - 1 ? ", " : ""}
            </span>
          ))
        }
        {" ]"}
      </span>
    );
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    return (
      <span>
        {"{ "}
        {
          entries.map(([k, v], i) => (
            <span key={k} >
              <span className="text-blue-500 dark:text-blue-400" > "{k}" </span>
              {": "}
              < JsonValue value={v} />
              {i < entries.length - 1 ? ", " : ""}
            </span>
          ))
        }
        {" }"}
      </span>
    );
  }
  return <span>{String(value)} </span>;
}