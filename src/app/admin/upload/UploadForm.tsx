
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

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

type UploadFormProps = {
  categories: Category[];
  resourceTypes: ResourceType[];
};

const academicYears = [
  { name: "Fourth Year", slug: "fourth-year" },
  { name: "Fifth Year", slug: "fifth-year" },
  { name: "Sixth Year", slug: "sixth-year" },
];

function getFileFormat(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  const formats: Record<string, string> = {
    pdf: "PDF",
    ppt: "PPT",
    pptx: "PPTX",
    doc: "DOC",
    docx: "DOCX",
    jpg: "IMAGE",
    jpeg: "IMAGE",
    png: "IMAGE",
    webp: "IMAGE",
  };

  return extension ? formats[extension] : undefined;
}

export default function UploadForm({
  categories,
  resourceTypes,
}: UploadFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [rootCategoryId, setRootCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const rootCategories = categories
    .filter(
      (category) =>
        category.year === year && category.parent_id === null
    )
    .sort((a, b) => a.sort_order - b.sort_order);

  const selectedRoot = rootCategories.find(
    (category) => category.id === rootCategoryId
  );

  const subcategories = categories
    .filter(
      (category) =>
        category.year === year &&
        category.parent_id === rootCategoryId
    )
    .sort((a, b) => a.sort_order - b.sort_order);

  const selectedCategory =
    subcategories.length > 0
      ? subcategories.find(
          (category) => category.id === subcategoryId
        )
      : selectedRoot;

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    if (!selectedRoot) {
      setMessage("Please select a valid main folder.");
      return;
    }

    if (!selectedCategory) {
      setMessage(
        subcategories.length > 0
          ? "Please select a subject within the chosen folder."
          : "Please select a valid subject."
      );
      return;
    }

    const selectedResourceType = resourceTypes.find(
      (item) => item.slug === resourceType
    );

    if (!selectedResourceType) {
      setMessage("Please select a valid resource category.");
      return;
    }

    const fileFormat = getFileFormat(file);

    if (!fileFormat) {
      setMessage("Unsupported file format.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const safeFileName = file.name
      .normalize("NFKD")
      .replace(/[^\w.-]+/g, "-")
      .replace(/-+/g, "-");

    const storagePath = `${crypto.randomUUID()}-${safeFileName}`;

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Please sign in before uploading.");
      }

      const { error: uploadError } = await supabase.storage
        .from("medical-resources")
        .upload(storagePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { error: databaseError } = await supabase
        .from("resources")
        .insert({
          title,
          description,
          year: selectedCategory.year,
          subject: selectedCategory.slug,
          category_id: selectedCategory.id,
          resource_type: selectedResourceType.slug,
          file_name: file.name,
          file_format: fileFormat,
          storage_path: storagePath,
          file_size_bytes: file.size,
          is_published: isPublished,
        });

      if (databaseError) {
        await supabase.storage
          .from("medical-resources")
          .remove([storagePath]);

        throw databaseError;
      }

      setMessage("Resource uploaded successfully!");

      setTitle("");
      setDescription("");
      setYear("");
      setRootCategoryId("");
      setSubcategoryId("");
      setResourceType("");
      setFile(null);
      setIsPublished(false);

      const fileInput = document.getElementById(
        "resource-file"
      ) as HTMLInputElement;

      if (fileInput) fileInput.value = "";
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong during upload."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleUpload}
      className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div>
        <label className="mb-2 block font-semibold text-slate-800">
          Resource Title
        </label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Introduction to Acid Base Balance"
          className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-sky-500"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold text-slate-800">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the learning resource..."
          rows={4}
          className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-sky-500"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold text-slate-800">
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
          className="w-full rounded-lg border border-slate-300 p-3"
        >
          <option value="">Select academic year</option>
          {academicYears.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block font-semibold text-slate-800">
          Main Folder
        </label>
        <select
          required
          value={rootCategoryId}
          onChange={(e) => {
            setRootCategoryId(e.target.value);
            setSubcategoryId("");
          }}
          disabled={!year || rootCategories.length === 0}
          className="w-full rounded-lg border border-slate-300 p-3 disabled:bg-slate-100 disabled:text-slate-400"
        >
          <option value="">
            {!year
              ? "Select an academic year first"
              : rootCategories.length === 0
                ? "No folders available"
                : "Select main folder"}
          </option>

          {rootCategories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {subcategories.length > 0 && (
        <div>
          <label className="mb-2 block font-semibold text-slate-800">
            Subject / Subcategory
          </label>
          <select
            required
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 p-3"
          >
            <option value="">Select subject</option>

            {subcategories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="mb-2 block font-semibold text-slate-800">
          Resource Category
        </label>
        <select
          required
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
          className="w-full rounded-lg border border-slate-300 p-3"
        >
          <option value="">Select resource category</option>

          {resourceTypes.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block font-semibold text-slate-800">
          Select File
        </label>
        <input
          id="resource-file"
          required
          type="file"
          accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png,.webp"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full rounded-lg border border-slate-300 p-3"
        />
        <p className="mt-2 text-sm text-slate-500">
          Supported formats: PDF, PPT, PPTX, DOC, DOCX and images.
        </p>
      </div>

      <label className="flex items-center gap-3 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="h-4 w-4"
        />
        Publish this resource immediately
      </label>

      {message && (
        <p className="rounded-lg bg-slate-100 p-4 text-sm text-slate-700">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-sky-700 px-6 py-4 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload Resource"}
      </button>
    </form>
  );
}
