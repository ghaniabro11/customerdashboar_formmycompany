import { PackagesHome } from "@/constants/types";
import PackageCardHome from "./package-card-home";

const HomePackages = ({ packagestypes }: { packagestypes: PackagesHome[] }) => {
  return (
    <section className="main text-center">
      <h2 className="font-bold text-3xl mb-2">
        Our Affordable{" "}
        <span className="text-orange">Company Formation Packages </span>
      </h2>
      <p className="max-w-[65ch] mx-auto mb-10">
        Protect your privacy by using our official registered office address,
        keeping your personal address off the public record.
      </p>
      <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5">
        {packagestypes?.map((plan: PackagesHome, index: number) => (
          <PackageCardHome key={index} data={plan} />
        ))}
      </div>
    </section>
  );
};

export default HomePackages;
