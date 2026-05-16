import { BottomNav } from '@/components/layout/bottom-nav';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

/**
 * Global layout template wrapping page structures with header, footer, and mobile nav.
 */
export const MainTemplate = (props: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main
        id="main-content"
        className="min-h-screen flex-1 pb-24 md:pb-0"
        tabIndex={-1}
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {props.children}
        </div>
      </main>
      <BottomNav />
      <Footer />
    </>
  );
};