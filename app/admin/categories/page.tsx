import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/server/middleware/security';
import { listAllCategoriesAdmin } from '@/server/repositories/categories.repo';
import { AdminCategoriesView } from '@/features/admin/AdminCategoriesView';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const session = await getServerSession();
  if (!session || session.role !== 'admin') {
    redirect('/login?next=/admin');
  }
  const categories = await listAllCategoriesAdmin();
  return <AdminCategoriesView initialCategories={categories} />;
}
