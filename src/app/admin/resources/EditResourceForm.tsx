
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

type Resource = {
  id: string;
  title: string;
  description: string | null;
  year: string;
  subject: string;
  resource_type: string;
  is_published: boolean;
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

type Props = {
  resource: Resource;
  onClose: () => void;
};

export default function EditResourceForm({
  resource,
  onClose,
}: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(resource.title);
  const [description, setDescription] = useState(
    resource.description ?? ""
  );
  const [year, setYear] = useState(resource.year);
  const [rootCategoryId, setRootCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [resourceType, setResourceType] = useState(
    resource.resource_type
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [publishedStatus, setPublishedStatus] = useState(
    resource.is_published
  );

  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadFormData() {
      const supabase = createClient();

      const [categoryResult, typeResult, resourceResult] =
        await Promise.all([
          supabase
            .from("academic_categories")
            .select("id, year, name, slug, sort_order, parent_id")
            .order("sort_order", { ascending: true }),

          supabase
            .from("resource_types")
            .select("id, name, slug, sort_order")
            .order("sort_order", { ascending: true }),

          supabase
            .from("resources")
            .select("category_id")
            .eq("id", resource.id)
            .single(),
        ]);

      if (categoryResult.error) {
        setErrorMessage("Unable to load academic categories.");
        setLoadingData(false);
        return;
      }

      if (typeResult.error) {
        setErrorMessage("Unable to load resource types.");
        setLoadingData(false);
        return;
      }

      if (resourceResult.error) {
        setErrorMessage("Unable to load this resource's category.");
        setLoadingData(false);
        return;
      }

      const loadedCategories = categoryResult.data ?? [];

      setCategories(loadedCategories);
      setResourceTypes(typeResult.data ?? []);

      const currentCategory = loadedCategories.find(
        (category) => category.id === resourceResult.data.category_id
      );

      if (currentCategory) {
        setYear(currentCategory.year);

        if (currentCategory.parent_id) {
          setRootCategoryId(currentCategory.parent_id);
          setSubcategoryId(currentCategory.id);
        } else {
          setRootCategoryId(currentCategory.id);
          setSubcategoryId("");
        }
      } else {
        setErrorMessage(
          "This resource is not linked to a valid academic category. Please check its category before editing."
        );
      }

      setLoadingData(false);
    }

    loadFormData();
  }, [resource.id]);

  const rootCategories = categories.filter(
    (category) =>
      category.year === year && category.parent_id === null
  );

  const subcategories = categories.filter(
    (category) => category.parent_id === rootCategoryId
  );

  const selectedRoot = rootCategories.find(
    (category) => category.id === rootCategoryId
  );

  const selectedCategory =
    subcategories.length > 0
      ? subcategories.find(
          (category) => category.id === subcategoryId
        )
      : selectedRoot;

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setErrorMessage("");

    if (!selectedCategory) {
      setErrorMessage("Please select a valid academic category.");
      setSaving(false);
      return;
    }

    const selectedType = resourceTypes.find(
      (item) => item.slug === resourceType
    );

    if (!selectedType) {
      setErrorMessage("Please select a valid resource type.");
      setSaving(false);
      return;
    }

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("resources")
        .update({
          title: title.trim(),
          description: description.trim() || null,
          year: selectedCategory.year,
          subject: selectedCategory.slug,
          category_id: selectedCategory.id,
          resource_type: selectedType.slug,
          is_published: publishedStatus,
        })
        .eq("id", resource.id);

      if (error) {
        throw error;
      }

      router.refresh();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update resource."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Edit Resource
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Resource Title
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Academic Year
            </label>
            <select
              required
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setRootCategoryId("");
                setSubcategoryId("");
              }}
              disabled={loadingData}
              className={`${inputClass} disabled:bg-gray-100`}
            >
              <option value="">Select academic year</option>
              <option value="fourth-year">Fourth Year</option>
              <option value="fifth-year">Fifth Year</option>
              <option value="sixth-year">Sixth Year</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Main Folder
            </label>
            <select
              required
              value={rootCategoryId}
              onChange={(e) => {
                setRootCategoryId(e.target.value);
                setSubcategoryId("");
              }}
              disabled={loadingData || rootCategories.length === 0}
              className={`${inputClass} disabled:bg-gray-100`}
            >
              <option value="">Select main folder</option>

              {rootCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {subcategories.length > 0 && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Subject / Subcategory
              </label>
              <select
                required
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                className={inputClass}
              >
                <option value="">Select subject or subcategory</option>

                {subcategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Resource Type
            </label>

            <select
              required
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              disabled={loadingData || resourceTypes.length === 0}
              className={`${inputClass} disabled:bg-gray-100`}
            >
              <option value="">Select resource type</option>

              {resourceTypes.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={publishedStatus}
              onChange={(e) => setPublishedStatus(e.target.checked)}
              className="h-4 w-4"
            />
            Published (visible to public)
          </label>

          {errorMessage && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm text-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                loadingData ||
                !selectedCategory ||
                resourceTypes.length === 0
              }
              className="rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : loadingData
                  ? "Loading..."
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
