
import { createClient } from "@/lib/supabase-server";

type YearPageProps = {
  params: Promise<{
    year: string;
  }>;
};

type Category = {
  id: string;
  year: string;
  name: string;
  slug: string;
  sort_order: number;
  parent_id: string | null;
};

const academicYears = [
  {
    year: "fourth-year",
    title: "Fourth Year",
    description:
      "Core clinical subjects and foundational medical learning materials.",
    subtitle: "Building strong clinical foundations",
  },
  {
    year: "fifth-year",
    title: "Fifth Year",
    description:
      "Advanced clinical rotations, specialised disciplines and clinical practice.",
    subtitle: "Exploring advanced clinical specialities",
  },
  {
    year: "sixth-year",
    title: "Sixth Year",
    description:
      "Final-year clinical learning, comprehensive revision and preparation for practice.",
    subtitle: "Preparing for clinical practice",
  },
];

const subjectImages: Record<string, string> = {
  "Internal Medicine": "/category-images/internal-medicine.jpg",
  "Obstetrics & Gynaecology": "/category-images/obstetrics-gynaecology.jpg",
  Surgery: "/category-images/surgery.jpg",
  Paediatrics: "/category-images/paediatrics.jpg",
  "Internal Medicine Subspecialties":
    "/category-images/internal-medicine-subspecialties.jpg",
  "Surgery Subspecialties":
    "/category-images/surgery-subspecialties.jpg",
  "Basic Science": "/category-images/basic-science.jpg",
  Cardiology: "/category-images/cardiology.jpg",
  "Past Papers": "/category-images/past-papers.jpg",
};

export default async function YearPage({
  params,
}: YearPageProps) {
  const { year } = await params;

  const selectedYear = academicYears.find(
    (item) => item.year === year
  );

  if (!selectedYear) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-blue-950">
            Academic year not found
          </h1>

          <a
            href="/library"
            className="mt-5 inline-block rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white"
          >
            Return to Medical Library
          </a>
        </div>
      </main>
    );
  }

  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("academic_categories")
    .select("id, year, name, slug, sort_order, parent_id")
    .eq("year", year)
    .is("parent_id", null)
    .order("sort_order", { ascending: true });

  const categoryList = (categories ?? []) as Category[];

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 px-6 py-16 text-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <nav className="mb-10 flex flex-wrap items-center gap-2 text-sm text-blue-100/70">
            <a href="/library" className="transition hover:text-white">
              Medical Library
            </a>

            <span>/</span>

            <span className="font-medium text-white">
              {selectedYear.title}
            </span>
          </nav>

          <p className="text-sm font-bold uppercase tracking-widest text-sky-400">
            Medical Academic Resources
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-6xl">
            {selectedYear.title}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100/80">
            {selectedYear.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm">
              {categoryList.length} Academic Folders
            </div>

            <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm">
              Medical Learning Library
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-sky-700">
              Explore your curriculum
            </p>

            <h2 className="mt-3 text-3xl font-bold text-blue-950">
              Academic Folders
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              {selectedYear.subtitle}. Select a folder below to
              explore its subjects and learning materials.
            </p>
          </div>

          <a
            href="/library"
            className="text-sm font-semibold text-sky-700 transition hover:text-blue-950"
          >
            ← All Academic Years
          </a>
        </div>

        {error && (
          <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            Unable to load academic categories. Please try again later.
          </div>
        )}

        {!error && categoryList.length === 0 && (
          <div className="mt-10 rounded-xl border border-slate-200 bg-white p-8 text-center">
            <h3 className="text-lg font-semibold text-blue-950">
              No folders available yet
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Academic categories for this year have not been added yet.
            </p>
          </div>
        )}

        {!error && categoryList.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryList.map((category, index) => {
              const image =
                subjectImages[category.name] ??
                "/category-images/other-subjects.jpg";

              return (
                <a
                  key={category.id}
                  href={`/library/${year}/${category.slug}`}
                  aria-label={`Explore ${category.name}`}
                  className="group relative isolate flex min-h-[270px] overflow-hidden rounded-2xl bg-blue-950 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className="absolute inset-0 -z-20 bg-cover bg-center transition duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url("${image}")`,
                    }}
                  />

                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/10 transition duration-300 group-hover:from-blue-950/95 group-hover:via-blue-950/50" />

                  <div className="flex w-full flex-col justify-between p-7">
                    <div className="flex items-start justify-between">
                      <span className="rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                        {selectedYear.title}
                      </span>

                      <span className="text-sm font-semibold text-white/70">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold leading-tight text-white drop-shadow-lg">
                        {category.name}
                      </h3>

                      <p className="mt-3 text-sm text-white/80">
                        Explore subjects, lectures and study materials.
                      </p>

                      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-sky-300 transition group-hover:gap-4 group-hover:text-white">
                        <span>Open Folder</span>
                        <span aria-hidden="true">→</span>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>

      <footer className="bg-blue-950 px-6 py-8 text-center text-sm text-blue-100/70">
        © {new Date().getFullYear()} Farai's Medical Hub
      </footer>
    </main>
  );
}
