
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

type Props = {
  category: {
    id: string;
    year: string;
    name: string;
    slug: string;
  };
};

export default function DeleteCategoryButton({ category }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}" from this academic year? This action cannot be undone.`
    );

    if (!confirmed) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const supabase = createClient();

      // Check whether resources still use this category.
      const { data: resources, error: resourceError } = await supabase
        .from("resources")
        .select("id")
        .eq("year", category.year)
        .eq("subject", category.slug)
        .limit(1);

      if (resourceError) throw resourceError;

      if (resources && resources.length > 0) {
        throw new Error(
          "This category cannot be deleted because it still has resources attached to it. Move or remove those resources first."
        );
      }

      const { data: deletedCategory, error } = await supabase
        .from("academic_categories")
        .delete()
        .eq("id", category.id)
        .select("id")
        .maybeSingle();

      if (error) throw error;

      if (!deletedCategory) {
        throw new Error(
          "Category was not deleted. Please check your administrator permissions."
        );
      }

      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete category."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
      >
        {loading ? "Deleting..." : "Delete"}
      </button>

      {errorMessage && (
        <p className="max-w-xs text-right text-xs text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
