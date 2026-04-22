import HeroSection from "@/components/custom/hero-section";

export const metadata = {
  title: "Registered & Compliance – MY Company Registration",
  description:
    "Learn about UK company registration and compliance with My Company Registration. Stay compliant with Companies House rules and legal requirements.",
};

export default function CompliancePage() {
  return (
    <>
      {/* Hero Section */}
      <div>
        <HeroSection>
          <header className="space-y-4 my-auto pt-10 text-center">
            <h1 className="text-white max-w-5xl px-5 mx-auto max-md:text-2xl font-semibold">
              Registered & Compliance
            </h1>
            <p className="text-white text-lg">
              Stay compliant with UK company laws and ensure your business meets
              all legal requirements with confidence.
            </p>
          </header>
        </HeroSection>
      </div>

      {/* Content Section */}
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <p className="mb-4">
          At My Company Registration, we ensure that all company formation and
          administrative processes are carried out in full compliance with UK
          laws and regulations.
        </p>

        <p className="mb-4">
          Our services are designed to help businesses meet their legal
          obligations and remain compliant with Companies House.
        </p>

        {/* What is Compliance */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          What Does Company Compliance Mean?
        </h2>
        <p className="mb-2">
          Company compliance refers to the legal requirements a UK business must
          follow after registration. This includes:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Filing annual confirmation statements</li>
          <li>Submitting company accounts</li>
          <li>Maintaining accurate company records</li>
          <li>Updating company details when changes occur</li>
          <li>Meeting tax and reporting obligations</li>
        </ul>

        {/* Commitment */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Our Compliance Commitment
        </h2>
        <p className="mb-2">We help businesses:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Stay compliant with UK regulations</li>
          <li>Avoid penalties and legal issues</li>
          <li>Maintain accurate and up-to-date records</li>
          <li>Meet filing deadlines with Companies House</li>
          <li>Understand their legal responsibilities</li>
        </ul>

        {/* Requirements */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Key Compliance Requirements
        </h2>

        <h3 className="font-semibold mt-4 mb-1">
          Annual Confirmation Statement
        </h3>
        <p className="mb-4">
          Every UK company must file a confirmation statement to confirm that
          company details are correct.
        </p>

        <h3 className="font-semibold mt-4 mb-1">
          Annual Accounts Filing
        </h3>
        <p className="mb-4">
          Companies must submit financial statements each year to Companies
          House.
        </p>

        <h3 className="font-semibold mt-4 mb-1">
          Registered Office Address
        </h3>
        <p className="mb-4">
          A valid UK registered office address must be maintained at all times.
        </p>

        <h3 className="font-semibold mt-4 mb-1">
          Director & PSC Updates
        </h3>
        <p className="mb-4">
          Any changes to directors or Persons with Significant Control (PSC)
          must be reported promptly.
        </p>

        <h3 className="font-semibold mt-4 mb-1">
          VAT & PAYE Compliance
        </h3>
        <p className="mb-4">
          If applicable, businesses must register and comply with VAT and PAYE
          requirements.
        </p>

        {/* Importance */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Why Compliance Is Important
        </h2>
        <p className="mb-2">Maintaining compliance helps you:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Avoid fines and penalties</li>
          <li>Prevent company dissolution</li>
          <li>Maintain good standing with authorities</li>
          <li>Build trust with banks, investors, and partners</li>
          <li>Ensure smooth business operations</li>
        </ul>

        {/* How we help */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          How My Company Registration Helps
        </h2>
        <p className="mb-2">We provide compliance support through:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Filing confirmation statements</li>
          <li>Preparing and submitting company accounts</li>
          <li>Managing director and shareholder updates</li>
          <li>Assisting with company changes and filings</li>
          <li>Providing registered office services</li>
          <li>Offering guidance on regulatory obligations</li>
        </ul>

        {/* CTA */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Stay Compliant with Confidence
        </h2>
        <p className="mb-4">
          Compliance can be complex, but with the right support, it becomes
          manageable and stress-free.
        </p>

        <p className="mb-4">
          At My Company Registration, we simplify the process so you can focus
          on growing your business while we handle the administrative and legal
          requirements.
        </p>

        {/* Notes */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Important Note
        </h2>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>
            Compliance requirements may vary depending on company structure and
            activities
          </li>
          <li>
            All filings are subject to approval by Companies House
          </li>
          <li>
            Failure to comply may result in penalties or legal action
          </li>
        </ul>

        {/* Final CTA */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Get Started
        </h2>
        <p>
          Need help staying compliant? Contact My Company Registration today to
          ensure your company meets all UK legal and regulatory requirements.
        </p>
      </div>
    </>
  );
}