import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/server/middleware/security';
import { listAllProductsAdmin } from '@/server/repositories/products.repo';
import { listAllSourcesAdmin } from '@/server/repositories/sources.repo';
import {
  computeProductWarningMap,
  listReportsAdmin,
} from '@/server/repositories/reports.repo';
import { AdminProductsListView } from '@/features/admin/AdminProductsListView';
import { paginateByCursor, sortByCursor } from '@/lib/listPagination';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const session = await getServerSession();
  if (!session || session.role !== 'admin') {
    redirect('/login?next=/admin');
  }
  const [products, sources, reports] = await Promise.all([
    listAllProductsAdmin(),
    listAllSourcesAdmin(),
    listReportsAdmin(),
  ]);

  const warningMap = computeProductWarningMap(reports);
  const orderedProducts = sortByCursor(products, (a, b) =>
    String(b.updatedAt || b.createdAt || '').localeCompare(
      String(a.updatedAt || a.createdAt || '')
    )
  );
  const firstPage = paginateByCursor(orderedProducts, null, 30);

  return (
    <AdminProductsListView
      initialProducts={firstPage.items}
      initialTotal={firstPage.total}
      initialHasMore={firstPage.hasMore}
      initialNextCursor={firstPage.nextCursor}
      sources={sources}
      productWarnings={warningMap}
    />
  );
}
