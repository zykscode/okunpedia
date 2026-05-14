import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Okunpedia Authentication',
  description: 'Access the authorized portal to manage archival heritage documents.',
};

export default function SignInPage() {
  return <SignIn path="/sign-in" />;
}
