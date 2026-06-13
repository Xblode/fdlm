"use client";

import { useEffect } from "react";
import { getOrCreateUserUuid } from "@/lib/anonymous-user";
import { isStandaloneMode } from "@/lib/device";

const TRACKED_KEY = "fdlm-standalone-tracked";

export function PwaStandaloneTracker() {
  useEffect(() => {
    if (!isStandaloneMode()) return;
    if (localStorage.getItem(TRACKED_KEY) === "1") return;

    const userUuid = getOrCreateUserUuid();
    if (!userUuid) return;

    void fetch("/api/analytics/pwa-standalone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uuid: userUuid }),
      keepalive: true,
    })
      .then((response) => {
        if (!response.ok) return;
        localStorage.setItem(TRACKED_KEY, "1");
      })
      .catch(() => {
        // Ignore tracking errors silently on the client.
      });
  }, []);

  return null;
}
