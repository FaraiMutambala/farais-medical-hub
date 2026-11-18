
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://farais-medical-hub.vercel.app";

  const pages = [
    "",
    "/library",
    "/library/fourth-year",
    "/library/fifth-year",
    "/library/sixth-year",
    "/search",
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: page === "" ? 1 : page === "/library" ? 0.9 : 0.8,
  }));
}
