import { Article } from '@/lib/api/articles';

interface ArticleContentProps {
  article: Article;
}

export function ArticleContent({ article }: ArticleContentProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <div 
        dangerouslySetInnerHTML={{ __html: article.content }}
        className="space-y-6"
      />
    </div>
  );
}