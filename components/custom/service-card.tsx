import { Service } from "@/constants/types";
import logger from "@/lib/logger/logger";
import Image from "next/image";
import Link from "next/link";

const ServiceCard = ({ data, index }: { data: Service; index: number }) => {
  logger.debug(data, `ServiceCard Data - ${data?.title}`);
  return (
    <Link href={`/services/${data?.slug}`} className="">
      <div className="h-24  mx-auto  w-24 rounded-full bg-orange/50 shadow-xl shadow-orange/30 flex justify-center">
        <div className="h-20 w-20 rounded-full bg-orange mt-2 flex justify-center items-center text-white text-2xl font-semibold">
          <Image
            src={data?.icon || `/badge.png`}
            alt={data?.title || `Badge  ${index + 1}`}
            height={50}
            width={50}
          />
        </div>
      </div>
      <div className="bg-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1)] -mt-10  -z-9 relative text-center h-28 md:min-w-[424px] min-w-[372px]">
        <div className="px-2 pt-14 my-auto ">
          <h3 className="text-lg font-semibold line-clamp-2  ">{data?.title || ""}</h3>
          {/* <p className="text-gray-500 text-sm">
            {data?.meta_description || ""}
          </p> */}
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
