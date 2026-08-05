export type Project = {
  slug: string;
  title: string;
  year: number;
  tagline: string;           // one-liner for cards
  description: string[];     // paragraphs for the detail page
  tech: string[];            // mono chips
  tags: string[];            // filterable categories
  cover: string;             // "/covers/<slug>-1200.webp"
  github: string;
  demo?: string;
  featured: boolean;
};

export type SkillGroup = { category: string; skills: string[] };

export type ExperienceEntry = {
  year: string;              // "2024", "2025", "2026"
  title: string;
  description: string;
};

export type Profile = {
  name: string;
  title: string;
  location: string;
  headline: string;          // hero serif headline
  bio: string;               // home hero one-liner
  about: string[];           // about page paragraphs
  email: string;
  availability: string;
  stats: { value: number; label: string; suffix?: string }[];
};

export type Social = { label: string; href: string; icon: "github" | "mail" | "external"; handle?: string };

export type Post = {
  title: string;
  slug: string;
  description: string;
  date: string;
  categories: string[];
  published: boolean;
};

export type SiteConfig = {
  name: string;
  url: string;
  description: string;
};
