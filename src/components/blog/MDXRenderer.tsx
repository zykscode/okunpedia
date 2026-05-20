'use client';

import { useMDXComponent } from 'next-contentlayer2/hooks';
import { mdxComponents } from '@/components/blog/MDXComponents';

export function MDXRenderer({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return <Component components={mdxComponents} />;
}
