import { Article, BlogProp } from "@/constants/types";
import ArticleCard from "./articlecard";
import ArticleVerticalCard from "./articleverticalcard";

interface ArticlesGroupProps {
  data?: Article[];
  h?: boolean;
  isDynamic?: boolean;
  isBlog?: boolean;
}

const ArticlesGroup = ({
  data,
  h = true,
  isBlog = false,
  isDynamic = false,
}: ArticlesGroupProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          No related articles available at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="main">
      {h && (
        <header className="flex items-center gap-2 mb-10">
          <h2 className="text-nowrap text-3xl font-bold text-gray-900 dark:text-white">
            Read Articles
          </h2>
          <div className="h-0.5 w-full bg-orange" aria-hidden="true" />
        </header>
      )}
      <div
        className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6 md:gap-8"
        role="list"
      >
        {data.map((blogItem: any, index: number) => {
          // Safely access category data
          const category = blogItem?.categories?.[0];
          const categoryName = category?.name || "Uncategorized";
          const categorySlug = category?.slug || "";
          const blogSlug = blogItem?.slug || "";

          // Build the full slug path safely
          const fullSlug =
            categorySlug && blogSlug
              ? isBlog ? `/blogs/${categorySlug}/${blogSlug}` : `/help-and-advice/${categorySlug}/${blogSlug}`
              : "/";

          return (
            <ArticleVerticalCard
              excerpt={blogItem?.meta_description || ""}
              title={blogItem?.title || ""}
              isDynamic={isDynamic}
              category={categoryName}
              categorySlug={categorySlug}
              imageUrl={blogItem?.featured_image || "/dummy/article.png"}
              slug={fullSlug}
              key={blogItem?.id || index}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ArticlesGroup;
