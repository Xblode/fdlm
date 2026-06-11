import { MobileOnlyGate } from "@/components/mobile-only-gate";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MobileOnlyGate>{children}</MobileOnlyGate>;
}
