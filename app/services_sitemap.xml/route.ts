import { NextResponse } from "next/server";

const BASE_URL = "https://mycompanyregistration.uk/services";
const API_URL = "https://login.formmycompany.uk/api/service_categories_sitemap";

// Revalidate every 1 hour
export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch services");
    }

    const json = await res.json();
    const services = json.data || [];

    // Static URLs (if needed)
    const staticUrls = [""];

    const staticXml = staticUrls.map((path) => `
      <url>
        <loc>${BASE_URL}${path}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `);

    // Service URLs
    const serviceXml = services
      .map((service: any) => {
        if (!service.slug) return "";

        return `
          <url>
            <loc>${BASE_URL}/${service.slug}</loc>
            <lastmod>${new Date(service.created_at).toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.7</priority>
          </url>
        `;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticXml.join("")}
      ${serviceXml}
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