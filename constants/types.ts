export interface Package {
  plan_name: string;
  price: string;
  mostPopular?: boolean;
  features: {
    isAdded: boolean;
    feature: string;
  }[];
}
export interface ServiceCardProps {
  title: string;
  description: string;
}

export interface PackagesHome {
  id: number;
  title: string;
  package_type_slug?: string;
  package_type_title?: string;
  slug: string;
  summary: string;
  description: string;
  price: string;
  discount: string;
  vat: string;
  status: string;
  duration: any;
  package_label: any;
  primary_color: string;
  secondary_color: string;
  package_features: PackageFeature[];
}

export interface PackageFeature {
  id: number;
  title: string;
  slug: string;
  description: string;
}

export interface HelpAndServices {
  icon: string;
  name: string;
  slug: string;
  meta_description?: string;
}

export interface Services {
  title: string;
  slug: string;
  icon: string;
  meta_description: string;
}

export interface CategoryAndServices {
  name: string;
  slug: string;
  icon: string;
  services: Service[];
}

export interface Service {
  title: string;
  slug: string;
  meta_description?: string;
  icon: string;
}

export interface Article {
  featured_image: string;
  title: string;
  meta_description: string;
  slug: string;
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface BlogProp {
  id: number;
  featured_image: string;
  published_date: string;
  author: string;
  content?: string;
  category?: string;
  title: string;
  slug: string;
  meta_description: string;
  categories: Category[];
  tags: any[];
  related_blogs?: Article[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export type Money = number;

export type CartService = {
  id: string;
  title: string;
  type: string;
  price: Money;
  discount?: Money;
  vat?: Money;
};
export type CartLine = {
  id: string;
  title: string;
  price: Money;
  qty: number;
  discount?: Money;
  vat?: Money;
};

export type Step =
  | "name-search"
  | "additional-services"
  | "payment"
  | "confirmation";

export interface PaymentMethod {
  id: string;
  object: "payment_method";
  allow_redisplay: string;
  billing_details: BillingDetails;
  card: Card;
  created: number;
  customer: string | null;
  livemode: boolean;
  radar_options: Record<string, unknown>;
  type: "card";
}

export interface BillingDetails {
  address: Address;
  email: string;
  name: string;
  phone: string;
  tax_id: string | null;
}

export interface Address {
  city: string | null;
  country: string | null;
  line1: string | null;
  line2: string | null;
  postal_code: string | null;
  state: string | null;
}

export interface Card {
  brand: string;
  checks: CardChecks;
  country: string;
  display_brand: string;
  exp_month: number;
  exp_year: number;
  funding: string;
  generated_from: unknown | null;
  last4: string;
  networks: CardNetworks;
  regulated_status: string;
  three_d_secure_usage: ThreeDSecureUsage;
  wallet: unknown | null;
}

export interface CardChecks {
  address_line1_check: string | null;
  address_postal_code_check: string | null;
  cvc_check: string | null;
}

export interface CardNetworks {
  available: string[];
  preferred: string | null;
}

export interface ThreeDSecureUsage {
  supported: boolean;
}

export interface CompanyDetail {
  id: number;
  registration_number: any;
  company_name: string;
  company_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  order: Order[];
  directors: Director[];
  secretaries: Secretary[];
  members: Member[];
  pscs: Psc[];
  documents: DirectorDocument[];
  proof_of_residency_documents?: {
    id: number;
    document_title: string;
    file_path: string;
  }[];
}

export interface Order {
  order_number: string;
  customer_id: number;
  order_date: string;
}

export interface Director {
  id?: string;

  // Person
  title: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email?: string;
  personal_code?: string;

  // Service Address
  service_building: string;
  service_street: string;
  service_address_3?: string;
  service_town: string;
  service_country: string;
  service_postcode: string;

  // Residential Address
  residential_building: string;
  residential_street: string;
  residential_address_3?: string;
  residential_town: string;
  residential_county?: string;
  residential_postcode: string;
  residential_country: string;

  // Other
  nationality: string;
  occupation: string;
  country_of_residence: string;

  // Existing
  designation?: string;
  company_id?: string;
  appointment_date?: string;

  // Optional old fields
  service_address?: string;
  residential_address?: string;
}

export interface Secretary {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  service_address: string;
  residential_address: string;
  nationality: string;
  designation: string;
  company_id?: string;
}

export interface Member {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  service_address: string;
  residential_address: string;
  nationality: string;
  shares: string;
}

export interface Psc {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  service_address: string;
  residential_address: string;
  nationality: string;
  designation: any;
  control_type: string;
  company_id?: string;
}

export interface DirectorDocument {
  id: number;
  file_type: string;
  file_path: string;
  document_name: string;
}
export interface WorkspaceResponse {
  id: number;
  icon: string;
  image: string;
  status: string;
  name: string;
  slug: string;
  description: string;
  meta_title: string;
  meta_keywords: string;
  meta_description: string;
  templates: Template[];
}

export interface Template {
  layout_type:
    | "summary_left_image_right_rounded"
    | "summary_left_image_right_squared"
    | "image_left_summary_right_rounded"
    | "image_left_summary_right_squared"
    | "items_only";
  summary: string | null;
  image: string | null;
  placeholder: string;
  workspaces?: Workspace[];
}

interface Workspace {
  featured_image: string;
  booking_type: "inquiry" | "direct";
  price: string;
  vat: string;
  title: string;
  slug: string;
  meta_description: string;
}


export interface ProofOfResidency {
  id?: number;
  company_id?: number;

  document_title: string;

  file?: File | null;

  file_path?: string;
  file_url?: string;

  created_at?: string;
  updated_at?: string;
}