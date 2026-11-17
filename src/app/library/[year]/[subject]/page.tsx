
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

type SubjectPageProps = {
  params: Promise<{
    year: string;
    subject: string;
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

type ResourceType = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

const resourceIcons: Record<string, string> = {
  "lecture-notes": "📚",
  "powerpoint-presentations": "📊",
  "clinical-guidelines": "🩺",
  "medical-illustrations": "🧠",
  "past-papers": "📝",
};

const resourceDescriptions: Record<string, string> = {
  "lecture-notes": "Written notes and learning summaries.",
  "powerpoint-presentations": "Presentation slides for academic learning.",
  "clinical-guidelines": "Clinical protocols and reference materials.",
  "medical-illustrations": "Diagrams, images and visual learning materials.",
  "past-papers": "Previous examination and revision papers.",
};

// Images for all subjects and academic folders.
const categoryImages: Record<string, string> = {
  "internal-medicine": "/category-images/internal-medicine.jpg",
  "obstetrics-gynaecology": "/category-images/obstetrics-gynaecology.jpg",
  surgery: "/category-images/surgery.jpg",
  paediatrics: "/category-images/paediatrics.jpg",
  "internal-medicine-subspecialties":
    "/category-images/internal-medicine-subspecialties.jpg",
  "surgery-subspecialties":
    "/category-images/surgery-subspecialties.jpg",
  "basic-science": "/category-images/basic-science.jpg",
  cardiology: "/category-images/cardiology.jpg",
  "past-papers": "/category-images/past-papers.jpg",

  "renal-medicine": "/category-images/renal-medicine.jpg",
  psychiatry: "/category-images/psychiatry.jpg",
  hiv: "/category-images/hiv.jpg",
  tuberculosis: "/category-images/tuberculosis.jpg",
  dermatology: "/category-images/dermatology.jpg",
  radiology: "/category-images/radiology-clinical.jpg",
  ophthalmology: "/category-images/ophthalmology.jpg",
  "dental-surgery": "/category-images/dental-surgery.jpg",
  "paediatric-surgery": "/category-images/paediatric-surgery.jpg",
  anaesthesia: "/category-images/anaesthesia.jpg",
  ent: "/category-images/ent.jpg",
  "clinical-chemistry": "/category-images/clinical-chemistry.jpg",
  "public-health": "/category-images/public-health.jpg",
  "society-and-medicine": "/category-images/society-medicine.jpg",
  haematology: "/category-images/haematology.jpg",
  parasitology: "/category-images/parasitology.jpg",
  microbiology: "/category-images/microbiology.jpg",
  immunology: "/category-images/immunology.jpg",
  "other-subjects": "/category-images/other-subjects.jpg",
};

function formatText(text: string) {
  return text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function SubjectPage({
  params,
}: SubjectPageProps) {
  const { year, subject } = await params;

  const supabase = await createClient();

  const { data: rootCategory, error: categoryError } = await supabase
    .from("academic_categories")
    .select("id, year, name, slug, sort_order, parent_id")
    .eq("year", year)
    .eq("slug", subject)
    .is("parent_id", null)
    .maybeSingle();

  const selectedCategory = rootCategory as Category | null;

  const formattedYear = formatText(year);
  const formattedSubject =
    selectedCategory?.name ?? formatText(subject);

  const { data: subcategories, error: subcategoryError } =
    selectedCategory
      ? await supabase
          .from("academic_categories")
          .select("id, year, name, slug, sort_order, parent_id")
          .eq("year", year)
          .eq("parent_id", selectedCategory.id)
          .order("sort_order", { ascending: true })
      : { data: null, error: null };

  const isParentFolder =
    !categoryError &&
    !subcategoryError &&
    (subcategories?.length ?? 0) > 0;

  const { data: resourceTypes, error: resourceError } =
    selectedCategory && !isParentFolder
      ? await supabase
          .from("resource_types")
          .select("id, name, slug, sort_order")
          .order("sort_order", { ascending: true })
      : { data: null, error: null };

  const folderImage =
    categoryImages[selectedCategory?.slug ?? ""] ??
    "/category-images/other-subjects.jpg";

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="relative isolate flex min-h-[400px] items-end overflow-hidden bg-blue-950 px-6 py-14 text-white md:min-h-[460px]">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage: `url("${folderImage}")`,
          }}
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-blue-950 via-blue-950/75 to-blue-950/20" />

        <div className="relative mx-auto w-full max-w-7xl">
          <Link
            href="/library"
            className="text-sm font-medium text-sky-300 transition hover:text-white"
          >
            ← Back to Medical Library
          </Link>

          <nav className="mb-8 mt-8 flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/library"
              className="text-sky-300 hover:text-white"
            >
              Medical Library
            </Link>

            <span className="text-white/50">/</span>

            <Link
              href={`/library/${year}`}
              className="text-sky-300 hover:text-white"
            >
              {formattedYear}
            </Link>

            <span className="text-white/50">/</span>

            <span className="font-semibold text-white">
              {formattedSubject}
            </span>
          </nav>

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-300">
            {formattedYear} • Medical Education
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl">
            {formattedSubject}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100 md:text-lg">
            {isParentFolder
              ? "Explore specialised subjects and academic disciplines within this folder."
              : "Explore lecture notes, presentations, clinical guidelines, illustrations and examination resources."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm backdrop-blur-sm">
              Academic Resources
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm backdrop-blur-sm">
              Medical Learning
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        {categoryError || subcategoryError ? (
          <p className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            Unable to load academic categories. Please try again.
          </p>
        ) : !selectedCategory ? (
          <p className="rounded-xl border border-slate-200 bg-white p-8 text-slate-600">
            This academic category could not be found.
          </p>
        ) : isParentFolder ? (
          <>
            <div className="mb-10">
              <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
                Academic Disciplines
              </p>

              <h2 className="mt-3 text-3xl font-bold text-blue-950 md:text-4xl">
                Explore Subjects
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                Select a subject to access its academic materials,
                learning resources and study references.
              </p>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {(subcategories as Category[]).map(
                (category, index) => {
                  const image =
                    categoryImages[category.slug] ??
                    "/category-images/other-subjects.jpg";

                  return (
                    <Link
                      key={category.id}
                      href={`/library/${year}/category/${category.id}`}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-sky-300 hover:shadow-xl"
                    >
                      <div className="relative h-56 overflow-hidden bg-blue-950">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                          style={{
                            backgroundImage: `url("${image}")`,
                          }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-blue-950/10 to-transparent" />

                        <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-blue-950/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                          {formattedYear}
                        </span>

                        <span className="absolute bottom-5 right-5 text-sm font-bold text-white/80">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-blue-950 transition group-hover:text-sky-700">
                          {category.name}
                        </h3>

                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          Explore lectures, notes and study materials
                          in {category.name}.
                        </p>

                        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                          <span className="text-sm font-bold text-sky-700">
                            Explore Subject
                          </span>

                          <span className="text-xl text-sky-600 transition group-hover:translate-x-2">
                            →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          </>
        ) : (
          <>
            <div className="mb-10">
              <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
                Learning Materials
              </p>

              <h2 className="mt-3 text-3xl font-bold text-blue-950">
                Browse Resources
              </h2>

              <p className="mt-3 text-slate-600">
                Choose the type of learning material you want to explore.
              </p>
            </div>

            {resourceError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                Unable to load resource categories. Please refresh the page and try again.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(resourceTypes as ResourceType[] ?? []).map(
                  (resource) => (
                    <Link
                      key={resource.id}
                      href={`/library/${year}/${subject}/${resource.slug}`}
                      className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-sky-300 hover:shadow-xl"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-3xl transition group-hover:bg-sky-100">
                        {resourceIcons[resource.slug] ?? "📁"}
                      </div>

                      <h3 className="mt-6 text-xl font-bold text-blue-950">
                        {resource.name}
                      </h3>

                      <p className="mt-3 leading-7 text-slate-600">
                        {resourceDescriptions[resource.slug] ??
                          "Explore learning materials in this resource category."}
                      </p>

                      <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
                        <span className="text-sm font-semibold text-sky-700">
                          Explore Resources
                        </span>

                        <span className="text-lg text-sky-600 transition group-hover:translate-x-2">
                          →
                        </span>
                      </div>
                    </Link>
                  )
                )}

                {resourceTypes?.length === 0 && (
                  <p className="col-span-full rounded-xl bg-white p-6 text-slate-600">
                    No resource categories are currently available.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </section>

      <footer className="bg-blue-950 px-6 py-8 text-center text-sm text-blue-100/70">
        © {new Date().getFullYear()} Farai&apos;s Medical Hub
      </footer>
    </main>
  );
}
