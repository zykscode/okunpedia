import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import "@/styles/global.css";
import { SearchProvider } from "pliny/search/index.js";
import { PwaRegistration } from "@/components/PwaRegistration";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AppConfig } from "@/utils/AppConfig";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { WelcomeModal } from "@/components/layout/WelcomeModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(AppConfig.siteUrl),
  title: {
    default: AppConfig.title,
    template: `%s — ${AppConfig.title}`,
  },
  description: AppConfig.description,
  keywords: [
    "Okun",
    "Kogi State",
    "Nigeria",
    "Oworo",
    "Lokoja",
    "Yoruba",
    "encyclopedia",
    "history",
    "culture",
    "Bunu",
    "Owe",
    "Gbede",
    "Oyi",
    "Kabba",
    "Ijumu",
    "Yagba",
  ],
  authors: [{ name: AppConfig.author }],
  creator: AppConfig.author,
  icons: {
    icon: [
      {
        url: "/static/favicons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/static/favicons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: "/static/favicons/apple-touch-icon.png",
  },
  openGraph: {
    title: AppConfig.title,
    description: AppConfig.description,
    url: AppConfig.siteUrl,
    siteName: AppConfig.title,
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: AppConfig.title,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: AppConfig.title,
    description: AppConfig.description,
    images: ["/og-banner.png"],
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${AppConfig.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: AppConfig.title,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10b981",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${lora.variable}`}
    >
      <head>
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/static/favicons/apple-touch-icon.png"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme={AppConfig.theme}
          enableSystem
        >
          <SearchProvider searchConfig={AppConfig.search as any}>
            {props.children}
          </SearchProvider>
          <Analytics />
          <PwaRegistration />
          <CookieConsent />
          <WelcomeModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
