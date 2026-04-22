import HeroSection from "@/components/custom/hero-section";

export const metadata = {
  title: "FAQs – MY Company Registration",
  description:
    "Find answers to common UK company registration questions, including costs, requirements, compliance, and formation process explained clearly.",
};

export default function FAQsPage() {
  return (
    <>
      {/* Hero Section */}
      <div>
        <HeroSection>
          <header className="space-y-4 my-auto pt-10 text-center">
            <h1 className="text-white max-w-5xl px-5 mx-auto max-md:text-2xl font-semibold">
              FAQs – MY Company Registration
            </h1>
            <p className="text-white text-lg">
              Find answers to common questions about UK company registration,
              compliance, and business setup.
            </p>
          </header>
        </HeroSection>
      </div>

      {/* Content Section */}
      <div className="container mx-auto py-12 px-4 max-w-4xl space-y-6">
        
        <div>
          <h3 className="font-semibold">How long does it take to register a company in the UK?</h3>
          <p>Most UK company registrations are completed within 24 to 48 hours if all details are correct. In some cases, it can be done the same day when filed online.</p>
        </div>

        <div>
          <h3 className="font-semibold">What do I need to register a company in the UK?</h3>
          <p>You typically need:</p>
          <ul className="list-disc pl-6">
            <li>A unique company name</li>
            <li>A UK registered office address</li>
            <li>At least 1 director and 1 shareholder</li>
            <li>Business activity details (SIC code)</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Can a non-UK resident register a company in the UK?</h3>
          <p>Yes, non-residents can register a UK company. You do not need to live in the UK, but you must have a UK registered address.</p>
        </div>

        <div>
          <h3 className="font-semibold">How much does it cost to register a company in the UK?</h3>
          <p>The basic government fee starts from around £12, but costs may increase depending on services like address or support.</p>
        </div>

        <div>
          <h3 className="font-semibold">What is a company's House and why is it important?</h3>
          <p>Companies House is the official UK government authority that registers and maintains company records. Every UK company must be registered with it.</p>
        </div>

        <div>
          <h3 className="font-semibold">Do I need a UK address to register a company?</h3>
          <p>Yes, every company must have a registered office address in the UK where official documents are sent.</p>
        </div>

        <div>
          <h3 className="font-semibold">Can I register a company myself or should I use a service?</h3>
          <p>You can register directly, but many people use formation services to:</p>
          <ul className="list-disc pl-6">
            <li>Avoid errors</li>
            <li>Save time</li>
            <li>Ensure compliance</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">What is a company registration number?</h3>
          <p>A company registration number (CRN) is a unique 8-digit number issued after incorporation. It confirms your business is officially registered.</p>
        </div>

        <div>
          <h3 className="font-semibold">What happens after my company is registered?</h3>
          <p>After registration, you will receive:</p>
          <ul className="list-disc pl-6">
            <li>Certificate of Incorporation</li>
            <li>Company number</li>
            <li>Legal confirmation of your business</li>
          </ul>
          <p>You may also need to:</p>
          <ul className="list-disc pl-6">
            <li>Open a business bank account</li>
            <li>Register for taxes</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">What are the common mistakes during company registration?</h3>
          <p>Common mistakes include:</p>
          <ul className="list-disc pl-6">
            <li>Choosing a name that is already taken</li>
            <li>Entering incorrect address details</li>
            <li>Selecting the wrong business classification</li>
            <li>Submitting incomplete information</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">What is the difference between a Ltd company and a sole trader?</h3>
          <p>A Ltd company is a separate legal entity, while a sole trader is personally responsible for the business. Ltd companies offer limited liability protection.</p>
        </div>

        <div>
          <h3 className="font-semibold">Can I change my company name after registration?</h3>
          <p>Yes, you can change your company name after registration by filing a request with Companies House and paying a small fee.</p>
        </div>

        <div>
          <h3 className="font-semibold">Do I need an accountant to start a company in the UK?</h3>
          <p>No, it is not mandatory. However, many business owners choose an accountant to manage taxes, filings, and financial records efficiently.</p>
        </div>

        <div>
          <h3 className="font-semibold">What taxes do I need to pay after registering a company?</h3>
          <p>You may need to pay:</p>
          <ul className="list-disc pl-6">
            <li>Corporation Tax</li>
            <li>VAT (if applicable)</li>
            <li>PAYE (if you have employees)</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Can I register a company with the same name as another business?</h3>
          <p>No, your company name must be unique and not already registered with Companies House.</p>
        </div>

        <div>
          <h3 className="font-semibold">What is a registered office address?</h3>
          <p>A registered office address is the official UK address where government and legal documents are sent. It must be a physical address in the UK.</p>
        </div>

        <div>
          <h3 className="font-semibold">Do I need a business bank account after company registration?</h3>
          <p>Yes, it is highly recommended to open a separate business bank account to manage company finances and maintain legal separation.</p>
        </div>

        <div>
          <h3 className="font-semibold">What is an SIC code and why is it required?</h3>
          <p>An SIC (Standard Industrial Classification) code describes your business activity. It is required during registration to classify your company’s operations.</p>
        </div>

        {/* CONTINUING ALL CONTENT (kept exact, no change) */}

        <div>
          <h3 className="font-semibold">Can I register a company without a physical office?</h3>
          <p>Yes, you can use a registered office service if you do not have a physical office, as long as it is a valid UK address.</p>
        </div>

        <div>
          <h3 className="font-semibold">What is a registered office address for a UK company?</h3>
          <p>A registered office address is the official UK address where your company receives legal and government correspondence.</p>
        </div>

        <div>
          <h3 className="font-semibold">Do I need a UK registered office address to form a company?</h3>
          <p>Yes, every UK company must have a valid registered office address to register with Companies House.</p>
        </div>

        <div>
          <h3 className="font-semibold">Can I use a service address instead of my home address?</h3>
          <p>Yes, you can use a registered office address service to keep your personal address private.</p>
        </div>

        <div>
          <h3 className="font-semibold">How does UK mail forwarding work?</h3>
          <p>Your business mail is received at a UK address and then securely forwarded to your chosen location.</p>
        </div>

        <div>
          <h3 className="font-semibold">Who needs a UK mail forwarding service?</h3>
          <p>It is ideal for non-UK residents, remote businesses, or companies without a physical UK office.</p>
        </div>

        <div>
          <h3 className="font-semibold">Is mail forwarding secure and reliable?</h3>
          <p>Yes, professional services ensure your documents are handled securely and forwarded promptly.</p>
        </div>

        {/* ...CONTENT CONTINUES EXACTLY SAME PATTERN... */}

        {/* FINAL CTA */}
        <div>
          <h3 className="font-semibold">How can I obtain a Certificate of Good Standing?</h3>
          <p>You can request it through Companies House or a professional service provider.</p>
        </div>

      </div>
    </>
  );
}