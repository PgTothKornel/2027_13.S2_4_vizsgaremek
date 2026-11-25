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
A felület adatbázisból tölti a recepteket, a kamrát és a profilt. A build nem kérdez le adatbázist; futáskor szükséges a kapcsolat.

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

## Adatbázis és tesztfiók

A second_chef könyvtárban másold a .env.example fájlt .env.local néven, és állítsd be:

- DATABASE_URL: PostgreSQL-kapcsolat a futó alkalmazásnak.
- DIRECT_URL: közvetlen kapcsolat a külön adatbázis-frissítő parancsnak (opcionális).
- TEST_USER_ID=1: egy létező tesztfiók azonosítója. A kliens nem választhat másik fiókot.

A jelenlegi adatbázist a dokumentacio/database/sqlDump.sql alapján hozták létre. A régi Prisma-migráció ettől eltérő User táblát ír le. Ezen az adatbázison ne futtass resetet vagy a régi migrációs láncot. Az új opcionális mezők adatvesztés nélküli hozzáadása, majd a kliens frissítése:

```sh
node scripts/apply-recommendation-migration.cjs
npx prisma generate
npm run build
npm start
```

A frissítő tranzakcióban csak a fiok.makrocelok és huto.mennyiseg/egyseg/kategoria mezőket adja hozzá. Ismét futtatható; részben eltérő séma esetén megáll. A Prisma migrációs előzményének későbbi rendezéséhez külön baseline szükséges. Az automatikus build nem módosít adatbázist.

Minden látogató a beállított közös tesztfiók kamráját és profilját szerkeszti; ezt a felület is jelzi. Ez a mód belső bemutatóhoz készült. Nyilvános többfelhasználós használathoz a TEST_USER_ID helyett hitelesített munkamenetből kell venni az azonosítót.

## Ajánlás és mentés

A GET /api/chef a functions.ts personalizedFoods függvényén át tölti az adatokat. Előbb kizárja a fiók allergénjeivel összekapcsolt hozzávalókat tartalmazó recepteket. Ezután a kamrában meglévő hozzávalók aránya, az egyező hozzávalók száma, a kedvelt kategória és a makrócélokhoz való közelség alapján rendez, végül receptazonosítóval dönt azonos pontszámnál.

Legfeljebb öt, legalább egy kamra-alapanyagot és a kedvelt kategóriát egyeztető recept kerül az első részbe. Kategória megadása nélkül bármelyik kategória megfelel. Az összes többi megengedett recept az „Ezek is tetszhetnek” részben látszik, ismétlődés nélkül. Üres kamra, nulla egyezés, illetve keresés/szűrés miatti üres rész külön üzenetet kap. Nulla készlet nem számít meglévő alapanyagnak.

A PATCH /api/chef/profile menti a kategóriát, allergéneket és makrócélokat. A POST /api/chef/pantry hozzáadja vagy frissíti a kiválasztott alapanyagot; a DELETE ugyanitt eltávolítja. Sikeres mentés után frissül az ajánlás. Azonos alapanyag újabb mentése felülírja annak mennyiségét. A profil étrendválasztója helyett az adatbázis valódi receptkategóriái szerepelnek; a húsmentes szűrőhöz jelenleg nincs megbízható étrendi besorolás.

A recept-alapanyag összekötő tábla nem tartalmaz szükséges mennyiséget vagy egységet, ezért ezeknél „Nincs megadva” jelenik meg. Az alapanyag-egyezés a jelenlétet jelzi, nem a megfelelő mennyiséget. Az elkészítési lépések és a tápértékek a recept JSON mezőiből jönnek; hiányzó tápértékből nem lesz kitalált nulla. Hiányzó képnél helyettesítő grafika jelenik meg.

A kedvencek és a bevásárlólista továbbra is böngészőben tárolódnak. A kedvencek nézete is tiszteletben tartja a profil allergénkizárásait.

## Ellenőrzés

```sh
node --import tsx --test tests/recommendations.test.ts
npx tsc --noEmit
npm run build
```

A futó helyi szerver és a tesztadatbázis teljes bekötési ellenőrzése: node scripts/check-chef-integration.cjs. A parancs átmenetileg módosítja a tesztprofilt és egy kamratételt, majd finally ágban visszaállítja az eredeti adatokat. Helyi, más által épp nem szerkesztett tesztfiókon futtasd.

A Route Handlerek működése: https://nextjs.org/docs/app/getting-started/route-handlers


## Képek külső tárhelyről

A receptek `kep.fo_kep` mezőjében teljes HTTPS-képlink tárolható. A szerver ezt
közvetlenül továbbadja a felületnek; nincs szükség képfájlokra a `public` mappában.
A korábbi `/img/receptek/...` hivatkozásokat az alkalmazás a
`public/photo-credits.json` fotókatalógus alapján működő külső URL-ekre fordítja.
Az új seed már a teljes URL-eket tartalmazza. A meglévő adatbázis régi útvonalait
opcionálisan a `scripts/use-photo-urls.sql` frissíti; a már beállított egyedi URL-eket megőrzi.

Saját felhős tárhelyre váltáskor a `kep.fo_kep` mezőbe az adott kép új HTTPS URL-jét írd.
Ha a régi mappaszerkezetet tartod meg, a `RECIPE_IMAGE_BASE_URL` környezeti változóba
megadhatod a tárhely közös HTTPS-prefixét. Például `https://cdn.sajat-domain.hu/kepek`
esetén a `/img/receptek/gulyasleves.jpg` útvonal a
`https://cdn.sajat-domain.hu/kepek/img/receptek/gulyasleves.jpg` URL-ről töltődik.
A teljes adatbázisbeli HTTPS URL elsőbbséget élvez a közös prefixszel szemben.
A tárhelynek a képeket a böngészők számára elérhetővé kell tennie.

Ha a felület HTML-választ jelez az `/api/chef` helyén, ellenőrizd a futó Next.js-verziót
és a projektkönyvtárat. A statikus `dist` változat nem szolgál ki adatbázisos API-t.
A `503 application/json` válasz már működő API-útvonalat jelent, de hiányzó vagy
hibás adatbázis-/tesztfiók-beállítást jelezhet; ezt a `npm run check:deployment` vizsgálja.

