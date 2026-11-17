
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import UploadForm from "./UploadForm";

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

export default async function AdminUploadPage() {
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
    { data: categoriesData, error: categoriesError },
    { data: resourceTypesData, error: resourceTypesError },
  ] = await Promise.all([
    supabase
      .from("academic_categories")
      .select("id, year, name, slug, sort_order, parent_id")
      .order("sort_order", { ascending: true }),

    supabase
      .from("resource_types")
      .select("id, name, slug, sort_order")
      .order("sort_order", { ascending: true }),
  ]);

  const categories = (categoriesData ?? []) as Category[];
  const resourceTypes = (resourceTypesData ?? []) as ResourceType[];

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <a
          href="/admin"
          className="font-medium text-sky-700 hover:text-sky-900"
        >
          ← Back to Dashboard
        </a>

        <h1 className="mt-8 text-3xl font-bold text-slate-900">
          Upload Medical Resources
        </h1>

        <p className="mt-3 text-slate-600">
          Add learning materials to your medical library.
        </p>

        {categoriesError || resourceTypesError ? (
          <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            Unable to load academic categories or resource types. Please refresh
            the page and try again.
          </p>
        ) : (
          <UploadForm
            categories={categories}
            resourceTypes={resourceTypes}
          />
        )}
      </div>
    </main>
  );
}
