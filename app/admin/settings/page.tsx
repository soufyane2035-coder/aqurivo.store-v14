import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/server/middleware/security';
import { getSiteSettings } from '@/server/repositories/settings.repo';
import {
  getCanopyConfig,
  redactCanopyConfigForClient,
} from '@/server/services/canopy.service';
import { AdminSettingsView } from '@/features/admin/AdminSettingsView';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const session = await getServerSession();
  if (!session || session.role !== 'admin') {
    redirect('/login?next=/admin');
  }

  const [settings, canopyConfig] = await Promise.all([
    getSiteSettings(),
    getCanopyConfig(),
  ]);
  return (
    <AdminSettingsView
      initialSettings={settings}
      initialCanopyConfig={redactCanopyConfigForClient(canopyConfig)}
    />
  );
}
