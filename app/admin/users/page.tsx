import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/server/middleware/security';
import { listUsersAdmin } from '@/server/repositories/users.repo';
import { AdminUsersView } from '@/features/admin/AdminUsersView';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const session = await getServerSession();
  if (!session || session.role !== 'admin') {
    redirect('/login?next=/admin');
  }

  const users = await listUsersAdmin();
  return <AdminUsersView users={users} />;
}
