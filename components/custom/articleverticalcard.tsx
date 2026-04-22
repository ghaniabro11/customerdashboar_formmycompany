import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ArticleVerticalCardProps {
  title?: string;
  excerpt?: string;
  category?: string;
  imageUrl?: string;
  categorySlug?: string;
  slug?: string;
  isDynamic?: boolean;
}

const ArticleVerticalCard: React.FC<ArticleVerticalCardProps> = ({
  title = "Closing a company with debts: what you need to know",
  excerpt = "Closing a company with debts can be a daunting process, but understanding the legal steps and available options can make it more manageable.",
  category = "Company formation",
  categorySlug,
  isDynamic = false,
  imageUrl = "/dummy/article.png",
  slug = "/",
}) => {
  return (
    <article className="shadow-[0px_4px_6px_1px_rgba(0,0,0,0.1)] h-full overflow-hidden flex flex-col transition-transform duration-200 hover:scale-[1.01] bg-white">
      {/* ===== Image Section ===== */}
      <div className="relative min-h-48 max-h-48 h-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover w-full"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
        />
      </div>

      {/* ===== Category Tag ===== */}
      <Link href={isDynamic ? `/help-and-advice/${categorySlug}` : `/blogs/${categorySlug}`}>
        <div className="bg-orange/80 text-white px-5 py-1 w-fit ml-5 -mt-4 relative z-10 rounded-sm text-sm font-medium">
          {category}
        </div>
      </Link>

      {/* ===== Content Section ===== */}
      <div className="px-5 pb-5 flex flex-col flex-1 justify-between">
        <header>
          <h2 className="font-semibold text-2xl mt-2 line-clamp-2">{title}</h2>
        </header>

        <p className="text-gray-500 mt-2 mb-5 line-clamp-3">{excerpt}</p>

        <footer>
          <Link
            href={slug}
            aria-label={`Read full article: ${title}`}
            className="inline-block text-black font-medium border-b-2 border-orange pb-1 hover:text-darkslate transition-colors duration-200"
          >
            Read the Post
          </Link>
        </footer>
      </div>
    </article>
  );
};

export default ArticleVerticalCard;
