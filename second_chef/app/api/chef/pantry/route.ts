import { z } from 'zod';
import { apiError, InputError, json, readBody } from '@/app/lib/chef-api';

export const runtime = 'nodejs';
const idSchema = z.object({ ingredientId: z.number().int().positive() }).strict();
const pantrySchema = idSchema.extend({
  qty: z.number().finite().min(0).max(1000000).nullable(),
  unit: z.enum(['db', 'g', 'kg', 'ml', 'csomag']),
  category: z.enum(['Zöldség és gyümölcs', 'Hűtő', 'Szárazáru', 'Fűszerek']),
}).strict();

export async function POST(request: Request) {
  try {
    const item = await readBody(request, pantrySchema);
    const { prisma } = await import('@/app/lib/prisma');
    const { testUserId } = await import('@/app/lib/chef-service');
    const profil_id = testUserId();
    if (!await prisma.alapanyag.findUnique({ where: { id: item.ingredientId }, select: { id: true } }))
      throw new InputError('Válassz alapanyagot a listából.');
    const data = { mennyiseg: item.qty, egyseg: item.unit, kategoria: item.category };
    await prisma.huto.upsert({
      where: { profil_id_alapanyag_id: { profil_id, alapanyag_id: item.ingredientId } },
      create: { profil_id, alapanyag_id: item.ingredientId, ...data }, update: data,
    });
    return json({ ok: true });
  } catch (error) { return apiError(error); }
}

export async function DELETE(request: Request) {
  try {
    const { ingredientId } = await readBody(request, idSchema);
    const { prisma } = await import('@/app/lib/prisma');
    const { testUserId } = await import('@/app/lib/chef-service');
    await prisma.huto.deleteMany({ where: { profil_id: testUserId(), alapanyag_id: ingredientId } });
    return json({ ok: true });
  } catch (error) { return apiError(error); }
}
