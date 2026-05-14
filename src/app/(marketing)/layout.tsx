import { Link } from '@/libs/I18nNavigation';
import { BaseTemplate } from '@/templates/BaseTemplate';
import { MainTemplate } from '@/templates/MainTemplate';

/**
 * Encapsulated persistent app router wrapper specifically routing marketing segment layers.
 * @param props Segment runtime object properties routing deep descendant structures.
 * @returns {React.ReactNode} Hydrated layout navigation template wrappers.
 */
export default function Layout(props: { children: React.ReactNode }) {
  return (
    <MainTemplate>
      <>{props.children}</>
    </MainTemplate>
  );
}
