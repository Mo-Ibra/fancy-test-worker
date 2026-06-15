"use client";

import { useState, useMemo } from "react";
import {
  ChevronRight,
  Search,
  RefreshCw,
  Star,
  ShoppingBag,
  FileText,
  HelpCircle,
  Building2,
  User,
  Utensils,
  Briefcase,
  BookOpen,
  Play,
  Calendar,
  Plus,
  X,
} from "lucide-react";
import { useLang, useT } from "@/context/TranslationProvider";
import { DEFAULTS, generateSchema, SchemaForm, SchemaType } from "@/funcs/seo-tools/SchemaMarkupGeneratorToolFuncs";
import Field from "@/components/seo-tools/schema-markup-generator/Field";
import Grid2 from "@/components/seo-tools/schema-markup-generator/Grid2";
import Section from "@/components/seo-tools/schema-markup-generator/Section";
import RelatedTools from "@/components/seo-tools/RelatedTools";
import TestingTools from "@/components/seo-tools/schema-markup-generator/TestingTools";
import JSONOnly from "@/components/seo-tools/schema-markup-generator/JSONOnly";
import ScriptTag from "@/components/seo-tools/schema-markup-generator/ScriptTag";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

const SCHEMA_TYPES: { type: SchemaType; icon: React.ElementType; badge?: string }[] = [
  { type: "Article", icon: FileText, badge: "popular" },
  { type: "Product", icon: ShoppingBag, badge: "popular" },
  { type: "FAQ", icon: HelpCircle, badge: "popular" },
  { type: "LocalBusiness", icon: Building2, badge: "popular" },
  { type: "Recipe", icon: Utensils },
  { type: "JobPosting", icon: Briefcase },
  { type: "Event", icon: Calendar },
  { type: "Person", icon: User },
  { type: "Review", icon: Star },
  { type: "BreadcrumbList", icon: ChevronRight },
  { type: "VideoObject", icon: Play },
  { type: "Course", icon: BookOpen },
  { type: "Organization", icon: Building2 },
  { type: "WebSite", icon: Search },
];

// ── Main ───────────────────────────────────────────────────────────

export default function SchemaMarkupGeneratorTool() {
  const t = useT("seo-tools/SchemaMarkupGeneratorTool.json");
  const lang = useLang();
  const isAr = lang === "ar";

  const [schemaType, setSchemaType] = useState<SchemaType>("Article");
  const [form, setForm] = useState<SchemaForm>(DEFAULTS);

  const set = <K extends keyof SchemaForm>(k: K, v: SchemaForm[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const schema = useMemo(() => generateSchema(schemaType, form), [schemaType, form]);
  const jsonStr = useMemo(() => JSON.stringify(schema, null, 2), [schema]);
  const scriptTag = useMemo(() =>
    `<script type="application/ld+json">\n${jsonStr}\n</script>`, [jsonStr]);

  const download = () => {
    const blob = new Blob([scriptTag], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `schema-${schemaType.toLowerCase()}.html`;
    a.click(); URL.revokeObjectURL(url);
  };

  const resetForm = () => setForm(DEFAULTS);

  // ── Form renderers ─────────────────────────────────────────────

  const renderForm = () => {
    switch (schemaType) {

      case "Article": return (
        <div className="flex flex-col gap-3">
          <Section title={t("form.articleDetails")}>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">{t("form.articleType")}</label>
              <select value={form.articleType} onChange={e => set("articleType", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-blue-400 transition-all">
                {["Article", "NewsArticle", "BlogPosting", "TechArticle", "SatiricalArticle"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <Field label={t("form.headline")} value={form.headline} onChange={v => set("headline", v)} placeholder={t("form.headlinePlaceholder")} />
            <Field label={t("form.articleUrl")} value={form.articleUrl} onChange={v => set("articleUrl", v)} placeholder={t("form.urlPlaceholder")} mono />
            <Field label={t("form.imageUrl")} value={form.articleImage} onChange={v => set("articleImage", v)} placeholder={t("form.imagePlaceholder")} mono />
            <Grid2>
              <Field label={t("form.publishedDate")} value={form.publishedDate} onChange={v => set("publishedDate", v)} type="date" />
              <Field label={t("form.modifiedDate")} value={form.modifiedDate} onChange={v => set("modifiedDate", v)} type="date" />
            </Grid2>
          </Section>
          <Section title={t("form.author")}>
            <Grid2>
              <Field label={t("form.authorName")} value={form.articleAuthor} onChange={v => set("articleAuthor", v)} placeholder={t("form.authorPlaceholder")} />
              <Field label={t("form.authorUrl")} value={form.authorUrl} onChange={v => set("authorUrl", v)} placeholder={t("form.urlPlaceholder")} mono />
            </Grid2>
          </Section>
          <Section title={t("form.publisher")}>
            <Grid2>
              <Field label={t("form.publisherName")} value={form.publisherName} onChange={v => set("publisherName", v)} placeholder={t("form.publisherNamePlaceholder")} />
              <Field label={t("form.publisherLogo")} value={form.publisherLogo} onChange={v => set("publisherLogo", v)} placeholder={t("form.publisherLogoPlaceholder")} mono />
            </Grid2>
          </Section>
        </div>
      );

      case "Product": return (
        <div className="flex flex-col gap-3">
          <Section title={t("form.productDetails")}>
            <Field label={t("form.productName")} value={form.productName} onChange={v => set("productName", v)} placeholder={t("form.productNamePlaceholder")} />
            <Field label={t("form.description")} value={form.productDesc} onChange={v => set("productDesc", v)} placeholder={t("form.descriptionPlaceholder")} textarea />
            <Field label={t("form.productUrl")} value={form.productUrl} onChange={v => set("productUrl", v)} placeholder={t("form.urlPlaceholder")} mono />
            <Field label={t("form.imageUrl")} value={form.productImage} onChange={v => set("productImage", v)} placeholder={t("form.imagePlaceholder")} mono />
            <Grid2>
              <Field label={t("form.brand")} value={form.productBrand} onChange={v => set("productBrand", v)} placeholder="Acme Inc" />
              <Field label={t("form.sku")} value={form.productSku} onChange={v => set("productSku", v)} placeholder="SKU-001" mono />
            </Grid2>
            <Field label={t("form.gtin")} value={form.productGtin} onChange={v => set("productGtin", v)} placeholder="012345678901" mono />
          </Section>
          <Section title={t("form.pricingAvailability")}>
            <Grid2>
              <Field label={t("form.price")} value={form.productPrice} onChange={v => set("productPrice", v)} placeholder={t("form.pricePlaceholder")} />
              <Field label={t("form.currency")} value={form.productCurrency} onChange={v => set("productCurrency", v)} placeholder="USD" />
            </Grid2>
            <Grid2>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">{t("form.availability")}</label>
                <select value={form.productAvail} onChange={e => set("productAvail", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-blue-400 transition-all">
                  {["InStock", "OutOfStock", "PreOrder", "BackOrder", "Discontinued", "LimitedAvailability"].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">{t("form.condition")}</label>
                <select value={form.productCondition} onChange={e => set("productCondition", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-blue-400 transition-all">
                  {["NewCondition", "UsedCondition", "RefurbishedCondition", "DamagedCondition"].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </Grid2>
          </Section>
          <Section title={t("form.productRatings")}>
            <Grid2>
              <Field label={t("form.avgRating")} value={form.productRating} onChange={v => set("productRating", v)} placeholder={t("form.ratingPlaceholder")} />
              <Field label={t("form.reviewCount")} value={form.productRatingCount} onChange={v => set("productRatingCount", v)} placeholder="128" />
            </Grid2>
          </Section>
        </div>
      );

      case "FAQ": return (
        <div className="flex flex-col gap-3">
          <Section title={t("form.faqItems")}>
            {form.faqItems.map((item, i) => (
              <div key={i} className="flex flex-col gap-2 p-3 rounded-xl border border-border bg-background">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground">{t("form.question")} {i + 1}</span>
                  <button onClick={() => set("faqItems", form.faqItems.filter((_, j) => j !== i))}
                    disabled={form.faqItems.length === 1}
                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:text-red-500 disabled:opacity-30 transition-all">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <Field label={t("form.question")} value={item.question} onChange={v => set("faqItems", form.faqItems.map((q, j) => j === i ? { ...q, question: v } : q))} placeholder={t("form.questionPlaceholder")} />
                <Field label={t("form.answer")} value={item.answer} onChange={v => set("faqItems", form.faqItems.map((q, j) => j === i ? { ...q, answer: v } : q))} placeholder={t("form.answerPlaceholder")} textarea rows={2} />
              </div>
            ))}
            <button onClick={() => set("faqItems", [...form.faqItems, { question: "", answer: "" }])}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-border hover:border-blue-300 hover:text-blue-500 text-xs font-medium text-muted-foreground transition-all">
              <Plus className="w-4 h-4" />{t("form.addQuestion")}
            </button>
          </Section>
        </div>
      );

      case "LocalBusiness": return (
        <div className="flex flex-col gap-3">
          <Section title={t("form.businessInfo") || "Business Info"}>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">{t("form.businessType")}</label>
              <select value={form.bizType} onChange={e => set("bizType", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-blue-400 transition-all">
                {["LocalBusiness", "Restaurant", "Store", "MedicalBusiness", "Hotel", "AutoDealer", "BeautySalon", "Dentist", "Doctor", "GroceryStore", "HealthAndBeautyBusiness", "Library", "LodgingBusiness", "MovieTheater", "Museum", "Pharmacy", "ProfessionalService", "SportsActivityLocation"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <Field label={t("form.businessName")} value={form.bizName} onChange={v => set("bizName", v)} placeholder={t("form.businessNamePlaceholder")} />
            <Field label={t("form.description")} value={form.bizDesc} onChange={v => set("bizDesc", v)} placeholder={t("form.descriptionPlaceholder")} textarea />
            <Field label={t("form.websiteUrl")} value={form.bizUrl} onChange={v => set("bizUrl", v)} placeholder={t("form.urlPlaceholder")} mono />
            <Field label={t("form.imageUrl")} value={form.bizImage} onChange={v => set("bizImage", v)} placeholder={t("form.imagePlaceholder")} mono />
            <Grid2>
              <Field label={t("form.phone")} value={form.bizPhone} onChange={v => set("bizPhone", v)} placeholder="+1 555-555-5555" />
              <Field label={t("form.email")} value={form.bizEmail} onChange={v => set("bizEmail", v)} placeholder="hello@example.com" />
            </Grid2>
            <Field label={t("form.priceRange")} value={form.bizPriceRange} onChange={v => set("bizPriceRange", v)} placeholder="$ / $$ / $$$ / $$$$" />
          </Section>
          <Section title={t("form.address")}>
            <Field label={t("form.streetAddress")} value={form.bizStreet} onChange={v => set("bizStreet", v)} placeholder="123 Main St" />
            <Grid2>
              <Field label={t("form.city")} value={form.bizCity} onChange={v => set("bizCity", v)} placeholder="New York" />
              <Field label={t("form.state")} value={form.bizState} onChange={v => set("bizState", v)} placeholder="NY" />
            </Grid2>
            <Grid2>
              <Field label={t("form.zip")} value={form.bizZip} onChange={v => set("bizZip", v)} placeholder="10001" />
              <Field label={t("form.country")} value={form.bizCountry} onChange={v => set("bizCountry", v)} placeholder="US" />
            </Grid2>
            <Grid2>
              <Field label={t("form.latitude")} value={form.bizLat} onChange={v => set("bizLat", v)} placeholder="40.7128" />
              <Field label={t("form.longitude")} value={form.bizLng} onChange={v => set("bizLng", v)} placeholder="-74.0060" />
            </Grid2>
          </Section>
          <Section title={t("form.openingHours")}>
            {form.bizHours.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <select value={h.day} onChange={e => set("bizHours", form.bizHours.map((x, j) => j === i ? { ...x, day: e.target.value } : x))}
                  className="flex-1 px-2 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input type="time" value={h.open} onChange={e => set("bizHours", form.bizHours.map((x, j) => j === i ? { ...x, open: e.target.value } : x))}
                  className="px-2 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all" aria-label="Open time" />
                <span className="text-muted-foreground text-xs">–</span>
                <input type="time" value={h.close} onChange={e => set("bizHours", form.bizHours.map((x, j) => j === i ? { ...x, close: e.target.value } : x))}
                  className="px-2 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all" aria-label="Close time" />
                <button onClick={() => set("bizHours", form.bizHours.filter((_, j) => j !== i))}
                  className="w-6 h-6 flex items-center justify-center hover:text-red-500 transition-all">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button onClick={() => set("bizHours", [...form.bizHours, { day: "Monday", open: "09:00", close: "17:00" }])}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-border hover:border-blue-300 hover:text-blue-500 text-xs font-medium text-muted-foreground transition-all self-start">
              <Plus className="w-3.5 h-3.5" />{t("form.addHours")}
            </button>
          </Section>
          <Section title={t("form.businessRating")}>
            <Grid2>
              <Field label={t("form.avgRating")} value={form.bizRating} onChange={v => set("bizRating", v)} placeholder="4.2" />
              <Field label={t("form.reviewCount")} value={form.bizRatingCount} onChange={v => set("bizRatingCount", v)} placeholder="256" />
            </Grid2>
          </Section>
        </div>
      );

      case "Recipe": return (
        <div className="flex flex-col gap-3">
          <Section title={t("form.recipeDetails")}>
            <Field label={t("form.recipeName")} value={form.recipeName} onChange={v => set("recipeName", v)} placeholder={t("form.recipeNamePlaceholder")} />
            <Field label={t("form.description")} value={form.recipeDesc} onChange={v => set("recipeDesc", v)} placeholder={t("form.descriptionPlaceholder")} textarea />
            <Field label={t("form.imageUrl")} value={form.recipeImage} onChange={v => set("recipeImage", v)} placeholder={t("form.imagePlaceholder")} mono />
            <Field label={t("form.authorName")} value={form.recipeAuthor} onChange={v => set("recipeAuthor", v)} placeholder={t("form.authorPlaceholder")} />
            <Grid2>
              <Field label={t("form.prepTime")} value={form.recipePrepTime} onChange={v => set("recipePrepTime", v)} placeholder="15" />
              <Field label={t("form.cookTime")} value={form.recipeCookTime} onChange={v => set("recipeCookTime", v)} placeholder="12" />
            </Grid2>
            <Grid2>
              <Field label={t("form.yield")} value={form.recipeYield} onChange={v => set("recipeYield", v)} placeholder="24 cookies" />
              <Field label={t("form.calories")} value={form.recipeCalories} onChange={v => set("recipeCalories", v)} placeholder="185 cal" />
            </Grid2>
            <Grid2>
              <Field label={t("form.category")} value={form.recipeCategory} onChange={v => set("recipeCategory", v)} placeholder="Dessert" />
              <Field label={t("form.cuisine")} value={form.recipeCuisine} onChange={v => set("recipeCuisine", v)} placeholder="American" />
            </Grid2>
          </Section>
          <Section title={t("form.ingredients")}>
            {form.recipeIngredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                <input value={ing.item} onChange={e => set("recipeIngredients", form.recipeIngredients.map((x, j) => j === i ? { item: e.target.value } : x))}
                  placeholder={t("form.ingredientPlaceholder", { n: i + 1 })}
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" aria-label={t("form.ingredientPlaceholder", { n: i + 1 })} />
                <button onClick={() => set("recipeIngredients", form.recipeIngredients.filter((_, j) => j !== i))}
                  disabled={form.recipeIngredients.length === 1}
                  className="w-8 h-8 flex items-center justify-center hover:text-red-500 disabled:opacity-30 transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button onClick={() => set("recipeIngredients", [...form.recipeIngredients, { item: "" }])}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-border hover:border-blue-300 hover:text-blue-500 text-xs font-medium text-muted-foreground transition-all self-start">
              <Plus className="w-3.5 h-3.5" />{t("form.addIngredient")}
            </button>
          </Section>
          <Section title={t("form.instructions")}>
            {form.recipeSteps.map((step, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-[10px] font-bold text-muted-foreground/50 w-5 pt-3 shrink-0">{i + 1}</span>
                <textarea value={step.text} onChange={e => set("recipeSteps", form.recipeSteps.map((x, j) => j === i ? { text: e.target.value } : x))}
                  placeholder={t("form.stepPlaceholder", { n: i + 1 })} rows={2}
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" />
                <button onClick={() => set("recipeSteps", form.recipeSteps.filter((_, j) => j !== i))}
                  disabled={form.recipeSteps.length === 1}
                  className="w-8 h-8 flex items-center justify-center hover:text-red-500 disabled:opacity-30 transition-all mt-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button onClick={() => set("recipeSteps", [...form.recipeSteps, { text: "" }])}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-border hover:border-blue-300 hover:text-blue-500 text-xs font-medium text-muted-foreground transition-all self-start">
              <Plus className="w-3.5 h-3.5" />{t("form.addStep")}
            </button>
          </Section>
        </div>
      );

      case "JobPosting": return (
        <div className="flex flex-col gap-3">
          <Section title={t("form.jobDetails")}>
            <Field label={t("form.jobTitle")} value={form.jobTitle} onChange={v => set("jobTitle", v)} placeholder={t("form.jobTitlePlaceholder")} />
            <Field label={t("form.jobDescription")} value={form.jobDesc} onChange={v => set("jobDesc", v)} placeholder={t("form.jobDescriptionPlaceholder")} textarea rows={4} />
            <Field label={t("form.jobUrl")} value={form.jobUrl} onChange={v => set("jobUrl", v)} placeholder={t("form.urlPlaceholder")} mono />
          </Section>
          <Section title={t("form.company")}>
            <Grid2>
              <Field label={t("form.companyName")} value={form.jobCompany} onChange={v => set("jobCompany", v)} placeholder="Acme Corp" />
              <Field label={t("form.companyUrl")} value={form.jobCompanyUrl} onChange={v => set("jobCompanyUrl", v)} placeholder="https://acme.com" mono />
            </Grid2>
          </Section>
          <Section title={t("form.locationType")}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-foreground">{t("form.remotePosition")}</p>
              <button onClick={() => set("jobRemote", !form.jobRemote)}
                className={`relative shrink-0 rounded-full transition-colors ${form.jobRemote ? "bg-blue-500" : "bg-border"}`}
                style={{ width: 36, height: 20 }}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.jobRemote ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </div>
            {!form.jobRemote && <Field label={t("form.location")} value={form.jobLocation} onChange={v => set("jobLocation", v)} placeholder="New York, NY" />}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">{t("form.employmentType")}</label>
              <select value={form.jobType} onChange={e => set("jobType", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-blue-400 transition-all">
                {["FULL_TIME", "PART_TIME", "CONTRACTOR", "TEMPORARY", "INTERN", "VOLUNTEER", "PER_DIEM", "OTHER"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <Grid2>
              <Field label={t("form.datePosted")} value={form.jobPostedDate} onChange={v => set("jobPostedDate", v)} type="date" />
              <Field label={t("form.validThrough")} value={form.jobValidThrough} onChange={v => set("jobValidThrough", v)} type="date" />
            </Grid2>
          </Section>
          <Section title={t("form.salary")}>
            <Grid2>
              <Field label={t("form.minSalary")} value={form.jobSalary.min} onChange={v => set("jobSalary", { ...form.jobSalary, min: v })} placeholder="80000" />
              <Field label={t("form.maxSalary")} value={form.jobSalary.max} onChange={v => set("jobSalary", { ...form.jobSalary, max: v })} placeholder="120000" />
            </Grid2>
            <Grid2>
              <Field label={t("form.salaryCurrency")} value={form.jobSalary.currency} onChange={v => set("jobSalary", { ...form.jobSalary, currency: v })} placeholder="USD" />
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">{t("form.period")}</label>
                <select value={form.jobSalary.period} onChange={e => set("jobSalary", { ...form.jobSalary, period: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-blue-400 transition-all">
                  {["HOUR", "DAY", "WEEK", "MONTH", "YEAR"].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </Grid2>
          </Section>
        </div>
      );

      case "BreadcrumbList": return (
        <Section title={t("form.breadcrumbItems")}>
          {form.breadcrumbs.map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground/40 w-4 tabular-nums">{i + 1}</span>
              <input value={b.name} onChange={e => set("breadcrumbs", form.breadcrumbs.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                placeholder={t("form.pageName")}
                className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" aria-label={t("form.pageName")} />
              <input value={b.url} onChange={e => set("breadcrumbs", form.breadcrumbs.map((x, j) => j === i ? { ...x, url: e.target.value } : x))}
                placeholder="https://…"
                className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" aria-label="URL" />
              <button onClick={() => set("breadcrumbs", form.breadcrumbs.filter((_, j) => j !== i))}
                disabled={form.breadcrumbs.length === 2}
                className="w-6 h-6 flex items-center justify-center hover:text-red-500 disabled:opacity-30 transition-all">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button onClick={() => set("breadcrumbs", [...form.breadcrumbs, { name: "", url: "" }])}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-border hover:border-blue-300 hover:text-blue-500 text-xs font-medium text-muted-foreground transition-all self-start">
            <Plus className="w-3.5 h-3.5" />{t("form.addItem")}
          </button>
        </Section>
      );

      case "Event": return (
        <div className="flex flex-col gap-3">
          <Section title={t("form.eventDetails")}>
            <Field label={t("form.eventName")} value={form.eventName} onChange={v => set("eventName", v)} placeholder={t("form.eventNamePlaceholder")} />
            <Field label={t("form.description")} value={form.eventDesc} onChange={v => set("eventDesc", v)} placeholder={t("form.descriptionPlaceholder")} textarea />
            <Field label={t("form.eventUrl")} value={form.eventUrl} onChange={v => set("eventUrl", v)} placeholder={t("form.urlPlaceholder")} mono />
            <Field label={t("form.eventImage")} value={form.eventImage} onChange={v => set("eventImage", v)} placeholder={t("form.imagePlaceholder")} mono />
            <Grid2>
              <Field label={t("form.startDate")} value={form.eventStartDate} onChange={v => set("eventStartDate", v)} type="datetime-local" />
              <Field label={t("form.endDate")} value={form.eventEndDate} onChange={v => set("eventEndDate", v)} type="datetime-local" />
            </Grid2>
            <Grid2>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">{t("form.status")}</label>
                <select value={form.eventStatus} onChange={e => set("eventStatus", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all">
                  {["EventScheduled", "EventCancelled", "EventPostponed", "EventRescheduled", "EventMovedOnline"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">{t("form.mode")}</label>
                <select value={form.eventMode} onChange={e => set("eventMode", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all">
                  {["OfflineEventAttendanceMode", "OnlineEventAttendanceMode", "MixedEventAttendanceMode"].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </Grid2>
          </Section>
          <Section title={t("form.locationOrganizer")}>
            <Field label={t("form.venueName")} value={form.eventLocation} onChange={v => set("eventLocation", v)} placeholder="Madison Square Garden" />
            <Field label={t("form.city")} value={form.eventCity} onChange={v => set("eventCity", v)} placeholder="New York" />
            <Field label={t("form.organizerName")} value={form.eventOrganizerName} onChange={v => set("eventOrganizerName", v)} placeholder="Tech Events LLC" />
          </Section>
          <Section title={t("form.pricing")}>
            <Grid2>
              <Field label={t("form.price")} value={form.eventPrice} onChange={v => set("eventPrice", v)} placeholder="25.00" />
              <Field label={t("form.currency")} value={form.eventCurrency} onChange={v => set("eventCurrency", v)} placeholder="USD" />
            </Grid2>
          </Section>
        </div>
      );

      case "Review": return (
        <Section title={t("form.reviewDetails")}>
          <Grid2>
            <Field label={t("form.itemReviewed")} value={form.reviewItemName} onChange={v => set("reviewItemName", v)} placeholder="Wireless Headphones" />
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">{t("form.itemType")}</label>
              <select value={form.reviewItemType} onChange={e => set("reviewItemType", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-blue-400 transition-all">
                {["Product", "Book", "Movie", "Restaurant", "LocalBusiness", "SoftwareApplication", "MusicAlbum"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </Grid2>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">{t("form.reviewRatingDisplay", { n: form.reviewRating })}</label>
            <input type="range" min={1} max={5} step={0.5} value={form.reviewRating}
              onChange={e => set("reviewRating", parseFloat(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-border accent-amber-400 cursor-pointer" />
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`w-4 h-4 ${s <= form.reviewRating ? "text-amber-400 fill-amber-400" : "text-border"}`} />
              ))}
            </div>
          </div>
          <Field label={t("form.reviewBody")} value={form.reviewBody} onChange={v => set("reviewBody", v)} placeholder={t("form.reviewBodyPlaceholder")} textarea rows={3} />
          <Grid2>
            <Field label={t("form.authorName")} value={form.reviewAuthor} onChange={v => set("reviewAuthor", v)} placeholder={t("form.authorPlaceholder")} />
            <Field label={t("form.reviewDate")} value={form.reviewDate} onChange={v => set("reviewDate", v)} type="date" />
          </Grid2>
          <Field label={t("form.reviewUrl")} value={form.reviewUrl} onChange={v => set("reviewUrl", v)} placeholder={t("form.urlPlaceholder")} mono />
        </Section>
      );

      case "VideoObject": return (
        <Section title={t("form.videoDetails")}>
          <Field label={t("form.videoName")} value={form.videoName} onChange={v => set("videoName", v)} placeholder={t("form.videoNamePlaceholder")} />
          <Field label={t("form.description")} value={form.videoDesc} onChange={v => set("videoDesc", v)} placeholder={t("form.descriptionPlaceholder")} textarea />
          <Field label={t("form.contentUrl")} value={form.videoUrl} onChange={v => set("videoUrl", v)} placeholder="https://…/video.mp4" mono />
          <Field label={t("form.embedUrl")} value={form.videoEmbedUrl} onChange={v => set("videoEmbedUrl", v)} placeholder="https://youtube.com/embed/…" mono />
          <Field label={t("form.thumbnailUrl")} value={form.videoThumbnail} onChange={v => set("videoThumbnail", v)} placeholder="https://…/thumb.jpg" mono />
          <Grid2>
            <Field label={t("form.uploadDate")} value={form.videoUploadDate} onChange={v => set("videoUploadDate", v)} type="date" />
            <Field label={t("form.duration")} value={form.videoDuration} onChange={v => set("videoDuration", v)} placeholder="PT5M30S" hint={t("form.durationHint")} />
          </Grid2>
        </Section>
      );

      case "Course": return (
        <Section title={t("form.courseDetails")}>
          <Field label={t("form.courseName")} value={form.courseName} onChange={v => set("courseName", v)} placeholder={t("form.courseNamePlaceholder")} />
          <Field label={t("form.description")} value={form.courseDesc} onChange={v => set("courseDesc", v)} placeholder={t("form.descriptionPlaceholder")} textarea />
          <Field label={t("form.courseUrl")} value={form.courseUrl} onChange={v => set("courseUrl", v)} placeholder={t("form.urlPlaceholder")} mono />
          <Field label={t("form.providerName")} value={form.courseProvider} onChange={v => set("courseProvider", v)} placeholder="Udemy" />
          <Grid2>
            <Field label={t("form.price")} value={form.coursePrice} onChange={v => set("coursePrice", v)} placeholder="49.99" />
            <Field label={t("form.currency")} value={form.courseCurrency} onChange={v => set("courseCurrency", v)} placeholder="USD" />
          </Grid2>
        </Section>
      );

      case "Organization": return (
        <Section title={t("form.organizationDetails")}>
          <Field label={t("form.name")} value={form.orgName} onChange={v => set("orgName", v)} placeholder="Acme Corporation" />
          <Field label={t("form.websiteUrl")} value={form.orgUrl} onChange={v => set("orgUrl", v)} placeholder="https://acme.com" mono />
          <Field label={t("form.logoUrl")} value={form.orgLogo} onChange={v => set("orgLogo", v)} placeholder="https://acme.com/logo.png" mono />
          <Field label={t("form.description")} value={form.orgDesc} onChange={v => set("orgDesc", v)} placeholder="We build amazing software…" textarea />
          <Grid2>
            <Field label={t("form.email")} value={form.orgEmail} onChange={v => set("orgEmail", v)} placeholder="info@acme.com" />
            <Field label={t("form.phone")} value={form.orgPhone} onChange={v => set("orgPhone", v)} placeholder="+1 555-555-5555" />
          </Grid2>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">{t("form.socialProfiles")}</label>
            {form.orgSameAs.map((url, i) => (
              <div key={i} className="flex gap-2 mb-1.5">
                <input value={url} onChange={e => set("orgSameAs", form.orgSameAs.map((x, j) => j === i ? e.target.value : x))}
                  placeholder={t("form.profilePlaceholder")}
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" aria-label={t("form.socialProfiles")} />
                <button onClick={() => set("orgSameAs", form.orgSameAs.filter((_, j) => j !== i))}
                  className="w-7 h-7 flex items-center justify-center hover:text-red-500 transition-all">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button onClick={() => set("orgSameAs", [...form.orgSameAs, ""])}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-border hover:border-blue-300 hover:text-blue-500 text-xs font-medium text-muted-foreground transition-all">
              <Plus className="w-3.5 h-3.5" />{t("form.addProfile")}
            </button>
          </div>
        </Section>
      );

      case "Person": return (
        <Section title={t("form.personDetails")}>
          <Grid2>
            <Field label={t("form.fullName")} value={form.personName} onChange={v => set("personName", v)} placeholder="Jane Smith" />
            <Field label={t("form.jobTitle")} value={form.personJobTitle} onChange={v => set("personJobTitle", v)} placeholder="Software Engineer" />
          </Grid2>
          <Field label={t("form.profileUrl")} value={form.personUrl} onChange={v => set("personUrl", v)} placeholder={t("form.urlPlaceholder")} mono />
          <Field label={t("form.imageUrl")} value={form.personImage} onChange={v => set("personImage", v)} placeholder={t("form.imagePlaceholder")} mono />
          <Field label={t("form.email")} value={form.personEmail} onChange={v => set("personEmail", v)} placeholder="jane@example.com" />
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">{t("form.socialProfiles")}</label>
            {form.personSameAs.map((url, i) => (
              <div key={i} className="flex gap-2 mb-1.5">
                <input value={url} onChange={e => set("personSameAs", form.personSameAs.map((x, j) => j === i ? e.target.value : x))}
                  placeholder={t("form.profilePlaceholder")}
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" aria-label={t("form.socialProfiles")} />
                <button onClick={() => set("personSameAs", form.personSameAs.filter((_, j) => j !== i))}
                  className="w-7 h-7 flex items-center justify-center hover:text-red-500 transition-all">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button onClick={() => set("personSameAs", [...form.personSameAs, ""])}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-border hover:border-blue-300 hover:text-blue-500 text-xs font-medium text-muted-foreground transition-all">
              <Plus className="w-3.5 h-3.5" />{t("form.addProfile")}
            </button>
          </div>
        </Section>
      );

      case "WebSite": return (
        <Section title={t("form.websiteDetails")}>
          <Field label={t("form.siteName")} value={form.siteName} onChange={v => set("siteName", v)} placeholder="My Awesome Website" />
          <Field label={t("form.url")} value={form.siteUrl} onChange={v => set("siteUrl", v)} placeholder={t("form.urlPlaceholder")} mono />
          <Field label={t("form.description")} value={form.siteDesc} onChange={v => set("siteDesc", v)} placeholder={t("form.descriptionPlaceholder")} textarea />
          <Field label={t("form.searchUrl")} value={form.searchUrl} onChange={v => set("searchUrl", v)}
            placeholder={t("form.searchUrlPlaceholder")} mono
            hint={t("form.searchUrlHint")} />
        </Section>
      );

      default: return null;
    }
  };

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="seo-tools/SchemaMarkupGeneratorTool.json" href="/seo-tools" />

        {/* Header */}
        <Header tKey="seo-tools/SchemaMarkupGeneratorTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Type picker + Form ── */}
          <div className="flex flex-col gap-5">

            {/* Schema type grid */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("schemaType.title")}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {SCHEMA_TYPES.map(({ type, icon: Icon, badge }) => (
                  <button key={type} onClick={() => setSchemaType(type)}
                    className={`flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-xl border text-start transition-all relative ${schemaType === type
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                      : "border-border bg-card hover:border-blue-200 dark:hover:border-blue-800/40"
                      }`}>
                    {badge && (
                      <span className={`absolute top-1.5 ${isAr ? "left-2" : "right-1.5"} text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400`}>
                        {t(`schemaType.${badge}`)}
                      </span>
                    )}
                    <Icon className={`w-4 h-4 mb-0.5 ${schemaType === type ? "text-blue-500" : "text-muted-foreground/60"}`} />
                    <p className={`text-[10px] font-bold leading-tight ${schemaType === type ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>{t(`schemaType.${type}.label`)}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-3 max-h-[75vh] overflow-y-auto pr-1">
              {renderForm()}
            </div>

            {/* Reset */}
            <button onClick={resetForm}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card hover:border-red-300 hover:text-red-500 text-xs font-medium transition-all">
              <RefreshCw className="w-3.5 h-3.5" /> {t("reset.button")}
            </button>
          </div>

          {/* ── Right: Output ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            <ScriptTag scriptTag={scriptTag} download={download} />

            {/* JSON only */}
            <JSONOnly jsonStr={jsonStr} />

            {/* Testing tools */}
            <TestingTools />
          </div>
        </div>

        {/* How‑to / FAQ / Examples */}
        <HowToUse tKey="seo-tools/SchemaMarkupGeneratorTool.json" count={4} />
        <FAQ tKey="seo-tools/SchemaMarkupGeneratorTool.json" />
        <Examples tKey="seo-tools/SchemaMarkupGeneratorTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}