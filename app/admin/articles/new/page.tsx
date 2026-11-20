import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/server/middleware/security';
import { listAllCategoriesAdmin } from '@/server/repositories/categories.repo';
import { listAllProductsAdmin } from '@/server/repositories/products.repo';
import { listAllArticlesAdmin } from '@/server/repositories/articles.repo';
import { AdminArticleFormView } from '@/features/admin/AdminArticleFormView';

export const dynamic = 'force-dynamic';

export default async function AdminNewArticlePage() {
  const session = await getServerSession();
  if (!session || session.role !== 'admin') {
    redirect('/login?next=/admin');
  }
  const [categories, products, allArticles] = await Promise.all([
    listAllCategoriesAdmin(),
    listAllProductsAdmin(),
    listAllArticlesAdmin(),
  ]);

  return (
    <AdminArticleFormView
      categories={categories}
      products={products}
      allArticles={allArticles}
    />
  );
}
