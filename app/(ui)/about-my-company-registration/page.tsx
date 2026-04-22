import HeroSection from "@/components/custom/hero-section";


export const metadata = {
    title: "About MY Company Registration",
    description:
      "Learn about MY Company Registration, trusted UK experts in company formation, LLP setup, and legal compliance for businesses of all sizes.",
  };
  
export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}

      <div>
      {/* ===== Hero Section ===== */}
      <HeroSection>
        <header className="space-y-4 my-auto pt-10 text-center">
          <h1 className="text-white max-w-5xl px-5 mx-auto max-md:text-2xl font-semibold">
          About MY Company Registration
          </h1>
          <p className="text-white text-lg">
            Trusted UK experts in company formation, LLP setup, and legal
            compliance for businesses of all sizes.
          </p>
        </header>
      </HeroSection>
      </div>


      {/* Content Section */}
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <p className="mb-4">
          At MY Company Registration, we specialize in helping entrepreneurs,
          startups, and small businesses establish their companies quickly,
          accurately, and in full compliance with UK regulations.
        </p>

        <p className="mb-4">
          Whether you’re registering a Limited Company (Ltd), forming an LLP,
          or setting up a Sole Trader, we provide step-by-step guidance and
          professional support to ensure your company is legally compliant
          from day one.
        </p>

        {/* Who We Are */}
        <h2 className="text-xl font-semibold mt-8 mb-2">Who We Are</h2>
        <p className="mb-4">
          We are a team of experienced professionals with a deep understanding
          of UK company law, registration procedures, and compliance
          requirements. Our mission is to make company registration simple,
          transparent, and stress-free.
        </p>

        {/* Expertise */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Our Core Expertise Includes
        </h2>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Company Formation (Ltd, LLP, and Sole Trader setup)</li>
          <li>Registered Office Services</li>
          <li>Company Secretarial Support</li>
          <li>Filing and compliance with Companies House</li>
          <li>Guidance on statutory obligations and filings</li>
        </ul>

        <p className="mb-4">
          We combine legal knowledge, administrative precision, and
          customer-focused service to deliver an efficient registration
          experience.
        </p>

        {/* Why Choose */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Why Choose MY Company Registration
        </h2>
        <p className="mb-2">
          Choosing the right company formation provider is critical. Here’s
          why businesses trust us:
        </p>

        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>
            <strong>Expertise You Can Rely On</strong> – Years of experience in
            UK company registration
          </li>
          <li>
            <strong>Compliant & Transparent</strong> – All filings follow legal
            requirements, no shortcuts
          </li>
          <li>
            <strong>Fast & Efficient</strong> – Quick company setup with
            minimal delays
          </li>
          <li>
            <strong>Personalized Support</strong> – Tailored guidance based on
            your business type
          </li>
          <li>
            <strong>Clear Communication</strong> – Regular updates and a
            straightforward process
          </li>
        </ul>

        {/* Mission */}
        <h2 className="text-xl font-semibold mt-8 mb-2">Our Mission</h2>
        <p className="mb-4">
          Our mission is to simplify business formation in the UK. We help
          clients focus on building their businesses while we handle the
          complexities of registration, legal compliance, and official
          filings.
        </p>

        <p className="mb-4">
          We believe in trust, transparency, and professionalism, and we
          strive to provide accurate, timely, and ethical services to every
          client.
        </p>

        {/* How We Work */}
        <h2 className="text-xl font-semibold mt-8 mb-2">How We Work</h2>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>
            <strong>Consultation & Assessment</strong> – Understand your
            business goals and requirements
          </li>
          <li>
            <strong>Documentation & Filing</strong> – Prepare and file all
            necessary documents with Companies House
          </li>
          <li>
            <strong>Confirmation & Registration</strong> – Receive official
            incorporation documents and registration number
          </li>
          <li>
            <strong>Ongoing Support</strong> – Guidance on statutory
            compliance and post-registration requirements
          </li>
        </ul>

        <p className="mb-4">
          Our structured approach ensures hassle-free registration and gives
          you peace of mind that your business is fully compliant.
        </p>

        {/* Trust Points */}
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>
            Registered in the UK, fully compliant with Companies House
            regulations
          </li>
          <li>Clear legal and operational disclosures on our website</li>
          <li>Transparent process with no hidden fees</li>
          <li>
            Testimonials and success stories from UK businesses we’ve helped
          </li>
        </ul>

        {/* CTA */}
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Get Started with MY Company Registration
        </h2>
        <p className="mb-4">
          Whether you’re starting your first business or expanding your
          portfolio, MY Company Registration makes company formation
          straightforward, reliable, and secure.
        </p>

        <p>
          Contact us today to start your registration process and take the
          first step toward officially forming your company in the UK.
        </p>
      </div>
    </>
  );
}