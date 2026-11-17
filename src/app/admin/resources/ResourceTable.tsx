
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import EditResourceForm from "./EditResourceForm";

type Resource = {
  id: string;
  title: string;
  description: string | null;
  year: string;
  yearLabel: string;
  subject: string;
  category_id: string | null;
  categoryPath: string;
  resource_type: string;
  file_name: string;
  file_format: string;
  is_published: boolean;
  created_at: string;
  storage_path: string | null;
};

const resourceTypeLabels: Record<string, string> = {
  "lecture-notes": "Lecture Notes",
  "powerpoint-presentations": "PowerPoint Presentations",
  "clinical-guidelines": "Clinical Guidelines",
  "medical-illustrations": "Medical Illustrations",
  "past-papers": "Past Papers",
};

function formatResourceType(value: string) {
  return (
    resourceTypeLabels[value] ??
    value
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

export default function ResourceTable({
  resources,
}: {
  resources: Resource[];
}) {
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [editingResource, setEditingResource] =
    useState<Resource | null>(null);

  const router = useRouter();

  async function togglePublish(resource: Resource) {
    setUpdatingId(resource.id);
    setMessage("");
    setErrorMessage("");

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("resources")
        .update({
          is_published: !resource.is_published,
        })
        .eq("id", resource.id);

      if (error) throw error;

      setMessage("Publication status updated successfully.");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update publication status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteResource(resource: Resource) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${resource.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(resource.id);
    setMessage("");
    setErrorMessage("");

    try {
      const supabase = createClient();

      const { data: deletedRecord, error: databaseError } =
        await supabase
          .from("resources")
          .delete()
          .eq("id", resource.id)
          .select("id")
          .maybeSingle();

      if (databaseError) throw databaseError;

      if (!deletedRecord) {
        throw new Error(
          "Resource was not deleted. Please check your administrator permissions."
        );
      }

      if (resource.storage_path) {
        const { error: storageError } = await supabase.storage
          .from("medical-resources")
          .remove([resource.storage_path]);

        if (storageError) {
          setMessage(
            "Resource record deleted, but its file could not be removed from Storage. Please clean it up manually."
          );
          router.refresh();
          return;
        }
      }

      setMessage("Resource deleted successfully.");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete resource."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const years = [
    ...new Set(resources.map((resource) => resource.year)),
  ];

  const subjects = [
    ...new Map(
      resources.map((resource) => [
        resource.category_id ?? resource.subject,
        {
          id: resource.category_id ?? resource.subject,
          label: `${resource.yearLabel} → ${resource.categoryPath}`,
        },
      ])
    ).values(),
  ];

  const filteredResources = resources.filter((resource) => {
    const searchMatch = [
      resource.title,
      resource.description || "",
      resource.file_name,
      resource.categoryPath,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const yearMatch =
      yearFilter === "All" || resource.year === yearFilter;

    const subjectMatch =
      subjectFilter === "All" ||
      (resource.category_id ?? resource.subject) === subjectFilter;

    const statusMatch =
      statusFilter === "All" ||
      (statusFilter === "Published" && resource.is_published) ||
      (statusFilter === "Unpublished" && !resource.is_published);

    return searchMatch && yearMatch && subjectMatch && statusMatch;
  });

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl bg-white shadow-sm">

      {/* Heading */}
      <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
        <h2 className="text-lg font-semibold text-gray-900">
          All Uploaded Resources
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Showing {filteredResources.length} of {resources.length} resources
        </p>
      </div>

      {/* Search and filters */}
      <div className="grid min-w-0 grid-cols-1 gap-3 border-b border-gray-200 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">

        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full min-w-0 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-600"
        />

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="w-full min-w-0 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900"
        >
          <option value="All">All Academic Years</option>

          {years.map((year) => (
            <option key={year} value={year}>
              {resources.find((resource) => resource.year === year)?.yearLabel ?? year}
            </option>
          ))}
        </select>

        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="w-full min-w-0 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900"
        >
          <option value="All">All Categories</option>

          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.label}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full min-w-0 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900"
        >
          <option value="All">All Statuses</option>
          <option value="Published">Published</option>
          <option value="Unpublished">Unpublished</option>
        </select>
      </div>

      {/* Success and error messages */}
      {message && (
        <p className="break-words px-4 py-3 text-sm text-green-700 sm:px-6">
          {message}
        </p>
      )}

      {errorMessage && (
        <p className="break-words px-4 py-3 text-sm text-red-700 sm:px-6">
          {errorMessage}
        </p>
      )}

      {/* Empty state */}
      {filteredResources.length === 0 ? (
        <p className="p-8 text-center text-gray-500">
          No resources match your search or filters.
        </p>
      ) : (
        <>
          {/* MOBILE AND TABLET RESOURCE CARDS */}
          <div className="space-y-4 p-4 lg:hidden">
            {filteredResources.map((resource) => (
              <article
                key={resource.id}
                className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words font-semibold text-gray-900">
                      {resource.title}
                    </h3>

                    <p className="mt-2 break-words text-sm leading-6 text-gray-500">
                      {resource.description || "No description"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      resource.is_published
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {resource.is_published
                      ? "Published"
                      : "Unpublished"}
                  </span>
                </div>

                <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                  <p className="break-words text-gray-600">
                    <span className="font-semibold text-gray-900">Academic year:</span>{" "}
                    {resource.yearLabel}
                  </p>

                  <p className="break-words text-gray-600">
                    <span className="font-semibold text-gray-900">Category:</span>{" "}
                    {resource.categoryPath}
                  </p>

                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Resource type:</span>{" "}
                    {formatResourceType(resource.resource_type)}
                  </p>

                  <p className="break-words text-gray-600">
                    <span className="font-semibold text-gray-900">File:</span>{" "}
                    {resource.file_name}
                  </p>

                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Format:</span>{" "}
                    {resource.file_format}
                  </p>

                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Date added:</span>{" "}
                    {new Date(resource.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Mobile action buttons */}
                <div className="mt-5 grid grid-cols-1 gap-2 border-t border-gray-100 pt-4 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setEditingResource(resource)}
                    disabled={
                      deletingId === resource.id ||
                      updatingId === resource.id
                    }
                    className="w-full rounded-lg bg-blue-100 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-200 disabled:opacity-50"
                  >
                    Edit Resource
                  </button>

                  <button
                    type="button"
                    onClick={() => togglePublish(resource)}
                    disabled={
                      updatingId === resource.id ||
                      deletingId === resource.id
                    }
                    className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition disabled:opacity-50 ${
                      resource.is_published
                        ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {updatingId === resource.id
                      ? "Updating..."
                      : resource.is_published
                        ? "Unpublish"
                        : "Publish"}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteResource(resource)}
                    disabled={
                      deletingId === resource.id ||
                      updatingId === resource.id
                    }
                    className="w-full rounded-lg bg-red-100 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-200 disabled:opacity-50"
                  >
                    {deletingId === resource.id
                      ? "Deleting..."
                      : "Delete Resource"}
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* DESKTOP RESOURCE TABLE */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-4">Resource</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">File</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date Added</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredResources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {resource.title}
                      </p>

                      <p className="mt-1 text-gray-500">
                        {resource.description || "No description"}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      <p className="font-medium text-gray-900">
                        {resource.yearLabel}
                      </p>

                      <p className="mt-1 text-blue-700">
                        {resource.categoryPath}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {formatResourceType(resource.resource_type)}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {resource.file_format}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          resource.is_published
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {resource.is_published
                          ? "Published"
                          : "Unpublished"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(resource.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingResource(resource)}
                          disabled={
                            deletingId === resource.id ||
                            updatingId === resource.id
                          }
                          className="rounded-lg bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => togglePublish(resource)}
                          disabled={
                            updatingId === resource.id ||
                            deletingId === resource.id
                          }
                          className={`rounded-lg px-4 py-2 text-xs font-semibold disabled:opacity-50 ${
                            resource.is_published
                              ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {updatingId === resource.id
                            ? "Updating..."
                            : resource.is_published
                              ? "Unpublish"
                              : "Publish"}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteResource(resource)}
                          disabled={
                            deletingId === resource.id ||
                            updatingId === resource.id
                          }
                          className="rounded-lg bg-red-100 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-50"
                        >
                          {deletingId === resource.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Edit resource modal */}
      {editingResource && (
        <EditResourceForm
          resource={editingResource}
          onClose={() => setEditingResource(null)}
        />
      )}
    </div>
  );
}
