import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Link } from '@/libs/I18nNavigation';
import { AppConfig } from '@/utils/AppConfig';

export const BaseTemplate = (props: {
  leftNav: React.ReactNode;
  rightNav?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-800 antialiased transition-colors duration-300 selection:bg-amber-100 selection:text-amber-900 dark:bg-gray-950 dark:text-gray-100 dark:selection:bg-amber-900/40 dark:selection:text-amber-200">
      {/* Sticky Full-Width Glassmorphic Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 backdrop-blur-md transition-all dark:border-gray-800/80 dark:bg-gray-950/85">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          
          {/* Left Wing: Brand Logo & Navigation Links */}
          <div className="flex items-center gap-x-6">
            <Link href="/" className="group flex items-center gap-2.5 focus:outline-hidden">
              <div className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-emerald-600 to-amber-600 text-white shadow-md shadow-emerald-600/20 transition-transform duration-300 group-hover:scale-105 dark:shadow-emerald-950/50">
                <span className="font-serif text-lg font-bold">O</span>
              </div>
              <div>
                <span className="bg-linear-to-r from-emerald-950 to-amber-900 bg-clip-text font-serif text-lg font-bold tracking-tight text-transparent transition-colors dark:from-emerald-400 dark:to-amber-400 sm:text-xl">
                  {AppConfig.name}
                </span>
                <span className="hidden text-[10px] font-semibold tracking-widest text-amber-700 uppercase dark:text-amber-500 sm:block">
                  Cultural Atlas
                </span>
              </div>
            </Link>

            <nav aria-label="Main Navigation" className="hidden md:flex items-center">
              <ul className="flex items-center gap-x-1 sm:gap-x-2 [&_a]:rounded-lg [&_a]:px-3 [&_a]:py-2 [&_a]:text-xs [&_a]:font-medium [&_a]:tracking-wide [&_a]:text-gray-600 [&_a]:transition-colors sm:[&_a]:text-sm [&_a:hover]:bg-gray-100/80 [&_a:hover]:text-gray-950 dark:[&_a]:text-gray-300 dark:[&_a:hover]:bg-gray-900/80 dark:[&_a:hover]:text-white">
                {props.leftNav}
              </ul>
            </nav>
          </div>

          {/* Right Action / Auth Items with Integrated Theme Switcher */}
          <div className="flex items-center gap-x-3">
            {/* Mobile nav visibility fallback wrapper */}
            <nav aria-label="Mobile Navigation" className="flex md:hidden items-center">
              <ul className="flex items-center gap-x-1 [&_a]:rounded-lg [&_a]:px-2 [&_a]:py-1.5 [&_a]:text-xs [&_a]:font-medium [&_a]:text-gray-600 [&_a:hover]:bg-gray-100/80 dark:[&_a]:text-gray-300 dark:[&_a:hover]:bg-gray-900/80">
                {props.leftNav}
              </ul>
            </nav>

            <ThemeToggle />

            <nav className="flex items-center">
              <ul className="flex items-center gap-x-2 [&_a]:rounded-lg [&_a]:px-3 [&_a]:py-1.5 [&_a]:text-xs [&_a]:font-medium [&_a]:text-gray-600 sm:[&_a]:text-sm [&_a:hover]:bg-gray-100/80 dark:[&_a]:text-gray-300 dark:[&_a:hover]:bg-gray-900/80">
                {props.rightNav}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{props.children}</main>

      {/* Premium Deep Footer */}
      <footer className="mt-16 border-t border-gray-200/80 bg-white py-12 text-center text-xs text-gray-500 transition-colors dark:border-gray-800/80 dark:bg-gray-950 dark:text-gray-400 sm:text-sm">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-4 flex justify-center gap-2">
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/10 ring-inset dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-500/20">
              Tribal Wikipedia
            </span>
            <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-600/10 ring-inset dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-500/20">
              Geospatial Atlas
            </span>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-600/10 ring-inset dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-500/20">
              Civic Archiving
            </span>
          </div>
          <p className="font-medium text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} {AppConfig.name} - Built by the{' '}
            <span className="font-bold text-emerald-700 dark:text-emerald-400">Okun Civic Tech Initiative</span>
          </p>
          <p className="mt-2 text-gray-400 dark:text-gray-500">
            Documenting the oral histories, traditional lineages, and developmental metrics of the
            Okun people.
          </p>
        </div>
      </footer>
    </div>
  );
};
