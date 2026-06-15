import Link from "next/link";

interface NavLinkProps {
  href: string;
  label: string;
}

export default function NavLink({ href, label }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors text-muted-foreground hover:text-foreground
        }`}
    >
      {label}
    </Link>
  );
}