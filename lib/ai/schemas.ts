import { z } from "zod";

export const classificationSchema = z.object({
  title: z
    .string()
    .describe("A short 3-6 word job title, e.g. 'Active leak under kitchen sink'."),
  urgency: z
    .enum(["low", "medium", "urgent"])
    .describe(
      "urgent = safety/active damage (leaks, no heat in winter, electrical, security); medium = needs attention soon; low = cosmetic/minor.",
    ),
  trade: z
    .string()
    .describe(
      "The single trade required, e.g. Plumber, Electrician, Heating / Gas engineer, Locksmith, Roofer, Carpenter, Handyperson, Appliance repair, Pest control, Glazier.",
    ),
  risk: z
    .string()
    .describe("Primary risk in 1-3 words, e.g. 'Water damage', 'Fire risk', 'Security', 'None significant'."),
  access_notes: z
    .string()
    .describe("When/how the contractor can access the property, from the tenant's messages."),
  summary: z
    .string()
    .describe("A concise 1-2 sentence summary of the issue for the property manager."),
  tenant_name: z.string().optional().describe("Tenant name if mentioned."),
  tenant_contact: z.string().optional().describe("Tenant phone/email if mentioned."),
  dispatch_message: z
    .string()
    .describe(
      "A short, structured message to send the contractor: what/where, urgency, access window, and a request to confirm attendance.",
    ),
});

export type ClassificationOutput = z.infer<typeof classificationSchema>;
