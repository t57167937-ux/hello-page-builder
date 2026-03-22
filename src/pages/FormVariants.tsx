import { useState, useMemo } from "react";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { GenericForm } from "@/components/forms";
import { FormConfig } from "@/components/forms/types";
import { extractFields, generateZodSchemaCode, buildZodSchema } from "@/utils/zodSchemaBuilder";
import { toast } from "@/hooks/use-toast";
import { Copy, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { z } from "zod";

// ─── Contact Form ───
const contactFormConfig: FormConfig = {
  id: "contact-form",
  title: "Contact Us",
  description: "Send us a message and we'll get back to you.",
  submitLabel: "Send Message",
  showReset: false,
  layout: "single",
  sections: [
    {
      id: "contact-details",
      title: "Your Details",
      columns: 2,
      fields: [
        { type: "text", name: "firstName", label: "First Name", placeholder: "John", required: true },
        { type: "text", name: "lastName", label: "Last Name", placeholder: "Doe", required: true },
        { type: "email", name: "email", label: "Email", placeholder: "john@example.com", required: true },
        { type: "textarea", name: "message", label: "Message", placeholder: "Your message...", rows: 4, required: true },
        { type: "checkbox", name: "terms", label: "Terms", checkboxLabel: "I agree to the terms and conditions" },
      ],
    },
  ],
};

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
  terms: z.boolean(),
});

// ─── Multi-Step Registration Form ───
const multiStepFormConfig: FormConfig = {
  id: "registration-wizard",
  title: "Create Account",
  description: "Complete all steps to create your account.",
  submitLabel: "Create Account",
  showReset: false,
  layout: "wizard",
  sections: [
    {
      id: "personal-info",
      title: "Personal Info",
      description: "Tell us about yourself",
      columns: 2,
      fields: [
        { type: "text", name: "firstName", label: "First Name", placeholder: "John", required: true },
        { type: "text", name: "lastName", label: "Last Name", placeholder: "Doe", required: true },
        { type: "date", name: "dob", label: "Date of Birth" },
        { type: "radio", name: "gender", label: "Gender", orientation: "horizontal" as const, options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
          { label: "Other", value: "other" },
        ]},
      ],
    },
    {
      id: "contact-details",
      title: "Contact Details",
      description: "How can we reach you?",
      columns: 2,
      fields: [
        { type: "email", name: "email", label: "Email Address", placeholder: "john@example.com", required: true },
        { type: "tel", name: "phone", label: "Phone Number", placeholder: "+1 (555) 000-0000" },
        { type: "text", name: "address", label: "Address", placeholder: "123 Main Street" },
        { type: "text", name: "city", label: "City", placeholder: "New York" },
        { type: "text", name: "postalCode", label: "Postal Code", placeholder: "10001" },
      ],
    },
    {
      id: "preferences",
      title: "Preferences",
      description: "Customize your experience",
      columns: 1,
      fields: [
        { type: "select", name: "language", label: "Preferred Language", options: [
          { label: "English", value: "en" },
          { label: "Spanish", value: "es" },
          { label: "French", value: "fr" },
          { label: "German", value: "de" },
        ]},
        { type: "switchgroup", name: "notifications", label: "Notification Preferences", options: [
          { label: "Email notifications", value: "email" },
          { label: "SMS notifications", value: "sms" },
          { label: "Marketing emails", value: "marketing" },
        ]},
        { type: "checkboxgroup", name: "interests", label: "Interests", orientation: "horizontal" as const, options: [
          { label: "Technology", value: "technology" },
          { label: "Design", value: "design" },
          { label: "Business", value: "business" },
          { label: "Marketing", value: "marketing" },
          { label: "Finance", value: "finance" },
          { label: "Health", value: "health" },
        ]},
      ],
    },
  ],
};

const multiStepFormSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  dob: z.string().optional(),
  gender: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  language: z.string().optional(),
  notifications: z.record(z.string(), z.boolean()),
  interests: z.array(z.string()),
});

// ─── Login Form ───
const loginFormConfig: FormConfig = {
  id: "login-form",
  title: "Welcome Back",
  description: "Sign in to your account to continue",
  submitLabel: "Sign In",
  showReset: false,
  layout: "compact",
  sections: [
    {
      id: "login-fields",
      columns: 1,
      fields: [
        { type: "email", name: "email", label: "Email", placeholder: "name@example.com", required: true },
        { type: "password", name: "password", label: "Password", placeholder: "••••••••", required: true },
        { type: "checkbox", name: "remember", label: "Remember", checkboxLabel: "Remember me" },
      ],
    },
  ],
};

const loginFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean(),
});

// ─── Payment Form ───
const paymentFormConfig: FormConfig = {
  id: "payment-form",
  title: "Payment Details",
  description: "Complete your purchase securely",
  submitLabel: "Pay $99.00",
  showReset: false,
  layout: "single",
  sections: [
    {
      id: "card-details",
      title: "Card Information",
      columns: 2,
      fields: [
        { type: "text", name: "cardNumber", label: "Card Number", placeholder: "4242 4242 4242 4242", required: true },
        { type: "text", name: "cardholderName", label: "Cardholder Name", placeholder: "John Doe", required: true },
        { type: "text", name: "expiry", label: "Expiry Date", placeholder: "MM/YY", required: true },
        { type: "text", name: "cvc", label: "CVC", placeholder: "123", required: true },
      ],
    },
    {
      id: "billing-address",
      title: "Billing Address",
      columns: 2,
      fields: [
        { type: "text", name: "address", label: "Address", placeholder: "Address line 1", required: true },
        { type: "text", name: "city", label: "City", placeholder: "City", required: true },
        { type: "text", name: "postalCode", label: "Postal Code", placeholder: "Postal Code", required: true },
        { type: "select", name: "country", label: "Country", required: true, options: [
          { label: "United States", value: "us" },
          { label: "United Kingdom", value: "uk" },
          { label: "Canada", value: "ca" },
        ]},
      ],
    },
  ],
};

const paymentFormSchema = z.object({
  cardNumber: z.string().min(1, "Card Number is required"),
  cardholderName: z.string().min(1, "Cardholder Name is required"),
  expiry: z.string().min(1, "Expiry Date is required"),
  cvc: z.string().min(1, "CVC is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal Code is required"),
  country: z.string().min(1, "Country is required"),
});

// ─── Survey Form ───
const surveyFormConfig: FormConfig = {
  id: "survey-form",
  title: "Customer Feedback",
  description: "Help us improve our services by sharing your experience",
  submitLabel: "Submit Feedback",
  showReset: false,
  layout: "single",
  sections: [
    {
      id: "feedback",
      title: "Your Feedback",
      columns: 1,
      fields: [
        { type: "radio", name: "satisfaction", label: "How would you rate your overall experience?", required: true, orientation: "horizontal" as const, options: [
          { label: "1 - Very Poor", value: "1" },
          { label: "2 - Poor", value: "2" },
          { label: "3 - Neutral", value: "3" },
          { label: "4 - Good", value: "4" },
          { label: "5 - Excellent", value: "5" },
        ]},
        { type: "checkboxgroup", name: "features", label: "What features do you use most?", orientation: "horizontal" as const, options: [
          { label: "Dashboard", value: "dashboard" },
          { label: "Reports", value: "reports" },
          { label: "Analytics", value: "analytics" },
          { label: "Integrations", value: "integrations" },
          { label: "API", value: "api" },
          { label: "Support", value: "support" },
        ]},
        { type: "radio", name: "recommend", label: "How likely are you to recommend us?", options: [
          { label: "Very Likely", value: "very-likely" },
          { label: "Likely", value: "likely" },
          { label: "Neutral", value: "neutral" },
          { label: "Unlikely", value: "unlikely" },
        ]},
        { type: "textarea", name: "comments", label: "Additional Comments", placeholder: "Share your thoughts...", rows: 4 },
      ],
    },
  ],
};

const surveyFormSchema = z.object({
  satisfaction: z.string().min(1, "Please rate your experience"),
  features: z.array(z.string()),
  recommend: z.string().optional(),
  comments: z.string().optional(),
});

// ─── Job Application Form ───
const jobApplicationFormConfig: FormConfig = {
  id: "job-application-form",
  title: "Senior Software Engineer",
  description: "Join our engineering team and build amazing products",
  submitLabel: "Submit Application",
  showReset: false,
  layout: "single",
  sections: [
    {
      id: "personal-info",
      title: "Personal Information",
      columns: 2,
      fields: [
        { type: "text", name: "firstName", label: "First Name", placeholder: "John", required: true },
        { type: "text", name: "lastName", label: "Last Name", placeholder: "Doe", required: true },
        { type: "email", name: "email", label: "Email", placeholder: "john@example.com", required: true },
        { type: "tel", name: "phone", label: "Phone", placeholder: "+1 (555) 000-0000" },
        { type: "url", name: "linkedin", label: "LinkedIn Profile", placeholder: "https://linkedin.com/in/johndoe" },
        { type: "select", name: "experience", label: "Years of Experience", options: [
          { label: "0-2 years", value: "0-2" },
          { label: "3-5 years", value: "3-5" },
          { label: "5-8 years", value: "5-8" },
          { label: "8+ years", value: "8+" },
        ]},
      ],
    },
    {
      id: "application-details",
      title: "Application Details",
      columns: 1,
      fields: [
        { type: "file", name: "resume", label: "Resume/CV", accept: ".pdf,.doc,.docx", required: true },
        { type: "textarea", name: "coverLetter", label: "Why do you want to join us?", placeholder: "Tell us about yourself...", rows: 4 },
      ],
    },
  ],
};

const jobApplicationFormSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  experience: z.string().optional(),
  resume: z.instanceof(File, { message: "Resume is required" }),
  coverLetter: z.string().optional(),
});

// ─── Conditional Form ───
// Company fields are conditionally required — the dynamic resolver
// in GenericForm re-evaluates these based on live form values.
const conditionalFormConfig: FormConfig = {
  id: "conditional-form",
  title: "Dynamic Registration",
  description: "Fields appear/disappear based on your selections",
  submitLabel: "Create Account",
  showReset: true,
  layout: "single",
  sections: [
    {
      id: "basic-info",
      title: "Basic Information",
      columns: 2,
      fields: [
        { type: "text", name: "firstName", label: "First Name", placeholder: "John", required: true },
        { type: "text", name: "lastName", label: "Last Name", placeholder: "Doe", required: true },
        { type: "email", name: "email", label: "Email", placeholder: "john@example.com", required: true },
        { type: "switch", name: "isCompany", label: "Account Type", switchLabel: "Register as a company?" },
      ],
    },
    {
      id: "company-info",
      title: "Company Information",
      description: "Fill in your company details",
      columns: 2,
      fields: [
        {
          type: "text", name: "companyName", label: "Company Name", placeholder: "Acme Inc.", required: true,
          condition: { field: "isCompany", operator: "isTrue" },
        },
        {
          type: "text", name: "registrationNumber", label: "Registration Number", placeholder: "REG-123456", required: true,
          condition: { field: "isCompany", operator: "isTrue" },
        },
        {
          type: "text", name: "taxId", label: "Tax ID", placeholder: "TAX-789012",
          condition: { field: "isCompany", operator: "isTrue" },
        },
        {
          type: "select", name: "companySize", label: "Company Size",
          condition: { field: "isCompany", operator: "isTrue" },
          options: [
            { label: "1-10 employees", value: "1-10" },
            { label: "11-50 employees", value: "11-50" },
            { label: "51-200 employees", value: "51-200" },
            { label: "200+ employees", value: "200+" },
          ],
        },
      ],
    },
    {
      id: "account-type",
      title: "Account & Services",
      columns: 1,
      fields: [
        { type: "radio", name: "accountType", label: "Account Type", options: [
          { label: "Basic Account — Free tier with limited features", value: "basic" },
          { label: "Pro Account — Advanced features + priority support", value: "pro" },
          { label: "Enterprise — Custom solutions + dedicated manager", value: "enterprise" },
        ]},
        {
          type: "email", name: "billingEmail", label: "Billing Email", placeholder: "billing@company.com",
          condition: { field: "accountType", operator: "equals", value: "pro" },
        },
        {
          type: "select", name: "paymentMethod", label: "Preferred Payment Method",
          condition: { field: "accountType", operator: "equals", value: "pro" },
          options: [
            { label: "Credit/Debit Card", value: "card" },
            { label: "Bank Transfer", value: "bank" },
            { label: "PayPal", value: "paypal" },
          ],
        },
        {
          type: "text", name: "accountManager", label: "Dedicated Account Manager", placeholder: "Preferred contact name",
          condition: { field: "accountType", operator: "equals", value: "enterprise" },
        },
        {
          type: "number", name: "expectedUsers", label: "Expected Monthly Users", placeholder: "1000",
          condition: { field: "accountType", operator: "equals", value: "enterprise" },
        },
        {
          type: "textarea", name: "customRequirements", label: "Custom Requirements", placeholder: "Describe your specific needs...", rows: 3,
          condition: { field: "accountType", operator: "equals", value: "enterprise" },
        },
        { type: "checkboxgroup", name: "services", label: "Additional Services", orientation: "horizontal" as const, options: [
          { label: "API Access", value: "api" },
          { label: "SSO Integration", value: "sso" },
          { label: "Advanced Analytics", value: "analytics" },
          { label: "24/7 Support", value: "support" },
        ]},
        { type: "checkbox", name: "needsShipping", label: "Shipping", checkboxLabel: "I need physical products shipped to me" },
      ],
    },
    {
      id: "shipping-address",
      title: "Shipping Address",
      columns: 2,
      fields: [
        { type: "text", name: "street", label: "Street Address", placeholder: "123 Main Street", condition: { field: "needsShipping", operator: "isTrue" } },
        { type: "text", name: "shippingCity", label: "City", placeholder: "New York", condition: { field: "needsShipping", operator: "isTrue" } },
        { type: "text", name: "shippingPostalCode", label: "Postal Code", placeholder: "10001", condition: { field: "needsShipping", operator: "isTrue" } },
        {
          type: "select", name: "shippingCountry", label: "Country",
          condition: { field: "needsShipping", operator: "isTrue" },
          options: [
            { label: "United States", value: "us" },
            { label: "United Kingdom", value: "uk" },
            { label: "Canada", value: "ca" },
            { label: "Australia", value: "au" },
          ],
        },
      ],
    },
  ],
};

// For the conditional form we pass null — GenericForm's dynamic resolver handles it
// by rebuilding the schema on every submission using live form values.
// This is the ONLY correct approach for conditional required fields.

// ─── Variant registry ───
type FormVariant = {
  key: string;
  label: string;
  config: FormConfig;
  schema: z.ZodObject<any> | null; // null = use dynamic resolver in GenericForm
};

const formVariants: FormVariant[] = [
  { key: "contact", label: "Contact", config: contactFormConfig, schema: contactFormSchema },
  { key: "multi-step", label: "Multi-Step", config: multiStepFormConfig, schema: multiStepFormSchema },
  { key: "conditional", label: "Conditional", config: conditionalFormConfig, schema: null },
  { key: "login", label: "Login", config: loginFormConfig, schema: loginFormSchema },
  { key: "payment", label: "Payment", config: paymentFormConfig, schema: paymentFormSchema },
  { key: "survey", label: "Survey", config: surveyFormConfig, schema: surveyFormSchema },
  { key: "job", label: "Job Application", config: jobApplicationFormConfig, schema: jobApplicationFormSchema },
];

// ─── Generated code helper (shows the correct import pattern) ───
function generateFormPageCode(config: FormConfig, schemaCode: string): string {
  const configStr = JSON.stringify(config, null, 2);
  const hasConditional = config.sections
    .flatMap(s => s.fields)
    .some(f => !!f.condition);

  if (hasConditional) {
    return `import { GenericForm } from "@/components/forms";
import type { FormConfig } from "@/components/forms/types";
import { buildZodSchema, extractFields } from "@/utils/zodSchemaBuilder";
import { toast } from "@/hooks/use-toast";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

const formConfig: FormConfig = ${configStr};

// For forms with conditional fields, schema is built dynamically
// inside GenericForm using the current live form values, so hidden
// conditional fields are never incorrectly required.

export default function MyFormPage() {
  // Pass a base schema — GenericForm's dynamic resolver takes over
  // for conditional fields automatically.
  const baseSchema = useMemo(
    () => buildZodSchema(extractFields(formConfig)),
    []
  );

  const handleSubmit = (data: Record<string, unknown>) => {
    console.log("Submitted:", data);
    toast({ title: "Success", description: "Form submitted successfully" });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <GenericForm config={formConfig} schema={baseSchema} onSubmit={handleSubmit} />
    </div>
  );
}`;
  }

  return `import { GenericForm } from "@/components/forms";
import type { FormConfig } from "@/components/forms/types";
import { toast } from "@/hooks/use-toast";
// Import the static schema directly — no runtime building needed
import { formSchema } from "./formSchema";

const formConfig: FormConfig = ${configStr};

export default function MyFormPage() {
  const handleSubmit = (data: Record<string, unknown>) => {
    console.log("Submitted:", data);
    toast({ title: "Success", description: "Form submitted successfully" });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <GenericForm config={formConfig} schema={formSchema} onSubmit={handleSubmit} />
    </div>
  );
}`;
}

// ─── Code Panel ───
function CodePanel({ config }: { config: FormConfig }) {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState(0);

  const files = useMemo(() => {
    const fields = extractFields(config);
    const schemaCode = generateZodSchemaCode(fields);
    return [
      {
        name: "MyFormPage.tsx",
        content: generateFormPageCode(config, schemaCode),
        description: "Form page component",
      },
      {
        name: "formConfig.json",
        content: JSON.stringify(config, null, 2),
        description: "JSON configuration",
      },
      {
        name: "formSchema.ts",
        content: schemaCode,
        description: "Zod schema",
      },
    ];
  }, [config]);

  const copyToClipboard = async (content: string, name: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedFile(name);
    setTimeout(() => setCopiedFile(null), 2000);
    toast({ title: "Copied!", description: `${name} copied to clipboard` });
  };

  const current = files[activeFile];

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      {/* File tabs header */}
      <div className="flex items-center justify-between px-1 py-1 bg-muted/40 border-b border-border gap-1">
        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {files.map((file, idx) => (
            <button
              key={file.name}
              onClick={() => setActiveFile(idx)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors whitespace-nowrap",
                activeFile === idx
                  ? "bg-background text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {file.name}
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 shrink-0 mr-1 text-xs"
          onClick={() => copyToClipboard(current.content, current.name)}
        >
          {copiedFile === current.name ? (
            <><Check className="h-3 w-3 text-primary" />Copied</>
          ) : (
            <><Copy className="h-3 w-3" />Copy</>
          )}
        </Button>
      </div>
      {/* Code content */}
      <ScrollArea className="h-72">
        <pre className="p-4 text-xs font-mono leading-relaxed bg-muted/30 text-foreground">
          <code>{current.content}</code>
        </pre>
      </ScrollArea>
    </div>
  );
}

// ─── Main Page ───
export default function FormVariants() {
  const [activeKey, setActiveKey] = useState("contact");

  const handleSubmit = (data: Record<string, unknown>) => {
    console.log("Form submitted:", data);
    toast({ title: "✓ Form Submitted", description: "Check the console for submitted data" });
  };

  const active = formVariants.find(v => v.key === activeKey) ?? formVariants[0];

  // For forms without conditional fields use their pre-built static schema.
  // For the conditional form, GenericForm's dynamic resolver takes over.
  const schemaToUse = useMemo(
    () => active.schema ?? buildZodSchema(extractFields(active.config)),
    [active]
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <PageBreadcrumb items={[{ label: "Form Variants" }]} />

      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Form Variants</h1>
        <p className="text-muted-foreground text-sm">
          Different form layouts and patterns — all powered by{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">GenericForm</code> +{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">FormConfig</code>
        </p>
      </div>

      {/* ── Responsive variant selector ── */}
      <div className="w-full">
        {/* Large screens: pill bar */}
        <div className="hidden md:flex flex-wrap items-center gap-1.5 p-1.5 bg-muted/50 rounded-xl border border-border">
          {formVariants.map(v => (
            <button
              key={v.key}
              onClick={() => setActiveKey(v.key)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeKey === v.key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Small screens: dropdown */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>{active.label}</span>
                <ChevronDown className="h-4 w-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[200px]">
              {formVariants.map(v => (
                <DropdownMenuItem
                  key={v.key}
                  onClick={() => setActiveKey(v.key)}
                  className={cn(activeKey === v.key && "bg-primary/10 text-primary font-medium")}
                >
                  {v.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── Form + Code stacked vertically ── */}
      <div className="space-y-6">
        {/* Form */}
        <div className="max-w-3xl">
          <GenericForm
            key={active.key}
            config={active.config}
            schema={schemaToUse}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Code — always visible below */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-2">
              Source Code
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <CodePanel config={active.config} />
        </div>
      </div>
    </div>
  );
}
