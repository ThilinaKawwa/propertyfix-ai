import {
  Bot,
  Send,
  Camera,
  ShieldCheck,
  ClipboardList,
  Building2,
  Smartphone,
  ScrollText,
  MessageSquareWarning,
  PhoneMissed,
  Mails,
  FileWarning,
  type LucideIcon,
} from "lucide-react";

export const nav = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Demo", href: "#demo" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

export const trustLogos = [
  "Ashcroft Lettings",
  "Meridian Estates",
  "Northgate Property",
  "Harbour & Co",
  "Camden Residential",
];

export const trustMetrics = [
  { value: "73%", label: "faster first response to tenants" },
  { value: "9 hrs", label: "admin saved per manager, weekly" },
  { value: "2× ", label: "quicker contractor dispatch" },
  { value: "100%", label: "of jobs captured with a full audit trail" },
];

export const problems: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: MessageSquareWarning,
    title: "Scattered WhatsApp threads",
    body: "Reports land across personal WhatsApps and group chats. Nothing is searchable, nothing is logged.",
  },
  {
    icon: PhoneMissed,
    title: "Missed calls & voicemails",
    body: "Tenants call at 8pm about a leak. By morning the details are gone and the urgency is guesswork.",
  },
  {
    icon: Mails,
    title: "Endless email tennis",
    body: "‘Can you send a photo?’ ‘Which flat?’ ‘When are you in?’ Three days of back-and-forth before anyone books a contractor.",
  },
  {
    icon: FileWarning,
    title: "Incomplete reports",
    body: "Half the information is missing, so contractors arrive unprepared, quote blind, or turn up to an empty flat.",
  },
];

export const steps: {
  step: string;
  title: string;
  body: string;
  icon: LucideIcon;
}[] = [
  {
    step: "01",
    title: "Tenant reports",
    body: "From a link on their phone — no app, no login. They describe the issue and add photos.",
    icon: Smartphone,
  },
  {
    step: "02",
    title: "AI triages",
    body: "Follow-up questions fill the gaps, then it classifies urgency, trade and risk into a clean ticket.",
    icon: Bot,
  },
  {
    step: "03",
    title: "Manager approves",
    body: "Review the draft, tweak if needed, pick the contractor, and approve dispatch in one click.",
    icon: ShieldCheck,
  },
  {
    step: "04",
    title: "Contractor dispatched",
    body: "A structured brief with photos and access times goes out. The contractor confirms attendance.",
    icon: Send,
  },
  {
    step: "05",
    title: "Everyone updated",
    body: "The tenant sees live status. The landlord gets a tidy summary. Every action is logged.",
    icon: ClipboardList,
  },
];

export const features: {
  icon: LucideIcon;
  title: string;
  body: string;
}[] = [
  {
    icon: Bot,
    title: "AI maintenance triage",
    body: "Asks the right follow-ups, classifies urgency and trade, and drafts a structured ticket automatically.",
  },
  {
    icon: Send,
    title: "Contractor dispatch",
    body: "Match the right trade and send a complete brief — photos, access, risk — the moment you approve.",
  },
  {
    icon: Camera,
    title: "Photo & video capture",
    body: "Tenants add media in the flow, so contractors see the problem before they leave the depot.",
  },
  {
    icon: ShieldCheck,
    title: "Manager approval workflow",
    body: "Nothing dispatches without a human. Review, edit, and approve — with full control.",
  },
  {
    icon: Building2,
    title: "Landlord summaries",
    body: "Auto-generated, plain-English updates keep owners informed without extra admin.",
  },
  {
    icon: ClipboardList,
    title: "Centralised job tracking",
    body: "Every ticket, from intake to resolved, in one board. No more hunting across inboxes.",
  },
  {
    icon: Smartphone,
    title: "Mobile-first reporting",
    body: "A PWA-ready experience that works instantly on any tenant's phone.",
  },
  {
    icon: ScrollText,
    title: "Audit trail & accountability",
    body: "A timestamped record of every message, decision and dispatch — for you, owners and compliance.",
  },
];

export const benefits: { title: string; body: string }[] = [
  {
    title: "Reduce admin workload",
    body: "Cut the chasing. AI collects and structures everything, so staff review instead of retype.",
  },
  {
    title: "Faster maintenance handling",
    body: "Triage happens the moment a tenant reports — not the next time someone checks the inbox.",
  },
  {
    title: "Better tenant communication",
    body: "Clear acknowledgements and live status replace silence and guesswork.",
  },
  {
    title: "Better contractor coordination",
    body: "Complete briefs and confirmed attendance mean fewer wasted visits and repeat trips.",
  },
  {
    title: "Professional landlord updates",
    body: "Owners get polished summaries automatically — you look on top of every property.",
  },
  {
    title: "Fewer missed details",
    body: "Structured intake means access times, risks and photos are captured every single time.",
  },
];

export const pricing: {
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  features: string[];
  cta: string;
  featured?: boolean;
}[] = [
  {
    name: "Starter",
    price: "£49",
    cadence: "/month",
    tagline: "For landlords and small portfolios finding their feet.",
    features: [
      "Up to 25 properties",
      "AI triage & ticketing",
      "Tenant photo & video capture",
      "1 team member",
      "Email support",
    ],
    cta: "Start free trial",
  },
  {
    name: "Growth",
    price: "£99",
    cadence: "/month",
    tagline: "For growing agencies that live in their maintenance queue.",
    features: [
      "Up to 150 properties",
      "Everything in Starter",
      "Contractor dispatch & confirmations",
      "Landlord summary updates",
      "Up to 5 team members",
      "Priority support",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Agency Pro",
    price: "£199",
    cadence: "/month",
    tagline: "For established agencies managing at scale.",
    features: [
      "Unlimited properties",
      "Everything in Growth",
      "Full audit trail & exports",
      "Unlimited team members",
      "Custom contractor network",
      "Dedicated onboarding",
    ],
    cta: "Book a demo",
  },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "Do tenants need to download an app?",
    a: "No. Tenants report from a link that opens on any phone browser. It's PWA-ready, so they can add it to their home screen if they want.",
  },
  {
    q: "Does the AI dispatch contractors on its own?",
    a: "Never. The AI drafts and recommends. A manager always reviews and approves before any contractor is dispatched.",
  },
  {
    q: "Can we use our own contractors?",
    a: "Yes. Add your trusted contractors and their trades, and PropertyFix suggests the right one for each job.",
  },
  {
    q: "Is there an audit trail?",
    a: "Every message, classification, approval and dispatch is timestamped and logged — for your records, landlords and compliance.",
  },
];

// --- Killer demo scenario (exact script) ---
export const demoScript = {
  messages: [
    {
      role: "tenant" as const,
      text: "Water is leaking from under the sink.",
    },
    {
      role: "ai" as const,
      text: "I'm sorry to hear that. Is the leak active right now? Please upload a photo or short video. Also, can you confirm whether you have turned off the water supply?",
    },
    {
      role: "tenant" as const,
      text: "Yes, still leaking. I've turned off the valve under the sink.",
      hasPhoto: true,
    },
  ],
  ticket: {
    title: "Active leak under kitchen sink",
    urgency: "Urgent",
    trade: "Plumber",
    risk: "Water damage",
    access: "Tenant available today after 5 PM",
    contractor: "ABC Plumbing Services",
    nextAction: "Manager approval",
  },
  dispatch:
    "Urgent bathroom sink leak at Flat 2. Photos attached. Tenant available after 5 PM. Please confirm attendance.",
};

export const trades = [
  "Plumber",
  "Electrician",
  "Heating / Gas engineer",
  "Locksmith",
  "Roofer",
  "Carpenter",
  "Handyperson",
  "Appliance repair",
  "Pest control",
  "Glazier",
];
