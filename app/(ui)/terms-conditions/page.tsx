import HeroSection from "@/components/custom/hero-section";

export const metadata = {
  title: "Terms & Conditions – MY Company Registration",
  description:
    "Read the Terms and Conditions of My Company Registration for details on services, user responsibilities, payments, and legal compliance.",
};

export default function TermsPage() {
  return (
    <>
      {/* Hero Section */}
      <div>
        <HeroSection>
          <header className="space-y-4 my-auto pt-10 text-center">
            <h1 className="text-white max-w-5xl px-5 mx-auto max-md:text-2xl font-semibold">
              Terms & Conditions
            </h1>
            <p className="text-white text-lg">
              Understand the terms governing the use of our services, payments,
              and legal responsibilities.
            </p>
          </header>
        </HeroSection>
      </div>

      {/* Content Section */}
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <p className="mb-4">
          These Terms and Conditions govern your use of the website and services
          provided by My Company Registration.
        </p>

        <p className="mb-4">
          By accessing our website or using our services, you agree to comply
          with these terms. If you do not agree, you should not use our services.
        </p>

        {/* Services */}
        <h2 className="text-xl font-semibold mt-8 mb-2">Services</h2>
        <p className="mb-2">My Company Registration provides:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>UK company formation services</li>
          <li>Company compliance and filing services</li>
          <li>Registered office and administrative services</li>
          <li>VAT and PAYE registration assistance</li>
          <li>Document-related services</li>
        </ul>
        <p className="mb-4">
          All services are subject to availability and compliance with UK
          regulations, including those of Companies House.
        </p>

        {/* User Responsibilities */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          User Responsibilities
        </h2>
        <p className="mb-2">By using our services, you agree to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Provide accurate and complete information</li>
          <li>Ensure all submitted details are truthful and lawful</li>
          <li>Use our services for legitimate business purposes only</li>
          <li>Comply with all applicable UK laws and regulations</li>
        </ul>
        <p className="mb-4">
          Failure to provide accurate information may result in delays,
          rejection, or cancellation of services.
        </p>

        {/* Service Limitations */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Service Limitations
        </h2>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>We do not guarantee approval of company registration or filings</li>
          <li>All approvals are subject to review by Companies House</li>
          <li>
            Processing times may vary depending on external authorities
          </li>
          <li>
            Certain services may depend on third-party approvals
          </li>
        </ul>

        {/* Payments */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Payments and Fees
        </h2>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>All services must be paid in full before processing begins</li>
          <li>Prices are subject to change without prior notice</li>
          <li>
            Additional charges may apply for optional or urgent services
          </li>
          <li>Payments are non-refundable unless stated otherwise</li>
        </ul>

        {/* Refund */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Refund Policy
        </h2>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Refunds may be considered on a case-by-case basis</li>
          <li>
            No refunds will be issued for services already completed or
            submitted
          </li>
          <li>
            If a service cannot be completed due to our error, a partial or
            full refund may be issued
          </li>
        </ul>

        {/* IP */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Intellectual Property
        </h2>
        <p className="mb-4">
          All content on this website, including text, graphics, logos, and
          materials, is the property of My Company Registration.
        </p>
        <p className="mb-4">
          You may not copy, reproduce, or distribute any content without written
          permission.
        </p>

        {/* Liability */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Limitation of Liability
        </h2>
        <p className="mb-2">My Company Registration is not liable for:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Delays caused by external authorities</li>
          <li>Rejection of applications by Companies House</li>
          <li>Errors caused by incorrect user-provided information</li>
          <li>Indirect, incidental, or consequential damages</li>
        </ul>

        {/* Confidentiality */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Confidentiality
        </h2>
        <p className="mb-4">
          We treat all client information as confidential and handle it with
          strict privacy standards.
        </p>
        <p className="mb-4">
          Information is only shared when required for service delivery or legal
          compliance.
        </p>

        {/* Third Party */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Third-Party Services
        </h2>
        <p className="mb-4">
          Some services may involve third-party providers.
        </p>
        <p className="mb-4">
          We are not responsible for their actions, policies, or service
          performance.
        </p>

        {/* Termination */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Termination of Services
        </h2>
        <p className="mb-2">We reserve the right to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Refuse or cancel services if necessary</li>
          <li>
            Terminate access in case of misuse or violation of terms
          </li>
          <li>
            Suspend services due to non-payment or incorrect information
          </li>
        </ul>

        {/* Changes */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Changes to Terms
        </h2>
        <p className="mb-4">
          We may update these Terms and Conditions at any time.
        </p>
        <p className="mb-4">
          Changes will be posted on this page with an updated effective date.
        </p>

        {/* Law */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Governing Law
        </h2>
        <p className="mb-4">
          These Terms are governed by the laws of the United Kingdom.
        </p>
        <p className="mb-4">
          Any disputes shall be subject to UK jurisdiction.
        </p>

        {/* Contact */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Contact Information
        </h2>
        <p className="mb-2">
          If you have any questions about these Terms and Conditions:
        </p>

        <p className="mb-2">My Company Registration</p>
        <p className="mb-4">📧 info@mycompanyregistration.uk</p>

        {/* Note */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Important Note
        </h2>
        <p>
          These Terms and Conditions are provided for general guidance and
          should be reviewed by a qualified legal professional to ensure full
          compliance with UK law.
        </p>
      </div>
    </>
  );
}