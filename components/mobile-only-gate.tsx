import { siteConfig } from "@/config/site";
import { DesktopMobilePrompt } from "@/components/desktop-mobile-prompt";
import { MobileEdgeVisuals } from "@/components/mobile-edge-visuals";
import { MobileViewportFix } from "@/components/mobile-viewport-fix";
import { MobileOverscrollLock } from "@/components/mobile-overscroll-lock";
import { PageScrollController } from "@/components/page-scroll-controller";
import { MobileHeader } from "@/components/mobile-header";
import { MobileHeroContent } from "@/components/mobile-hero-content";
import { InstallAppPrompt } from "@/components/install-app-prompt";
import { IosButtonTapFix } from "@/components/ios-button-tap-fix";
import { StyleRecovery } from "@/components/style-recovery";
import { ProgramProvider } from "@/components/program-provider";
import {
  SiteDataProvider,
  type EventInfo,
} from "@/components/site-data-provider";
import type { Artist, Venue } from "@/config/event";

type MobileOnlyGateProps = {
  children: React.ReactNode;
  venues: Venue[];
  artists: Artist[];
  musicFilterStyles: string[];
  eventInfo: EventInfo;
};

function MobileAppShell({
  children,
  className = "",
  siteData,
}: {
  children: React.ReactNode;
  className?: string;
  siteData: Omit<MobileOnlyGateProps, "children">;
}) {
  return (
    <SiteDataProvider {...siteData}>
      <ProgramProvider>
        <div
          className={`mobile-app relative flex min-h-full flex-1 flex-col ${className}`}
        >
          <MobileViewportFix />
          <MobileOverscrollLock />
          <StyleRecovery />
          <PageScrollController />
          <IosButtonTapFix />
          <MobileEdgeVisuals />
          <MobileHeader />
          <MobileHeroContent />
          <div className="relative z-10 flex min-h-full flex-1 flex-col">
            {children}
          </div>
          <InstallAppPrompt />
        </div>
      </ProgramProvider>
    </SiteDataProvider>
  );
}

export function MobileOnlyGate({
  children,
  venues,
  artists,
  musicFilterStyles,
  eventInfo,
}: MobileOnlyGateProps) {
  const siteData = { venues, artists, musicFilterStyles, eventInfo };

  if (!siteConfig.mobileOnly) {
    return <MobileAppShell siteData={siteData}>{children}</MobileAppShell>;
  }

  return (
    <>
      <MobileAppShell className="md:hidden" siteData={siteData}>
        {children}
      </MobileAppShell>
      <div className="hidden min-h-full flex-1 md:flex">
        <DesktopMobilePrompt />
      </div>
    </>
  );
}
