
const projects = [
  {
    number: "01",
    category: "Digital Development",
    title: "Farai's Medical Hub",
    description:
      "A developing digital platform bringing together medical learning resources, academic materials, research interests and professional development.",
    status: "Ongoing project",
    icon: "💻",
    link: "/library",
    linkText: "Explore the platform",
    accent: "from-sky-500 to-blue-700",
  },
  {
    number: "02",
    category: "Academic Research",
    title: "Energy Drink Research",
    description:
      "A cross-sectional study investigating energy drink consumption and associated factors among long-distance drivers in Ndola, Zambia.",
    status: "Dissertation research",
    icon: "🔬",
    link: "/#research",
    linkText: "Explore the research",
    accent: "from-emerald-500 to-teal-700",
  },
  {
    number: "03",
    category: "Technology & Innovation",
    title: "Medicine Meets Technology",
    description:
      "Exploring web development, digital tools and creative problem-solving to discover new ways of supporting medical education and healthcare.",
    status: "Area of development",
    icon: "🚀",
    link: "https://github.com/FaraiMutambala",
    linkText: "Visit GitHub",
    accent: "from-violet-500 to-indigo-700",
  },
];

export default function PortfolioSection() {
  return (
    <section className="bg-slate-50 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
            Projects and professional development
          </p>

          <h2 className="mt-4 text-3xl font-bold text-blue-950 md:text-5xl">
            My Portfolio
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            A growing collection of projects, research activities and
            ideas reflecting my interests in medicine, scientific
            research, technology and innovation.
          </p>
        </div>

        {/* Project cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.number}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div
                className={`bg-gradient-to-br ${project.accent} p-8 text-white`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold tracking-widest text-white/70">
                    PROJECT {project.number}
                  </span>

                  <span className="text-4xl">{project.icon}</span>
                </div>

                <p className="mt-8 text-sm font-semibold text-white/80">
                  {project.category}
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  {project.title}
                </h3>
              </div>

              <div className="flex flex-1 flex-col p-8">
                <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {project.status}
                </span>

                <p className="mt-5 flex-1 leading-7 text-slate-600">
                  {project.description}
                </p>

                <a
                  href={project.link}
                  target={project.link.startsWith("http") ? "_blank" : undefined}
                  rel={
                    project.link.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="mt-8 inline-flex items-center gap-2 font-semibold text-sky-700 transition group-hover:text-blue-950"
                >
                  {project.linkText}
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Closing statement */}
        <div className="mt-16 rounded-3xl bg-blue-950 px-8 py-12 text-center text-white md:px-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
            Always learning. Always building.
          </p>

          <h3 className="mt-4 text-2xl font-bold md:text-3xl">
            Every project is an opportunity to create something meaningful.
          </h3>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-blue-100/80">
            My journey is still evolving. I look forward to developing
            new ideas, pursuing meaningful research and building projects
            that bring knowledge and innovation together.
          </p>
        </div>
      </div>
    </section>
  );
}
