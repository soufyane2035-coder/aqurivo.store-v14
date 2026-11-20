import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/server/middleware/security';
import { listReportsAdmin } from '@/server/repositories/reports.repo';
import { AdminReportsView } from '@/features/admin/AdminReportsView';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  const session = await getServerSession();
  if (!session || session.role !== 'admin') {
    redirect('/login?next=/admin');
  }
  const reports = await listReportsAdmin();
  return <AdminReportsView initialReports={reports} />;
}
