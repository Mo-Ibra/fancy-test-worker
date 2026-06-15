
// ── Types ──────────────────────────────────────────────────────────

export interface Unit {
  key: string;
  label: string;
  symbol: string;
  toBase: (v: number) => number;  // converts value → base unit
  fromBase: (v: number) => number; // converts base unit → value
}

export interface Category {
  key: string;
  label: string;
  icon: string;
  base: string; // label of base unit
  units: Unit[];
}

// ── Unit definitions ───────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  {
    key: "length", label: "Length", icon: "📏", base: "meter",
    units: [
      { key: "pm", label: "Picometer", symbol: "pm", toBase: v => v * 1e-12, fromBase: v => v / 1e-12 },
      { key: "nm", label: "Nanometer", symbol: "nm", toBase: v => v * 1e-9, fromBase: v => v / 1e-9 },
      { key: "um", label: "Micrometer", symbol: "µm", toBase: v => v * 1e-6, fromBase: v => v / 1e-6 },
      { key: "mm", label: "Millimeter", symbol: "mm", toBase: v => v * 0.001, fromBase: v => v / 0.001 },
      { key: "cm", label: "Centimeter", symbol: "cm", toBase: v => v * 0.01, fromBase: v => v / 0.01 },
      { key: "dm", label: "Decimeter", symbol: "dm", toBase: v => v * 0.1, fromBase: v => v / 0.1 },
      { key: "m", label: "Meter", symbol: "m", toBase: v => v, fromBase: v => v },
      { key: "km", label: "Kilometer", symbol: "km", toBase: v => v * 1000, fromBase: v => v / 1000 },
      { key: "in", label: "Inch", symbol: "in", toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
      { key: "ft", label: "Foot", symbol: "ft", toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { key: "yd", label: "Yard", symbol: "yd", toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      { key: "mi", label: "Mile", symbol: "mi", toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
      { key: "nmi", label: "Nautical Mile", symbol: "nmi", toBase: v => v * 1852, fromBase: v => v / 1852 },
      { key: "ly", label: "Light-year", symbol: "ly", toBase: v => v * 9.461e15, fromBase: v => v / 9.461e15 },
      { key: "au", label: "Astronomical Unit", symbol: "AU", toBase: v => v * 1.496e11, fromBase: v => v / 1.496e11 },
    ],
  },
  {
    key: "weight", label: "Weight / Mass", icon: "⚖️", base: "kilogram",
    units: [
      { key: "ug", label: "Microgram", symbol: "µg", toBase: v => v * 1e-9, fromBase: v => v / 1e-9 },
      { key: "mg", label: "Milligram", symbol: "mg", toBase: v => v * 1e-6, fromBase: v => v / 1e-6 },
      { key: "g", label: "Gram", symbol: "g", toBase: v => v * 0.001, fromBase: v => v / 0.001 },
      { key: "kg", label: "Kilogram", symbol: "kg", toBase: v => v, fromBase: v => v },
      { key: "t", label: "Metric Ton", symbol: "t", toBase: v => v * 1000, fromBase: v => v / 1000 },
      { key: "oz", label: "Ounce", symbol: "oz", toBase: v => v * 0.028349, fromBase: v => v / 0.028349 },
      { key: "lb", label: "Pound", symbol: "lb", toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
      { key: "st", label: "Stone", symbol: "st", toBase: v => v * 6.35029, fromBase: v => v / 6.35029 },
      { key: "ton", label: "Short Ton", symbol: "ton", toBase: v => v * 907.185, fromBase: v => v / 907.185 },
      { key: "lton", label: "Long Ton", symbol: "L.T", toBase: v => v * 1016.047, fromBase: v => v / 1016.047 },
      { key: "ct", label: "Carat", symbol: "ct", toBase: v => v * 0.0002, fromBase: v => v / 0.0002 },
    ],
  },
  {
    key: "temperature", label: "Temperature", icon: "🌡️", base: "celsius",
    units: [
      { key: "c", label: "Celsius", symbol: "°C", toBase: v => v, fromBase: v => v },
      { key: "f", label: "Fahrenheit", symbol: "°F", toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      { key: "k", label: "Kelvin", symbol: "K", toBase: v => v - 273.15, fromBase: v => v + 273.15 },
      { key: "r", label: "Rankine", symbol: "°R", toBase: v => (v - 491.67) * 5 / 9, fromBase: v => (v + 273.15) * 9 / 5 },
      { key: "re", label: "Réaumur", symbol: "°Ré", toBase: v => v * 5 / 4, fromBase: v => v * 4 / 5 },
    ],
  },
  {
    key: "area", label: "Area", icon: "▭", base: "square meter",
    units: [
      { key: "mm2", label: "Square Millimeter", symbol: "mm²", toBase: v => v * 1e-6, fromBase: v => v / 1e-6 },
      { key: "cm2", label: "Square Centimeter", symbol: "cm²", toBase: v => v * 1e-4, fromBase: v => v / 1e-4 },
      { key: "m2", label: "Square Meter", symbol: "m²", toBase: v => v, fromBase: v => v },
      { key: "km2", label: "Square Kilometer", symbol: "km²", toBase: v => v * 1e6, fromBase: v => v / 1e6 },
      { key: "ha", label: "Hectare", symbol: "ha", toBase: v => v * 1e4, fromBase: v => v / 1e4 },
      { key: "ac", label: "Acre", symbol: "ac", toBase: v => v * 4046.856, fromBase: v => v / 4046.856 },
      { key: "in2", label: "Square Inch", symbol: "in²", toBase: v => v * 6.4516e-4, fromBase: v => v / 6.4516e-4 },
      { key: "ft2", label: "Square Foot", symbol: "ft²", toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
      { key: "yd2", label: "Square Yard", symbol: "yd²", toBase: v => v * 0.836127, fromBase: v => v / 0.836127 },
      { key: "mi2", label: "Square Mile", symbol: "mi²", toBase: v => v * 2.59e6, fromBase: v => v / 2.59e6 },
    ],
  },
  {
    key: "volume", label: "Volume", icon: "🧪", base: "liter",
    units: [
      { key: "ml", label: "Milliliter", symbol: "mL", toBase: v => v * 0.001, fromBase: v => v / 0.001 },
      { key: "cl", label: "Centiliter", symbol: "cL", toBase: v => v * 0.01, fromBase: v => v / 0.01 },
      { key: "dl", label: "Deciliter", symbol: "dL", toBase: v => v * 0.1, fromBase: v => v / 0.1 },
      { key: "l", label: "Liter", symbol: "L", toBase: v => v, fromBase: v => v },
      { key: "m3", label: "Cubic Meter", symbol: "m³", toBase: v => v * 1000, fromBase: v => v / 1000 },
      { key: "cm3", label: "Cubic Centimeter", symbol: "cm³", toBase: v => v * 0.001, fromBase: v => v / 0.001 },
      { key: "in3", label: "Cubic Inch", symbol: "in³", toBase: v => v * 0.016387, fromBase: v => v / 0.016387 },
      { key: "ft3", label: "Cubic Foot", symbol: "ft³", toBase: v => v * 28.3168, fromBase: v => v / 28.3168 },
      { key: "tsp", label: "Teaspoon (US)", symbol: "tsp", toBase: v => v * 0.004929, fromBase: v => v / 0.004929 },
      { key: "tbsp", label: "Tablespoon (US)", symbol: "tbsp", toBase: v => v * 0.014787, fromBase: v => v / 0.014787 },
      { key: "floz", label: "Fl. Oz (US)", symbol: "fl oz", toBase: v => v * 0.029574, fromBase: v => v / 0.029574 },
      { key: "cup", label: "Cup (US)", symbol: "cup", toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
      { key: "pt", label: "Pint (US)", symbol: "pt", toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
      { key: "qt", label: "Quart (US)", symbol: "qt", toBase: v => v * 0.946353, fromBase: v => v / 0.946353 },
      { key: "gal", label: "Gallon (US)", symbol: "gal", toBase: v => v * 3.785411, fromBase: v => v / 3.785411 },
      { key: "gal_uk", label: "Gallon (UK)", symbol: "gal UK", toBase: v => v * 4.546092, fromBase: v => v / 4.546092 },
    ],
  },
  {
    key: "speed", label: "Speed", icon: "⚡", base: "m/s",
    units: [
      { key: "ms", label: "Meter/second", symbol: "m/s", toBase: v => v, fromBase: v => v },
      { key: "kmh", label: "Kilometer/hour", symbol: "km/h", toBase: v => v / 3.6, fromBase: v => v * 3.6 },
      { key: "mph", label: "Miles/hour", symbol: "mph", toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
      { key: "kn", label: "Knot", symbol: "kn", toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
      { key: "fps", label: "Feet/second", symbol: "ft/s", toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { key: "mach", label: "Mach (sea level)", symbol: "Mach", toBase: v => v * 340.29, fromBase: v => v / 340.29 },
      { key: "c", label: "Speed of Light", symbol: "c", toBase: v => v * 2.998e8, fromBase: v => v / 2.998e8 },
    ],
  },
  {
    key: "time", label: "Time", icon: "⏱️", base: "second",
    units: [
      { key: "ns", label: "Nanosecond", symbol: "ns", toBase: v => v * 1e-9, fromBase: v => v / 1e-9 },
      { key: "us", label: "Microsecond", symbol: "µs", toBase: v => v * 1e-6, fromBase: v => v / 1e-6 },
      { key: "ms", label: "Millisecond", symbol: "ms", toBase: v => v * 0.001, fromBase: v => v / 0.001 },
      { key: "s", label: "Second", symbol: "s", toBase: v => v, fromBase: v => v },
      { key: "min", label: "Minute", symbol: "min", toBase: v => v * 60, fromBase: v => v / 60 },
      { key: "h", label: "Hour", symbol: "h", toBase: v => v * 3600, fromBase: v => v / 3600 },
      { key: "d", label: "Day", symbol: "d", toBase: v => v * 86400, fromBase: v => v / 86400 },
      { key: "wk", label: "Week", symbol: "wk", toBase: v => v * 604800, fromBase: v => v / 604800 },
      { key: "mo", label: "Month (avg)", symbol: "mo", toBase: v => v * 2628000, fromBase: v => v / 2628000 },
      { key: "yr", label: "Year", symbol: "yr", toBase: v => v * 31536000, fromBase: v => v / 31536000 },
      { key: "dec", label: "Decade", symbol: "dec", toBase: v => v * 315360000, fromBase: v => v / 315360000 },
      { key: "cen", label: "Century", symbol: "cen", toBase: v => v * 3153600000, fromBase: v => v / 3153600000 },
    ],
  },
  {
    key: "data", label: "Data Storage", icon: "💾", base: "byte",
    units: [
      { key: "bit", label: "Bit", symbol: "bit", toBase: v => v / 8, fromBase: v => v * 8 },
      { key: "B", label: "Byte", symbol: "B", toBase: v => v, fromBase: v => v },
      { key: "KB", label: "Kilobyte", symbol: "KB", toBase: v => v * 1024, fromBase: v => v / 1024 },
      { key: "MB", label: "Megabyte", symbol: "MB", toBase: v => v * 1048576, fromBase: v => v / 1048576 },
      { key: "GB", label: "Gigabyte", symbol: "GB", toBase: v => v * 1073741824, fromBase: v => v / 1073741824 },
      { key: "TB", label: "Terabyte", symbol: "TB", toBase: v => v * 1.0995e12, fromBase: v => v / 1.0995e12 },
      { key: "PB", label: "Petabyte", symbol: "PB", toBase: v => v * 1.1259e15, fromBase: v => v / 1.1259e15 },
      { key: "Kib", label: "Kibibyte", symbol: "KiB", toBase: v => v * 1024, fromBase: v => v / 1024 },
      { key: "Mib", label: "Mebibyte", symbol: "MiB", toBase: v => v * 1048576, fromBase: v => v / 1048576 },
      { key: "Gib", label: "Gibibyte", symbol: "GiB", toBase: v => v * 1073741824, fromBase: v => v / 1073741824 },
      { key: "kbps", label: "Kilobit/s", symbol: "kbps", toBase: v => v * 125, fromBase: v => v / 125 },
      { key: "mbps", label: "Megabit/s", symbol: "Mbps", toBase: v => v * 125000, fromBase: v => v / 125000 },
      { key: "gbps", label: "Gigabit/s", symbol: "Gbps", toBase: v => v * 1.25e8, fromBase: v => v / 1.25e8 },
    ],
  },
  {
    key: "pressure", label: "Pressure", icon: "💨", base: "pascal",
    units: [
      { key: "pa", label: "Pascal", symbol: "Pa", toBase: v => v, fromBase: v => v },
      { key: "kpa", label: "Kilopascal", symbol: "kPa", toBase: v => v * 1000, fromBase: v => v / 1000 },
      { key: "mpa", label: "Megapascal", symbol: "MPa", toBase: v => v * 1e6, fromBase: v => v / 1e6 },
      { key: "bar", label: "Bar", symbol: "bar", toBase: v => v * 1e5, fromBase: v => v / 1e5 },
      { key: "mbar", label: "Millibar", symbol: "mbar", toBase: v => v * 100, fromBase: v => v / 100 },
      { key: "atm", label: "Atmosphere", symbol: "atm", toBase: v => v * 101325, fromBase: v => v / 101325 },
      { key: "psi", label: "PSI", symbol: "psi", toBase: v => v * 6894.76, fromBase: v => v / 6894.76 },
      { key: "torr", label: "Torr", symbol: "Torr", toBase: v => v * 133.322, fromBase: v => v / 133.322 },
      { key: "mmhg", label: "mmHg", symbol: "mmHg", toBase: v => v * 133.322, fromBase: v => v / 133.322 },
      { key: "inhg", label: "inHg", symbol: "inHg", toBase: v => v * 3386.39, fromBase: v => v / 3386.39 },
    ],
  },
  {
    key: "energy", label: "Energy", icon: "⚡", base: "joule",
    units: [
      { key: "j", label: "Joule", symbol: "J", toBase: v => v, fromBase: v => v },
      { key: "kj", label: "Kilojoule", symbol: "kJ", toBase: v => v * 1000, fromBase: v => v / 1000 },
      { key: "mj", label: "Megajoule", symbol: "MJ", toBase: v => v * 1e6, fromBase: v => v / 1e6 },
      { key: "cal", label: "Calorie", symbol: "cal", toBase: v => v * 4.184, fromBase: v => v / 4.184 },
      { key: "kcal", label: "Kilocalorie", symbol: "kcal", toBase: v => v * 4184, fromBase: v => v / 4184 },
      { key: "wh", label: "Watt-hour", symbol: "Wh", toBase: v => v * 3600, fromBase: v => v / 3600 },
      { key: "kwh", label: "Kilowatt-hour", symbol: "kWh", toBase: v => v * 3.6e6, fromBase: v => v / 3.6e6 },
      { key: "btu", label: "BTU", symbol: "BTU", toBase: v => v * 1055.06, fromBase: v => v / 1055.06 },
      { key: "ev", label: "Electronvolt", symbol: "eV", toBase: v => v * 1.602e-19, fromBase: v => v / 1.602e-19 },
    ],
  },
  {
    key: "power", label: "Power", icon: "🔌", base: "watt",
    units: [
      { key: "mw", label: "Milliwatt", symbol: "mW", toBase: v => v * 0.001, fromBase: v => v / 0.001 },
      { key: "w", label: "Watt", symbol: "W", toBase: v => v, fromBase: v => v },
      { key: "kw", label: "Kilowatt", symbol: "kW", toBase: v => v * 1000, fromBase: v => v / 1000 },
      { key: "mwatt", label: "Megawatt", symbol: "MW", toBase: v => v * 1e6, fromBase: v => v / 1e6 },
      { key: "gw", label: "Gigawatt", symbol: "GW", toBase: v => v * 1e9, fromBase: v => v / 1e9 },
      { key: "hp", label: "Horsepower", symbol: "hp", toBase: v => v * 745.7, fromBase: v => v / 745.7 },
      { key: "dbm", label: "dBm", symbol: "dBm", toBase: v => Math.pow(10, (v - 30) / 10), fromBase: v => 10 * Math.log10(v) + 30 },
    ],
  },
  {
    key: "angle", label: "Angle", icon: "📐", base: "degree",
    units: [
      { key: "deg", label: "Degree", symbol: "°", toBase: v => v, fromBase: v => v },
      { key: "rad", label: "Radian", symbol: "rad", toBase: v => v * (180 / Math.PI), fromBase: v => v * (Math.PI / 180) },
      { key: "grad", label: "Gradian", symbol: "grad", toBase: v => v * 0.9, fromBase: v => v / 0.9 },
      { key: "rev", label: "Revolution", symbol: "rev", toBase: v => v * 360, fromBase: v => v / 360 },
      { key: "arcmin", label: "Arc Minute", symbol: "′", toBase: v => v / 60, fromBase: v => v * 60 },
      { key: "arcsec", label: "Arc Second", symbol: "″", toBase: v => v / 3600, fromBase: v => v * 3600 },
    ],
  },
  {
    key: "fuel", label: "Fuel Economy", icon: "⛽", base: "km/l",
    units: [
      { key: "kml", label: "km/L", symbol: "km/L", toBase: v => v, fromBase: v => v },
      { key: "l100", label: "L/100km", symbol: "L/100km", toBase: v => 100 / v, fromBase: v => 100 / v },
      { key: "mpg", label: "MPG (US)", symbol: "mpg", toBase: v => v * 0.425144, fromBase: v => v / 0.425144 },
      { key: "mpguk", label: "MPG (UK)", symbol: "mpg UK", toBase: v => v * 0.354006, fromBase: v => v / 0.354006 },
      { key: "kmgal", label: "km/gallon", symbol: "km/gal", toBase: v => v / 3.785411, fromBase: v => v * 3.785411 },
    ],
  },
];

// ── Number formatter ───────────────────────────────────────────────

export function smartFormat(n: number): string {
  if (!isFinite(n)) return "—";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e15 || (abs < 1e-9 && abs > 0)) return n.toExponential(6);
  if (abs >= 1e9) return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
  if (abs >= 1) return parseFloat(n.toPrecision(10)).toString();
  return parseFloat(n.toPrecision(8)).toString();
}