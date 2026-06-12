export function MobileEdgeVisuals() {
  return (
    <>
      <div
        id="edge-left"
        className="mobile-edge-side mobile-edge-side--left pointer-events-none fixed left-0 z-[6] md:hidden"
        aria-hidden="true"
      >
        <div className="mobile-edge-side__building mobile-edge-side__building--left" />
      </div>
      <div
        id="edge-right"
        className="mobile-edge-side mobile-edge-side--right pointer-events-none fixed right-0 z-[6] md:hidden"
        aria-hidden="true"
      />
    </>
  );
}
