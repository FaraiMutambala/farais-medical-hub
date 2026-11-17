
import ResourceTable from "./ResourceTable";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

const yearLabels: Record<string, string> = {
  "fourth-year": "Fourth Year",
  "fifth-year": "Fifth Year",
  "sixth-year": "Sixth Year",
};

export default async function ManageResourcesPage() {
  const supabase = await createClient();

  const { data, error: claimsError } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (claimsError || !claims?.sub) {
    redirect("/admin/login");
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", claims.sub)
    .maybeSingle();

  if (adminError || !admin) {
    redirect("/admin/login");
  }

  const [
    { data: resources, error },
    { data: categories, error: categoryError },
  ] = await Promise.all([
    supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false }),

    supabase
      .from("academic_categories")
      .select("id, year, name, slug, parent_id"),
  ]);

  if (error) {
    throw new Error("Unable to load resources.");
  }

  if (categoryError) {
    throw new Error("Unable to load academic categories.");
  }

  const categoryMap = new Map(
    (categories ?? []).map((category) => [
      category.id,
      category,
    ])
  );

  const resourcesWithCategories = (resources ?? []).map((resource) => {
    const category = resource.category_id
      ? categoryMap.get(resource.category_id)
      : null;

    const parentCategory = category?.parent_id
      ? categoryMap.get(category.parent_id)
      : null;

    const categoryPath = category
      ? parentCategory
        ? `${parentCategory.name} → ${category.name}`
        : category.name
      : "Unassigned category";

    return {
      ...resource,
      categoryPath,
      yearLabel: yearLabels[resource.year] ?? resource.year,
    };
  });

  const totalResources = resourcesWithCategories.length;

  const publishedResources = resourcesWithCategories.filter(
    (resource) => resource.is_published
  ).length;

  const unpublishedResources = totalResources - publishedResources;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Resources
            </h1>
            <p className="mt-2 text-gray-600">
              View and manage your uploaded medical resources.
            </p>
          </div>

          <Link
            href="/admin/upload"
            className="rounded-lg bg-blue-700 px-5 py-3 text-center font-medium text-white hover:bg-blue-800"
          >
            + Upload Resource
          </Link>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Resources</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalResources}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Published</p>
            <p className="mt-2 text-3xl font-bold text-green-700">
              {publishedResources}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Unpublished</p>
            <p className="mt-2 text-3xl font-bold text-orange-600">
              {unpublishedResources}
            </p>
          </div>
        </div>

        <ResourceTable resources={resourcesWithCategories} />

        <div className="mt-6">
          <Link
            href="/admin"
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
