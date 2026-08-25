import { createClient } from "@supabase/supabase-js";

export type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  tag: string;
  imageUrl: string;
};

export type PortfolioContent = {
  brand: string;
  headline: string;
  intro: string;
  contactEmail: string;
  heroImageUrl: string;
  profileImageUrl: string;
  skills: string[];
  projects: PortfolioProject[];
};

export const DEFAULT_ADMIN_USERNAME = "Admin01";
export const DEFAULT_ADMIN_PASSWORD = "Admin4321";

export const defaultPortfolioContent: PortfolioContent = {
  brand: "Ellest Ingz",
  headline: "Building thoughtful digital experiences.",
  intro:
    "I design and build clean, high-impact products that blend technical precision with craft. My work sits between engineering, product, and creative problem-solving.",
  contactEmail: "hello@ellest.dev",
  heroImageUrl:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  profileImageUrl:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  skills: ["React", "Next.js", "TypeScript", "Node.js", "UI Design", "Product Thinking"],
  projects: [
    {
      id: "project-1",
      title: "Portfolio Experience",
      description:
        "A sleek personal brand website designed to highlight work, story, and technical capability in a modern, conversion-friendly layout.",
      tag: "Brand Website",
      imageUrl:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "project-2",
      title: "Product Design System",
      description:
        "A reusable design language and component system built to keep digital products consistent, accessible, and fast to ship.",
      tag: "Design System",
      imageUrl:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "project-3",
      title: "Creative Tech Experiments",
      description:
        "Explorations at the intersection of code, visualization, and interaction to build memorable and useful user experiences.",
      tag: "Experiments",
      imageUrl:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    },
  ],
};

let inMemoryContent: PortfolioContent = { ...defaultPortfolioContent };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export function normalizeContent(content?: Partial<PortfolioContent>): PortfolioContent {
  return {
    ...defaultPortfolioContent,
    ...content,
    skills: content?.skills?.length ? content.skills : defaultPortfolioContent.skills,
    projects: content?.projects?.length ? content.projects : defaultPortfolioContent.projects,
  };
}

export async function getSiteContent(): Promise<PortfolioContent> {
  if (supabase) {
    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("id", "portfolio-home")
      .maybeSingle();

    if (!error && data?.content) {
      const parsed = typeof data.content === "string" ? JSON.parse(data.content) : data.content;
      const safeContent = normalizeContent(parsed as Partial<PortfolioContent>);
      inMemoryContent = safeContent;
      return safeContent;
    }
  }

  return inMemoryContent;
}

export async function saveSiteContent(content: PortfolioContent): Promise<PortfolioContent> {
  const normalized = normalizeContent(content);
  inMemoryContent = normalized;

  if (supabase) {
    const { error } = await supabase.from("site_content").upsert({
      id: "portfolio-home",
      content: normalized,
    });

    if (error) {
      console.error("Supabase content save failed:", error);
    }
  }

  return normalized;
}
