'use client';

import * as React from 'react';

interface ScrollRevealWrapperProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  tagName?: 'div' | 'section';
  mode?: 'self' | 'children';
  threshold?: number;
  immediate?: boolean;
}

export function ScrollRevealWrapper(props: ScrollRevealWrapperProps) {
  const {
    children,
    className,
    tagName = 'div',
    mode = 'children',
    threshold = 0.08,
    immediate = false,
    ...rest
  } = props;

  const ref = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (immediate) {
      const runImmediate = () => {
        if (mode === 'self') {
          el.dataset.visible = 'true';
        } else {
          el.querySelectorAll<HTMLElement>('.animate-on-scroll').forEach((child) => {
            child.dataset.visible = 'true';
          });
        }
      };
      
      const frameId = requestAnimationFrame(() => {
        requestAnimationFrame(runImmediate);
      });
      return () => cancelAnimationFrame(frameId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (mode === 'self') {
            el.dataset.visible = 'true';
          } else {
            el.querySelectorAll<HTMLElement>('.animate-on-scroll').forEach((child) => {
              child.dataset.visible = 'true';
            });
          }
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mode, threshold, immediate]);

  const Tag = tagName;

  return (
    <Tag ref={ref as React.RefObject<any>} className={className} {...rest}>
      {children}
    </Tag>
  );
}
