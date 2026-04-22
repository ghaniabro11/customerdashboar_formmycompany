import React from "react";

const files = [
  {
    label: "ABM - Appointment of Director",
    url: "https://www.companiesmadesimple.com/project/upload/files/abm-appointment-of-director.rtf",
  },
  {
    label: "ABM - Appointment of Secretary",
    url: "https://www.companiesmadesimple.com/project/upload/files/abm-appointment-of-secretary.rtf",
  },
  {
    label: "ABM - Basic",
    url: "https://www.companiesmadesimple.com/project/upload/files/abm-basic.rtf",
  },
  {
    label: "ABM - Interim Dividend Minutes",
    url: "https://www.companiesmadesimple.com/project/upload/files/abm-interim-dividend-minutes.rtf",
  },
  {
    label: "ABM - Resignation of Secretary",
    url: "https://www.companiesmadesimple.com/project/upload/files/abm-resignation-of-secretary.rtf",
  },
  {
    label: "Automatic Board Meeting Minutes",
    url: "https://www.companiesmadesimple.com/project/upload/files/automatic-board-meeting-minutes.rtf",
  },
  {
    label: "Board Minutes for the Bonus Issue of Shares",
    url: "https://www.companiesmadesimple.com/project/upload/files/board-minutes-for-the-bonus-issue-of-shares.rtf",
  },
  {
    label: "Board Minutes to Change Company Name",
    url: "https://www.companiesmadesimple.com/project/upload/files/board-minutes-to-change-company-name.rtf",
  },
  {
    label: "Board Minutes to Convene Annual General Meeting",
    url: "https://www.companiesmadesimple.com/project/upload/files/board-minutes-to-convene-annual-general-meeting.rtf",
  },
  {
    label: "Board Minutes to Create New Share Class",
    url: "https://www.companiesmadesimple.com/project/upload/files/board-minutes-to-create-new-share-class.rtf",
  },
  {
    label: "Board Minutes to Re-designate Shares",
    url: "https://www.companiesmadesimple.com/project/upload/files/board-minutes-to-re-designate-shares.rtf",
  },
  {
    label: "Dividend Report",
    url: "https://www.companiesmadesimple.com/project/upload/files/dividend-report.rtf",
  },
  {
    label: "Dividend Vouchers",
    url: "https://www.companiesmadesimple.com/project/upload/files/dividend-vouchers.rtf",
  },
  {
    label: "First Board Meeting Minutes",
    url: "https://www.companiesmadesimple.com/project/upload/files/first-board-meeting-minutes.rtf",
  },
  {
    label: "Letter of Application of Allotment",
    url: "https://www.companiesmadesimple.com/project/upload/files/letter-of-application-on-allotment.rtf",
  },
  {
    label: "Minutes of an Annual General Meeting",
    url: "https://www.companiesmadesimple.com/project/upload/files/minutes-of-an-annual-general-meeting.rtf",
  },
  {
    label: "Notice of an Annual General Meeting",
    url: "https://www.companiesmadesimple.com/project/upload/files/notice-of-an-annual-general-meeting.rtf",
  },
  {
    label: "Share Certificate Template",
    url: "https://www.companiesmadesimple.com/project/upload/files/share-certificate-template.doc",
  },
  {
    label: "Short Notice of an Annual General Meeting",
    url: "https://www.companiesmadesimple.com/project/upload/files/short-notice-of-an-annual-general-meeting.rtf",
  },
  {
    label:
      "Written Members Resolution for the Bonus Issue of Shares (and copy to Co Hse)",
    url: "https://www.companiesmadesimple.com/project/upload/files/written-members-resolution-for-the-bonus-issue-of-shares-and-copy-to-co-hse.rtf",
  },
  {
    label:
      "Written Members Resolution to Change Company Name (and copy to Co Hse)",
    url: "https://www.companiesmadesimple.com/project/upload/files/written-members-resolution-to-change-company-name-and-copy-to-co-hse.rtf",
  },
  {
    label:
      "Written Members Resolution to Re-designate Shares (and copy to Co Hse)",
    url: "https://www.companiesmadesimple.com/project/upload/files/written-members-resolution-to-re-designate-shares-and-copy-to-co-hse.rtf",
  },
  {
    label:
      "Written Members Resolutions to Create New Share Class (and copy to Co Hse)",
    url: "https://www.companiesmadesimple.com/project/upload/files/written-members-resolutions-to-create-new-share-class-and-copy-to-co-hse.rtf",
  },
  {
    label: "J30 - Stock Transfer Form",
    url: "https://www.companiesmadesimple.com/project/upload/files/j30-stock-transfer-form.pdf",
  },
  {
    label: "CT41G",
    url: "https://www.companiesmadesimple.com/project/upload/files/ct41g-08-05.pdf",
  },
  {
    label: "CT41G - Dormant Company Insert",
    url: "https://www.companiesmadesimple.com/project/upload/files/ct41g-dormant-company-insert.pdf",
  },
  {
    label: "Limited Liability Partnership Agreement",
    url: "https://www.companiesmadesimple.com/project/upload/files/llp-agreement.doc",
  },
  {
    label: "Certificate of Membership for Companies Limited by Guarantee",
    url: "https://www.companiesmadesimple.com/project/upload/files/certificates-of-membership-template.rtf",
  },
  {
    label: "People with Significant Control Register",
    url: "http://s3-eu-west-1.amazonaws.com/madesimplegroup-static/uploads/20160412170037-psc-register.pdf",
  },
];

const FileLinks: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold ">Statutory Forms</h1>
      <p className="text-lg text-gray-500 mb-6">
        Useful templates and forms for your statutory requirements:
      </p>
      <ul className="space-y-4">
        {files.map((file, index) => (
          <li key={index} className="flex items-center space-x-3">
            <a
              href={file.url}
              className="text-blue-400 hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              {file.label}
            </a>
          </li>
        ))}
        <li>
          Companies House{" "}
          <a
            className="text-blue-500 hover:text-blue-700"
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.companieshouse.gov.uk/forms/formsOnline.shtml"
          >
            Paper Forms
          </a>{" "}
          (Opens in a new window)
        </li>
      </ul>
    </div>
  );
};

export default FileLinks;
