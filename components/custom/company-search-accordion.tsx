// app/components/NameSearchFaq.tsx
import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";


type Link = { text: string; url: string };
type Section = {
  heading: string;
  content?: string[];
  bullets?: string[];
  note?: string;
  afterword?: string;
  links?: Link[];
};

type Payload = {
  source: string;
  start_heading: string;
  end_block: string;
  sections: Section[];
};

const data = {
    source: "https://www.companiesmadesimple.com/search-for-company-name.html",
    start_heading: "Getting started with the company name search",
    end_block:
      "Unfortunately not. Because of the complex rules and regulations associated with naming a UK limited company, there may be instances where Companies House block a name from being registered, despite the company name check stating that it was available.\n\nReady to check company name availability? Search for available company names now",
    sections: [
      {
        heading: "Getting started with the company name search",
        content: [
          "Companies House - the UK’s official registrar of companies - have strict rules and regulations (see below) in place regarding company names.",
          "Use our company name check to see if your chosen limited company name is available. If you search for a company name and the name is available, great - you can then proceed to register a business name. If not, take a look at some of the below tips and then try to search for a company name again.",
        ],
      },
      {
        heading: "‘Same as’ regulations",
        content: [
          "Companies House will not allow a company to be formed if its name is too similar to another on the register. For example, 1 & 2 Limited would be considered the same as One and Two Limited. In most cases the business name checker will notify you if your company name is unavailable because of ‘same as’ regulations, however, in more complicated instances a name may appear to be available when it is not.",
          "You will be notified of this once the application has been submitted to Companies House - you will then be able to select an alternative name.",
        ],
      },
      {
        heading: "Exceptions to ‘same as’ regulations",
        content: ["The regulations can be disregarded if:"],
        bullets: [
          "The new company will be part of the same group as the existing company, or",
          "The new company has the permission of the existing company to use the name",
        ],
        note: "In both cases, a letter from the existing company stating either of the above will need to be provided alongside the company formation application.",
      },
      {
        heading: "Sensitive words and expressions",
        content: [
          "When you complete a company names check your chosen company name may be flagged for including sensitive words or expressions.",
          "There may be instances where the companies name check doesn’t initially catch this - you will be notified once the name has been submitted to Companies House.",
          "Sensitive words and expressions are in place to ensure that your company name does not mislead (or harm) the public. For example, you can’t:",
        ],
        bullets: [
          "Allude to pre-eminence in your field by including a word such as ‘British’",
          "Give the impression of being associated with the government by including a word such as ‘Parliamentary’",
          "Use a word that implies that you work in a regulated activity such as ‘Dental’",
          "Include offensive language",
        ],
        afterword:
          "If your company is preeminent in a field, is associated with the government, or partakes in regulated activity - you can seek approval from the necessary bodies.",
        links: [
          {
            text: "Full list of sensitive words and expressions",
            url: "https://www.legislation.gov.uk",
          },
        ],
      },
      {
        heading: "Tips to naming your company",
        content: [
          "As well as looking at the things you can and can’t do when naming your new company, it’s important to look at some of the things you should and shouldn’t do.",
          "Limited to Location - Putting a location in your company name is fine if your business will conduct the majority of its activity in one place, not so fine if you’ve global aspirations.",
          "Is it Memorable? After you’ve told someone your company name, they should be able to find it on Google. This means they need to: a) remember it b) be able to spell it. Avoid overly long names and non-standard spelling.",
          "No to Initials - We recommend steering clear of using initials in your company name as it will just prompt the question “what does that stand for?”.",
          "Branding - Consider the marketing opportunities of a great name. Does it look good in a logo? Does it conjure relevant imagery? Could it inspire a worthy slogan?",
          "Be Unique - Don’t let inspiration from others seep into your name. Your name should highlight what’s different about your business; your USP.",
          "Got the perfect name for your business? Check the company name availability now.",
        ],
      },
      {
        heading: "Does my company have to include Limited/Ltd?",
        content: [
          "In the majority of cases, all private limited companies and companies limited by shares must end with Limited or Ltd.",
          "If a company’s registered office is based in Wales it can instead use Cyfyngedig or Cyf.",
        ],
      },
      {
        heading: "What is the difference between Limited and Ltd?",
        content: [
          "There is no difference between Limited and Ltd; it is simply an aesthetic decision.",
          "We will automatically add Ltd to the end of your company name when using the company name checker. If you proceed to register, Ltd will be included on official documentation such as the certificate of incorporation. If you prefer “Limited,” append it during the search.",
          "Limited and Ltd are interchangeable; while one version appears on official documentation, you can use whichever version you prefer post-formation.",
        ],
      },
      {
        heading: "How does the business name check work?",
        content: [
          "When you check company name availability the search engine cross references the company name with the Companies House register (active and dissolved). You then get an instant response as to availability.",
        ],
      },
      {
        heading:
          "Can the ltd company name check guarantee if a company name is available?",
        content: [
          "Unfortunately not. Because of the complex rules and regulations associated with naming a UK limited company, there may be instances where Companies House block a name from being registered, despite the company name check stating that it was available.",
          "Ready to check company name availability? Search for available company names now",
        ],
      },
    ],
  };
export function NameSearchFaq() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {data.sections.map((sec, idx) => (
          <AccordionItem key={idx} value={`item-${idx}`} className="border-b">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">{sec.heading}</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              {sec.content?.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed">
                  {p}
                </p>
              ))}

              {sec.bullets && sec.bullets.length > 0 && (
                <ul className="ml-5 list-disc space-y-1">
                  {sec.bullets.map((b, i) => (
                    <li key={i} className="text-sm">
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {sec.note && (
                <p className="rounded-md bg-muted p-3 text-sm">
                  <span className="font-medium">Note: </span>
                  {sec.note}
                </p>
              )}

              {sec.afterword && <p className="text-sm">{sec.afterword}</p>}

              {sec.links && sec.links.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-1">
                  {sec.links.map((l, i) => (
                    <a
                      key={i}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline underline-offset-4 hover:opacity-80"
                    >
                      {l.text}
                    </a>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="text-xs text-muted-foreground">
        Source:{" "}
        <a
          href={data.source}
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          {data.source}
        </a>
      </div>
    </div>
  );
}
