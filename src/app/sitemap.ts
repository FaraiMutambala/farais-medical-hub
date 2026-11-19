
import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

type Category = {
  id: string;
  year: string;
  slug: string;
  parent_id: string | null;
};

type PublishedResource = {
  id: string;
  category_id: string | null;
  resource_type: string;
  created_at: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://farais-medical-hub.vercel.app";

  const urls = new Map<string, MetadataRoute.Sitemap[number]>();

  function addUrl(
    path: string,
    priority: number,
    lastModified: Date = new Date()
  ) {
    const url = `${baseUrl}${path}`;

    urls.set(url, {
      url,
      lastModified,
      changeFrequency: "weekly",
      priority,
    });
  }

  // Main public pages
  addUrl("", 1);
  addUrl("/library", 0.9);
  addUrl("/search", 0.7);

  // Academic year pages
  const years = ["fourth-year", "fifth-year", "sixth-year"];

  for (const year of years) {
    addUrl(`/library/${year}`, 0.8);
  }

  // Retrieve academic categories, resource types and published resources
  const [categoryResult, typeResult, resourceResult] = await Promise.all([
    supabase
      .from("academic_categories")
      .select("id, year, slug, parent_id"),

    supabase
      .from("resource_types")
      .select("slug"),

    supabase
      .from("resources")
      .select("id, category_id, resource_type, created_at")
      .eq("is_published", true),
  ]);

  const categories = (categoryResult.data ?? []) as Category[];
  const resourceTypes = typeResult.data ?? [];
  const resources = (resourceResult.data ?? []) as PublishedResource[];

  const validResourceTypes = new Set(
    resourceTypes.map((type) => type.slug)
  );

  // Create a lookup for real category IDs
  const categoryMap = new Map(
    categories.map((category) => [category.id, category])
  );

  // Add all academic category pages
  for (const category of categories) {
    const categoryPath = category.parent_id
      ? `/library/${category.year}/category/${category.id}`
      : `/library/${category.year}/${category.slug}`;

    addUrl(categoryPath, 0.7);
  }

  // Add resource listing pages and individual published resources
  for (const resource of resources) {
    if (!resource.category_id) continue;

    if (!validResourceTypes.has(resource.resource_type)) continue;

    const category = categoryMap.get(resource.category_id);

    if (!category) continue;

    const categoryPath = category.parent_id
      ? `/library/${category.year}/category/${category.id}`
      : `/library/${category.year}/${category.slug}`;

    const resourcePath = `${categoryPath}/${resource.resource_type}`;

    const publishedDate = new Date(resource.created_at);

    addUrl(resourcePath, 0.8, publishedDate);

    addUrl(
      `${resourcePath}/${resource.id}`,
      0.9,
      publishedDate
    );
  }

  return Array.from(urls.values());
}
