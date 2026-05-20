import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import { Link as CustomLink } from '@/libs/I18nNavigation';

function RoundedImage(props: any) {
  return <Image className="rounded-2xl shadow-sm" {...props} />;
}

function CustomA(props: any) {
  const href = props.href;

  if (href && (href.startsWith('/') || href.startsWith('#'))) {
    return (
      <CustomLink href={href} {...props}>
        {props.children}
      </CustomLink>
    );
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

export const mdxComponents: MDXComponents = {
  Image: RoundedImage,
  img: RoundedImage,
  a: CustomA as any,
};
