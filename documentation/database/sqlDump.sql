CREATE TABLE "profil"(
    "id" INTEGER NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "profil" ADD PRIMARY KEY("id");
CREATE TABLE "alapanyag"(
    "id" INTEGER NOT NULL,
    "nev" VARCHAR(255) NOT NULL,
    "tapanyag" JSON NOT NULL
);
ALTER TABLE
    "alapanyag" ADD PRIMARY KEY("id");
CREATE TABLE "allergenek"(
    "id" INTEGER NOT NULL,
    "nev" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "allergenek" ADD PRIMARY KEY("id");
CREATE TABLE "allergen_alapanyag_osszekoto"(
    "alapanyag_id" INTEGER NOT NULL,
    "allergen_id" INTEGER NOT NULL
);
CREATE TABLE "recept"(
    "id" INTEGER NOT NULL,
    "nev" VARCHAR(255) NOT NULL,
    "leiras" VARCHAR(255) NOT NULL,
    "adag" INTEGER NOT NULL,
    "ido" INTEGER NOT NULL,
    "kategoria_id" INTEGER NOT NULL,
    "kep" JSON NULL,
    "tapanyagok" JSON NULL,
    "lepesek" JSON NULL
);
ALTER TABLE
    "recept" ADD PRIMARY KEY("id");
CREATE TABLE "recept_alapanyag_osszekoto"(
    "alapanyag_id" INTEGER NOT NULL,
    "recept_id" INTEGER NOT NULL
);
CREATE TABLE "huto"(
    "alapanyag_id" INTEGER NOT NULL,
    "profil_id" INTEGER NOT NULL
);
CREATE TABLE "mertekegysegek"(
    "id" INTEGER NOT NULL,
    "nev" VARCHAR(255) NOT NULL,
    "egysegek" JSON NOT NULL
);
ALTER TABLE
    "mertekegysegek" ADD PRIMARY KEY("id");
CREATE TABLE "fiok"(
    "id" INTEGER NOT NULL,
    "etrend" VARCHAR(255) NOT NULL,
    "profil_id" INTEGER NOT NULL
);
ALTER TABLE
    "fiok" ADD PRIMARY KEY("id");
CREATE TABLE "allergen_fiok_osszekoto"(
    "fiok_id" INTEGER NOT NULL,
    "allergen_id" INTEGER NOT NULL
);
CREATE TABLE "velemeny_receptrol"(
    "fiok_id" INTEGER NOT NULL,
    "recept_id" INTEGER NOT NULL,
    "velemeny" VARCHAR(255) NOT NULL
);
CREATE TABLE "velemeny_alapanyagrol"(
    "fiok_id" INTEGER NOT NULL,
    "alapanyag_id" INTEGER NOT NULL,
    "velemeny" VARCHAR(255) NOT NULL
);
CREATE TABLE "Kategoria"(
    "id" INTEGER NOT NULL,
    "kategoria" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "Kategoria" ADD PRIMARY KEY("id");
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