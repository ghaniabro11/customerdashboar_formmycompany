import HeroSection from "@/components/custom/hero-section";

export const metadata = {
  title: "Privacy Policy – MY Company Registration",
  description:
    "Read the Privacy Policy of My Company Registration to understand how we collect, use, and protect your personal data securely.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero Section */}
      <div>
        <HeroSection>
          <header className="space-y-4 my-auto pt-10 text-center">
            <h1 className="text-white max-w-5xl px-5 mx-auto max-md:text-2xl font-semibold">
              Privacy Policy
            </h1>
            <p className="text-white text-lg">
              Learn how we collect, use, and protect your personal data securely.
            </p>
          </header>
        </HeroSection>
      </div>

      {/* Content Section */}
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <p className="mb-4">
          At My Company Registration, we are committed to protecting your privacy
          and ensuring that your personal data is handled securely and
          transparently.
        </p>

        <p className="mb-4">
          This Privacy Policy explains how we collect, use, store, and protect
          your information when you use our website and services related to UK
          company registration.
        </p>

        {/* Information We Collect */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Information We Collect
        </h2>

        <p className="mb-2">
          We may collect and process the following types of information:
        </p>

        <h3 className="font-semibold mt-4 mb-1">Personal Information</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Full name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Company details provided during registration</li>
          <li>Identification details (if required for compliance)</li>
        </ul>

        <h3 className="font-semibold mt-4 mb-1">Business Information</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Company name and structure</li>
          <li>Director and shareholder details</li>
          <li>Registered office address</li>
        </ul>

        <h3 className="font-semibold mt-4 mb-1">Technical Data</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>IP address</li>
          <li>Browser type and device information</li>
          <li>Pages visited and time spent on the website</li>
        </ul>

        <h3 className="font-semibold mt-4 mb-1">Communication Data</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Emails and messages sent to our support team</li>
          <li>Inquiry details and service requests</li>
        </ul>

        {/* Usage */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          How We Use Your Information
        </h2>
        <p className="mb-2">We use your information to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Provide company registration and related services</li>
          <li>Process applications and filings</li>
          <li>Communicate with you regarding your requests</li>
          <li>Improve our website and services</li>
          <li>Comply with legal and regulatory requirements</li>
        </ul>

        {/* Legal Basis */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Legal Basis for Processing
        </h2>
        <p className="mb-2">We process your data based on:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Your consent</li>
          <li>Contractual necessity (to provide services)</li>
          <li>Legal obligations under UK regulations</li>
          <li>Legitimate business interests</li>
        </ul>

        {/* Data Sharing */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Data Sharing and Disclosure
        </h2>
        <p className="mb-2">We do not sell your personal data.</p>
        <p className="mb-2">We may share your information with:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Companies House for official company registration</li>
          <li>Government or regulatory authorities when required</li>
          <li>
            Trusted service providers assisting in operations (under strict
            confidentiality)
          </li>
        </ul>

        {/* Security */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Data Security
        </h2>
        <p className="mb-2">
          We implement appropriate security measures to protect your
          information, including:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Secure data storage systems</li>
          <li>Restricted access to sensitive information</li>
          <li>Encryption and secure communication methods where applicable</li>
        </ul>

        <p className="mb-4">
          However, no online system is completely secure, and we encourage
          users to take precautions when sharing information online.
        </p>

        {/* Retention */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Data Retention
        </h2>
        <p className="mb-4">
          We retain your personal data only as long as necessary to:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Provide our services</li>
          <li>Meet legal and regulatory obligations</li>
          <li>Resolve disputes and enforce agreements</li>
        </ul>

        {/* Rights */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Your Rights
        </h2>
        <p className="mb-2">You may have the right to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Restrict or object to processing</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <p className="mb-4">
          To exercise your rights, please contact us.
        </p>

        {/* Cookies */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Cookies and Tracking Technologies
        </h2>
        <p className="mb-4">
          Our website may use cookies to:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Improve user experience</li>
          <li>Analyze website traffic</li>
          <li>Understand visitor behavior</li>
        </ul>

        <p className="mb-4">
          You can control cookie settings through your browser.
        </p>

        <p className="mb-4">
          Our website may include links to third-party websites. We are not
          responsible for their privacy practices or content.
        </p>

        {/* Children */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Children’s Privacy
        </h2>
        <p className="mb-4">
          Our services are not intended for individuals under the age of 18.
          We do not knowingly collect data from children.
        </p>

        {/* Updates */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Updates to This Privacy Policy
        </h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Any changes
          will be posted on this page with an updated effective date.
        </p>

        {/* Contact */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Contact Us
        </h2>
        <p className="mb-2">
          If you have any questions about this Privacy Policy or your data:
        </p>

        <p className="mb-2">My Company Registration</p>
        <p className="mb-4">📧 info@mycompanyregistration.uk</p>

        <p>
          This Privacy Policy is provided for general guidance and should be
          reviewed by a legal professional to ensure full compliance with
          applicable laws such as GDPR.
        </p>
      </div>
    </>
  );
}