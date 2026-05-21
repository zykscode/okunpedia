import { SessionProvider } from 'next-auth/react';

export default function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {props.children}
    </SessionProvider>
  );
}

