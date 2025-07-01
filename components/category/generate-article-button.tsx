
'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface GenerateCategoryArticleButtonProps {
  category: string;
}

export function GenerateCategoryArticleButton({ category }: GenerateCategoryArticleButtonProps) {
  const handleGenerate = async () => {
    try {
      const response = await fetch('/api/articles/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }),
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error generating article:', error);
    }
  };

  return (
    <Button onClick={handleGenerate} variant="outline">
      <Plus className="h-4 w-4 mr-2" />
      Generate New Article
    </Button>
  );
}
