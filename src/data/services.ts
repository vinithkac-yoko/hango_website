export type PricingTier = {
  name: string;
  features: string[];
};

export type RetainerService = {
  slug: string;
  title: string;
  description: string;
  includes: string[];
  tiers: PricingTier[];
};

export type ProjectService = {
  slug: string;
  title: string;
  description: string;
  includes: string[];
  pricingNote: string;
};

export const retainerService: RetainerService = {
  slug: "digital-marketing-package",
  title: "Digital Marketing Monthly Package",
  description:
    "A recurring retainer covering social media marketing, SEO, SEM, performance ads, and content marketing — built to grow with you.",
  includes: [
    "Social Media Marketing",
    "Search Engine Optimization (SEO)",
    "Google Ads",
    "Meta Ads",
    "Performance Marketing",
    "Content Marketing",
  ],
  tiers: [
    {
      name: "Starter",
      features: ["2 platforms", "Basic SEO", "Monthly report"],
    },
    {
      name: "Growth",
      features: ["All channels + SEM", "Content marketing", "Bi-weekly report"],
    },
    {
      name: "Premium",
      features: ["Full-stack service", "Dedicated manager", "Weekly strategy calls"],
    },
  ],
};

export const projectServices: ProjectService[] = [
  {
    slug: "video-shoot",
    title: "Video Shoot",
    description:
      "Reels, ad films, documentaries, and short films — full shoot and post-production.",
    includes: ["Videography", "Advertisement Films", "Reels Production"],
    pricingNote: "Package + custom quote for larger productions",
  },
  {
    slug: "photoshoot",
    title: "Photoshoot",
    description:
      "Product photography, model and portfolio shoots, and brand campaign shoots.",
    includes: ["Product Photography", "Commercial Photography"],
    pricingNote: "Package + custom quote",
  },
  {
    slug: "creative-design",
    title: "Video Editing & Print Design",
    description:
      "Posters, flyers, brochures, flex banners, pamphlets, and invitations — standalone or bundled.",
    includes: ["Video Editing", "Posters", "Flyers", "Brochures", "Pamphlets", "Business Collaterals"],
    pricingNote: "Fixed packages per deliverable",
  },
  {
    slug: "website-optimization",
    title: "Website Optimization",
    description:
      "Speed, SEO, and UI/UX improvements plus Core Web Vitals fixes for an existing website.",
    includes: ["Website Optimization", "UI/UX Improvements"],
    pricingNote: "Package + custom quote",
  },
  {
    slug: "brand-design",
    title: "Brand Logo & Asset Design",
    description:
      "Logo, brand kit, colour palette, typography, and a full brand guidelines document.",
    includes: ["Brand Identity", "Logo Design"],
    pricingNote: "Fixed packages",
  },
  {
    slug: "consultation",
    title: "Digital Marketing Consultation",
    description:
      "Strategy audit, campaign review, and a one-on-one business advisory session.",
    includes: ["Marketing Strategy", "Campaign Planning", "AI-Powered Business Solutions"],
    pricingNote: "Fixed per session",
  },
  {
    slug: "website-development",
    title: "Website Development",
    description:
      "Custom websites with AI features — for businesses, portfolios, and landing pages.",
    includes: ["Website Development", "Landing Pages"],
    pricingNote: "Package + custom quote",
  },
  {
    slug: "seo",
    title: "SEO — Search Engine Optimisation",
    description:
      "On-page, off-page, and technical SEO with keyword research and a full audit report.",
    includes: ["Search Engine Optimization (SEO)"],
    pricingNote: "Package + custom quote",
  },
  {
    slug: "ads",
    title: "Meta Ads & Google Ads",
    description: "Campaign setup, creatives, targeting, and pixel/tracking configuration.",
    includes: ["Google Ads", "Meta Ads", "Performance Marketing"],
    pricingNote: "Fixed setup fee + % of ad spend",
  },
];
