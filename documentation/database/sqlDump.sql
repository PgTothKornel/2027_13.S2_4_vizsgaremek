-- Felhasználói profil (bejelentkezési adatok)
CREATE TABLE "profil"(
    "id" INTEGER NOT NULL,                              -- profil azonosítója
    "email" VARCHAR(255) NOT NULL,                      -- felhasználó e-mail címe
    "password" VARCHAR(255) NOT NULL,                   -- jelszó (hash)
    "created" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL   -- regisztráció időpontja
);
ALTER TABLE
    "profil" ADD PRIMARY KEY("id");

-- Alapanyagok (hozzávalók) törzstáblája
CREATE TABLE "alapanyag"(
    "id" INTEGER NOT NULL,                              -- alapanyag azonosítója
    "nev" VARCHAR(255) NOT NULL,                        -- alapanyag neve
    "tapanyag" JSON NOT NULL                            -- tápanyagértékek JSON-ben
);
ALTER TABLE
    "alapanyag" ADD PRIMARY KEY("id");

-- Allergének listája
CREATE TABLE "allergenek"(
    "id" INTEGER NOT NULL,                              -- allergén azonosítója
    "nev" VARCHAR(255) NOT NULL                         -- allergén neve
);
ALTER TABLE
    "allergenek" ADD PRIMARY KEY("id");

-- Összekötő: melyik alapanyag milyen allergént tartalmaz
CREATE TABLE "allergen_alapanyag_osszekoto"(
    "alapanyag_id" INTEGER NOT NULL,                    -- hivatkozás az alapanyagra
    "allergen_id" INTEGER NOT NULL                      -- hivatkozás az allergénre
);

-- Receptek
CREATE TABLE "recept"(
    "id" INTEGER NOT NULL,                              -- recept azonosítója
    "nev" VARCHAR(255) NOT NULL,                        -- recept neve
    "leiras" VARCHAR(255) NOT NULL,                     -- rövid leírás a receptről
    "adag" INTEGER NOT NULL,                            -- hány főre elég a recept
    "ido" INTEGER NOT NULL,                             -- elkészítési idő (perc)
    "kategoria_id" INTEGER NOT NULL,                    -- hivatkozás a kategóriára
    "kep" JSON NULL,                                    -- képek adatai JSON-ben
    "tapanyagok" JSON NULL,                             -- recept összesített tápanyagai
    "lepesek" JSON NULL                                 -- elkészítési lépések JSON-ben
);
ALTER TABLE
    "recept" ADD PRIMARY KEY("id");

-- Összekötő: melyik recept milyen alapanyagokat használ
CREATE TABLE "recept_alapanyag_osszekoto"(
    "alapanyag_id" INTEGER NOT NULL,                    -- hivatkozás az alapanyagra
    "recept_id" INTEGER NOT NULL                        -- hivatkozás a receptre
);

-- Hűtő: a profilhoz tartozó, otthon lévő alapanyagok
CREATE TABLE "huto"(
    "alapanyag_id" INTEGER NOT NULL,                    -- hivatkozás az alapanyagra
    "profil_id" INTEGER NOT NULL                        -- hivatkozás a profilra
);

-- Mértékegységek
CREATE TABLE "mertekegysegek"(
    "id" INTEGER NOT NULL,                              -- mértékegység-csoport azonosítója
    "nev" VARCHAR(255) NOT NULL,                        -- csoport neve (pl. tömeg, térfogat)
    "egysegek" JSON NOT NULL                            -- egységek és átváltásuk JSON-ben
);
ALTER TABLE
    "mertekegysegek" ADD PRIMARY KEY("id");

-- Fiók: egy profilhoz tartozó egyéni beállítások
CREATE TABLE "fiok"(
    "id" INTEGER NOT NULL,                              -- fiók azonosítója
    "etrend" VARCHAR(255) NOT NULL,                     -- választott étrend (pl. vegán)
    "profil_id" INTEGER NOT NULL                        -- hivatkozás a profilra
);
ALTER TABLE
    "fiok" ADD PRIMARY KEY("id");

-- Összekötő: melyik fiók milyen allergénekre érzékeny
CREATE TABLE "allergen_fiok_osszekoto"(
    "fiok_id" INTEGER NOT NULL,                         -- hivatkozás a fiókra
    "allergen_id" INTEGER NOT NULL                      -- hivatkozás az allergénre
);

-- Fiók véleménye egy receptről
CREATE TABLE "velemeny_receptrol"(
    "fiok_id" INTEGER NOT NULL,                         -- ki írta a véleményt (fiók)
    "recept_id" INTEGER NOT NULL,                       -- melyik receptről szól
    "velemeny" VARCHAR(255) NOT NULL                    -- a vélemény szövege
);

-- Fiók véleménye egy alapanyagról
CREATE TABLE "velemeny_alapanyagrol"(
    "fiok_id" INTEGER NOT NULL,                         -- ki írta a véleményt (fiók)
    "alapanyag_id" INTEGER NOT NULL,                    -- melyik alapanyagról szól
    "velemeny" VARCHAR(255) NOT NULL                    -- a vélemény szövege
);

-- Receptkategóriák
CREATE TABLE "Kategoria"(
    "id" INTEGER NOT NULL,                              -- kategória azonosítója
    "kategoria" VARCHAR(255) NOT NULL                   -- kategória neve (pl. leves, desszert)
);
ALTER TABLE
    "Kategoria" ADD PRIMARY KEY("id");

-- Idegen kulcsok
ALTER TABLE
    "allergen_alapanyag_osszekoto" ADD CONSTRAINT "allergen_alapanyag_osszekoto_alapanyag_id_foreign" FOREIGN KEY("alapanyag_id") REFERENCES "alapanyag"("id");
ALTER TABLE
    "recept_alapanyag_osszekoto" ADD CONSTRAINT "recept_alapanyag_osszekoto_recept_id_foreign" FOREIGN KEY("recept_id") REFERENCES "recept"("id");
ALTER TABLE
    "recept" ADD CONSTRAINT "recept_kategoria_id_foreign" FOREIGN KEY("kategoria_id") REFERENCES "Kategoria"("id");
ALTER TABLE
    "allergen_fiok_osszekoto" ADD CONSTRAINT "allergen_fiok_osszekoto_fiok_id_foreign" FOREIGN KEY("fiok_id") REFERENCES "fiok"("id");
ALTER TABLE
    "recept_alapanyag_osszekoto" ADD CONSTRAINT "recept_alapanyag_osszekoto_alapanyag_id_foreign" FOREIGN KEY("alapanyag_id") REFERENCES "alapanyag"("id");
ALTER TABLE
    "huto" ADD CONSTRAINT "huto_alapanyag_id_foreign" FOREIGN KEY("alapanyag_id") REFERENCES "alapanyag"("id");
ALTER TABLE
    "huto" ADD CONSTRAINT "huto_profil_id_foreign" FOREIGN KEY("profil_id") REFERENCES "profil"("id");
ALTER TABLE
    "velemeny_receptrol" ADD CONSTRAINT "velemeny_receptrol_fiok_id_foreign" FOREIGN KEY("fiok_id") REFERENCES "fiok"("id");
ALTER TABLE
    "velemeny_alapanyagrol" ADD CONSTRAINT "velemeny_alapanyagrol_fiok_id_foreign" FOREIGN KEY("fiok_id") REFERENCES "fiok"("id");
ALTER TABLE
    "velemeny_receptrol" ADD CONSTRAINT "velemeny_receptrol_recept_id_foreign" FOREIGN KEY("recept_id") REFERENCES "recept"("id");
ALTER TABLE
    "allergen_alapanyag_osszekoto" ADD CONSTRAINT "allergen_alapanyag_osszekoto_allergen_id_foreign" FOREIGN KEY("allergen_id") REFERENCES "allergenek"("id");
ALTER TABLE
    "allergen_fiok_osszekoto" ADD CONSTRAINT "allergen_fiok_osszekoto_allergen_id_foreign" FOREIGN KEY("allergen_id") REFERENCES "allergenek"("id");
ALTER TABLE
    "fiok" ADD CONSTRAINT "fiok_profil_id_foreign" FOREIGN KEY("profil_id") REFERENCES "profil"("id");
ALTER TABLE
    "velemeny_alapanyagrol" ADD CONSTRAINT "velemeny_alapanyagrol_alapanyag_id_foreign" FOREIGN KEY("alapanyag_id") REFERENCES "alapanyag"("id");