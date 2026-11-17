
import Link from "next/link";
import ResourceSearch from "../../../[subject]/[resourceType]/ResourceSearch";
import { supabase } from "@/lib/supabase";

type ResourceCategoryProps = {
  params: Promise<{
    year: string;
    categoryId: string;
    resourceType: string;
  }>;
};

function formatText(text: string) {
  return text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatFileSize(bytes: number | null) {
  if (bytes === null) return "Size unavailable";

  const mb = bytes / (1024 * 1024);

  if (mb < 1) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${mb.toFixed(1)} MB`;
}

export default async function ResourceCategoryPage({
  params,
}: ResourceCategoryProps) {
  const { year, categoryId, resourceType } = await params;

  const { data: category, error: categoryError } = await supabase
    .from("academic_categories")
    .select("id, name, slug, year, parent_id")
    .eq("id", categoryId)
    .eq("year", year)
    .maybeSingle();

  if (categoryError || !category) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-blue-950">
          Category not found
        </h1>
        <Link href="/library" className="mt-5 inline-block text-sky-700">
          Return to Medical Library
        </Link>
      </main>
    );
  }

  let parentCategory = null;

  if (category.parent_id) {
    const { data } = await supabase
      .from("academic_categories")
      .select("name, slug")
      .eq("id", category.parent_id)
      .eq("year", year)
      .maybeSingle();

    parentCategory = data;
  }

  const { data, error } = await supabase
    .from("resources")
    .select(
      "id, title, description, year, subject, resource_type, file_name, file_format, file_size_bytes, created_at"
    )
    .eq("category_id", categoryId)
    .eq("resource_type", resourceType)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const resources = (data ?? []).map((resource) => ({
    id: resource.id,
    title: resource.title,
    description: resource.description ?? "",
    format: resource.file_format,
    size: formatFileSize(
      resource.file_size_bytes === null
        ? null
        : Number(resource.file_size_bytes)
    ),
    date: new Date(resource.created_at).toLocaleDateString(),
  }));

  const formattedYear = formatText(year);
  const formattedSubject = category.name;
  const formattedResourceType = formatText(resourceType);

  const parentUrl = parentCategory
    ? `/library/${year}/${parentCategory.slug}`
    : `/library/${year}`;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-blue-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-3 text-sm"
          >
            <Link href="/library" className="text-sky-300 hover:text-white">
              Medical Library
            </Link>

            <span className="text-blue-300/50">/</span>

            <Link
              href={`/library/${year}`}
              className="text-sky-300 hover:text-white"
            >
              {formattedYear}
            </Link>

            <span className="text-blue-300/50">/</span>

            <Link
              href={parentUrl}
              className="text-sky-300 hover:text-white"
            >
              {parentCategory?.name ?? formattedYear}
            </Link>

            <span className="text-blue-300/50">/</span>

            <Link
              href={`/library/${year}/category/${categoryId}`}
              className="text-sky-300 hover:text-white"
            >
              {formattedSubject}
            </Link>

            <span className="text-blue-300/50">/</span>

            <span className="font-semibold text-white">
              {formattedResourceType}
            </span>
          </nav>

          <p className="mt-8 text-sm font-bold uppercase tracking-widest text-sky-400">
            {formattedYear} / {formattedSubject}
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            {formattedResourceType}
          </h1>

          <p className="mt-5 max-w-2xl leading-8 text-blue-100/80">
            Browse and access learning materials for {formattedSubject}.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-950">
              Available Resources
            </h2>

            <p className="mt-2 text-slate-600">
              Explore the learning materials in this category.
            </p>
          </div>

          <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-800">
            {resources.length} resources
          </span>
        </div>

        {error ? (
          <p className="mt-8 rounded-xl bg-red-50 p-5 text-red-700">
            We could not load the resources. Please try again later.
          </p>
        ) : (
          <div className="mt-8">
            <ResourceSearch
              resources={resources}
              basePath={`/library/${year}/category/${categoryId}/${resourceType}`}
            />
          </div>
        )}

        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
          <p className="font-medium text-blue-950">
            More learning materials will be added.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            New published resources will appear here automatically.
          </p>
        </div>
      </section>

      <footer className="bg-blue-950 px-6 py-8 text-center text-sm text-blue-100/70">
        © {new Date().getFullYear()} Farai&apos;s Medical Hub
      </footer>
    </main>
  );
}
