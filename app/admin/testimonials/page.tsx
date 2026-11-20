import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/server/middleware/security';
import { listAllTestimonialsAdminServer } from '@/server/repositories/testimonials.repo';
import { AdminTestimonialsView } from '@/features/admin/AdminTestimonialsView';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const session = await getServerSession();
  if (!session || session.role !== 'admin') {
    redirect('/login?next=/admin');
  }
  const testimonials = await listAllTestimonialsAdminServer();
  return <AdminTestimonialsView initialTestimonials={testimonials} />;
}
