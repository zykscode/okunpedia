import { Link } from '@/libs/I18nNavigation';
import { slug } from 'github-slugger';
import { Badge } from '@/components/ui/Badge';

interface Props {
  text: string;
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/blog/category/${slug(text)}`}
      className="mr-3 focus:outline-hidden"
    >
      <Badge variant="amber" className="hover:bg-amber-600 hover:text-white transition-colors duration-300">
        {text}
      </Badge>
    </Link>
  );
};

export default Tag;
