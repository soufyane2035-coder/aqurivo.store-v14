import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/server/middleware/security';
import { listAllArticlesAdmin } from '@/server/repositories/articles.repo';
import { AdminArticlesListView } from '@/features/admin/AdminArticlesListView';
import { paginateByCursor, sortByCursor } from '@/lib/listPagination';

export const dynamic = 'force-dynamic';

export default async function AdminArticlesPage() {
  const session = await getServerSession();
  if (!session || session.role !== 'admin') {
    redirect('/login?next=/admin');
  }
  const articles = await listAllArticlesAdmin();
  const sorted = sortByCursor(articles, (a, b) =>
    String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''))
  );
  const page = paginateByCursor(sorted, null, 30);
  return (
    <AdminArticlesListView
      initialArticles={page.items}
      initialTotal={page.total}
      initialHasMore={page.hasMore}
      initialNextCursor={page.nextCursor}
    />
  );
}
