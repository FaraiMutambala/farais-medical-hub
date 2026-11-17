
import { createClient } from "@/lib/supabase-server";

const libraryYears = [
  {
    year: "Fourth Year",
    slug: "fourth-year",
    number: "04",
    description:
      "Explore foundational clinical disciplines, essential medical knowledge and core clinical practice.",
    image: "/category-images/fourth-year.jpg",
    subjects: "Internal Medicine · Surgery · Paediatrics · Obstetrics & Gynaecology",
  },
  {
    year: "Fifth Year",
    slug: "fifth-year",
    number: "05",
    description:
      "Discover specialised clinical disciplines, medical subspecialties and advanced academic learning.",
    image: "/category-images/fifth-year.jpg",
    subjects: "Clinical Subspecialties · Basic Sciences · Surgery",
  },
  {
    year: "Sixth Year",
    slug: "sixth-year",
    number: "06",
    description:
      "Strengthen your clinical knowledge and prepare for internship through advanced learning resources.",
    image: "/category-images/sixth-year.jpg",
    subjects: "Advanced Clinical Medicine · Basic Sciences · Past Papers",
  },
];

export default async function LibraryPage() {
  const supabase = await createClient();

  const { error } = await supabase
    .from("academic_categories")
    .select("id")
    .limit(1);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-blue-950 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(2,25,65,0.97),rgba(3,45,85,0.88),rgba(2,25,65,0.72))]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-sky-300 transition hover:text-white"
          >
            ← Back to Home
          </a>

          <div className="mt-14 max-w-3xl">
            <span className="inline-flex rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
              Academic Resources
            </span>

            <h1 className="mt-7 text-4xl font-extrabold leading-tight md:text-6xl">
              Your Medical Learning Journey Starts Here.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-blue-100/80 md:text-lg">
              Explore a growing collection of medical lecture notes,
              clinical resources, academic materials and past examination
              papers organised to support your medical education.
            </p>

            <a
              href="#academic-years"
              className="mt-9 inline-flex items-center gap-3 rounded-xl bg-sky-500 px-7 py-4 font-bold text-white shadow-lg transition hover:bg-sky-400"
            >
              Explore Academic Years
              <span>↓</span>
            </a>
          </div>

          <div className="mt-16 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/15 pt-8">
            <div>
              <p className="text-3xl font-extrabold text-sky-300">04</p>
              <p className="mt-1 text-xs text-blue-100/70 md:text-sm">
                Fourth Year
              </p>
            </div>

            <div>
              <p className="text-3xl font-extrabold text-sky-300">05</p>
              <p className="mt-1 text-xs text-blue-100/70 md:text-sm">
                Fifth Year
              </p>
            </div>

            <div>
              <p className="text-3xl font-extrabold text-sky-300">06</p>
              <p className="mt-1 text-xs text-blue-100/70 md:text-sm">
                Sixth Year
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="academic-years"
        className="mx-auto max-w-7xl px-6 py-20 md:py-24"
      >
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
            Explore the Library
          </p>

          <h2 className="mt-4 text-3xl font-extrabold text-blue-950 md:text-4xl">
            Choose Your Academic Year
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Select your year of study to discover organised learning
            materials, clinical subjects and academic resources.
          </p>
        </div>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            Unable to connect to the academic library. Please try again later.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {libraryYears.map((year) => (
              <article
                key={year.slug}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={year.image}
                    alt={`${year.year} medical learning`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-950/20 to-transparent" />

                  <div className="absolute bottom-6 left-6">
                    <span className="text-sm font-bold tracking-widest text-sky-300">
                      ACADEMIC YEAR {year.number}
                    </span>

                    <h3 className="mt-2 text-3xl font-extrabold text-white">
                      {year.year}
                    </h3>
                  </div>
                </div>

                <div className="p-7">
                  <p className="leading-7 text-slate-600">
                    {year.description}
                  </p>

                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Explore subjects
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {year.subjects}
                    </p>
                  </div>

                  <a
                    href={`/library/${year.slug}`}
                    className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-blue-950 px-5 py-4 font-bold text-white transition hover:bg-sky-600"
                  >
                    Explore {year.year}
                    <span className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-slate-200 bg-white px-6 py-14">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-blue-950">
            Learn. Explore. Grow.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Whether you are revising lecture materials, strengthening your
            clinical knowledge or preparing for examinations, the Medical
            Library is here to support your academic journey.
          </p>

          <a
            href="/"
            className="mt-6 inline-flex font-semibold text-sky-600 transition hover:text-blue-950"
          >
            ← Return to Farai's Medical Hub
          </a>
        </div>
      </section>

      <footer className="bg-blue-950 px-6 py-8 text-center text-sm text-blue-100/70">
        © {new Date().getFullYear()} Farai's Medical Hub
      </footer>
    </main>
  );
}
