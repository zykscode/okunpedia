"use client";

import * as React from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Cookie consent banner shown to first-time visitors.
 * Stores preferences in localStorage to avoid showing on subsequent visits.
 */
export function CookieConsent() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const consent = localStorage.getItem("okunpedia_cookie_consent");
    if (consent) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleAccept = () => {
    localStorage.setItem("okunpedia_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("okunpedia_cookie_consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md animate-fade-in-up rounded-2xl border border-gray-200/80 bg-white/95 p-5 shadow-2xl shadow-gray-900/10 backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-950/95 md:left-auto md:right-4">
      <div className="flex items-start gap-3.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
          <Cookie className="size-5" />
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-sm font-bold text-gray-950 dark:text-white">
              Cookie Preferences
            </h4>
            <button
              onClick={handleDecline}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
          <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            We use cookies to maintain your authenticated session, remember dark
            mode selections, and count visits. You can read details in our{" "}
            <Link
              href="/cookie-policy"
              className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Cookie Policy
            </Link>
            .
          </p>
          <div className="mt-3 flex items-center gap-2 pt-1">
            <Button
              variant="primary"
              size="xs"
              onClick={handleAccept}
              className="flex-1"
            >
              Accept All
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={handleDecline}
              className="flex-1"
            >
              Essential Only
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
