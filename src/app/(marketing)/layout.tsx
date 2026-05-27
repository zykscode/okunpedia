import { MainTemplate } from '@/templates/MainTemplate';

// oxlint-disable jsdoc/require-returns
/**
 * Marketing segment layout wrapping all public-facing pages.
 */
export default function Layout(props: { children: React.ReactNode }) {
  return <MainTemplate>{props.children}</MainTemplate>;
}
