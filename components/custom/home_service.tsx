import { Services } from "@/constants/types";
import ServiceCard from "./service-card";
import { fetchServicesByCategory } from "@/apis";

const HomeService = async () => {
  const services_by_categories = await fetchServicesByCategory(
    "address-services"
  );
  return (
    <div className="main">
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-black text-3xl font-bold">
          <span className="text-orange">Additional services </span>to{" "}
          <br className="hidden md:block" /> support your company closure
        </h2>
        <p>
          Explore expert services to help with company closure and legal
          compliance.
        </p>
      </div>
      <div className="grid md:grid-cols-3 grid-cols-2  gap-5">
        {services_by_categories?.data?.services?.map(
          (data: Services, index: number) => (
            <ServiceCard key={index} data={data as Services} index={index} />
          )
        )}
      </div>
    </div>
  );
};

export default HomeService;
