import { marked } from 'marked';

export type MarkdownProps = {
  content: string;
  className?: string;
};

/**
 * Renders markdown text safely to HTML with Tailwind CSS Typography styles.
 * @param props Props containing the raw markdown content and styling classNames.
 * @returns React node representing the formatted Markdown wrapper.
 */
export function Markdown(props: MarkdownProps) {
  // Sync markdown parsing using GFM rules
  const html = marked.parse(props.content, { gfm: true, breaks: true }) as string;

  return (
    <div
      className={[
        'prose prose-emerald dark:prose-invert max-w-none text-[15px] leading-relaxed text-gray-700 dark:text-gray-300',
        'prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white',
        'prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4',
        'prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3',
        'prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-2',
        'prose-a:text-emerald-700 dark:prose-a:text-emerald-400 prose-a:underline hover:text-emerald-600 dark:hover:text-emerald-300',
        'prose-strong:font-bold prose-strong:text-gray-900 dark:prose-strong:text-white',
        'prose-ul:list-disc prose-ul:pl-5 prose-ul:my-4',
        'prose-ol:list-decimal prose-ol:pl-5 prose-ol:my-4',
        'prose-li:my-1',
        props.className || '',
      ].join(' ')}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
