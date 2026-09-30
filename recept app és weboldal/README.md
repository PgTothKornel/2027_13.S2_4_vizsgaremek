# Second Chef webalkalmazás

Reszponzív, animált magyar nyelvű recept- és kamratervező webalkalmazás.

## Helyi indítás

```powershell
python -m http.server 4173 --directory dist
```

Ezután nyisd meg: `http://127.0.0.1:4173/`

## Elkészült funkciók

- animált, scroll-alapú bemutatkozó oldal;
- receptfelfedezés és szűrés;
- recept részletek, adagszám-skálázás és hiányzó tételek hozzáadása;
- kamra keresése és bővítése;
- kedvencek és bevásárlólista;
- étrendi, allergén- és makróbeállítások;
- böngészőben tartósított demóadatok (`localStorage`);
- reszponzív mobil és asztali felület, csökkentett mozgás támogatása.

## Demó korlátai

Ez a verzió kliensoldali termékprototípus. Nincs még valódi fiók, szerveroldali adatbázis, fotófelismerő szolgáltatás vagy üzleti áradat. A recept- és tápértékadatok demonstrációs célúak.
