import type { Metadata } from "next";
import { ReportChat } from "@/components/report/report-chat";

export const metadata: Metadata = {
  title: "Report an issue",
  robots: { index: false },
};

export default async function ReportPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ReportChat propertyToken={token} />;
}
