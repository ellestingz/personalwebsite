import Image from "next/image";
import { getSiteContent } from "@/lib/site-content";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <main className="min-h-screen text-slate-100">
      <section className="mx-auto flex max-w-6xl flex-col px-6 pb-16 pt-10 lg:px-8">
        <header className="mb-16 flex items-center justify-between">
          <div className="text-lg font-semibold tracking-[0.2em] text-sky-300 uppercase">
            {content.brand}
          </div>
          <nav className="hidden gap-8 text-sm text-slate-300 md:flex">
            <a href="#about" className="transition hover:text-white">
              About
            </a>
            <a href="#work" className="transition hover:text-white">
              Work
            </a>
            <a href="#contact" className="transition hover:text-white">
              Contact
            </a>
          </nav>
        </header>

        <div className="grid items-center gap-12 pb-12 pt-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-sky-200">
              Software Developer
            </p>
            <h1 className="max-w-xl text-5xl font-black leading-tight text-white sm:text-6xl">
              {content.headline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              {content.intro}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#work"
                className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                View Work
              </a>
              <a
                href="#contact"
                className="rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-400 hover:bg-slate-800/60"
              >
                Get in Touch
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-sky-500/30 via-indigo-500/20 to-transparent blur-3xl" />
            <div className="relative rounded-[2rem] border border-slate-700 bg-slate-900/80 p-6 shadow-2xl shadow-sky-500/10 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 p-0">
                {content.heroImageUrl ? (
                  <div className="relative h-72 w-full">
                    <Image
                      src={content.heroImageUrl}
                      alt={content.brand}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : null}
                <div className="p-5">
                  <p className="text-sm text-slate-400">Currently</p>
                  <p className="mt-3 text-2xl font-bold text-white">{content.headline}</p>
                  <div className="mt-6 space-y-3 text-sm text-slate-300">
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span>Focus</span>
                      <span className="text-sky-300">Web & UX</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span>Location</span>
                      <span>Remote</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Availability</span>
                      <span className="text-emerald-300">Open</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
              About
            </p>
          </div>
          <div className="space-y-5 text-lg leading-8 text-slate-300">
            <p>{content.intro}</p>
            {content.profileImageUrl ? (
              <div className="mt-4 h-48 w-48 overflow-hidden rounded-full border border-slate-700">
                <Image
                  src={content.profileImageUrl}
                  alt="Profile"
                  width={192}
                  height={192}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section id="work" className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
              Work
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">Selected projects</h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {content.projects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/70 shadow-lg shadow-slate-950/30"
            >
              {project.imageUrl ? (
                <div className="relative h-48 w-full">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ) : null}
              <div className="p-6">
                <span className="inline-flex rounded-full border border-sky-400/30 bg-sky-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-sky-200">
                  {project.tag}
                </span>
                <h3 className="mt-5 text-xl font-semibold text-white">{project.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="rounded-[2rem] border border-slate-700 bg-slate-900/70 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
            Skills
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {content.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 pb-24 pt-10 lg:px-8">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-sky-400/30 bg-sky-500/10 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">
              Contact
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">Let’s build something meaningful.</h2>
          </div>
          <a
            href={`mailto:${content.contactEmail}`}
            className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            {content.contactEmail}
          </a>
        </div>
      </section>
    </main>
  );
}
