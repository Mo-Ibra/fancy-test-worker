import { Tool } from "@/types/tools";

export const securityTools: Tool[] = [
  {
    icon: "KeyRound",
    label: "toolsList.security.passwordGenerator.label",
    description: "toolsList.security.passwordGenerator.description",
    href: "/security-tools/password-generator",
    badge: "common.popular",
    badgeColor: "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
  },
  {
    icon: "Eye",
    label: "toolsList.security.passwordStrength.label",
    description: "toolsList.security.passwordStrength.description",
    href: "/security-tools/password-strength-checker",
    badge: null,
    badgeColor: "",
  },
  {
    icon: "ShieldCheck",
    label: "toolsList.security.md5.label",
    description: "toolsList.security.md5.description",
    href: "/security-tools/md5-hash-generator",
    badge: null,
    badgeColor: "",
  }
];
