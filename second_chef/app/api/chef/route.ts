import { apiError, json } from '@/app/lib/chef-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { personalizedFoods } = await import('@/app/lib/functions');
    const { testUserId } = await import('@/app/lib/chef-service');
    return json(await personalizedFoods(testUserId()));
  } catch (error) { return apiError(error); }
}
