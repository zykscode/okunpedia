import { SignUp } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Okunpedia Authentication',
  description: 'Register as an authenticated contributor to submit and document municipal archives.',
};

export default function SignUpPage() {
  return <SignUp path="/sign-up" />;
}
