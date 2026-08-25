"use client";

import { useEffect, useState } from "react";
import type { PortfolioContent, PortfolioProject } from "@/lib/site-content";

const emptyProject: PortfolioProject = {
  id: `project-${Date.now()}`,
  title: "New Project",
  description: "Describe this project",
  tag: "New",
  imageUrl: "",
};

const defaultContent: PortfolioContent = {
  brand: "Ellest Ingz",
  headline: "Building thoughtful digital experiences.",
  intro:
    "I design and build clean, high-impact products that blend technical precision with craft.",
  contactEmail: "hello@ellest.dev",
  heroImageUrl: "",
  profileImageUrl: "",
  skills: ["React", "Next.js", "TypeScript"],
  projects: [
    {
      id: "project-1",
      title: "Portfolio Experience",
      description: "A custom portfolio experience built for clarity and conversion.",
      tag: "Brand Website",
      imageUrl: "",
    },
  ],
};

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("Admin01");
  const [password, setPassword] = useState("Admin4321");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [content, setContent] = useState<PortfolioContent>(defaultContent);

  useEffect(() => {
    fetch("/api/admin/login")
      .then((response) => response.json())
      .then((data) => {
        setLoggedIn(Boolean(data.authenticated));
      })
      .finally(() => setLoading(false));

    fetch("/api/site")
      .then((response) => response.json())
      .then((data) => setContent({ ...defaultContent, ...data, skills: data.skills || defaultContent.skills, projects: data.projects || defaultContent.projects }))
      .catch(() => setContent(defaultContent));
  }, []);

  const handleLogin = async () => {
    setError("");
    setSuccess("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      setError(data.error || "Login failed");
      return;
    }

    setLoggedIn(true);
    setSuccess("Logged in successfully.");
  };

  const handleLogout = async () => {
    document.cookie = "portfolio_admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setLoggedIn(false);
    setSuccess("Logged out.");
  };

  const updateField = (field: keyof PortfolioContent, value: string | string[]) => {
    setContent((current) => ({ ...current, [field]: value }));
  };

  const updateProject = (projectId: string, field: keyof PortfolioProject, value: string) => {
    setContent((current) => ({
      ...current,
      projects: current.projects.map((project) =>
        project.id === projectId ? { ...project, [field]: value } : project,
      ),
    }));
  };

  const addProject = () => {
    const newProject = { ...emptyProject, id: `project-${Date.now()}` };
    setContent((current) => ({ ...current, projects: [...current.projects, newProject] }));
  };

  const deleteProject = (projectId: string) => {
    setContent((current) => ({
      ...current,
      projects: current.projects.filter((project) => project.id !== projectId),
    }));
  };

  const saveContent = async () => {
    setError("");
    setSuccess("");

    const response = await fetch("/api/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      setError("You must log in before saving.");
      return;
    }

    setSuccess("Portfolio content saved successfully.");
  };

  if (loading) {
    return <main className="min-h-screen bg-slate-950 p-10 text-white">Loading...</main>;
  }

  if (!loggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            Portfolio Admin
          </p>
          <h1 className="mb-6 text-3xl font-bold">Sign in</h1>

          <div className="space-y-4">
            <label className="block text-sm">
              <span className="mb-2 block text-slate-300">Username</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-white outline-none ring-0"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-slate-300">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-white outline-none ring-0"
              />
            </label>
          </div>

          {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
          {success && <p className="mt-4 text-sm text-emerald-300">{success}</p>}

          <button
            onClick={handleLogin}
            className="mt-6 w-full rounded-full bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Login
          </button>

          <p className="mt-4 text-xs text-slate-400">
            Default admin: Username <strong>Admin01</strong>, Password <strong>Admin4321</strong>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between rounded-3xl border border-slate-700 bg-slate-900 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-sky-300">Content admin</p>
            <h1 className="mt-2 text-3xl font-bold">Edit your portfolio</h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
          >
            Logout
          </button>
        </div>

        <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="mb-5 text-xl font-bold">Main content</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-300">
              Brand name
              <input
                value={content.brand}
                onChange={(event) => updateField("brand", event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-300">
              Contact email
              <input
                value={content.contactEmail}
                onChange={(event) => updateField("contactEmail", event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-300 md:col-span-2">
              Headline
              <input
                value={content.headline}
                onChange={(event) => updateField("headline", event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-300 md:col-span-2">
              Intro text
              <textarea
                value={content.intro}
                onChange={(event) => updateField("intro", event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-300 md:col-span-2">
              Hero image URL
              <input
                value={content.heroImageUrl}
                onChange={(event) => updateField("heroImageUrl", event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-300 md:col-span-2">
              Profile image URL
              <input
                value={content.profileImageUrl}
                onChange={(event) => updateField("profileImageUrl", event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-300 md:col-span-2">
              Skills (comma-separated)
              <input
                value={content.skills.join(", ")}
                onChange={(event) =>
                  updateField(
                    "skills",
                    event.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2"
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold">Projects</h2>
            <button
              onClick={addProject}
              className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
            >
              Add project
            </button>
          </div>

          <div className="space-y-5">
            {content.projects.map((project) => (
              <div key={project.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm uppercase tracking-[0.2em] text-sky-300">Project</span>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="rounded-full border border-rose-500/40 px-3 py-1 text-xs text-rose-300 hover:bg-rose-500/10"
                  >
                    Delete
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm text-slate-300">
                    Title
                    <input
                      value={project.title}
                      onChange={(event) => updateProject(project.id, "title", event.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2"
                    />
                  </label>
                  <label className="text-sm text-slate-300">
                    Tag
                    <input
                      value={project.tag}
                      onChange={(event) => updateProject(project.id, "tag", event.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2"
                    />
                  </label>
                  <label className="text-sm text-slate-300 md:col-span-2">
                    Description
                    <textarea
                      value={project.description}
                      onChange={(event) => updateProject(project.id, "description", event.target.value)}
                      rows={3}
                      className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2"
                    />
                  </label>
                  <label className="text-sm text-slate-300 md:col-span-2">
                    Image URL
                    <input
                      value={project.imageUrl}
                      onChange={(event) => updateProject(project.id, "imageUrl", event.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        {error && <p className="text-sm text-rose-300">{error}</p>}
        {success && <p className="text-sm text-emerald-300">{success}</p>}

        <div className="flex justify-end">
          <button
            onClick={saveContent}
            className="rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            Save changes
          </button>
        </div>
      </div>
    </main>
  );
}
