
// ── Types ──────────────────────────────────────────────────────────

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  nextBirthday: { days: number; date: string; age: number };
  dayOfWeek: string;
  zodiac: { sign: string; symbol: string; dates: string };
  chinese: { animal: string; element: string; year: string; symbol: string };
  generation: { name: string; years: string };
  milestones: { label: string; date: string; passed: boolean; daysAway: number }[];
  lifePercent: number;
  season: string;
}

// ── Zodiac ─────────────────────────────────────────────────────────

export function getZodiac(month: number, day: number) {
  const signs = [
    { sign: "Capricorn", symbol: "♑", dates: "Dec 22 – Jan 19", start: [12, 22], end: [1, 19] },
    { sign: "Aquarius", symbol: "♒", dates: "Jan 20 – Feb 18", start: [1, 20], end: [2, 18] },
    { sign: "Pisces", symbol: "♓", dates: "Feb 19 – Mar 20", start: [2, 19], end: [3, 20] },
    { sign: "Aries", symbol: "♈", dates: "Mar 21 – Apr 19", start: [3, 21], end: [4, 19] },
    { sign: "Taurus", symbol: "♉", dates: "Apr 20 – May 20", start: [4, 20], end: [5, 20] },
    { sign: "Gemini", symbol: "♊", dates: "May 21 – Jun 20", start: [5, 21], end: [6, 20] },
    { sign: "Cancer", symbol: "♋", dates: "Jun 21 – Jul 22", start: [6, 21], end: [7, 22] },
    { sign: "Leo", symbol: "♌", dates: "Jul 23 – Aug 22", start: [7, 23], end: [8, 22] },
    { sign: "Virgo", symbol: "♍", dates: "Aug 23 – Sep 22", start: [8, 23], end: [9, 22] },
    { sign: "Libra", symbol: "♎", dates: "Sep 23 – Oct 22", start: [9, 23], end: [10, 22] },
    { sign: "Scorpio", symbol: "♏", dates: "Oct 23 – Nov 21", start: [10, 23], end: [11, 21] },
    { sign: "Sagittarius", symbol: "♐", dates: "Nov 22 – Dec 21", start: [11, 22], end: [12, 21] },
  ];
  for (const s of signs) {
    const [sm, sd] = s.start;
    const [em, ed] = s.end;
    if ((month === sm && day >= sd) || (month === em && day <= ed)) return s;
  }
  return signs[0]; // Capricorn fallback
}

// ── Chinese zodiac ─────────────────────────────────────────────────

export function getChineseZodiac(year: number) {
  const animals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  const elements = ["Wood", "Fire", "Earth", "Metal", "Water"];
  const symbols = ["🐀", "🐂", "🐯", "🐇", "🐉", "🐍", "🐴", "🐑", "🐒", "🐓", "🐕", "🐖"];
  const idx = (year - 1900) % 12;
  const elemIdx = Math.floor(((year - 1900) % 10) / 2);
  return {
    animal: animals[((idx % 12) + 12) % 12],
    symbol: symbols[((idx % 12) + 12) % 12],
    element: elements[((elemIdx % 5) + 5) % 5],
    year: `${elements[((elemIdx % 5) + 5) % 5]} ${animals[((idx % 12) + 12) % 12]}`,
  };
}

// ── Generation ─────────────────────────────────────────────────────

export function getGeneration(year: number) {
  if (year < 1928) return { name: "Greatest Generation", years: "Before 1928" };
  if (year < 1946) return { name: "Silent Generation", years: "1928–1945" };
  if (year < 1965) return { name: "Baby Boomers", years: "1946–1964" };
  if (year < 1981) return { name: "Generation X", years: "1965–1980" };
  if (year < 1997) return { name: "Millennials", years: "1981–1996" };
  if (year < 2013) return { name: "Generation Z", years: "1997–2012" };
  return { name: "Generation Alpha", years: "2013–present" };
}

// ── Season ─────────────────────────────────────────────────────────

export function getSeason(month: number): string {
  if (month >= 3 && month <= 5) return "🌸 Spring";
  if (month >= 6 && month <= 8) return "☀️ Summer";
  if (month >= 9 && month <= 11) return "🍂 Autumn";
  return "❄️ Winter";
}

// ── Core calculation ───────────────────────────────────────────────

export function calculateAge(birthDate: Date, targetDate: Date): AgeResult {
  const bd = new Date(birthDate);
  const td = new Date(targetDate);

  let years = td.getFullYear() - bd.getFullYear();
  let months = td.getMonth() - bd.getMonth();
  let days = td.getDate() - bd.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(td.getFullYear(), td.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) { years--; months += 12; }

  const msPerDay = 86400000;
  const totalMs = td.getTime() - bd.getTime();
  const totalDays = Math.floor(totalMs / msPerDay);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;
  const totalSeconds = totalMinutes * 60;

  // Next birthday
  let nextBDay = new Date(td.getFullYear(), bd.getMonth(), bd.getDate());
  if (nextBDay <= td) nextBDay = new Date(td.getFullYear() + 1, bd.getMonth(), bd.getDate());
  const daysToNext = Math.ceil((nextBDay.getTime() - td.getTime()) / msPerDay);
  const nextBdayAge = years + (daysToNext === 0 ? 0 : 1);

  // Day of week born
  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayOfWeek = weekDays[bd.getDay()];

  // Zodiac
  const zodiac = getZodiac(bd.getMonth() + 1, bd.getDate());

  // Chinese zodiac
  const chinese = getChineseZodiac(bd.getFullYear());

  // Generation
  const generation = getGeneration(bd.getFullYear());

  // Milestones (age in years → date)
  const milestoneAges = [1, 5, 10, 13, 16, 18, 21, 25, 30, 40, 50, 60, 70, 80, 90, 100];
  const milestones = milestoneAges.map(age => {
    const mDate = new Date(bd.getFullYear() + age, bd.getMonth(), bd.getDate());
    const passed = mDate <= td;
    const daysAway = Math.ceil(Math.abs(mDate.getTime() - td.getTime()) / msPerDay);
    return {
      label: `${age} years old`,
      date: mDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }),
      passed,
      daysAway,
    };
  });

  // Life expectancy % (avg ~72 years)
  const lifePercent = Math.min(100, Math.round((years / 72) * 100));

  // Season of birth
  const season = getSeason(bd.getMonth() + 1);

  return {
    years, months, days,
    totalDays, totalWeeks, totalMonths, totalHours, totalMinutes, totalSeconds,
    nextBirthday: {
      days: daysToNext,
      date: nextBDay.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }),
      age: nextBdayAge,
    },
    dayOfWeek, zodiac, chinese, generation, milestones, lifePercent, season,
  };
}

export const FAMOUS: Record<string, { name: string; year: number; field: string }[]> = {
  "01-01": [{ name: "J. Edgar Hoover", year: 1895, field: "FBI Director" }],
  "01-15": [{ name: "Martin Luther King Jr.", year: 1929, field: "Civil Rights Leader" }],
  "02-14": [{ name: "Frederick Douglass", year: 1818, field: "Abolitionist" }],
  "03-14": [{ name: "Albert Einstein", year: 1879, field: "Physicist" }],
  "04-15": [{ name: "Leonardo da Vinci", year: 1452, field: "Artist & Inventor" }],
  "05-05": [{ name: "Karl Marx", year: 1818, field: "Philosopher" }],
  "06-12": [{ name: "Anne Frank", year: 1929, field: "Diarist" }],
  "07-04": [{ name: "Calvin Coolidge", year: 1872, field: "US President" }],
  "08-04": [{ name: "Barack Obama", year: 1961, field: "US President" }],
  "09-11": [{ name: "O. Henry", year: 1862, field: "Author" }],
  "10-31": [{ name: "Indira Gandhi", year: 1917, field: "Indian PM" }],
  "11-19": [{ name: "Jodie Foster", year: 1962, field: "Actress" }],
  "12-25": [{ name: "Isaac Newton", year: 1643, field: "Physicist" }],
};
