"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Sparkles, Heart, Users, X, Map } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * A beautiful welcome modal overlay shown to first-time visitors.
 * Explains the site aim, credits Mr. John Otitoju's book, and lists future roadmap.
 */
export function WelcomeModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const welcomeSeen = localStorage.getItem("okunpedia_welcome_seen");
    if (welcomeSeen) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("okunpedia_welcome_seen", "true");
    setIsOpen(false);
  };

  const handleReadMore = () => {
    localStorage.setItem("okunpedia_welcome_seen", "true");
    setIsOpen(false);
    router.push("/welcome");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-950/60 backdrop-blur-md transition-opacity duration-300"
        onClick={handleDismiss}
      />

      {/* Modal Content */}
      <div
        className="relative max-w-lg w-full transform rounded-3xl border border-gray-200/80 bg-white/95 p-6 text-left shadow-2xl transition-all duration-300 backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-950/95 sm:p-8 flex flex-col gap-6"
        style={{
          animation: "scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors"
          aria-label="Close welcome message"
        >
          <X className="size-5" />
        </button>

        {/* Content */}
        <div className="space-y-4">
          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
            <BookOpen className="size-5.5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
              Welcome to Okunpedia
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              A digital heritage repository and encyclopedia preserving the
              history, culture, and lineages of the Okun people across Kogi
              State, Nigeria.
            </p>
          </div>
        </div>

        {/* Key Features / Highlights */}
        <div className="space-y-3.5 border-t border-b border-gray-200/60 py-4 dark:border-gray-800/60">
          {/* Sourcing */}
          <div className="flex gap-3 items-start">
            <Heart className="size-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                Based on John Otitoju’s “The Okun People”
              </p>
              <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                Foundational content about communities is based on Mr. John
                Otitoju's inspiring book. He holds the copyright to these
                records.
              </p>
            </div>
          </div>

          {/* Collaborative */}
          <div className="flex gap-3 items-start">
            <Users className="size-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                Live & Collaborative
              </p>
              <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                Contents are dynamic and subject to real-time contributions and
                corrections by everyone.
              </p>
            </div>
          </div>

          {/* Future */}
          <div className="flex gap-3 items-start">
            <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                Future Extensions
              </p>
              <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                Coming soon: Community Reports, Role Modelling Index, and
                professional Mentorship connections.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <Button
            variant="primary"
            className="flex-1 gap-2"
            onClick={handleDismiss}
          >
            <Map className="size-4" />
            Explore Platform
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleReadMore}>
            Read Our Full Story
          </Button>
        </div>
      </div>
    </div>
  );
}
