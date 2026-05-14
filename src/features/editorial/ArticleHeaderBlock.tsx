import { Badge } from '@/components/ui/Badge';

export interface ArticleHeaderBlockProps {
  article: {
    title: string;
    category: string;
    publishedAt?: Date | null;
    authorName?: string;
    readingTime?: string;
  };
}

export const ArticleHeaderBlock = (props: ArticleHeaderBlockProps) => {
  const data = props.article;

  return (
    <header className="border-b border-gray-100 pb-8 text-left dark:border-gray-800">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="blue">{data.category}</Badge>
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500">•</span>
        <span className="text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400">
          {data.readingTime || '6 min read'}
        </span>
      </div>

      <h1 className="mt-4 font-serif text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
        {data.title}
      </h1>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block size-6 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-center font-bold text-white text-[10px] leading-6">
            {data.authorName ? data.authorName.charAt(0) : 'E'}
          </span>
          <span>By {data.authorName || 'Archival Editor Desk'}</span>
        </div>

        <time dateTime={data.publishedAt?.toISOString()}>
          {data.publishedAt
            ? data.publishedAt.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            : 'Recently Indexed'}
        </time>
      </div>
    </header>
  );
};
