import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/server/middleware/security';
import { getServiceReadiness } from '@/server/config/env';
import { listAllCategoriesAdmin } from '@/server/repositories/categories.repo';
import { listAllSourcesAdmin } from '@/server/repositories/sources.repo';
import { AdminProductFormView } from '@/features/admin/AdminProductFormView';

export const dynamic = 'force-dynamic';

export default async function AdminNewProductPage() {
  const session = await getServerSession();
  if (!session || session.role !== 'admin') {
    redirect('/login?next=/admin');
  }
  const readiness = getServiceReadiness();
  const [categories, sources] = await Promise.all([
    listAllCategoriesAdmin(),
    listAllSourcesAdmin(),
  ]);

  return (
    <AdminProductFormView
      categories={categories}
      sources={sources}
      cloudinaryReady={readiness.cloudinaryConfigured}
    />
  );
}
