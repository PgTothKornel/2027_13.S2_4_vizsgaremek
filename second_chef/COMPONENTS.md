# Second Chef komponensek

Az `app/page.tsx` szerverkomponens állítja össze a teljes felületet. A `layout.tsx` tartalmazza a globális stílusokat, a magyar nyelv beállítását és a metaadatokat.

- `app/components/home/`: a kezdőlap önálló szakaszai és lábléce.
- `app/components/navigation/`: fejléc, kereső, mobilmenü és alkalmazásnavigáció.
- `app/components/recipes/`: közös receptkártya, felfedezés, kedvencek és receptablak.
- `app/components/pantry/`, `shopping/`, `profile/`: az alkalmazás további nézetei.
- `SecondChefProvider.tsx`: közös React-állapot, hash-alapú nézetváltás, böngészős tárolás és értesítések.
- `PageView.tsx`: a nézetek közös kerete; `Modal.tsx`: újrahasználható natív párbeszédablak.
- `PageMotion.tsx`: megjelenési és görgetési animációk, eseménykezelők takarításával.
- `app/lib/demo-data.ts`: típusozott bemutatóadatok; `public/assets/`: a weboldal képei.
- `app/ui/second-chef.css`: a meglévő weboldal reszponzív megjelenése.

A meglévő `#home`, `#discover`, `#pantry`, `#favorites`, `#shopping` és `#profile` hivatkozások megmaradtak. Az interaktív komponensek `use client` jelölést kapnak; a statikus kezdőlapi szakaszokat a szerver állítja elő.

A receptek, kamra-egyezések és hozzávaló-elérhetőségek továbbra is a korábbi bemutatóadatok. A profilbeállítások mentése helyi; valódi személyre szabás és adatbázis-integráció még nincs bekötve. A kedvencek, kamra és bevásárlólista a korábbi `secondchef-*` böngészős tárkulcsokat használják.

Indítás a `second_chef` könyvtárból: `npm run dev`. Éles build: `npm run build`.

## Ellenőrzés

A komponensek, a `page.tsx` és a `layout.tsx` TypeScript-ellenőrzése sikeres. Böngészőben ellenőrizve: nézetváltás, receptszűrés és keresés, kedvencmentés, receptablak, adagszám, hiányzók hozzáadása a listához, kamratétel hozzáadása/törlése és újratöltés utáni megőrzése.

Az `npm run build` sikeresen lefordítja a felületet, majd a meglévő adatbázisos fájlok típusellenőrzésén megáll:

- `app/lib/prisma.ts`: hiányzik az `app/generated/prisma/client.ts` generált kliens.
- `prisma.config.ts` és `prisma7.config.ts`: az opcionális környezeti változóból származó adatbázis-URL típusa nem felel meg a telepített Prisma konfiguráció típusának.

A build nem hagyja figyelmen kívül ezeket a hibákat; az adatbázis beállítása külön javítást igényel. A helyi függőségek a meglévő `package.json` alapján telepítve lettek, a csomaglista és a lockfájlok módosítása nélkül. A PostCSS konfiguráció CommonJS-exportot használ, hogy a Next.js helyesen beolvassa.
