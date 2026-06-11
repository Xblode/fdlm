"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

type BottomSheetPortalProps = {
  children: React.ReactNode;
};

function subscribe() {
  return () => {};
}

export function BottomSheetPortal({ children }: BottomSheetPortalProps) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!mounted) return null;

  return createPortal(children, document.body);
}
