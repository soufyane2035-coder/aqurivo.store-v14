import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminApi, verifyCsrfRequest } from '@/server/middleware/security';
import {
  type CanopyRotationStrategy,
  addCanopyKeysAdmin,
  checkAllCanopyKeysAdmin,
  checkSingleCanopyKeyAdmin,
  deleteCanopyKeyAdmin,
  getCanopyConfig,
  redactCanopyConfigForClient,
  redactCanopyKeyForClient,
  toggleCanopyKeyAdmin,
  updateCanopyStrategyAdmin,
} from '@/server/services/canopy.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const guard = await requireAdminApi();
  if (!guard.authorized) return guard.response;

  try {
    const config = await getCanopyConfig();
    return NextResponse.json({ config: redactCanopyConfigForClient(config) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'تعذر تحميل إعدادات مفاتيح Canopy API.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdminApi();
  if (!guard.authorized) return guard.response;

  const csrfValid = await verifyCsrfRequest(req);
  if (!csrfValid) {
    return NextResponse.json({ error: 'Invalid security token.' }, { status: 403 });
  }

  try {
    const body = (await req.json()) as {
      action?:
        | 'add'
        | 'delete'
        | 'toggle'
        | 'check_one'
        | 'check_all'
        | 'update_strategy';
      rawKeysInput?: string;
      customLabel?: string;
      keyId?: string;
      enabled?: boolean;
      rotationStrategy?: CanopyRotationStrategy;
      activeKeyId?: string;
    };

    const action = body.action;

    if (action === 'add') {
      const result = await addCanopyKeysAdmin({
        rawKeysInput: String(body.rawKeysInput || ''),
        customLabel: body.customLabel ? String(body.customLabel) : undefined,
      });
      revalidatePath('/admin/settings');
      return NextResponse.json({
        config: redactCanopyConfigForClient(result.config),
        addedCount: result.addedCount,
        skippedDuplicates: result.skippedDuplicates,
      });
    }

    if (action === 'delete') {
      if (!body.keyId) {
        return NextResponse.json({ error: 'معرف المفتاح مطلوب للحذف.' }, { status: 400 });
      }
      const config = await deleteCanopyKeyAdmin(String(body.keyId));
      revalidatePath('/admin/settings');
      return NextResponse.json({ config: redactCanopyConfigForClient(config) });
    }

    if (action === 'toggle') {
      if (!body.keyId) {
        return NextResponse.json({ error: 'معرف المفتاح مطلوب.' }, { status: 400 });
      }
      const config = await toggleCanopyKeyAdmin(String(body.keyId), Boolean(body.enabled));
      revalidatePath('/admin/settings');
      return NextResponse.json({ config: redactCanopyConfigForClient(config) });
    }

    if (action === 'check_one') {
      if (!body.keyId) {
        return NextResponse.json({ error: 'معرف المفتاح مطلوب للفحص.' }, { status: 400 });
      }
      const result = await checkSingleCanopyKeyAdmin(String(body.keyId));
      revalidatePath('/admin/settings');
      return NextResponse.json({
        config: redactCanopyConfigForClient(result.config),
        checkedKey: redactCanopyKeyForClient(result.checkedKey),
        ok: result.ok,
        messageAr: result.messageAr,
      });
    }

    if (action === 'check_all') {
      const result = await checkAllCanopyKeysAdmin();
      revalidatePath('/admin/settings');
      return NextResponse.json({
        config: redactCanopyConfigForClient(result.config),
        activeCount: result.activeCount,
        exhaustedCount: result.exhaustedCount,
        invalidCount: result.invalidCount,
      });
    }

    if (action === 'update_strategy') {
      const config = await updateCanopyStrategyAdmin({
        rotationStrategy: body.rotationStrategy,
        activeKeyId: body.activeKeyId,
      });
      revalidatePath('/admin/settings');
      return NextResponse.json({ config: redactCanopyConfigForClient(config) });
    }

    return NextResponse.json({ error: 'عملية غير معروفة.' }, { status: 400 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء إدارة مفاتيح Canopy API.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
