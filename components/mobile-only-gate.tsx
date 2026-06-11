import { siteConfig } from "@/config/site";
import { DesktopMobilePrompt } from "@/components/desktop-mobile-prompt";
import { MobileEdgeVisuals } from "@/components/mobile-edge-visuals";
import { MobileViewportFix } from "@/components/mobile-viewport-fix";
import { PageScrollController } from "@/components/page-scroll-controller";
import { MobileHeader } from "@/components/mobile-header";
import { MobileHeroContent } from "@/components/mobile-hero-content";
import { InstallAppPrompt } from "@/components/install-app-prompt";
import { IosButtonTapFix } from "@/components/ios-button-tap-fix";
import { ProgramProvider } from "@/components/program-provider";

type MobileOnlyGateProps = {
  children: React.ReactNode;
};

function MobileAppShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ProgramProvider>
      <div
        className={`mobile-app relative flex min-h-full flex-1 flex-col ${className}`}
      >
        <MobileViewportFix />
        <PageScrollController />
        <IosButtonTapFix />
        <MobileEdgeVisuals />
        <MobileHeader />
        <MobileHeroContent />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">{children}</div>
        <InstallAppPrompt />
      </div>
    </ProgramProvider>
  );
}

export function MobileOnlyGate({ children }: MobileOnlyGateProps) {
  if (!siteConfig.mobileOnly) {
    return <MobileAppShell>{children}</MobileAppShell>;
  }

  return (
    <>
      <MobileAppShell className="md:hidden">{children}</MobileAppShell>
      <div className="hidden min-h-full flex-1 md:flex">
        <DesktopMobilePrompt />
      </div>
    </>
  );
}
