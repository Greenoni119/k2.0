'use client';

import { useRouter } from 'next/navigation';
import CategoryPageContent from './CategoryPage';

export default function CategoryWrapper({ category }: { category: string }) {
  const router = useRouter();

  if (!category || typeof category !== 'string') {
    router.push('/');
    return null;
  }

  return <CategoryPageContent slug={category} />;
}
