import { BottomNav } from '@/components/layout/bottom-nav';
import { Footer} from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

/**
 * Enhanced global layout template wrapping page structures with localized brand headers.
 * @param props Object properties carrying optional wings and core page hierarchies.
 * @returns {React.ReactNode} Standard layout wrapper viewports.
 */
export const MainTemplate = (props: {

  children: React.ReactNode;
}) => {
  return (
    <> <Header />
      <main id="main-content" className="flex-1 pb-20 md:pb-0" tabIndex={-1}>
        {props.children}
      </main>
      <BottomNav />
      <Footer /></>
  );
};