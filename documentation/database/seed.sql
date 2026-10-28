-- =====================================================================
-- Seed fájl (PostgreSQL) – receptes alkalmazás
-- A jelszavak bcrypt-formátumú DEMÓ értékek, nem valódi hash-ek.
-- A tápanyagértékek 100 g (alapanyag), illetve 1 adag (recept) mennyiségre értendők.
-- =====================================================================

BEGIN;

-- Újrafuttathatóság: törlés függőségi sorrendben
TRUNCATE TABLE
    "velemeny_alapanyagrol",
    "velemeny_receptrol",
    "allergen_fiok_osszekoto",
    "huto",
    "recept_alapanyag_osszekoto",
    "allergen_alapanyag_osszekoto",
    "fiok",
    "recept",
    "Kategoria",
    "mertekegysegek",
    "allergenek",
    "alapanyag",
    "profil"
CASCADE;

-- ---------------------------------------------------------------------
-- Profilok
-- ---------------------------------------------------------------------
INSERT INTO "profil" ("id", "email", "password", "created") VALUES
(1, 'kovacs.anna@example.hu',  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '2025-01-12 09:15:00'),
(2, 'nagy.bence@example.hu',   '$2b$10$7EqJtq98hPqEX7fNZaFWoOhi5BEq8mM6rGJX3o1Hk0yTq5dB2cVXe', '2025-02-03 18:42:00'),
(3, 'szabo.eszter@example.hu', '$2b$10$wJ1d8Yl3kQpXr5uVn0sZ.eC4mTgHfA7bLz2oPq9RiSxKvDuYhNj6G', '2025-03-21 07:30:00'),
(4, 'toth.gabor@example.hu',  '$2b$10$Xk3Lm9PqRt5VwYz1AbCdEeFgHiJkLmNoPqRsTuVwXyZ0123456789a', '2025-05-09 20:05:00');

-- ---------------------------------------------------------------------
-- Allergének (a 14 EU-s kötelezően jelölendő allergén)
-- ---------------------------------------------------------------------
INSERT INTO "allergenek" ("id", "nev") VALUES
(1,  'Glutén'),
(2,  'Tej (laktóz)'),
(3,  'Tojás'),
(4,  'Mogyoró'),
(5,  'Diófélék'),
(6,  'Szója'),
(7,  'Hal'),
(8,  'Rákfélék'),
(9,  'Zeller'),
(10, 'Mustár'),
(11, 'Szezámmag'),
(12, 'Szulfitok'),
(13, 'Csillagfürt'),
(14, 'Puhatestűek');

-- ---------------------------------------------------------------------
-- Alapanyagok (tápanyag: 100 g-ra)
-- ---------------------------------------------------------------------
INSERT INTO "alapanyag" ("id", "nev", "tapanyag") VALUES
(1,  'Búzaliszt (BL55)',        '{"kcal":364,"feherje_g":10.3,"szenhidrat_g":76.0,"zsir_g":1.0,"rost_g":2.7}'),
(2,  'Tojás',                   '{"kcal":143,"feherje_g":12.6,"szenhidrat_g":0.7,"zsir_g":9.5,"rost_g":0.0}'),
(3,  'Tej (2,8%)',              '{"kcal":52,"feherje_g":3.4,"szenhidrat_g":4.8,"zsir_g":2.8,"rost_g":0.0}'),
(4,  'Vaj',                     '{"kcal":717,"feherje_g":0.9,"szenhidrat_g":0.1,"zsir_g":81.0,"rost_g":0.0}'),
(5,  'Kristálycukor',           '{"kcal":387,"feherje_g":0.0,"szenhidrat_g":100.0,"zsir_g":0.0,"rost_g":0.0}'),
(6,  'Csirkemell',              '{"kcal":120,"feherje_g":22.5,"szenhidrat_g":0.0,"zsir_g":2.6,"rost_g":0.0}'),
(7,  'Burgonya',                '{"kcal":77,"feherje_g":2.0,"szenhidrat_g":17.0,"zsir_g":0.1,"rost_g":2.2}'),
(8,  'Sárgarépa',               '{"kcal":41,"feherje_g":0.9,"szenhidrat_g":9.6,"zsir_g":0.2,"rost_g":2.8}'),
(9,  'Vöröshagyma',             '{"kcal":40,"feherje_g":1.1,"szenhidrat_g":9.3,"zsir_g":0.1,"rost_g":1.7}'),
(10, 'Fokhagyma',               '{"kcal":149,"feherje_g":6.4,"szenhidrat_g":33.0,"zsir_g":0.5,"rost_g":2.1}'),
(11, 'Paradicsom',              '{"kcal":18,"feherje_g":0.9,"szenhidrat_g":3.9,"zsir_g":0.2,"rost_g":1.2}'),
(12, 'Édes paprika (TV)',       '{"kcal":27,"feherje_g":1.0,"szenhidrat_g":6.3,"zsir_g":0.2,"rost_g":2.1}'),
(13, 'Olívaolaj',               '{"kcal":884,"feherje_g":0.0,"szenhidrat_g":0.0,"zsir_g":100.0,"rost_g":0.0}'),
(14, 'Rizs (fehér, nyers)',     '{"kcal":360,"feherje_g":6.7,"szenhidrat_g":79.0,"zsir_g":0.7,"rost_g":1.3}'),
(15, 'Spagetti (száraztészta)', '{"kcal":371,"feherje_g":13.0,"szenhidrat_g":75.0,"zsir_g":1.5,"rost_g":3.2}'),
(16, 'Marhahús (darabolt)',    '{"kcal":158,"feherje_g":21.0,"szenhidrat_g":0.0,"zsir_g":8.0,"rost_g":0.0}'),
(17, 'Tejföl (20%)',           '{"kcal":204,"feherje_g":3.0,"szenhidrat_g":3.5,"zsir_g":20.0,"rost_g":0.0}'),
(18, 'Trappista sajt',          '{"kcal":350,"feherje_g":25.0,"szenhidrat_g":1.5,"zsir_g":27.0,"rost_g":0.0}'),
(19, 'Étcsokoládé (70%)',       '{"kcal":546,"feherje_g":5.0,"szenhidrat_g":61.0,"zsir_g":31.0,"rost_g":7.0}'),
(20, 'Banán',                   '{"kcal":89,"feherje_g":1.1,"szenhidrat_g":23.0,"zsir_g":0.3,"rost_g":2.6}'),
(21, 'Spenót',                  '{"kcal":23,"feherje_g":2.9,"szenhidrat_g":3.6,"zsir_g":0.4,"rost_g":2.2}'),
(22, 'Lencse (száraz)',         '{"kcal":352,"feherje_g":25.0,"szenhidrat_g":60.0,"zsir_g":1.1,"rost_g":31.0}'),
(23, 'Kókusztej',               '{"kcal":197,"feherje_g":2.0,"szenhidrat_g":2.8,"zsir_g":21.0,"rost_g":0.0}'),
(24, 'Tofu',                    '{"kcal":76,"feherje_g":8.0,"szenhidrat_g":1.9,"zsir_g":4.8,"rost_g":0.3}'),
(25, 'Zabpehely',               '{"kcal":372,"feherje_g":13.5,"szenhidrat_g":59.0,"zsir_g":7.0,"rost_g":10.0}'),
(26, 'Fűszerpaprika (őrölt)',   '{"kcal":282,"feherje_g":14.0,"szenhidrat_g":54.0,"zsir_g":13.0,"rost_g":35.0}'),
(27, 'Lazacfilé',               '{"kcal":208,"feherje_g":20.0,"szenhidrat_g":0.0,"zsir_g":13.0,"rost_g":0.0}'),
(28, 'Dió (héjas, magbél)',     '{"kcal":654,"feherje_g":15.0,"szenhidrat_g":14.0,"zsir_g":65.0,"rost_g":6.7}'),
(29, 'Alma',                    '{"kcal":52,"feherje_g":0.3,"szenhidrat_g":14.0,"zsir_g":0.2,"rost_g":2.4}'),
(30, 'Citrom',                  '{"kcal":29,"feherje_g":1.1,"szenhidrat_g":9.3,"zsir_g":0.3,"rost_g":2.8}');

-- ---------------------------------------------------------------------
-- Alapanyag – allergén összerendelés
-- ---------------------------------------------------------------------
INSERT INTO "allergen_alapanyag_osszekoto" ("alapanyag_id", "allergen_id") VALUES
(1,  1),   -- Búzaliszt – glutén
(2,  3),   -- Tojás – tojás
(3,  2),   -- Tej – tej
(4,  2),   -- Vaj – tej
(15, 1),   -- Spagetti – glutén
(17, 2),   -- Tejföl – tej
(18, 2),   -- Trappista sajt – tej
(19, 6),   -- Étcsokoládé – szója (lecitin)
(24, 6),   -- Tofu – szója
(25, 1),   -- Zabpehely – glutén (keresztszennyeződés / zab-gluténfehérje)
(27, 7),   -- Lazac – hal
(28, 5);   -- Dió – diófélék

-- ---------------------------------------------------------------------
-- Kategóriák
-- ---------------------------------------------------------------------
INSERT INTO "Kategoria" ("id", "kategoria") VALUES
(1, 'Leves'),
(2, 'Főétel'),
(3, 'Főzelék'),
(4, 'Desszert'),
(5, 'Reggeli');

-- ---------------------------------------------------------------------
-- Receptek
-- ---------------------------------------------------------------------
INSERT INTO "recept" ("id", "nev", "leiras", "adag", "ido", "kategoria_id", "kep", "tapanyagok", "lepesek") VALUES
(1, 'Gulyásleves',
 'Klasszikus magyar gulyásleves marhahússal, burgonyával és sok fűszerpaprikával.',
 4, 90, 1,
 '{"fo_kep":"/img/receptek/gulyasleves.jpg","galeria":["/img/receptek/gulyasleves-2.jpg"]}',
 '{"kcal":320,"feherje_g":24.0,"szenhidrat_g":22.0,"zsir_g":14.0,"rost_g":4.5}',
 '[{"sorszam":1,"leiras":"A vöröshagymát finomra vágjuk, és kevés olajon üvegesre pirítjuk."},
   {"sorszam":2,"leiras":"Levesszük a tűzről, belekeverjük a fűszerpaprikát, majd rátesszük a kockára vágott marhahúst."},
   {"sorszam":3,"leiras":"Felöntjük vízzel, hozzáadjuk a fokhagymát, és lassú tűzön egy órán át főzzük."},
   {"sorszam":4,"leiras":"Beletesszük a felkockázott sárgarépát, burgonyát, paprikát és paradicsomot, majd puhára főzzük."},
   {"sorszam":5,"leiras":"Sóval ízesítjük, és melegen, friss kenyérrel tálaljuk."}]'),

(2, 'Palacsinta',
 'Vékony, lágy palacsinta, amely édesen és sósan is tölthető.',
 4, 30, 4,
 '{"fo_kep":"/img/receptek/palacsinta.jpg","galeria":[]}',
 '{"kcal":280,"feherje_g":9.0,"szenhidrat_g":38.0,"zsir_g":10.0,"rost_g":1.2}',
 '[{"sorszam":1,"leiras":"A lisztet, a tojásokat, a tejet és a cukrot csomómentesre keverjük."},
   {"sorszam":2,"leiras":"A tésztát 15 percig pihentetjük."},
   {"sorszam":3,"leiras":"Kevés vajjal kikent serpenyőben mindkét oldalán aranybarnára sütjük a palacsintákat."},
   {"sorszam":4,"leiras":"Lekvárral, kakaóval vagy túróval töltve tálaljuk."}]'),

(3, 'Csirkepaprikás',
 'Krémes, tejfölös csirkepaprikás, hagyományosan galuskával tálalva.',
 4, 60, 2,
 '{"fo_kep":"/img/receptek/csirkepaprikas.jpg","galeria":["/img/receptek/csirkepaprikas-2.jpg"]}',
 '{"kcal":520,"feherje_g":38.0,"szenhidrat_g":42.0,"zsir_g":20.0,"rost_g":3.8}',
 '[{"sorszam":1,"leiras":"A vöröshagymát apróra vágjuk, és zsiradékon megdinszteljük."},
   {"sorszam":2,"leiras":"Hozzáadjuk a fűszerpaprikát, majd a kockára vágott csirkemellet, és fehéredésig pirítjuk."},
   {"sorszam":3,"leiras":"Beletesszük a paprikát és a paradicsomot, felöntjük kevés vízzel, és fedő alatt puhára főzzük."},
   {"sorszam":4,"leiras":"A tejfölt simára keverjük egy kanál liszttel, és a paprikáshoz adjuk."},
   {"sorszam":5,"leiras":"A tojásból, lisztből és vízből galuskatésztát készítünk, sós vízben kifőzzük, és a paprikással tálaljuk."}]'),

(4, 'Spagetti bolognai',
 'Gazdag, lassan főtt marhahúsos paradicsomszósz spagettivel és reszelt sajttal.',
 4, 55, 2,
 '{"fo_kep":"/img/receptek/spagetti-bolognai.jpg","galeria":[]}',
 '{"kcal":610,"feherje_g":32.0,"szenhidrat_g":78.0,"zsir_g":18.0,"rost_g":5.0}',
 '[{"sorszam":1,"leiras":"Olívaolajon megdinszteljük az apróra vágott hagymát és a fokhagymát."},
   {"sorszam":2,"leiras":"Hozzáadjuk a marhahúst, és színesedésig pirítjuk."},
   {"sorszam":3,"leiras":"Beletesszük a felkockázott paradicsomot, sózzuk, borsozzuk, majd 30 percig kis lángon főzzük."},
   {"sorszam":4,"leiras":"A spagettit sós vízben al dente-re főzzük, majd leszűrjük."},
   {"sorszam":5,"leiras":"A tésztát a szósszal tálaljuk, és megszórjuk reszelt trappista sajttal."}]'),

(5, 'Lencsefőzelék',
 'Egyszerű, laktató, vegán lencsefőzelék, hagymával és fokhagymával ízesítve.',
 4, 45, 3,
 '{"fo_kep":"/img/receptek/lencsefozelek.jpg","galeria":[]}',
 '{"kcal":290,"feherje_g":16.0,"szenhidrat_g":42.0,"zsir_g":6.0,"rost_g":14.0}',
 '[{"sorszam":1,"leiras":"A lencsét átmossuk, és 20 percig főzzük sós vízben a felkockázott sárgarépával."},
   {"sorszam":2,"leiras":"Olívaolajon lisztből világos rántást készítünk, hozzáadjuk a hagymát és a fokhagymát."},
   {"sorszam":3,"leiras":"A rántást fűszerpaprikával megszórjuk, majd a lencséhez keverjük."},
   {"sorszam":4,"leiras":"Még 10 percig főzzük, ízlés szerint ecettel savanyítjuk, és forrón tálaljuk."}]'),

(6, 'Zabkása banánnal és dióval',
 'Gyors, tápláló reggeli zabkása szeletelt banánnal és durvára vágott dióval.',
 2, 15, 5,
 '{"fo_kep":"/img/receptek/zabkasa.jpg","galeria":[]}',
 '{"kcal":410,"feherje_g":13.0,"szenhidrat_g":54.0,"zsir_g":16.0,"rost_g":8.0}',
 '[{"sorszam":1,"leiras":"A zabpelyhet a tejjel kis lángon 5-7 percig főzzük, közben időnként megkeverjük."},
   {"sorszam":2,"leiras":"A banánt karikákra szeljük, a diót durvára vágjuk."},
   {"sorszam":3,"leiras":"A kását tálkákba szedjük, rátesszük a banánt és a diót."}]'),

(7, 'Kókuszos tofu curry',
 'Vegán curry tofuval, spenóttal és zöldségekkel kókusztejes szószban, rizzsel.',
 3, 40, 2,
 '{"fo_kep":"/img/receptek/tofu-curry.jpg","galeria":["/img/receptek/tofu-curry-2.jpg"]}',
 '{"kcal":480,"feherje_g":18.0,"szenhidrat_g":52.0,"zsir_g":22.0,"rost_g":6.0}',
 '[{"sorszam":1,"leiras":"A rizst a csomagoláson megadott ideig főzzük, majd lecsepegtetjük."},
   {"sorszam":2,"leiras":"A tofut kockákra vágjuk, és forró serpenyőben aranybarnára sütjük."},
   {"sorszam":3,"leiras":"A hagymát, a fokhagymát és a paprikát megdinszteljük, majd felöntjük a kókusztejjel."},
   {"sorszam":4,"leiras":"Hozzáadjuk a tofut és a spenótot, 5-8 percig főzzük, amíg a szósz besűrűsödik."},
   {"sorszam":5,"leiras":"A currytt a rizzsel együtt tálaljuk."}]'),

(8, 'Sült lazac burgonyával',
 'Citromos, fokhagymás sült lazacfilé sült burgonyával, egyszerűen és gyorsan.',
 2, 35, 2,
 '{"fo_kep":"/img/receptek/sult-lazac.jpg","galeria":[]}',
 '{"kcal":540,"feherje_g":34.0,"szenhidrat_g":36.0,"zsir_g":28.0,"rost_g":4.0}',
 '[{"sorszam":1,"leiras":"A burgonyát felszeleteljük, olívaolajjal és sóval összeforgatjuk, majd 200 fokos sütőben 15 percig sütjük."},
   {"sorszam":2,"leiras":"A lazacfilét sóval, fokhagymával és citromlével megszórjuk."},
   {"sorszam":3,"leiras":"A halat a burgonya mellé tesszük, és további 15-18 percig sütjük."},
   {"sorszam":4,"leiras":"Citromszeletekkel díszítve tálaljuk."}]'),

(9, 'Almás pite',
 'Omlós vajas tészta fahéjas almatöltelékkel, a hagyományos vasárnapi desszert.',
 8, 75, 4,
 '{"fo_kep":"/img/receptek/almas-pite.jpg","galeria":["/img/receptek/almas-pite-2.jpg"]}',
 '{"kcal":340,"feherje_g":5.0,"szenhidrat_g":48.0,"zsir_g":15.0,"rost_g":2.5}',
 '[{"sorszam":1,"leiras":"A lisztet a hideg vajjal, a cukorral és a tojássárgájával összegyúrjuk, majd 30 percre hűtőbe tesszük."},
   {"sorszam":2,"leiras":"Az almát megpucoljuk, lereszeljük, és kevés cukorral, fahéjjal összekeverjük."},
   {"sorszam":3,"leiras":"A tészta kétharmadát kinyújtjuk, és a tepsi aljára simítjuk, majd rákenjük a tölteléket."},
   {"sorszam":4,"leiras":"A maradék tésztát lereszeljük a töltelékre, és 180 fokon 35-40 percig sütjük."},
   {"sorszam":5,"leiras":"Langyosan, porcukorral megszórva tálaljuk."}]');

-- ---------------------------------------------------------------------
-- Recept – alapanyag összerendelés
-- ---------------------------------------------------------------------
INSERT INTO "recept_alapanyag_osszekoto" ("alapanyag_id", "recept_id") VALUES
-- 1. Gulyásleves
(16, 1), (7, 1), (8, 1), (9, 1), (10, 1), (11, 1), (12, 1), (26, 1),
-- 2. Palacsinta
(1, 2), (2, 2), (3, 2), (5, 2), (4, 2),
-- 3. Csirkepaprikás
(6, 3), (9, 3), (26, 3), (17, 3), (1, 3), (2, 3), (12, 3), (11, 3),
-- 4. Spagetti bolognai
(15, 4), (16, 4), (11, 4), (9, 4), (10, 4), (13, 4), (18, 4),
-- 5. Lencsefőzelék
(22, 5), (9, 5), (10, 5), (13, 5), (1, 5), (26, 5), (8, 5),
-- 6. Zabkása
(25, 6), (3, 6), (20, 6), (28, 6),
-- 7. Kókuszos tofu curry
(24, 7), (23, 7), (14, 7), (12, 7), (9, 7), (10, 7), (21, 7),
-- 8. Sült lazac
(27, 8), (7, 8), (13, 8), (10, 8), (30, 8),
-- 9. Almás pite
(1, 9), (4, 9), (5, 9), (2, 9), (29, 9);

-- ---------------------------------------------------------------------
-- Fiókok (profilonként egy)
-- ---------------------------------------------------------------------
INSERT INTO "fiok" ("id", "etrend", "profil_id") VALUES
(1, 'mindenevő',     1),
(2, 'vegán',         2),
(3, 'gluténmentes',  3),
(4, 'vegetáriánus',  4);

-- ---------------------------------------------------------------------
-- Fiók – allergén összerendelés
-- ---------------------------------------------------------------------
INSERT INTO "allergen_fiok_osszekoto" ("fiok_id", "allergen_id") VALUES
(2, 4),   -- Nagy Bence – mogyoró
(3, 1),   -- Szabó Eszter – glutén
(4, 3),   -- Tóth Gábor – tojás
(4, 5);   -- Tóth Gábor – diófélék

-- ---------------------------------------------------------------------
-- Hűtő (profilhoz tartozó alapanyagok)
-- ---------------------------------------------------------------------
INSERT INTO "huto" ("alapanyag_id", "profil_id") VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (7, 1), (9, 1),
(24, 2), (23, 2), (14, 2), (21, 2), (22, 2),
(14, 3), (6, 3), (7, 3), (11, 3), (12, 3),
(3, 4), (18, 4), (25, 4), (20, 4);

-- ---------------------------------------------------------------------
-- Mértékegységek (az átváltás az alapegységre vonatkozik)
-- ---------------------------------------------------------------------
INSERT INTO "mertekegysegek" ("id", "nev", "egysegek") VALUES
(1, 'Tömeg',
 '{"alapegyseg":"g","egysegek":[{"jel":"g","nev":"gramm","szorzo":1},{"jel":"dkg","nev":"dekagramm","szorzo":10},{"jel":"kg","nev":"kilogramm","szorzo":1000}]}'),
(2, 'Térfogat',
 '{"alapegyseg":"ml","egysegek":[{"jel":"ml","nev":"milliliter","szorzo":1},{"jel":"cl","nev":"centiliter","szorzo":10},{"jel":"dl","nev":"deciliter","szorzo":100},{"jel":"l","nev":"liter","szorzo":1000},{"jel":"tk","nev":"teáskanál","szorzo":5},{"jel":"ek","nev":"evőkanál","szorzo":15},{"jel":"bögre","nev":"bögre","szorzo":250}]}'),
(3, 'Darab',
 '{"alapegyseg":"db","egysegek":[{"jel":"db","nev":"darab","szorzo":1},{"jel":"csipet","nev":"csipet","szorzo":1},{"jel":"gerezd","nev":"gerezd","szorzo":1},{"jel":"szál","nev":"szál","szorzo":1}]}');

-- ---------------------------------------------------------------------
-- Vélemények receptekről
-- ---------------------------------------------------------------------
INSERT INTO "velemeny_receptrol" ("fiok_id", "recept_id", "velemeny") VALUES
(1, 1, 'Pont olyan, mint a nagymamámé volt! A család is imádta.'),
(1, 2, 'Nagyon könnyű elkészíteni, a gyerekek is segítettek a sütésben.'),
(2, 7, 'Fantasztikus vegán vacsora, legközelebb több currypasztát teszek bele.'),
(2, 5, 'Egyszerű, olcsó és nagyon laktató. Fokhagymával még jobb.'),
(3, 8, 'Gyors és finom, a citrom nagyon jól passzol a lazachoz.'),
(3, 3, 'Gluténmentes liszttel is remekül sikerült a galuska.'),
(4, 6, 'Tökéletes reggeli munka előtt, a dió adja meg az igazi ízét.'),
(4, 9, 'Omlós a tészta, kicsit kevesebb cukorral még jobb lenne.');

-- ---------------------------------------------------------------------
-- Vélemények alapanyagokról
-- ---------------------------------------------------------------------
INSERT INTO "velemeny_alapanyagrol" ("fiok_id", "alapanyag_id", "velemeny") VALUES
(1, 26, 'A szegedi fűszerpaprika íze összehasonlíthatatlan.'),
(2, 24, 'Fűszerezve és jól kisütve szinte bármit helyettesít.'),
(2, 23, 'Zsíros, krémes állagot ad a szószoknak, érdemes a dobozosat választani.'),
(3, 14, 'Gluténmentes étkezéshez nélkülözhetetlen alapanyag.'),
(4, 28, 'Friss dióval sokkal jobb, mint a bolti, régebben tárolttal.'),
(4, 25, 'Tartós és olcsó, a reggeli alapja nálunk.');

COMMIT;
