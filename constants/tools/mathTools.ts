import { Tool } from "@/types/tools";

export const mathTools: Tool[] = [
  {
    icon: "Ruler",
    label: "toolsList.math.unitConverter.label",
    description: "toolsList.math.unitConverter.description",
    href: "/math-tools/unit-converter",
    badge: "common.popular",
    badgeColor: "bg-amber-100 text-amber-600",
  },
  {
    icon: "Percent",
    label: "toolsList.math.percentage.label",
    description: "toolsList.math.percentage.description",
    href: "/math-tools/percentage-calculator",
    badge: null,
    badgeColor: "",
  },
  {
    icon: "Binary",
    label: "toolsList.math.numberBase.label",
    description: "toolsList.math.numberBase.description",
    href: "/math-tools/number-base-converter",
    badge: null,
    badgeColor: "",
  },
  {
    icon: "Calculator",
    label: "toolsList.math.scientific.label",
    description: "toolsList.math.scientific.description",
    href: "/math-tools/scientific-calculator",
    badge: null,
    badgeColor: "",
  },
  {
    icon: "Clock",
    label: "toolsList.math.age.label",
    description: "toolsList.math.age.description",
    href: "/math-tools/age-calculator",
    badge: null,
    badgeColor: "",
  },
  {
    icon: "CalendarDays",
    label: "toolsList.math.dateDiff.label",
    description: "toolsList.math.dateDiff.description",
    href: "/math-tools/date-difference",
    badge: null,
    badgeColor: "",
  },
  {
    icon: "Sigma",
    label: "toolsList.math.average.label",
    description: "toolsList.math.average.description",
    href: "/math-tools/average-calculator",
    badge: "common.new",
    badgeColor: "bg-emerald-100 text-emerald-600",
  }
];
