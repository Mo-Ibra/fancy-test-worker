interface ToolJsonLdProps {
  toolLd: Record<string, unknown>;
  breadcrumbLd: Record<string, unknown>;
}

export default function ToolJsonLd({ toolLd, breadcrumbLd }: ToolJsonLdProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </>
  );
}
