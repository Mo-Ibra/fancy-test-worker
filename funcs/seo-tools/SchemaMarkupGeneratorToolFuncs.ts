
// ── Types ──────────────────────────────────────────────────────────

export type SchemaType =
  | "Article"
  | "Product"
  | "FAQ"
  | "LocalBusiness"
  | "Person"
  | "Recipe"
  | "JobPosting"
  | "BreadcrumbList"
  | "Event"
  | "Review"
  | "VideoObject"
  | "Course"
  | "Organization"
  | "WebSite";

export interface FAQItem { question: string; answer: string; }
export interface ReviewItem { author: string; rating: number; body: string; date: string; }
export interface BreadcrumbItem { name: string; url: string; }
export interface RecipeIngredient { item: string; }
export interface RecipeStep { text: string; }
export interface OpeningHour { day: string; open: string; close: string; }
export interface JobSalary { min: string; max: string; currency: string; period: string; }

// ── Schema form data ───────────────────────────────────────────────

export interface SchemaForm {
  // Article
  articleType: string;
  headline: string;
  articleBody: string;
  articleImage: string;
  articleAuthor: string;
  authorUrl: string;
  publishedDate: string;
  modifiedDate: string;
  articleUrl: string;
  publisherName: string;
  publisherLogo: string;
  // Product
  productName: string;
  productDesc: string;
  productImage: string;
  productBrand: string;
  productSku: string;
  productGtin: string;
  productPrice: string;
  productCurrency: string;
  productAvail: string;
  productCondition: string;
  productRating: string;
  productRatingCount: string;
  productUrl: string;
  // FAQ
  faqItems: FAQItem[];
  // LocalBusiness
  bizType: string;
  bizName: string;
  bizDesc: string;
  bizUrl: string;
  bizPhone: string;
  bizEmail: string;
  bizStreet: string;
  bizCity: string;
  bizState: string;
  bizZip: string;
  bizCountry: string;
  bizLat: string;
  bizLng: string;
  bizPriceRange: string;
  bizRating: string;
  bizRatingCount: string;
  bizImage: string;
  bizHours: OpeningHour[];
  // Person
  personName: string;
  personJobTitle: string;
  personUrl: string;
  personImage: string;
  personEmail: string;
  personSameAs: string[];
  // Recipe
  recipeName: string;
  recipeDesc: string;
  recipeImage: string;
  recipeAuthor: string;
  recipePrepTime: string;
  recipeCookTime: string;
  recipeYield: string;
  recipeCategory: string;
  recipeCuisine: string;
  recipeCalories: string;
  recipeIngredients: RecipeIngredient[];
  recipeSteps: RecipeStep[];
  recipeRating: string;
  recipeRatingCount: string;
  // JobPosting
  jobTitle: string;
  jobDesc: string;
  jobUrl: string;
  jobCompany: string;
  jobCompanyUrl: string;
  jobLocation: string;
  jobRemote: boolean;
  jobType: string;
  jobPostedDate: string;
  jobValidThrough: string;
  jobSalary: JobSalary;
  // BreadcrumbList
  breadcrumbs: BreadcrumbItem[];
  // Event
  eventName: string;
  eventDesc: string;
  eventUrl: string;
  eventImage: string;
  eventStartDate: string;
  eventEndDate: string;
  eventStatus: string;
  eventMode: string;
  eventLocation: string;
  eventCity: string;
  eventOrganizerName: string;
  eventPrice: string;
  eventCurrency: string;
  // Review
  reviewItemName: string;
  reviewItemType: string;
  reviewRating: number;
  reviewBody: string;
  reviewAuthor: string;
  reviewDate: string;
  reviewUrl: string;
  // VideoObject
  videoName: string;
  videoDesc: string;
  videoUrl: string;
  videoThumbnail: string;
  videoUploadDate: string;
  videoDuration: string;
  videoEmbedUrl: string;
  // Course
  courseName: string;
  courseDesc: string;
  courseUrl: string;
  courseProvider: string;
  coursePrice: string;
  courseCurrency: string;
  // Organization
  orgName: string;
  orgUrl: string;
  orgLogo: string;
  orgDesc: string;
  orgEmail: string;
  orgPhone: string;
  orgSameAs: string[];
  // WebSite
  siteName: string;
  siteUrl: string;
  siteDesc: string;
  searchUrl: string;
}

export const DEFAULTS: SchemaForm = {
  articleType: "Article", headline: "", articleBody: "", articleImage: "", articleAuthor: "",
  authorUrl: "", publishedDate: "", modifiedDate: "", articleUrl: "", publisherName: "", publisherLogo: "",
  productName: "", productDesc: "", productImage: "", productBrand: "", productSku: "", productGtin: "",
  productPrice: "", productCurrency: "USD", productAvail: "InStock", productCondition: "NewCondition",
  productRating: "", productRatingCount: "", productUrl: "",
  faqItems: [{ question: "", answer: "" }],
  bizType: "LocalBusiness", bizName: "", bizDesc: "", bizUrl: "", bizPhone: "", bizEmail: "",
  bizStreet: "", bizCity: "", bizState: "", bizZip: "", bizCountry: "US", bizLat: "", bizLng: "",
  bizPriceRange: "$$", bizRating: "", bizRatingCount: "", bizImage: "",
  bizHours: [{ day: "Monday", open: "09:00", close: "17:00" }],
  personName: "", personJobTitle: "", personUrl: "", personImage: "", personEmail: "", personSameAs: [""],
  recipeName: "", recipeDesc: "", recipeImage: "", recipeAuthor: "", recipePrepTime: "", recipeCookTime: "",
  recipeYield: "", recipeCategory: "", recipeCuisine: "", recipeCalories: "",
  recipeIngredients: [{ item: "" }], recipeSteps: [{ text: "" }], recipeRating: "", recipeRatingCount: "",
  jobTitle: "", jobDesc: "", jobUrl: "", jobCompany: "", jobCompanyUrl: "", jobLocation: "", jobRemote: false,
  jobType: "FULL_TIME", jobPostedDate: "", jobValidThrough: "",
  jobSalary: { min: "", max: "", currency: "USD", period: "YEAR" },
  breadcrumbs: [{ name: "Home", url: "https://example.com/" }, { name: "", url: "" }],
  eventName: "", eventDesc: "", eventUrl: "", eventImage: "", eventStartDate: "", eventEndDate: "",
  eventStatus: "EventScheduled", eventMode: "OfflineEventAttendanceMode", eventLocation: "", eventCity: "",
  eventOrganizerName: "", eventPrice: "", eventCurrency: "USD",
  reviewItemName: "", reviewItemType: "Product", reviewRating: 5, reviewBody: "", reviewAuthor: "",
  reviewDate: "", reviewUrl: "",
  videoName: "", videoDesc: "", videoUrl: "", videoThumbnail: "", videoUploadDate: "",
  videoDuration: "PT5M30S", videoEmbedUrl: "",
  courseName: "", courseDesc: "", courseUrl: "", courseProvider: "", coursePrice: "", courseCurrency: "USD",
  orgName: "", orgUrl: "", orgLogo: "", orgDesc: "", orgEmail: "", orgPhone: "", orgSameAs: [""],
  siteName: "", siteUrl: "", siteDesc: "", searchUrl: "",
};

// ── JSON-LD generators ─────────────────────────────────────────────

function cleanObj(obj: any): any {
  if (Array.isArray(obj)) return obj.map(cleanObj).filter(v => v !== null && v !== undefined && v !== "");
  if (typeof obj === "object" && obj !== null) {
    const result: any = {};
    for (const [k, v] of Object.entries(obj)) {
      const cleaned = cleanObj(v);
      if (cleaned !== null && cleaned !== undefined && cleaned !== "" &&
        !(Array.isArray(cleaned) && cleaned.length === 0)) {
        result[k] = cleaned;
      }
    }
    return Object.keys(result).length > 0 ? result : null;
  }
  return obj;
}

function isoDate(d: string): string { return d ? d.split("T")[0] : ""; }

export function generateSchema(type: SchemaType, f: SchemaForm): object {
  const ctx = "https://schema.org";

  switch (type) {

    case "Article": return cleanObj({
      "@context": ctx, "@type": f.articleType || "Article",
      headline: f.headline, description: f.articleBody,
      image: f.articleImage,
      author: f.articleAuthor ? { "@type": "Person", name: f.articleAuthor, url: f.authorUrl || undefined } : undefined,
      publisher: f.publisherName ? {
        "@type": "Organization", name: f.publisherName,
        logo: f.publisherLogo ? { "@type": "ImageObject", url: f.publisherLogo } : undefined
      } : undefined,
      datePublished: isoDate(f.publishedDate), dateModified: isoDate(f.modifiedDate),
      url: f.articleUrl,
    });

    case "Product": return cleanObj({
      "@context": ctx, "@type": "Product",
      name: f.productName, description: f.productDesc, image: f.productImage,
      brand: f.productBrand ? { "@type": "Brand", name: f.productBrand } : undefined,
      sku: f.productSku, gtin: f.productGtin, url: f.productUrl,
      offers: {
        "@type": "Offer", price: f.productPrice, priceCurrency: f.productCurrency,
        availability: `https://schema.org/${f.productAvail}`,
        itemCondition: `https://schema.org/${f.productCondition}`
      },
      aggregateRating: f.productRating ? {
        "@type": "AggregateRating", ratingValue: f.productRating, reviewCount: f.productRatingCount
      } : undefined,
    });

    case "FAQ": return cleanObj({
      "@context": ctx, "@type": "FAQPage",
      mainEntity: f.faqItems.filter(q => q.question && q.answer).map(q => ({
        "@type": "Question", name: q.question,
        acceptedAnswer: { "@type": "Answer", text: q.answer },
      })),
    });

    case "LocalBusiness": return cleanObj({
      "@context": ctx, "@type": f.bizType || "LocalBusiness",
      name: f.bizName, description: f.bizDesc, url: f.bizUrl,
      image: f.bizImage, telephone: f.bizPhone, email: f.bizEmail,
      priceRange: f.bizPriceRange,
      address: {
        "@type": "PostalAddress", streetAddress: f.bizStreet, addressLocality: f.bizCity,
        addressRegion: f.bizState, postalCode: f.bizZip, addressCountry: f.bizCountry
      },
      geo: f.bizLat && f.bizLng ? { "@type": "GeoCoordinates", latitude: f.bizLat, longitude: f.bizLng } : undefined,
      openingHoursSpecification: f.bizHours.filter(h => h.day && h.open && h.close).map(h => ({
        "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${h.day}`,
        opens: h.open, closes: h.close,
      })),
      aggregateRating: f.bizRating ? {
        "@type": "AggregateRating", ratingValue: f.bizRating, reviewCount: f.bizRatingCount
      } : undefined,
    });

    case "Person": return cleanObj({
      "@context": ctx, "@type": "Person",
      name: f.personName, jobTitle: f.personJobTitle, url: f.personUrl,
      image: f.personImage, email: f.personEmail,
      sameAs: f.personSameAs.filter(Boolean),
    });

    case "Recipe": return cleanObj({
      "@context": ctx, "@type": "Recipe",
      name: f.recipeName, description: f.recipeDesc, image: f.recipeImage,
      author: f.recipeAuthor ? { "@type": "Person", name: f.recipeAuthor } : undefined,
      prepTime: f.recipePrepTime ? `PT${f.recipePrepTime}M` : undefined,
      cookTime: f.recipeCookTime ? `PT${f.recipeCookTime}M` : undefined,
      recipeYield: f.recipeYield, recipeCategory: f.recipeCategory,
      recipeCuisine: f.recipeCuisine,
      nutrition: f.recipeCalories ? { "@type": "NutritionInformation", calories: f.recipeCalories } : undefined,
      recipeIngredient: f.recipeIngredients.map(i => i.item).filter(Boolean),
      recipeInstructions: f.recipeSteps.filter(s => s.text).map((s, i) => ({
        "@type": "HowToStep", position: i + 1, text: s.text,
      })),
      aggregateRating: f.recipeRating ? {
        "@type": "AggregateRating", ratingValue: f.recipeRating, reviewCount: f.recipeRatingCount
      } : undefined,
    });

    case "JobPosting": return cleanObj({
      "@context": ctx, "@type": "JobPosting",
      title: f.jobTitle, description: f.jobDesc, url: f.jobUrl,
      hiringOrganization: { "@type": "Organization", name: f.jobCompany, sameAs: f.jobCompanyUrl },
      jobLocation: f.jobRemote ? undefined : { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: f.jobLocation } },
      jobLocationType: f.jobRemote ? "TELECOMMUTE" : undefined,
      employmentType: f.jobType,
      datePosted: isoDate(f.jobPostedDate), validThrough: isoDate(f.jobValidThrough),
      baseSalary: f.jobSalary.min ? {
        "@type": "MonetaryAmount", currency: f.jobSalary.currency,
        value: {
          "@type": "QuantitativeValue", minValue: f.jobSalary.min, maxValue: f.jobSalary.max || undefined,
          unitText: f.jobSalary.period
        },
      } : undefined,
    });

    case "BreadcrumbList": return cleanObj({
      "@context": ctx, "@type": "BreadcrumbList",
      itemListElement: f.breadcrumbs.filter(b => b.name && b.url).map((b, i) => ({
        "@type": "ListItem", position: i + 1, name: b.name, item: b.url,
      })),
    });

    case "Event": return cleanObj({
      "@context": ctx, "@type": "Event",
      name: f.eventName, description: f.eventDesc, url: f.eventUrl, image: f.eventImage,
      startDate: f.eventStartDate, endDate: f.eventEndDate,
      eventStatus: `https://schema.org/${f.eventStatus}`,
      eventAttendanceMode: `https://schema.org/${f.eventMode}`,
      location: {
        "@type": "Place", name: f.eventLocation,
        address: { "@type": "PostalAddress", addressLocality: f.eventCity }
      },
      organizer: f.eventOrganizerName ? { "@type": "Organization", name: f.eventOrganizerName } : undefined,
      offers: f.eventPrice ? {
        "@type": "Offer", price: f.eventPrice, priceCurrency: f.eventCurrency,
        availability: "https://schema.org/InStock"
      } : undefined,
    });

    case "Review": return cleanObj({
      "@context": ctx, "@type": "Review",
      itemReviewed: { "@type": f.reviewItemType, name: f.reviewItemName },
      reviewRating: { "@type": "Rating", ratingValue: f.reviewRating, bestRating: 5, worstRating: 1 },
      reviewBody: f.reviewBody,
      author: { "@type": "Person", name: f.reviewAuthor },
      datePublished: isoDate(f.reviewDate),
      url: f.reviewUrl,
    });

    case "VideoObject": return cleanObj({
      "@context": ctx, "@type": "VideoObject",
      name: f.videoName, description: f.videoDesc, contentUrl: f.videoUrl,
      thumbnailUrl: f.videoThumbnail, uploadDate: isoDate(f.videoUploadDate),
      duration: f.videoDuration, embedUrl: f.videoEmbedUrl,
    });

    case "Course": return cleanObj({
      "@context": ctx, "@type": "Course",
      name: f.courseName, description: f.courseDesc, url: f.courseUrl,
      provider: f.courseProvider ? { "@type": "Organization", name: f.courseProvider } : undefined,
      offers: f.coursePrice ? {
        "@type": "Offer", price: f.coursePrice, priceCurrency: f.courseCurrency
      } : undefined,
    });

    case "Organization": return cleanObj({
      "@context": ctx, "@type": "Organization",
      name: f.orgName, url: f.orgUrl, logo: f.orgLogo,
      description: f.orgDesc, email: f.orgEmail, telephone: f.orgPhone,
      sameAs: f.orgSameAs.filter(Boolean),
    });

    case "WebSite": return cleanObj({
      "@context": ctx, "@type": "WebSite",
      name: f.siteName, url: f.siteUrl, description: f.siteDesc,
      potentialAction: f.searchUrl ? {
        "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: f.searchUrl },
        "query-input": "required name=search_term_string",
      } : undefined,
    });

    default: return { "@context": ctx };
  }
}

// ── Helpers ────────────────────────────────────────────────────────

export function uid() { return Math.random().toString(36).slice(2, 8); }