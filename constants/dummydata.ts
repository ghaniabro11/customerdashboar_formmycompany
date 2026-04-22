import { Package } from "./types";
export const plans = [
  {
    plan_name: "Basic",
    price: "$9",
    features: [
      { isAdded: true, feature: "Access to basic dashboard" },
      { isAdded: true, feature: "Email support" },
      { isAdded: false, feature: "Advanced analytics" },
      { isAdded: false, feature: "Custom branding" },
    ],
  },
  {
    plan_name: "Privacy",
    price: "$19",
    features: [
      { isAdded: true, feature: "All Basic features" },
      { isAdded: true, feature: "Privacy-focused tools" },
      { isAdded: true, feature: "Secure file sharing" },
      { isAdded: false, feature: "Team collaboration" },
    ],
  },
  {
    plan_name: "Premium",
    price: "$39",
    features: [
      { isAdded: true, feature: "All Privacy features" },
      { isAdded: true, feature: "Advanced analytics" },
      { isAdded: true, feature: "Team collaboration" },
      { isAdded: true, feature: "Priority support" },
    ],
  },
  {
    plan_name: "Ultimate",
    price: "$79",
    mostPopular: true,
    features: [
      { isAdded: true, feature: "All Premium features" },
      { isAdded: true, feature: "Dedicated account manager" },
      { isAdded: true, feature: "Custom integrations" },
      { isAdded: true, feature: "Unlimited team members" },
    ],
  },
] as Package[];

export const packagesData = {
  packages: [
    {
      plan_name: "Basic",
      price: 56.99,
      period: "per year",
      mostPopular: true,
      features: [
        { isAdded: true, feature: "UK Private Limited Company" },
        { isAdded: true, feature: "Free business bank account" },
        { isAdded: true, feature: "Super-fast online service" },
        {
          isAdded: true,
          feature: "Digital copy of your certificate of incorporation",
        },
        { isAdded: true, feature: "Digital copy of share certificates" },
        {
          isAdded: true,
          feature: "Digital copy of memorandum & articles of association",
        },
        {
          isAdded: true,
          feature: "Digital copy of company register with first entries",
        },
        { isAdded: true, feature: "Digital copy of minutes of meeting" },
        { isAdded: true, feature: "Web authentication code" },
        {
          isAdded: true,
          feature: "Free business startup and marketing guides",
        },
        { isAdded: true, feature: "Free consultation with an accountant" },
        { isAdded: true, feature: "Free online company manager account" },
        {
          isAdded: true,
          feature: "Free customer support for the life of your company",
        },
        { isAdded: false, feature: "Free .co.uk domain name" },
        { isAdded: false, feature: "Registered office (London, HA4)" },
        { isAdded: false, feature: "Director service address" },
        { isAdded: false, feature: "Printed copies of official documents" },
        { isAdded: false, feature: "Corporate hijack protection" },
        { isAdded: false, feature: "VAT registration for your new company" },
        { isAdded: false, feature: "PAYE registration service" },
      ],
    },
    {
      plan_name: "Privacy",
      price: 86.99,
      period: "per year",
      features: [
        { isAdded: true, feature: "UK Private Limited Company" },
        { isAdded: true, feature: "Free business bank account" },
        { isAdded: true, feature: "Super-fast online service" },
        {
          isAdded: true,
          feature: "Digital copy of your certificate of incorporation",
        },
        { isAdded: true, feature: "Digital copy of share certificates" },
        {
          isAdded: true,
          feature: "Digital copy of memorandum & articles of association",
        },
        {
          isAdded: true,
          feature: "Digital copy of company register with first entries",
        },
        { isAdded: true, feature: "Digital copy of minutes of meeting" },
        { isAdded: true, feature: "Web authentication code" },
        {
          isAdded: true,
          feature: "Free business startup and marketing guides",
        },
        { isAdded: true, feature: "Free consultation with an accountant" },
        { isAdded: true, feature: "Free online company manager account" },
        {
          isAdded: true,
          feature: "Free customer support for the life of your company",
        },
        { isAdded: false, feature: "Free .co.uk domain name" },
        { isAdded: false, feature: "Registered office (London, HA4)" },
        { isAdded: false, feature: "Director service address" },
        { isAdded: false, feature: "Printed copies of official documents" },
        { isAdded: false, feature: "Corporate hijack protection" },
        { isAdded: false, feature: "VAT registration for your new company" },
        { isAdded: false, feature: "PAYE registration service" },
      ],
    },
    {
      plan_name: "Premium",
      price: 119.99,
      period: "per year",
      features: [
        { isAdded: true, feature: "UK Private Limited Company" },
        { isAdded: true, feature: "Free business bank account" },
        { isAdded: true, feature: "Super-fast online service" },
        {
          isAdded: true,
          feature: "Digital copy of your certificate of incorporation",
        },
        { isAdded: true, feature: "Digital copy of share certificates" },
        {
          isAdded: true,
          feature: "Digital copy of memorandum & articles of association",
        },
        {
          isAdded: true,
          feature: "Digital copy of company register with first entries",
        },
        { isAdded: true, feature: "Digital copy of minutes of meeting" },
        { isAdded: true, feature: "Web authentication code" },
        {
          isAdded: true,
          feature: "Free business startup and marketing guides",
        },
        { isAdded: true, feature: "Free consultation with an accountant" },
        { isAdded: true, feature: "Free online company manager account" },
        {
          isAdded: true,
          feature: "Free customer support for the life of your company",
        },
        { isAdded: false, feature: "Free .co.uk domain name" },
        { isAdded: false, feature: "Registered office (London, HA4)" },
        { isAdded: false, feature: "Director service address" },
        { isAdded: false, feature: "Printed copies of official documents" },
        { isAdded: false, feature: "Corporate hijack protection" },
        { isAdded: false, feature: "VAT registration for your new company" },
        { isAdded: true, feature: "PAYE registration service" },
      ],
    },
    {
      plan_name: "Ultimate",
      price: 139.99,
      period: "per year",
      features: [
        { isAdded: true, feature: "UK Private Limited Company" },
        { isAdded: true, feature: "Free business bank account" },
        { isAdded: true, feature: "Super-fast online service" },
        {
          isAdded: true,
          feature: "Digital copy of your certificate of incorporation",
        },
        { isAdded: true, feature: "Digital copy of share certificates" },
        {
          isAdded: true,
          feature: "Digital copy of memorandum & articles of association",
        },
        {
          isAdded: true,
          feature: "Digital copy of company register with first entries",
        },
        { isAdded: true, feature: "Digital copy of minutes of meeting" },
        { isAdded: true, feature: "Web authentication code" },
        {
          isAdded: true,
          feature: "Free business startup and marketing guides",
        },
        { isAdded: true, feature: "Free consultation with an accountant" },
        { isAdded: true, feature: "Free online company manager account" },
        {
          isAdded: true,
          feature: "Free customer support for the life of your company",
        },
        { isAdded: false, feature: "Free .co.uk domain name" },
        { isAdded: false, feature: "Registered office (London, HA4)" },
        { isAdded: false, feature: "Director service address" },
        { isAdded: false, feature: "Printed copies of official documents" },
        { isAdded: false, feature: "Corporate hijack protection" },
        { isAdded: false, feature: "VAT registration for your new company" },
        { isAdded: false, feature: "PAYE registration service" },
      ],
    },
  ],
};





export const coutries = [
  {
    id: "TV",
    name: "Tuvalu",
  },
  {
    id: "BV",
    name: "Bouvet Island",
  },
  {
    id: "GI",
    name: "Gibraltar",
  },
  {
    id: "GO",
    name: "Glorioso Islands",
  },
  {
    id: "JU",
    name: "Juan De Nova Island",
  },
  {
    id: "UM-DQ",
    name: "Jarvis Island",
  },
  {
    id: "UM-FQ",
    name: "Baker Island",
  },
  {
    id: "UM-HQ",
    name: "Howland Island",
  },
  {
    id: "UM-JQ",
    name: "Johnston Atoll",
  },
  {
    id: "UM-MQ",
    name: "Midway Islands",
  },
  {
    id: "UM-WQ",
    name: "Wake Island",
  },
  {
    id: "BQ",
    name: "Bonair, Saint Eustachius and Saba",
  },
  {
    id: "NL",
    name: "Netherlands",
  },
  {
    id: "ZW",
    name: "Zimbabwe",
  },
  {
    id: "ZM",
    name: "Zambia",
  },
  {
    id: "ZA",
    name: "South Africa",
  },
  {
    id: "YE",
    name: "Yemen",
  },
  {
    id: "WS",
    name: "Samoa",
  },
  {
    id: "WF",
    name: "Wallis and Futuna",
  },
  {
    id: "PS",
    name: "Palestinian Territories",
  },
  {
    id: "VU",
    name: "Vanuatu",
  },
  {
    id: "VN",
    name: "Vietnam",
  },
  {
    id: "VI",
    name: "US Virgin Islands",
  },
  {
    id: "VG",
    name: "British Virgin Islands",
  },
  {
    id: "VE",
    name: "Venezuela",
  },
  {
    id: "VC",
    name: "Saint Vincent and the Grenadines",
  },
  {
    id: "VA",
    name: "Vatican City",
  },
  {
    id: "UZ",
    name: "Uzbekistan",
  },
  {
    id: "US",
    name: "United States",
  },
  {
    id: "UY",
    name: "Uruguay",
  },
  {
    id: "UA",
    name: "Ukraine",
  },
  {
    id: "UG",
    name: "Uganda",
  },
  {
    id: "TZ",
    name: "Tanzania",
  },
  {
    id: "TW",
    name: "Taiwan",
  },
  {
    id: "TR",
    name: "Türkiye",
  },
  {
    id: "TN",
    name: "Tunisia",
  },
  {
    id: "TT",
    name: "Trinidad and Tobago",
  },
  {
    id: "TO",
    name: "Tonga",
  },
  {
    id: "TL",
    name: "Timor-Leste",
  },
  {
    id: "TM",
    name: "Turkmenistan",
  },
  {
    id: "TK",
    name: "Tokelau",
  },
  {
    id: "TJ",
    name: "Tajikistan",
  },
  {
    id: "TH",
    name: "Thailand",
  },
  {
    id: "TG",
    name: "Togo",
  },
  {
    id: "TD",
    name: "Chad",
  },
  {
    id: "TC",
    name: "Turks and Caicos Islands",
  },
  {
    id: "SY",
    name: "Syria",
  },
  {
    id: "SC",
    name: "Seychelles",
  },
  {
    id: "SX",
    name: "Sint Maarten",
  },
  {
    id: "SZ",
    name: "Eswatini",
  },
  {
    id: "SE",
    name: "Sweden",
  },
  {
    id: "SI",
    name: "Slovenia",
  },
  {
    id: "SK",
    name: "Slovakia",
  },
  {
    id: "SR",
    name: "Suriname",
  },
  {
    id: "ST",
    name: "Sao Tome and Principe",
  },
  {
    id: "RS",
    name: "Serbia",
  },
  {
    id: "PM",
    name: "Saint Pierre and Miquelon",
  },
  {
    id: "SO",
    name: "Somalia",
  },
  {
    id: "SM",
    name: "San Marino",
  },
  {
    id: "SV",
    name: "El Salvador",
  },
  {
    id: "SL",
    name: "Sierra Leone",
  },
  {
    id: "SB",
    name: "Solomon Islands",
  },
  {
    id: "SH",
    name: "Saint Helena",
  },
  {
    id: "GS",
    name: "South Georgia and South Sandwich Islands",
  },
  {
    id: "SG",
    name: "Singapore",
  },
  {
    id: "SN",
    name: "Senegal",
  },
  {
    id: "SS",
    name: "South Sudan",
  },
  {
    id: "SD",
    name: "Sudan",
  },
  {
    id: "SA",
    name: "Saudi Arabia",
  },
  {
    id: "EH",
    name: "Western Sahara",
  },
  {
    id: "RW",
    name: "Rwanda",
  },
  {
    id: "RU",
    name: "Russia",
  },
  {
    id: "RO",
    name: "Romania",
  },
  {
    id: "RE",
    name: "Reunion",
  },
  {
    id: "QA",
    name: "Qatar",
  },
  {
    id: "PF",
    name: "French Polynesia",
  },
  {
    id: "PY",
    name: "Paraguay",
  },
  {
    id: "PT",
    name: "Portugal",
  },
  {
    id: "KP",
    name: "North Korea",
  },
  {
    id: "PR",
    name: "Puerto Rico",
  },
  {
    id: "PL",
    name: "Poland",
  },
  {
    id: "PG",
    name: "Papua New Guinea",
  },
  {
    id: "PW",
    name: "Palau",
  },
  {
    id: "PH",
    name: "Philippines",
  },
  {
    id: "PE",
    name: "Peru",
  },
  {
    id: "PN",
    name: "Pitcairn Islands",
  },
  {
    id: "PA",
    name: "Panama",
  },
  {
    id: "PK",
    name: "Pakistan",
  },
  {
    id: "OM",
    name: "Oman",
  },
  {
    id: "NZ",
    name: "New Zealand",
  },
  {
    id: "SJ",
    name: "Svalbard and Jan Mayen",
  },
  {
    id: "NR",
    name: "Nauru",
  },
  {
    id: "NP",
    name: "Nepal",
  },
  {
    id: "NO",
    name: "Norway",
  },
  {
    id: "NU",
    name: "Niue",
  },
  {
    id: "NI",
    name: "Nicaragua",
  },
  {
    id: "NG",
    name: "Nigeria",
  },
  {
    id: "NF",
    name: "Norfolk Island",
  },
  {
    id: "NE",
    name: "Niger",
  },
  {
    id: "NC",
    name: "New Caledonia",
  },
  {
    id: "NA",
    name: "Namibia",
  },
  {
    id: "YT",
    name: "Mayotte",
  },
  {
    id: "MY",
    name: "Malaysia",
  },
  {
    id: "MW",
    name: "Malawi",
  },
  {
    id: "MU",
    name: "Mauritius",
  },
  {
    id: "MQ",
    name: "Martinique",
  },
  {
    id: "MS",
    name: "Montserrat",
  },
  {
    id: "MR",
    name: "Mauritania",
  },
  {
    id: "MZ",
    name: "Mozambique",
  },
  {
    id: "MP",
    name: "Northern Mariana Islands",
  },
  {
    id: "MN",
    name: "Mongolia",
  },
  {
    id: "ME",
    name: "Montenegro",
  },
  {
    id: "MM",
    name: "Myanmar",
  },
  {
    id: "MT",
    name: "Malta",
  },
  {
    id: "ML",
    name: "Mali",
  },
  {
    id: "MK",
    name: "North Macedonia",
  },
  {
    id: "MH",
    name: "Marshall Islands",
  },
  {
    id: "MX",
    name: "Mexico",
  },
  {
    id: "MV",
    name: "Maldives",
  },
  {
    id: "MG",
    name: "Madagascar",
  },
  {
    id: "MD",
    name: "Moldova",
  },
  {
    id: "MC",
    name: "Monaco",
  },
  {
    id: "MA",
    name: "Morocco",
  },
  {
    id: "MF",
    name: "Saint Martin",
  },
  {
    id: "MO",
    name: "Macau",
  },
  {
    id: "LV",
    name: "Latvia",
  },
  {
    id: "LU",
    name: "Luxembourg",
  },
  {
    id: "LT",
    name: "Lithuania",
  },
  {
    id: "LS",
    name: "Lesotho",
  },
  {
    id: "LK",
    name: "Sri Lanka",
  },
  {
    id: "LI",
    name: "Liechtenstein",
  },
  {
    id: "LC",
    name: "Saint Lucia",
  },
  {
    id: "LY",
    name: "Libya",
  },
  {
    id: "LR",
    name: "Liberia",
  },
  {
    id: "LB",
    name: "Lebanon",
  },
  {
    id: "LA",
    name: "Lao People's Democratic Republic",
  },
  {
    id: "KW",
    name: "Kuwait",
  },
  {
    id: "XK",
    name: "Kosovo",
  },
  {
    id: "KR",
    name: "South Korea",
  },
  {
    id: "KN",
    name: "Saint Kitts and Nevis",
  },
  {
    id: "KI",
    name: "Kiribati",
  },
  {
    id: "KH",
    name: "Cambodia",
  },
  {
    id: "KG",
    name: "Kyrgyzstan",
  },
  {
    id: "KE",
    name: "Kenya",
  },
  {
    id: "KZ",
    name: "Kazakhstan",
  },
  {
    id: "JP",
    name: "Japan",
  },
  {
    id: "JO",
    name: "Jordan",
  },
  {
    id: "JE",
    name: "Jersey",
  },
  {
    id: "JM",
    name: "Jamaica",
  },
  {
    id: "IT",
    name: "Italy",
  },
  {
    id: "IL",
    name: "Israel",
  },
  {
    id: "IS",
    name: "Iceland",
  },
  {
    id: "IQ",
    name: "Iraq",
  },
  {
    id: "IR",
    name: "Iran",
  },
  {
    id: "IE",
    name: "Ireland",
  },
  {
    id: "IO",
    name: "British Indian Ocean Territory",
  },
  {
    id: "IN",
    name: "India",
  },
  {
    id: "IM",
    name: "Isle of Man",
  },
  {
    id: "ID",
    name: "Indonesia",
  },
  {
    id: "HU",
    name: "Hungary",
  },
  {
    id: "HT",
    name: "Haiti",
  },
  {
    id: "HR",
    name: "Croatia",
  },
  {
    id: "HN",
    name: "Honduras",
  },
  {
    id: "HM",
    name: "Heard Island and McDonald Islands",
  },
  {
    id: "HK",
    name: "Hong Kong",
  },
  {
    id: "GY",
    name: "Guyana",
  },
  {
    id: "GU",
    name: "Guam",
  },
  {
    id: "GF",
    name: "French Guiana",
  },
  {
    id: "GT",
    name: "Guatemala",
  },
  {
    id: "GL",
    name: "Greenland",
  },
  {
    id: "GD",
    name: "Grenada",
  },
  {
    id: "GR",
    name: "Greece",
  },
  {
    id: "GQ",
    name: "Equatorial Guinea",
  },
  {
    id: "GW",
    name: "Guinea-Bissau",
  },
  {
    id: "GM",
    name: "Gambia",
  },
  {
    id: "GP",
    name: "Guadeloupe",
  },
  {
    id: "GN",
    name: "Guinea",
  },
  {
    id: "GH",
    name: "Ghana",
  },
  {
    id: "GG",
    name: "Guernsey",
  },
  {
    id: "GE",
    name: "Georgia",
  },
  {
    id: "GA",
    name: "Gabon",
  },
  {
    id: "FR",
    name: "France",
  },
  {
    id: "FM",
    name: "Federated States of Micronesia",
  },
  {
    id: "FO",
    name: "Faroe Islands",
  },
  {
    id: "FK",
    name: "Falkland Islands",
  },
  {
    id: "FJ",
    name: "Fiji",
  },
  {
    id: "FI",
    name: "Finland",
  },
  {
    id: "ET",
    name: "Ethiopia",
  },
  {
    id: "EE",
    name: "Estonia",
  },
  {
    id: "ES",
    name: "Spain",
  },
  {
    id: "ER",
    name: "Eritrea",
  },
  {
    id: "GB",
    name: "United Kingdom",
  },
  {
    id: "EG",
    name: "Egypt",
  },
  {
    id: "EC",
    name: "Ecuador",
  },
  {
    id: "DZ",
    name: "Algeria",
  },
  {
    id: "DO",
    name: "Dominican Republic",
  },
  {
    id: "DK",
    name: "Denmark",
  },
  {
    id: "DM",
    name: "Dominica",
  },
  {
    id: "DJ",
    name: "Djibouti",
  },
  {
    id: "DE",
    name: "Germany",
  },
  {
    id: "CZ",
    name: "Czechia",
  },
  {
    id: "CY",
    name: "Cyprus",
  },
  {
    id: "KY",
    name: "Cayman Islands",
  },
  {
    id: "CX",
    name: "Christmas Island",
  },
  {
    id: "CW",
    name: "Curaçao",
  },
  {
    id: "CU",
    name: "Cuba",
  },
  {
    id: "CR",
    name: "Costa Rica",
  },
  {
    id: "CV",
    name: "Cape Verde",
  },
  {
    id: "KM",
    name: "Comoros",
  },
  {
    id: "CO",
    name: "Colombia",
  },
  {
    id: "CK",
    name: "Cook Islands",
  },
  {
    id: "CG",
    name: "Republic of Congo",
  },
  {
    id: "CD",
    name: "Democratic Republic of Congo",
  },
  {
    id: "CM",
    name: "Cameroon",
  },
  {
    id: "CI",
    name: "Côte d'Ivoire",
  },
  {
    id: "CN",
    name: "China",
  },
  {
    id: "CL",
    name: "Chile",
  },
  {
    id: "CH",
    name: "Switzerland",
  },
  {
    id: "CC",
    name: "Cocos (Keeling) Islands",
  },
  {
    id: "CA",
    name: "Canada",
  },
  {
    id: "CF",
    name: "Central African Republic",
  },
  {
    id: "BE",
    name: "Belgium",
  },
  {
    id: "BW",
    name: "Botswana",
  },
  {
    id: "BT",
    name: "Bhutan",
  },
  {
    id: "BN",
    name: "Brunei",
  },
  {
    id: "BB",
    name: "Barbados",
  },
  {
    id: "BR",
    name: "Brazil",
  },
  {
    id: "BO",
    name: "Bolivia",
  },
  {
    id: "BM",
    name: "Bermuda",
  },
  {
    id: "BZ",
    name: "Belize",
  },
  {
    id: "BY",
    name: "Belarus",
  },
  {
    id: "BL",
    name: "Saint Barthelemy",
  },
  {
    id: "BS",
    name: "Bahamas",
  },
  {
    id: "BH",
    name: "Bahrain",
  },
  {
    id: "BA",
    name: "Bosnia and Herzegovina",
  },
  {
    id: "BG",
    name: "Bulgaria",
  },
  {
    id: "BD",
    name: "Bangladesh",
  },
  {
    id: "BF",
    name: "Burkina Faso",
  },
  {
    id: "BJ",
    name: "Benin",
  },
  {
    id: "BI",
    name: "Burundi",
  },
  {
    id: "AZ",
    name: "Azerbaijan",
  },
  {
    id: "AT",
    name: "Austria",
  },
  {
    id: "AU",
    name: "Australia",
  },
  {
    id: "TF",
    name: "French Southern and Antarctic Lands",
  },
  {
    id: "AQ",
    name: "Antarctica",
  },
  {
    id: "AS",
    name: "American Samoa",
  },
  {
    id: "AM",
    name: "Armenia",
  },
  {
    id: "AR",
    name: "Argentina",
  },
  {
    id: "AE",
    name: "United Arab Emirates",
  },
  {
    id: "AD",
    name: "Andorra",
  },
  {
    id: "AX",
    name: "Aland Islands",
  },
  {
    id: "AL",
    name: "Albania",
  },
  {
    id: "AI",
    name: "Anguilla",
  },
  {
    id: "AO",
    name: "Angola",
  },
  {
    id: "AF",
    name: "Afghanistan",
  },
  {
    id: "AG",
    name: "Antigua and Barbuda",
  },
  {
    id: "AW",
    name: "Aruba",
  },
];
