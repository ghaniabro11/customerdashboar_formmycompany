import { NextResponse } from "next/server";

const BASE_URL = "https://mycompanyregistration.uk/blogs";
const API_URL = "https://login.mycompanyregistration.uk/api/sitemap_blogs";

//  Revalidate every 1 hour (important for SEO)
export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 3600 }, // ISR caching
    });

    if (!res.ok) {
      throw new Error("Failed to fetch blogs");
    }

    const json = await res.json();
    const blogs = json.data || [];

    //  Static Pages (add your real pages here)
    const staticUrls = [
      "",
    ];

    const staticXml = staticUrls.map((path) => `
      <url>
        <loc>${BASE_URL}${path}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>hourly</changefreq>
            <priority>0.8</priority>
      </url>
    `);

    //  Blog URLs
    const blogXml = blogs
      .map((blog: any) => {
        if (!blog.url) return ""; // safety

        let lastmod = new Date().toISOString(); // fallback

        if (blog.created_at) {
          const date = new Date(blog.created_at);
          if (!isNaN(date.getTime())) {
            lastmod = date.toISOString();
          }
        }

        return `
          <url>
            <loc>${BASE_URL}/${blog.url}</loc>
            <lastmod>${lastmod}</lastmod>
            <changefreq>hourly</changefreq>
            <priority>0.8</priority>
          </url>
        `;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticXml.join("")}
      ${blogXml}
    </urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
  return new NextResponse(
    JSON.stringify({
      message: "Sitemap Error",
      error: error.message,
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
}
}