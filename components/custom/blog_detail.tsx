import { BlogProp } from "@/constants/types";
import Image from "next/image";
import { format } from "date-fns";

interface BlogDetailProps {
  details: BlogProp & {
    related_blogs?: any[];
  };
}

const BlogDetail = ({ details }: BlogDetailProps) => {
  if (!details) return null;

  return (
    <article className="w-full">
      {/* Hero Section with Featured Image */}
      <header className="relative md:min-h-[70dvh] h-[40dvh] flex flex-col justify-center items-center overflow-hidden">
        {details?.featured_image && (
          <Image
            src={details?.featured_image}
            alt={details?.title || ""}
            fill
            className="object-cover w-full h-full"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/60 to-black/40" />

        <div className="relative z-10 px-4 max-w-4xl py-10 mx-auto text-center space-y-4">
          {/* Category Badge */}
          {details?.categories && details?.categories?.length > 0 && (
            <div className="inline-block">
              <span className="px-4 py-2 bg-orange/90 text-white md:text-sm text-xs font-semibold rounded-full uppercase tracking-wide">
                {details?.categories[0]?.name}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
            {details?.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/90 text-sm md:text-base">
            {details?.author && (
              <div className="flex items-center gap-2">
                <span className="font-medium">By {details?.author}</span>
              </div>
            )}
            {details?.published_date && (
              <time
                dateTime={details?.published_date}
                className="flex items-center gap-2"
              >
                <span>{details?.published_date}</span>
              </time>
            )}
          </div>
        </div>
      </header>

      {/* Content Section */}
      <div className="main py-8 md:py-12">
        <div
          className="content [&_p]:text-left [&_p]:!text-left [&_div]:text-left [&_span]:text-left"
          dangerouslySetInnerHTML={{
            __html: details?.content || "<p>Content not available.</p>",
          }}
        />
      </div>
    </article>
  );
};

export default BlogDetail;
