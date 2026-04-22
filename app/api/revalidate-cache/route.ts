import { NextResponse } from "next/server";
import { purgeAllCacheTags } from "@/apis";

/**
 * Purge all API cache tags. Call this API to invalidate every unstable_cache entry
 * so the next request refetches fresh data.
 *
 * POST /api/revalidate-cache
 * Optional: x-revalidate-secret header must match REVALIDATE_CACHE_SECRET env (if set).
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_CACHE_SECRET;
  if (secret) {
    const headerSecret = req.headers.get("x-revalidate-secret");
    if (headerSecret !== secret) {
      return NextResponse.json(
        { error: "Unauthorized", revalidated: [] },
        { status: 401 }
      );
    }
  }

  try {
    const { revalidated } = await purgeAllCacheTags();
    return NextResponse.json({
      ok: true,
      revalidated,
      message: `Revalidated ${revalidated.length} cache tag(s).`,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error), revalidated: [] },
      { status: 500 }
    );
  }
}
