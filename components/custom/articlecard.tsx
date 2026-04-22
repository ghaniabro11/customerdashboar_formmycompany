import { Article } from "@/constants/types";
import logger from "@/lib/logger/logger";
import Image from "next/image";
import Link from "next/link";

interface ArticleCardProps {
  data: Article;
}

const ArticleCard = ({ data }: ArticleCardProps) => {
  if (!data) {
    logger.warn("ArticleCard received null or undefined data");
    return null;
  }

  const categorySlug = data?.categories?.[0]?.slug || "general";
  const href = `/blogs/${categorySlug}/${data.slug}`;

  return (
    <article 
      className="flex gap-4  rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 
                 transition-colors duration-200 border border-transparent hover:border-gray-200 
                 dark:hover:border-gray-700 group"
      role="listitem"
    >
      <Link 
        href={href}
        className="flex gap-4 w-full"
        aria-label={`Read article: ${data.title}`}
      >
        {data.featured_image && (
          <div className="relative shrink-0 w-44 h-32 md:w-48 md:h-32 overflow-hidden rounded-md">
            <Image
              src={data.featured_image}
              alt={data.title || "Article image"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 128px, 192px"
            />
          </div>
        )}
        <div className="flex-1 md:mt-2 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white  group-hover:text-orange transition-colors">
            {data.title}
          </h3>
          {/* {data.meta_description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
              {data.meta_description}
            </p>
          )} */}
        </div>
      </Link>
    </article>
  );
};

export default ArticleCard;
