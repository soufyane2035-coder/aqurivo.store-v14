import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/server/middleware/security';
import { listAllSourcesAdmin } from '@/server/repositories/sources.repo';
import { AdminSourcesView } from '@/features/admin/AdminSourcesView';

export const dynamic = 'force-dynamic';

export default async function AdminSourcesPage() {
  const session = await getServerSession();
  if (!session || session.role !== 'admin') {
    redirect('/login?next=/admin');
  }
  const sources = await listAllSourcesAdmin();
  return <AdminSourcesView initialSources={sources} />;
}
