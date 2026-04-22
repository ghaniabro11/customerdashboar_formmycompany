import HeroSection from "@/components/custom/hero-section";

export const metadata = {
  title: "How It Works – MY Company Registration",
  description:
    "Learn how UK company registration works with MY Company Registration. Simple step-by-step process for fast, compliant business setup.",
};

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero Section */}
      <div>
        <HeroSection>
          <header className="space-y-4 my-auto pt-10 text-center">
            <h1 className="text-white max-w-5xl px-5 mx-auto max-md:text-2xl font-semibold">
              How It Works – MY Company Registration
            </h1>
            <p className="text-white text-lg">
              A simple, fast, and fully compliant step-by-step process to
              register your company in the UK.
            </p>
          </header>
        </HeroSection>
      </div>

      {/* Content Section */}
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <p className="mb-4">
          At MY Company Registration, we make the process of registering a
          company in the UK simple, fast, and fully compliant.
        </p>

        <p className="mb-4">
          Our step-by-step approach ensures that your business is registered
          correctly with Companies House and meets all legal requirements.
        </p>

        {/* Steps */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Step-by-Step Company Registration Process
        </h2>

        {/* Step 1 */}
        <h3 className="font-semibold mt-4 mb-1">
          Choose Your Company Type
        </h3>
        <p className="mb-2">
          Start by selecting the right business structure based on your
          needs:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Private Limited Company (Ltd)</li>
          <li>Limited Liability Partnership (LLP)</li>
          <li>Sole Trader (guidance available)</li>
        </ul>
        <p className="mb-4">
          We can help you decide which structure is best for your business
          goals.
        </p>

        {/* Step 2 */}
        <h3 className="font-semibold mt-4 mb-1">
          Provide Company Details
        </h3>
        <p className="mb-2">
          You will need to submit key information required for registration,
          including:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Company name</li>
          <li>Registered office address</li>
          <li>Director(s) and shareholder details</li>
          <li>Nature of business (SIC code)</li>
        </ul>
        <p className="mb-4">
          We ensure all details are accurate and meet UK regulations.
        </p>

        {/* Step 3 */}
        <h3 className="font-semibold mt-4 mb-1">
          Document Preparation & Filing
        </h3>
        <p className="mb-2">
          Our team prepares and submits your application to Companies
          House.
        </p>
        <p className="mb-2">This includes:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Incorporation documents</li>
          <li>Legal filings</li>
          <li>Compliance checks</li>
        </ul>
        <p className="mb-4">
          We handle the technical and legal aspects so you don’t have to.
        </p>

        {/* Step 4 */}
        <h3 className="font-semibold mt-4 mb-1">
          Company Registration Confirmation
        </h3>
        <p className="mb-2">
          Once approved, your company is officially registered.
        </p>
        <p className="mb-2">You will receive:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Certificate of Incorporation</li>
          <li>Company registration number</li>
          <li>Official confirmation from Companies House</li>
        </ul>
        <p className="mb-4">
          This confirms your business is legally formed in the UK.
        </p>

        {/* Step 5 */}
        <h3 className="font-semibold mt-4 mb-1">
          Post-Registration Support
        </h3>
        <p className="mb-2">
          After your company is formed, we continue to support you with:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Compliance guidance</li>
          <li>Filing requirements</li>
          <li>Registered office services (if applicable)</li>
          <li>Ongoing company maintenance</li>
        </ul>

        {/* Time */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          How Long Does It Take?
        </h2>
        <p className="mb-2">
          Standard company registration: 24–48 hours
        </p>
        <p className="mb-4">
          Time may vary depending on accuracy of information and approval
          process.
        </p>
        <p className="mb-4">
          We aim to complete registrations as quickly as possible without
          compromising accuracy.
        </p>

        {/* Why Process Works */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Why Our Process Works
        </h2>
        <p className="mb-2">Our process is designed to be:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Simple – Easy steps with clear guidance</li>
          <li>Fast – Efficient submission and processing</li>
          <li>Accurate – Error-free documentation</li>
          <li>Compliant – Fully aligned with UK laws and regulations</li>
          <li>Transparent – No hidden steps or confusion</li>
        </ul>

        {/* Difference */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          What Makes MY Company Registration Different
        </h2>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Experienced in UK company formation</li>
          <li>Direct handling of filings with Companies House</li>
          <li>Clear communication throughout the process</li>
          <li>Support before and after registration</li>
          <li>
            Focus on long-term compliance, not just setup
          </li>
        </ul>

        {/* Notes */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Important Notes
        </h2>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>All information provided must be accurate and complete</li>
          <li>
            Approval depends on Companies House verification
          </li>
          <li>
            We follow legal and ethical registration practices only
          </li>
        </ul>

        {/* CTA */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Get Started Today
        </h2>
        <p className="mb-4">
          Starting a company in the UK doesn’t have to be complicated.
        </p>

        <p className="mb-4">
          With MY Company Registration, you get a structured, reliable,
          and professional process from start to finish.
        </p>

        <p>
          Contact us today to begin your company registration journey.
        </p>
      </div>
    </>
  );
}