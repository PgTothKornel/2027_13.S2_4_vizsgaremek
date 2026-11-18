import express, { type NextFunction, type Request, type Response } from 'express';
import { InputError, invalidDataMessage, readIngredientId, readPantryItem, readProfile } from './chef-input';

const chefApi = express();
chefApi.disable('x-powered-by');

const bodyLimit = 16000;
const largeBodyMessage = 'Túl nagy kérés.';

const parseJson = express.json({
  type: () => true,
  // Az Express bájtban számol, az eddigi korlát a dekódolt szöveg hosszára vonatkozik.
  limit: bodyLimit * 3,
  verify(_request, _response, buffer) {
    if (new TextDecoder().decode(buffer).length > bodyLimit) {
      throw new InputError(largeBodyMessage);
    }
  },
});

chefApi.route('/api/chef')
  .get(getChefData)
  .all(handleOtherMethods('GET, HEAD, OPTIONS'));

chefApi.route('/api/chef/pantry')
  .post(readJson, savePantryItem)
  .delete(readJson, removePantryItem)
  .all(handleOtherMethods('DELETE, OPTIONS, POST'));

chefApi.route('/api/chef/profile')
  .patch(readJson, saveProfile)
  .all(handleOtherMethods('OPTIONS, PATCH'));

chefApi.use(apiError);

function checkOrigin(request: Request) {
  const origin = request.get('origin');
  if (!origin) {
    return;
  }

  const invalidOrigin = 'Érvénytelen kérés eredet.';
  let source: URL;
  try {
    source = new URL(origin);
  } catch {
    throw new InputError(invalidOrigin);
  }

  const isHttp = source.protocol === 'http:' || source.protocol === 'https:';
  if (!isHttp || source.host !== request.get('host')) {
    throw new InputError(invalidOrigin);
  }
}

function readJson(request: Request, response: Response, next: NextFunction) {
  checkOrigin(request);

  parseJson(request, response, (error?: unknown) => {
    if (!error || error instanceof InputError) {
      next(error);
      return;
    }

    if (typeof error === 'object' && 'type' in error && error.type === 'entity.too.large') {
      next(new InputError(largeBodyMessage));
      return;
    }

    next(new InputError(invalidDataMessage));
  });
}

async function getChefData(_request: Request, response: Response) {
  const { personalizedFoods } = await import('./functions');
  const { testUserId } = await import('./chef-service');
  const data = await personalizedFoods(testUserId());

  response.set('Cache-Control', 'no-store').json(data);
}

async function savePantryItem(request: Request, response: Response) {
  const { ingredientId, qty, unit, category } = readPantryItem(request.body);
  const { prisma } = await import('./prisma');
  const { testUserId } = await import('./chef-service');
  const profil_id = testUserId();

  const ingredient = await prisma.alapanyag.findUnique({
    where: { id: ingredientId },
    select: { id: true },
  });
  if (!ingredient) {
    throw new InputError('Válassz alapanyagot a listából.');
  }

  const data = { mennyiseg: qty, egyseg: unit, kategoria: category };
  await prisma.huto.upsert({
    where: { profil_id_alapanyag_id: { profil_id, alapanyag_id: ingredientId } },
    create: { profil_id, alapanyag_id: ingredientId, ...data },
    update: data,
  });

  response.set('Cache-Control', 'no-store').json({ ok: true });
}

async function removePantryItem(request: Request, response: Response) {
  const ingredientId = readIngredientId(request.body);

  const { prisma } = await import('./prisma');
  const { testUserId } = await import('./chef-service');
  await prisma.huto.deleteMany({
    where: { profil_id: testUserId(), alapanyag_id: ingredientId },
  });

  response.set('Cache-Control', 'no-store').json({ ok: true });
}

async function saveProfile(request: Request, response: Response) {
  const { preference, allergyIds, macros } = readProfile(request.body);
  const { prisma } = await import('./prisma');
  const { testUserId } = await import('./chef-service');
  const id = testUserId();
  const ids = [...new Set(allergyIds)];

  await prisma.$transaction(async tx => {
    if (preference) {
      const category = await tx.kategoria.findFirst({ where: { kategoria: preference } });
      if (!category) {
        throw new InputError('Ismeretlen receptkategória.');
      }
    }

    const allergyCount = await tx.allergenek.count({ where: { id: { in: ids } } });
    if (allergyCount !== ids.length) {
      throw new InputError('Ismeretlen allergén.');
    }

    await tx.fiok.update({
      where: { id },
      data: { preferencia: preference || null, makrocelok: macros },
    });
    await tx.allergen_fiok_osszekoto.deleteMany({ where: { fiok_id: id } });
    if (ids.length > 0) {
      await tx.allergen_fiok_osszekoto.createMany({
        data: ids.map(allergen_id => ({ fiok_id: id, allergen_id })),
      });
    }
  });

  response.set('Cache-Control', 'no-store').json({ ok: true });
}

function handleOtherMethods(allow: string) {
  return (request: Request, response: Response) => {
    if (request.method === 'OPTIONS') {
      response.set('Allow', allow).status(204).end();
      return;
    }

    response.status(405).end();
  };
}

function apiError(error: unknown, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof InputError) {
    response.status(400).json({ error: error.message });
    return;
  }

  let code: string | undefined;
  if (error !== null && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
    code = error.code;
  }

  const configurationError = error instanceof Error && /TEST_USER_ID|DATABASE_URL is not defined/.test(error.message);
  const typeError = error instanceof TypeError
    ? error.message.replace(/postgres(?:ql)?:\/\/\S+/g, '[redacted]')
    : undefined;
  console.error('Second Chef request failed', JSON.stringify({
    name: error instanceof Error ? error.name : 'UnknownError',
    code,
    configurationError,
    typeError,
  }));
  response.status(503).json({ error: 'Nem sikerült elérni az adatokat. Próbáld újra később.' });
}

export default chefApi;
