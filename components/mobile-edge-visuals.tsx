export function MobileEdgeVisuals() {
  return (
    <>
      <div
        className="mobile-edge-side mobile-edge-side--left pointer-events-none fixed left-0 z-0 md:hidden"
        aria-hidden="true"
      />
      <div
        className="mobile-edge-side mobile-edge-side--right pointer-events-none fixed right-0 z-[2] md:hidden"
        aria-hidden="true"
      />
    </>
  );
}
