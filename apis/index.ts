// app/data/client.ts
import { unstable_cache, revalidateTag } from "next/cache";
import { axiosPublicServer } from "@/lib/axiosServer";
import logger from "@/lib/logger/logger";
import { cookies } from "next/headers";

// ——— Config ————————————————————————————————————————————————
// 1 day in seconds
export const REVALIDATE_SECONDS = 86400;

// All cache tags used by unstable_cache (for purgeAllCacheTags)
export const CACHE_TAGS = [
  "packages-homepage",
  "package-types",
  "packages",
  "package-by-slug",
  "service-categories",
  "categories-with-services",
  "services-by-category",
  "service-by-slug",
  "blogs",
  "latest-blogs",
  "workspace-types",
  "blog-categories",
  "blogs-by-category",
  "blog-category-meta",
  "blog-by-slug",
  "help-and-advice-by-slug",
  "blog-meta",
  "workspace-type-detail",
  "help-advice-categories",
  "articles-by-category",
  "package-types-meta",
  "blog-category-meta",
  "workspaces-detail",
  "packages-meta",
] as const;

/** Purge all cached API data by revalidating every cache tag. Call from API route or server action. */
export async function purgeAllCacheTags(): Promise<{ revalidated: string[] }> {
  const revalidated: string[] = [];
  for (const tag of CACHE_TAGS) {
    revalidateTag(String(tag), "max");
    revalidated.push(String(tag));
  }
  logger.info({ revalidated }, "purgeAllCacheTags");
  return { revalidated };
}

// ——— Helpers ————————————————————————————————————————————————
const num = (v?: number) => (typeof v === "number" ? v : undefined);
const str = (v?: string) => (typeof v === "string" && v.trim() ? v : undefined);

const buildParams = <T extends Record<string, unknown>>(obj: T) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number>;

async function safeGet<T>(
  url: string,
  params?: Record<string, any>,
  label?: string,
  token?: string,
): Promise<T | null> {
  try {
    logger.debug(url, "url");
    logger.debug(params, "params");
    logger.debug(label, "label");
    logger.debug(token, "token");
    const res = await axiosPublicServer.get(url, {
      params,
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    });
    logger.info(res, label);
    return res?.data ?? null;
  } catch (error) {
    logger.error(error, `${label} failed`);
    return null;
  }
}

// ——— APIs ————————————————————————————————————————————————

// Homepage packages
export const fetchPackagesHomepage = async (
  opts: { page?: number; per_page?: number } = {},
) => {
  const fn = unstable_cache(
    async ({ page, per_page }: { page?: number; per_page?: number }) =>
      safeGet(
        "/packages-homepage",
        buildParams({ page: num(page), per_page: num(per_page) }),
        "fetchPackagesHomepage",
      ) as any,
    ["packages-homepage", String(opts.page ?? ""), String(opts.per_page ?? "")],
    { revalidate: REVALIDATE_SECONDS, tags: ["packages-homepage"] },
  );
  return fn(opts);
};

// Package types
export const fetchPackagesTypes = async (
  opts: { search?: string; per_page?: number; types?: string } = {},
) => {
  const fn = unstable_cache(
    async ({
      search,
      per_page,
      types,
    }: {
      search?: string;
      per_page?: number;
      types?: string;
    }) =>
      safeGet(
        "/package-types",
        buildParams({
          search: str(search),
          per_page: num(per_page),
          type: str(types),
        }),
        "fetchPackagesTypes",
      ) as any,
    [
      "package-types",
      String(opts.search ?? ""),
      String(opts.per_page ?? ""),
      String(opts.types ?? ""),
    ],
    { revalidate: REVALIDATE_SECONDS, tags: ["package-types"] },
  );
  return fn(opts);
};

// Packages list
export const fetchPackages = async (
  opts: { package_type?: string; page?: number; per_page?: number } = {},
) => {
  const fn = unstable_cache(
    async ({
      package_type,
      page,
      per_page,
    }: {
      package_type?: string;
      page?: number;
      per_page?: number;
    }) =>
      safeGet(
        "/packages",
        buildParams({
          package_type: str(package_type),
          page: num(page),
          per_page: num(per_page),
        }),
        "fetchPackages",
      ) as any,
    [
      "packages",
      String(opts.package_type ?? ""),
      String(opts.page ?? ""),
      String(opts.per_page ?? ""),
    ],
    { revalidate: REVALIDATE_SECONDS, tags: ["packages"] },
  );
  return fn(opts);
};

// Package by slug
export const fetchPackageBySlug = async (slug: string) => {
  const s = str(slug);
  if (!s) return null;
  const fn = unstable_cache(
    async (sl: string) =>
      safeGet(`/packages/${sl}`, undefined, "fetchPackageBySlug") as any,
    ["package-by-slug", s],
    { revalidate: REVALIDATE_SECONDS, tags: ["package-by-slug"] },
  );
  return fn(s);
};

// Service categories
export const fetchServiceCategories = async (
  opts: { per_page?: number; page?: number } = {},
) => {
  const fn = unstable_cache(
    async ({ per_page, page }: { per_page?: number; page?: number }) =>
      safeGet(
        "/service-categories",
        buildParams({ per_page: num(per_page), page: num(page) }),
        "fetchServiceCategories",
      ) as any,
    [
      "service-categories",
      String(opts.per_page ?? ""),
      String(opts.page ?? ""),
    ],
    { revalidate: REVALIDATE_SECONDS, tags: ["service-categories"] },
  );
  return fn(opts);
};

// Categories with services
export const fetchCategoriesWithServices = async (
  opts: { page?: number; per_page?: number } = {},
) => {
  const fn = unstable_cache(
    async ({ page, per_page }: { page?: number; per_page?: number }) =>
      safeGet(
        "/categories-with-services",
        buildParams({ page: num(page), per_page: num(per_page) }),
        "fetchCategoriesWithServices",
      ) as any,
    [
      "categories-with-services",
      String(opts.page ?? ""),
      String(opts.per_page ?? ""),
    ],
    { revalidate: REVALIDATE_SECONDS, tags: ["categories-with-services"] },
  );
  return fn(opts);
};

// Services by category
export const fetchServicesByCategory = async (slug: string) => {
  const s = str(slug);
  if (!s) return null;
  const fn = unstable_cache(
    async (sl: string) =>
      safeGet(
        `/services-by-category/${sl}`,
        undefined,
        "fetchServicesByCategory",
      ) as any,
    ["services-by-category", s],
    { revalidate: REVALIDATE_SECONDS, tags: ["services-by-category"] },
  );
  return fn(s);
};

// Service by slug
export const fetchServiceBySlug = async (slug: string) => {
  const s = str(slug);
  if (!s) return null;
  const fn = unstable_cache(
    async (sl: string) =>
      safeGet(`/services/${sl}`, undefined, "fetchServiceBySlug") as any,
    ["service-by-slug", s],
    { revalidate: REVALIDATE_SECONDS, tags: ["service-by-slug"] },
  );
  return fn(s);
};

// Blogs (list)
export const fetchBlogs = async (
  opts: { per_page?: number; page?: number } = {},
) => {
  const fn = unstable_cache(
    async ({ per_page, page }: { per_page?: number; page?: number }) =>
      safeGet(
        "/blogs",
        buildParams({ per_page: num(per_page), page: num(page) }),
        "fetchBlogs",
      ) as any,
    ["blogs", String(opts.per_page ?? ""), String(opts.page ?? "")],
    { revalidate: REVALIDATE_SECONDS, tags: ["blogs"] },
  );
  return fn(opts);
};

// Blogs (latest)
export const fetchLatestBlogs = async (
  opts: { per_page?: number; page?: number } = {},
) => {
  const fn = unstable_cache(
    async ({ per_page, page }: { per_page?: number; page?: number }) =>
      safeGet(
        "/latest_blogs",
        buildParams({ per_page: num(per_page), page: num(page) }),
        "fetchLatestBlogs",
      ) as any,
    ["latest-blogs", String(opts.per_page ?? ""), String(opts.page ?? "")],
    { revalidate: REVALIDATE_SECONDS, tags: ["latest-blogs"] },
  );
  return fn(opts);
};

// Workspace types
export const fetchWorkspaceTypes = async () =>
  unstable_cache(
    async () =>
      safeGet("/workspace-types", undefined, "fetchWorkspaceTypes") as any,
    ["workspace-types"],
    { revalidate: REVALIDATE_SECONDS, tags: ["workspace-types"] },
  )();

// Blog categories
export const fetchBlogCategories = async () =>
  unstable_cache(
    async () =>
      safeGet("/blog_categories", undefined, "fetchBlogCategories") as any,
    ["blog-categories"],
    { revalidate: REVALIDATE_SECONDS, tags: ["blog-categories"] },
  )();

// Blogs by category slug
export const fetchBlogsByCategorySlug = async (
  slug: string,
  opts: { per_page?: number; page?: number } = {},
) => {
  const s = str(slug);
  if (!s) return null;
  const fn = unstable_cache(
    async (sl: string, per_page?: number, page?: number) =>
      safeGet(
        `/blogs/${sl}/category`,
        buildParams({ per_page: num(per_page), page: num(page) }),
        "fetchBlogsByCategorySlug",
      ) as any,
    [
      "blogs-by-category",
      s,
      String(opts.per_page ?? ""),
      String(opts.page ?? ""),
    ],
    { revalidate: REVALIDATE_SECONDS, tags: ["blogs-by-category"] },
  );
  return fn(s, opts.per_page, opts.page);
};

// Blog category meta
export const fetchBlogCategoryMeta = async (slug: string) => {
  const s = str(slug);
  if (!s) return null;
  const fn = unstable_cache(
    async (sl: string) =>
      safeGet(
        `/blog_category_meta/${sl}`,
        undefined,
        "fetchBlogCategoryMeta",
      ) as any,
    ["blog-category-meta", s],
    { revalidate: REVALIDATE_SECONDS, tags: ["blog-category-meta"] },
  );
  return fn(s);
};

// Blog by slug
export const fetchBlogBySlug = async (slug: string) => {
  const s = str(slug);
  if (!s) return null;
  const fn = unstable_cache(
    async (sl: string) =>
      safeGet(`/blogs/${sl}`, undefined, "fetchBlogBySlug") as any,
    ["blog-by-slug", s],
    { revalidate: REVALIDATE_SECONDS, tags: ["blog-by-slug"] },
  );
  return fn(s);
};

export const fetchHelpAndAdviceBySlug = async (slug: string) => {
  const s = str(slug);
  if (!s) return null;
  const fn = unstable_cache(
    async (sl: string) =>
      safeGet(
        `/help_and_advise/${sl}`,
        undefined,
        "fetchHelpAndAdviceBySlug",
      ) as any,
    ["help-and-advice-by-slug", s],
    { revalidate: REVALIDATE_SECONDS, tags: ["help-and-advice-by-slug"] },
  );
  return fn(s);
};

// Blog meta by slug
export const fetchBlogMeta = async (slug: string) => {
  const s = str(slug);
  if (!s) return null;
  const fn = unstable_cache(
    async (sl: string) =>
      safeGet(`/blogs_meta/${sl}`, undefined, "fetchBlogMeta") as any,
    ["blog-meta", s],
    { revalidate: REVALIDATE_SECONDS, tags: ["blog-meta"] },
  );
  return fn(s);
};

// Workspace type detail by slug
export const fetchWorkspaceTypeBySlugDetail = async (slug: string) => {
  const s = str(slug);
  if (!s) return null;
  const fn = unstable_cache(
    async (sl: string) =>
      safeGet(
        `/workspace-type/${sl}`,
        undefined,
        "fetchWorkspaceTypeBySlugDetail",
      ) as any,
    ["workspace-type-detail", s],
    { revalidate: REVALIDATE_SECONDS, tags: ["workspace-type-detail"] },
  );
  return fn(s);
};

// Help & Advice categories
export const fetchHelpAdviceCategories = async () =>
  unstable_cache(
    async () =>
      safeGet(
        "/help_advice_categories",
        undefined,
        "fetchHelpAdviceCategories",
      ) as any,
    ["help-advice-categories"],
    { revalidate: REVALIDATE_SECONDS, tags: ["help-advice-categories"] },
  )();

// Articles by category slug
export const fetchArticlesByCategorySlug = async (
  slug: string,
  opts: { per_page?: number; page?: number } = {},
) => {
  const s = str(slug);
  if (!s) return null;
  const fn = unstable_cache(
    async (sl: string, per_page?: number, page?: number) =>
      safeGet(
        `/articles/${sl}`,
        buildParams({ per_page: num(per_page), page: num(page) }),
        "fetchArticlesByCategorySlug",
      ) as any,
    [
      "articles-by-category",
      s,
      String(opts.per_page ?? ""),
      String(opts.page ?? ""),
    ],
    { revalidate: REVALIDATE_SECONDS, tags: ["articles-by-category"] },
  );
  return fn(s, opts.per_page, opts.page);
};

//Get Customer Profile Data
export const fetchCustomerProfile = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ldjsldjs82ydkz");
    // logger.info(token, "Token");
    if (!token) return null;
    const res = await axiosPublicServer.get(`/customer/personal-information`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    return res?.data;
  } catch (error) {
    logger.error(error, "fetchCustomerProfile failed");
    return null;
  }
};
//Get Customer Profile Data
export const fetchCustomerOrderHistory = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ldjsldjs82ydkz");
    // logger.info(token, "Token");
    if (!token) return null;
    const res = await axiosPublicServer.get(`/customer/orders`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    return res?.data;
  } catch (error) {
    logger.error(error, "fetchCustomerProfile failed");
    return null;
  }
};
//Get Customer Profile Data
export const fetchCustomerOrderHistoryDetail = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ldjsldjs82ydkz");
    // logger.info(token, "Token");
    if (!token) return null;
    const res = await axiosPublicServer.get(`/customer/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    return res?.data;
  } catch (error) {
    logger.error(error, "fetchCustomerProfile failed");
    return null;
  }
};
//Get Customer Companies Data
export const fetchCustomerCompanies = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ldjsldjs82ydkz");
    // logger.info(token, "Token");
    if (!token) return null;
    const res = await axiosPublicServer.get(`/customer/companies`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    return res?.data;
  } catch (error) {
    logger.error(error, "fetchCustomerCompanies failed");
    return null;
  }
};

// Articles by category slug
export async function fetchCustomerCompanyDetailBySlug(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ldjsldjs82ydkz");
  logger.info(token, "Token");

  if (!token) return null;
  if (!id) return null;

  const response = (await safeGet(
    `/customer/companies_detail/${id}`,
    undefined,
    "fetchCustomerCompanyDetailBySlug",
    token.value,
  )) as any;

  return response;
}
export async function deleteCompaniesDocument(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ldjsldjs82ydkz");
  logger.info(token, "Token");

  if (!token) return null;
  if (!id) return null;

  const response = (await safeGet(
    `/customer/companies/documents/${id}/delete`,
    undefined,
    "deleteCompaniesDocument",
    token.value,
  )) as any;

  return response;
}
export async function getCompanyServices() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ldjsldjs82ydkz");
  logger.info(token, "Token");

  if (!token) return null;

  const response = (await safeGet(
    `/customer/services`,
    undefined,
    "getCompanyServices",
    token?.value,
  )) as any;

  return response;
}
export async function getCustomerVerifications() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ldjsldjs82ydkz");
  logger.info(token, "Token");

  if (!token) return null;

  const response = (await safeGet(
    `/customer-verifications`,
    undefined,
    "getCustomerVerifications",
    token?.value,
  )) as any;

  return response;
}
export async function getCompanyInboxEmails(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ldjsldjs82ydkz");
  logger.info(token, "Token");

  if (!token) return null;

  const response = (await safeGet(
    `/company_inbox/${id}`,
    undefined,
    "getCompanyInbox",
    token?.value,
  )) as any;

  return response;
}
export async function getCompanyInboxEmailDetail(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ldjsldjs82ydkz");
  logger.info(token, "Token");

  if (!token) return null;

  const response = (await safeGet(
    `/company_inbox_detail/${id}`,
    undefined,
    "getCompanyInboxEmailDetail",
    token?.value,
  )) as any;

  return response;
}

export async function getDocumentsByAdmin(companyId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ldjsldjs82ydkz");
  logger.info(token, "Token");

  if (!token) return null;
  if (!companyId) return null;

  const response = (await safeGet(
    `/customer/companies/get_documents_by_admin/${companyId}`,
    undefined,
    "getDocumentsByAdmin",
    token?.value,
  )) as any;

  return response;
}
export const fetchPackageTypeMetaBySlug = unstable_cache(
  async (slug: string) => {
    const s = str(slug);
    if (!s) return null;
    return safeGet(
      `/package-types-meta/${s}`,
      undefined,
      "fetchPackageTypeMetaBySlug",
    ) as any;
  },
  ["package-types-meta"],
  { revalidate: REVALIDATE_SECONDS, tags: ["package-types-meta"] },
);
export const fetchBlogCategoryMetaBySlug = unstable_cache(
  async (slug: string) => {
    const s = str(slug);
    if (!s) return null;
    return safeGet(
      `/blog_category_meta/${s}`,
      undefined,
      "fetchBlogCategoryMetaBySlug",
    ) as any;
  },
  ["blog-category-meta"],
  { revalidate: REVALIDATE_SECONDS, tags: ["blog-category-meta"] },
);
export const fetchWorkSpaceDetail = unstable_cache(
  async (slug: string) => {
    const s = str(slug);
    if (!s) return null;
    return safeGet(
      `/workspaces/${s}`,
      undefined,
      "fetchWorkSpaceDetail",
    ) as any;
  },
  ["workspaces-detail"],
  { revalidate: REVALIDATE_SECONDS, tags: ["workspaces-detail"] },
);

export async function getWorkspaceBookings() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ldjsldjs82ydkz");
  logger.info(token, "Token");

  if (!token) return null;

  const response = (await safeGet(
    `/workspace-bookings`,
    undefined,
    "getWorkspaceBookings",
    token?.value,
  )) as any;

  return response;
}

export async function getWorkspaceBookingDetail(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ldjsldjs82ydkz");
  logger.info(token, "Token");

  if (!token) return null;
  if (!id) return null;

  const response = (await safeGet(
    `/workspace-bookings/${id}`,
    undefined,
    "getWorkspaceBookingDetail",
    token?.value,
  )) as any;

  return response;
}
export const getPackagesMetaBySlug = async (slug: string) => {
  if (!slug) return null;
  const fn = unstable_cache(
    async (s: string) =>
      safeGet(`/packages-meta/${s}`, undefined, "getPackagesMetaBySlug") as any,
    ["packages-meta", slug],
    { revalidate: REVALIDATE_SECONDS, tags: ["packages-meta"] },
  );
  return fn(slug);
};
