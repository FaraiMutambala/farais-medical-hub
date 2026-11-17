
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import ResourceTypeManager from "./ResourceTypeManager";

export type ResourceType = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
};

export default async function ResourceTypesPage() {
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

  const { data: resourceTypes, error } = await supabase
    .from("resource_types")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <a
          href="/admin"
          className="font-medium text-sky-700 hover:text-sky-900"
        >
          ← Back to Dashboard
        </a>

        <h1 className="mt-8 text-3xl font-bold text-slate-900">
          Manage Resource Types
        </h1>

        <p className="mt-3 text-slate-600">
          Create and organise the types of learning materials available in your medical library.
        </p>

        {error ? (
          <p className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            Unable to load resource types. Please try again.
          </p>
        ) : (
          <ResourceTypeManager
            resourceTypes={(resourceTypes ?? []) as ResourceType[]}
          />
        )}
      </div>
    </main>
  );
}
