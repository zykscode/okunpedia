import Image from 'next/image';
import logo from '../../../public/logo.png';

/**
 * Brand logo mark used in header and navigation contexts.
 * @returns Optimised Next.js Image with LCP priority.
 */
export function PageLogo() {
  return (
    <div className="size-8 md:size-9">
      <Image
        alt="Okunpedia logo"
        src={logo}
        className="inline rounded-full"
        priority
        sizes="36px"
      />
    </div>
  );
}
