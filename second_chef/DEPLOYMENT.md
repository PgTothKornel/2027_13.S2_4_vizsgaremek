# Second Chef indítása és közzététele

## Telepítés és éles indítás

A repository gyökerében:

```sh
npm --prefix second_chef ci
npm run build
npm start
```

A `second_chef` könyvtárból ugyanez: `npm ci`, `npm run build`, `npm start`.
A build automatikusan generálja a Prisma-klienst, és a TypeScript-hibák ellenőrzése is bekapcsolva marad.
A jelenlegi, bemutatóadatokat használó felület fordításához nem szükséges adatbázis-kapcsolat.

## Elérés másik eszközről

A szerver minden hálózati interfészen figyel (`0.0.0.0`), alapértelmezés szerint a 3000-es porton.
Ugyanazon hálózat másik eszközén a szervergép IPv4-címét kell megnyitni, például `http://192.168.1.20:3000`.
A `localhost` mindig azt az eszközt jelenti, amelyen a böngésző fut.
A szervergépnek és a kiszolgálónak futnia kell, és a hálózatnak/tűzfalnak engednie kell a kapcsolatot.

Másik port a `second_chef` könyvtárból:

```sh
npm start -- --port 3100
```

## Nyilvános webcím

A hálózati IP-cím nem nyilvános internetes tárhely. Nyilvános eléréshez a projektet Next.js/Node.js futtatását támogató tárhelyre kell telepíteni.

A tárhely beállításai:

- Projektkönyvtár / Root Directory: `second_chef`
- Telepítés: `npm ci`
- Build: `npm run build`
- Indítás saját Node.js szerveren: `npm start`
- Node.js: 24 LTS
- A tárhely által megadott `PORT` környezeti változót a Next.js induláskor használja.

A domain és a HTTPS a kiválasztott tárhelyen állítható be. A `page.tsx` fájlt nem lehet önmagában HTML-fájlként feltölteni vagy dupla kattintással futtatni.

Az adatbázisos funkciók későbbi bekötéséhez a tárhelyen `DATABASE_URL` szükséges; külön migrációs kapcsolat esetén `DIRECT_URL` is megadható. A build nem futtat migrációt és nem ír adatbázisba. Bejelentkezés bekötésekor az `AUTH_URL` az éles HTTPS-címhez igazítandó.

A receptek továbbra is bemutatóadatok. A kamra, kedvencek és bevásárlólista böngészőnként, webcímenként tárolódnak; nincs eszközök közötti szinkronizálás.

Prisma-konfiguráció: https://docs.prisma.io/docs/orm/reference/prisma-config-reference
