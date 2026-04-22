import logger from "@/lib/logger/logger";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let companyName = searchParams.get("q") || "";
    companyName = companyName.toUpperCase();
    const itemsPerPage = searchParams.get("items_per_page") || "1000";
    const startIndex = searchParams.get("start_index") || "0";

    if (!companyName) {
      return NextResponse.json(
        { error: "Missing required companyName parameter: q" },
        { status: 400 }
      );
    }

    const apiKey = "2c95edd9-e973-4668-bdbb-5078c31cdf77";
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing Companies House API key" },
        { status: 500 }
      );
    }

    const url = new URL(
      "https://api.company-information.service.gov.uk/search/companies"
      // "https://api.company-information.service.gov.uk/alphabetical-search/companies"
    );
    url.searchParams.set("q", companyName);
    url.searchParams.set("start_index", startIndex);
    url.searchParams.set("items_per_page", "1000");
    //   url.searchParams.set("company_status", "active");
    //   url.searchParams.set('restrictions', 'active-companies legally-equivalent-company-name');
    logger.debug(url, "url");
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Companies House API error: ${res.status} - ${text}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const exactMatch = data?.items?.some(
      (item: any) => item?.title?.toLowerCase() === companyName?.toLowerCase()
    );

    if (exactMatch) {
      return NextResponse.json({
        available: false,
        message: `The company name "${companyName}" is already registered.`,
        data: data,
      });
    } else {
      // Optionally store name in session or database
      return NextResponse.json({
        available: true,
        message: `The company name "${companyName}" is available.`,
        data: data,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          "There was an error connecting to the Companies House API. Please try again later.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
