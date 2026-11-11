import { z } from 'zod';
import { apiError, InputError, json, readBody } from '@/app/lib/chef-api';

export const runtime = 'nodejs';
const profileSchema = z.object({
  preference: z.string().max(255),
  allergyIds: z.array(z.number().int().positive()).max(100),
  macros: z.tuple([z.number().finite().min(0).max(20000), z.number().finite().min(0).max(2000),
    z.number().finite().min(0).max(2000), z.number().finite().min(0).max(2000)]),
}).strict();

export async function PATCH(request: Request) {
  try {
    const profile = await readBody(request, profileSchema);
    const { prisma } = await import('@/app/lib/prisma');
    const { testUserId } = await import('@/app/lib/chef-service');
    const id = testUserId();
    await prisma.$transaction(async tx => {
      if (profile.preference && !await tx.kategoria.findFirst({ where: { kategoria: profile.preference } }))
        throw new InputError('Ismeretlen receptkategória.');
      const ids = [...new Set(profile.allergyIds)];
      if (await tx.allergenek.count({ where: { id: { in: ids } } }) !== ids.length)
        throw new InputError('Ismeretlen allergén.');
      await tx.fiok.update({ where: { id }, data: { preferencia: profile.preference || null, makrocelok: profile.macros } });
      await tx.allergen_fiok_osszekoto.deleteMany({ where: { fiok_id: id } });
      if (ids.length) await tx.allergen_fiok_osszekoto.createMany({ data: ids.map(allergen_id => ({ fiok_id: id, allergen_id })) });
    });
    return json({ ok: true });
  } catch (error) { return apiError(error); }
}
