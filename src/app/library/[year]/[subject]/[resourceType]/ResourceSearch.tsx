"use client";

import { useState } from "react";

type Resource = {
  id: string;
  title: string;
  description: string;
  format: string;
  size: string;
  date: string;
};

type ResourceSearchProps = {
  resources: Resource[];
  basePath: string;
};

export default function ResourceSearch({
  resources,
  basePath,
}: ResourceSearchProps) {
  const [search, setSearch] = useState("");
  const [format, setFormat] = useState("All");

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(search.toLowerCase()) ||
      resource.description.toLowerCase().includes(search.toLowerCase());

    const matchesFormat =
      format === "All" || resource.format === format;

    return matchesSearch && matchesFormat;
  });

  return (
    <div>
      {/* Search and filter controls */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search learning materials..."
          className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />

        <select
          value={format}
          onChange={(event) => setFormat(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-5 py-4 text-slate-700 outline-none focus:border-sky-500"
        >
          <option value="All">All Formats</option>
          <option value="PDF">PDF</option>
          <option value="PPTX">PowerPoint (PPTX)</option>
          <option value="PPT">PowerPoint (PPT)</option>
          <option value="DOCX">Word (DOCX)</option>
          <option value="DOC">Word (DOC)</option>
          <option value="IMAGE">Images</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setFormat("All");
          }}
          className="rounded-xl bg-blue-950 px-5 py-4 font-medium text-white transition hover:bg-blue-900"
        >
          Clear
        </button>
      </div>

      {/* Resource count */}
      <p className="mb-5 text-sm text-slate-500">
        Showing{" "}
        <span className="font-semibold text-blue-950">
          {filteredResources.length}
        </span>{" "}
        of {resources.length} resources
      </p>

      {/* Resource cards */}
      {filteredResources.length > 0 ? (
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <a
              key={resource.id}
              href={`${basePath}/${resource.id}`}
              className="group flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-400 hover:shadow-lg sm:flex-row sm:items-center"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sm font-bold text-sky-700 transition group-hover:bg-sky-100">
                {resource.format}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-blue-950 transition group-hover:text-sky-700">
                  {resource.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {resource.description || "No description available."}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>{resource.format} document</span>
                  <span>•</span>
                  <span>{resource.size}</span>
                  <span>•</span>
                  <span>{resource.date}</span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-sky-700 transition group-hover:text-blue-950">
                <span>View Resource</span>
                <span aria-hidden="true" className="transition group-hover:translate-x-1">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="text-4xl">🔎</div>

          <h3 className="mt-4 text-lg font-bold text-blue-950">
            No resources found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Try another search term or change your file format.
          </p>
        </div>
      )}
    </div>
  );
}