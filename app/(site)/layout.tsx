import { MobileOnlyGate } from "@/components/mobile-only-gate";
import { getSiteData } from "@/lib/data/site-data";

export const revalidate = 60;

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteData = await getSiteData();

  return <MobileOnlyGate {...siteData}>{children}</MobileOnlyGate>;
}
