
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

type CategoryPageProps = {
  params: Promise<{
    year: string;
    categoryId: string;
  }>;
};

type ResourceType = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

const categoryImages: Record<string, string> = {
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

function formatText(text: string) {
  return text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { year, categoryId } = await params;
  const supabase = await createClient();

  const { data: category, error: categoryError } = await supabase
    .from("academic_categories")
    .select("id, year, name, slug, parent_id")
    .eq("id", categoryId)
    .eq("year", year)
    .maybeSingle();

  const { data: resourceTypes, error: resourceError } = await supabase
    .from("resource_types")
    .select("id, name, slug, sort_order")
    .order("sort_order", { ascending: true });

  const { data: parentCategory } = category?.parent_id
    ? await supabase
        .from("academic_categories")
        .select("id, name, slug")
        .eq("id", category.parent_id)
        .maybeSingle()
    : { data: null };

  if (categoryError || !category) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-blue-950">
          Subject not found
        </h1>
        <p className="mt-3 text-slate-600">
          This academic subject could not be found.
        </p>
        <Link
          href="/library"
          className="mt-6 inline-block font-semibold text-sky-700"
        >
          Return to Medical Library
        </Link>
      </main>
    );
  }

  const formattedYear = formatText(year);

  const parentUrl = parentCategory
    ? `/library/${year}/${parentCategory.name
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}`
    : `/library/${year}`;

  let image = categoryImages[category.slug];

  if (category.slug === "radiology") {
    if (parentCategory?.slug === "basic-science") {
      image = "/category-images/radiology-basic-science.jpg";
    } else if (
      parentCategory?.slug === "internal-medicine-subspecialties"
    ) {
      image = "/category-images/radiology-clinical.jpg";
    }
  }

  image = image ?? "/category-images/other-subjects.jpg";

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="relative flex min-h-[430px] items-end overflow-hidden bg-blue-950 px-6 py-14 text-white md:min-h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url("${image}")` }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/70 to-blue-950/20" />

        <div className="relative mx-auto w-full max-w-7xl">
          <nav
            aria-label="Breadcrumb"
            className="mb-10 flex flex-wrap items-center gap-3 text-sm"
          >
            <Link href="/library" className="text-sky-300 hover:text-white">
              Medical Library
            </Link>
            <span className="text-white/50">/</span>
            <Link
              href={`/library/${year}`}
              className="text-sky-300 hover:text-white"
            >
              {formattedYear}
            </Link>

            {parentCategory && (
              <>
                <span className="text-white/50">/</span>
                <Link
                  href={parentUrl}
                  className="text-sky-300 hover:text-white"
                >
                  {parentCategory.name}
                </Link>
              </>
            )}

            <span className="text-white/50">/</span>
            <span className="font-semibold">{category.name}</span>
          </nav>

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-300">
            {formattedYear} • Medical Learning
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl">
            {category.name}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100 md:text-lg">
            Explore curated academic materials, clinical learning resources
            and study references in {category.name}.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm backdrop-blur-sm">
              Academic Resources
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm backdrop-blur-sm">
              Medical Education
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
            Explore the Library
          </p>
          <h2 className="mt-3 text-3xl font-bold text-blue-950 md:text-4xl">
            Browse Resources
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Choose the type of learning material you want to explore.
            Resources are organised to make studying and revision easier.
          </p>
        </div>

        {resourceError ? (
          <p className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            Unable to load resource categories. Please try again.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(resourceTypes as ResourceType[] ?? []).map((resource) => (
              <Link
                key={resource.id}
                href={`/library/${year}/category/${categoryId}/${resource.slug}`}
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
            ))}

            {resourceTypes?.length === 0 && (
              <p className="col-span-full rounded-xl bg-white p-6 text-slate-600">
                No resource categories are currently available.
              </p>
            )}
          </div>
        )}
      </section>

      <footer className="bg-blue-950 px-6 py-8 text-center text-sm text-blue-100/70">
        © {new Date().getFullYear()} Farai&apos;s Medical Hub
      </footer>
    </main>
  );
}
