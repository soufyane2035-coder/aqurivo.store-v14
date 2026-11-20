import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from '@/server/middleware/security';
import {
  getArticleByIdAdmin,
  listAllArticlesAdmin,
} from '@/server/repositories/articles.repo';
import { listAllCategoriesAdmin } from '@/server/repositories/categories.repo';
import { listAllProductsAdmin } from '@/server/repositories/products.repo';
import { AdminArticleFormView } from '@/features/admin/AdminArticleFormView';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditArticlePage({ params }: PageProps) {
  const session = await getServerSession();
  if (!session || session.role !== 'admin') {
    redirect('/login?next=/admin');
  }
  const { id } = await params;
  const [article, categories, products, allArticles] = await Promise.all([
    getArticleByIdAdmin(id),
    listAllCategoriesAdmin(),
    listAllProductsAdmin(),
    listAllArticlesAdmin(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <AdminArticleFormView
      existingArticle={article}
      categories={categories}
      products={products}
      allArticles={allArticles}
    />
  );
}
