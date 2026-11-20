import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from '@/server/middleware/security';
import { getServiceReadiness } from '@/server/config/env';
import { getProductByIdAdmin } from '@/server/repositories/products.repo';
import { listAllCategoriesAdmin } from '@/server/repositories/categories.repo';
import { listAllSourcesAdmin } from '@/server/repositories/sources.repo';
import { AdminProductFormView } from '@/features/admin/AdminProductFormView';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProductPage({ params }: PageProps) {
  const session = await getServerSession();
  if (!session || session.role !== 'admin') {
    redirect('/login?next=/admin');
  }
  const { id } = await params;
  const readiness = getServiceReadiness();
  const [product, categories, sources] = await Promise.all([
    getProductByIdAdmin(id),
    listAllCategoriesAdmin(),
    listAllSourcesAdmin(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <AdminProductFormView
      existingProduct={product}
      categories={categories}
      sources={sources}
      cloudinaryReady={readiness.cloudinaryConfigured}
    />
  );
}
