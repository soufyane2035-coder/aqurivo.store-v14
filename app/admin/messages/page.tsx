import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/server/middleware/security';
import { listMessagesAdmin } from '@/server/repositories/messages.repo';
import { AdminMessagesView } from '@/features/admin/AdminMessagesView';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const session = await getServerSession();
  if (!session || session.role !== 'admin') {
    redirect('/login?next=/admin');
  }
  const messages = await listMessagesAdmin();
  return <AdminMessagesView initialMessages={messages} />;
}
