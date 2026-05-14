import { ClerkProvider } from '@clerk/nextjs';
import { ClerkLocalizations } from '@/utils/AppConfig';

export default function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        cssLayerName: 'clerk', // Ensure Clerk is compatible with Tailwind CSS v4
      }}
      localization={ClerkLocalizations.defaultLocale}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      afterSignOutUrl="/"
    >
      {props.children}
    </ClerkProvider>
  );
}
