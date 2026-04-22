import HeroSection from "@/components/custom/hero-section";

export const metadata = {
  title: "Contact MY Company Registration",
  description:
    "Contact MY Company Registration for expert UK company formation support, guidance, and fast assistance with business registration services.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <div>
        <HeroSection>
          <header className="space-y-4 my-auto pt-10 text-center">
            <h1 className="text-white max-w-5xl px-5 mx-auto max-md:text-2xl font-semibold">
              Contact MY Company Registration
            </h1>
            <p className="text-white text-lg">
              Get expert support, guidance, and fast assistance for UK company
              formation and compliance.
            </p>
          </header>
        </HeroSection>
      </div>

      {/* Content Section */}
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <p className="mb-4">
          If you have questions about UK company registration, company
          formation, or compliance requirements, our team at MY Company
          Registration is here to help.
        </p>

        <p className="mb-4">
          We provide fast, reliable, and professional support for individuals
          and businesses looking to register a company in the UK.
        </p>

        {/* Contact Information */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Contact Information
        </h2>

        <h3 className="font-semibold mt-4 mb-1">Email Support</h3>
        <p className="mb-2">📧 info@mycompanyregistration.uk</p>

        <p className="mb-2">Send us an email for:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Company registration inquiries</li>
          <li>Service details and guidance</li>
          <li>Pricing and package information</li>
          <li>Compliance and documentation questions</li>
          <li>General support</li>
        </ul>

        {/* Why Contact Us */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Why Contact Us
        </h2>
        <p className="mb-2">
          We assist with a wide range of company formation services,
          including:
        </p>

        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Limited Company (Ltd) registration</li>
          <li>LLP (Limited Liability Partnership) setup</li>
          <li>Sole Trader registration guidance</li>
          <li>Registered office services</li>
          <li>Filing and compliance with Companies House</li>
        </ul>

        {/* What to Include */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          What to Include in Your Email
        </h2>

        <p className="mb-2">
          To help us respond quickly and accurately, please include:
        </p>

        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Your full name</li>
          <li>Type of business you want to register</li>
          <li>Any specific requirements or questions</li>
          <li>Preferred timeline (if urgent)</li>
        </ul>

        {/* Response Time */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Our Response Time
        </h2>

        <p className="mb-2">
          We aim to respond to all inquiries within:
        </p>

        <p className="mb-4">⏱️ 24 hours (Monday–Saturday)</p>

        <p className="mb-4">
          For urgent matters, please clearly mention it in your email
          subject line.
        </p>

        {/* Confidentiality */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Confidential & Professional Support
        </h2>

        <p className="mb-4">
          All communication with MY Company Registration is handled with:
        </p>

        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Strict confidentiality</li>
          <li>Professional discretion</li>
          <li>Compliance with UK business regulations</li>
        </ul>

        <p className="mb-4">
          Your information is safe with us.
        </p>

        {/* How We Help */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          How We Help You
        </h2>

        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Review your inquiry</li>
          <li>Provide tailored guidance</li>
          <li>Explain the registration process</li>
          <li>Help you proceed with company formation</li>
          <li>Assist with required filings and compliance</li>
        </ul>

        {/* CTA */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Start Your Company Registration Today
        </h2>

        <p className="mb-4">
          If you’re ready to register your company or need expert guidance,
          contact us today.
        </p>

        <p className="mb-2">📧 Email: info@mycompanyregistration.uk</p>

        <p>
          Let MY Company Registration help you establish your business in
          the UK with confidence and compliance.
        </p>
      </div>
    </>
  );
}